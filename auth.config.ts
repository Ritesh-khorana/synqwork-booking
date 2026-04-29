import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

const googleClientId = process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID ?? "";
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET ?? "";
const hasGoogleOAuth = Boolean(googleClientId && googleClientSecret);

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
  },
  providers: hasGoogleOAuth
    ? [
        Google({
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        }),
      ]
    : [],
  secret: process.env.AUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === "production",
};
