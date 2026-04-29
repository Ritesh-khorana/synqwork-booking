import { randomUUID } from "crypto";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { authConfig } from "@/auth.config";
import { connectToDatabase } from "@/lib/mongodb";
import { UserModel } from "@/lib/mongo-models";

function getAdminEmailAllowlist(): string[] {
  const raw = process.env.SYNQ_ADMIN_EMAILS ?? process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function isAdminEmail(email: string) {
  const allowlist = getAdminEmailAllowlist();
  return allowlist.includes(email.toLowerCase());
}

async function upsertGoogleUser(input: {
  email?: string | null;
  name?: string | null;
  image?: string | null;
}) {
  if (!input.email) {
    return null;
  }

  await connectToDatabase();

  let user = await UserModel.findOne({ email: input.email }).lean();
  if (!user) {
    const role = isAdminEmail(input.email) ? "admin" : "user";
    user = await UserModel.create({
      id: `user_${randomUUID()}`,
      email: input.email,
      name: input.name ?? input.email.split("@")[0],
      image: input.image ?? undefined,
      provider: "google",
      role,
    });
    return JSON.parse(JSON.stringify(user)) as {
      id: string;
      email: string;
      name?: string;
      image?: string;
      role: "admin" | "user";
    };
  }

  const existingUser = JSON.parse(JSON.stringify(user)) as {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role: "admin" | "user";
  };

  const desiredRole = isAdminEmail(input.email) ? "admin" : existingUser.role;

  await UserModel.updateOne(
    { email: input.email },
    {
      $set: {
        name: input.name ?? existingUser.name,
        image: input.image ?? existingUser.image,
        provider: "google",
        role: desiredRole,
      },
    },
  );

  return {
    id: existingUser.id,
    email: existingUser.email,
    name: input.name ?? existingUser.name,
    image: input.image ?? existingUser.image,
    role: desiredRole,
  };
}

const authOptions: NextAuthConfig = {
  ...authConfig,
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "google") {
        return true;
      }

      const user = await upsertGoogleUser({
        email: profile?.email,
        name: profile?.name,
        image: typeof profile?.picture === "string" ? profile.picture : null,
      });

      return Boolean(user);
    },
    async jwt({ token, account, profile, user }) {
      if (account?.provider === "google") {
        const dbUser = await upsertGoogleUser({
          email: profile?.email ?? user?.email,
          name: profile?.name ?? user?.name,
          image:
            (typeof profile?.picture === "string" ? profile.picture : null) ??
            user?.image ??
            null,
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.picture = dbUser.image;
          token.name = dbUser.name;
          token.email = dbUser.email;
        }
      } else if (token.email && (!token.role || !token.id)) {
        await connectToDatabase();
        const dbUser = await UserModel.findOne({ email: token.email }).lean();
        if (dbUser) {
          const existingUser = JSON.parse(JSON.stringify(dbUser)) as {
            id: string;
            role: "admin" | "user";
            image?: string;
          };
          token.id = existingUser.id;
          token.role = isAdminEmail(token.email) ? "admin" : existingUser.role;
          token.picture = existingUser.image;

          if (isAdminEmail(token.email) && existingUser.role !== "admin") {
            await UserModel.updateOne({ email: token.email }, { $set: { role: "admin" } });
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.role = token.role === "admin" ? "admin" : "user";
        session.user.image = typeof token.picture === "string" ? token.picture : session.user.image;
      }

      return session;
    },
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      if (!path.startsWith("/admin")) {
        return true;
      }

      return auth?.user?.role === "admin";
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
