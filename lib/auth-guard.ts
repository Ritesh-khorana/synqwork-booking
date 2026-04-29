import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    return { error: "Unauthorized", status: 401 } as const;
  }

  if (session.user.role !== "admin") {
    return { error: "Forbidden", status: 403 } as const;
  }

  return { session } as const;
}
