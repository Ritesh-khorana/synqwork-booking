import { NextResponse } from "next/server";
import { createAdminCookieValue, getAdminCookieName } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as null | { username?: string; password?: string };
  const username = body?.username?.trim() ?? "";
  const password = body?.password ?? "";

  const expectedUsername = process.env.ADMIN_USERNAME ?? "";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";

  if (!expectedUsername || !expectedPassword) {
    return NextResponse.json(
      { error: "Admin login is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD." },
      { status: 500 },
    );
  }

  if (username !== expectedUsername || password !== expectedPassword) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const cookieValue = await createAdminCookieValue();
  if (!cookieValue) {
    return NextResponse.json({ error: "Admin auth is not configured. Set ADMIN_AUTH_SECRET." }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(getAdminCookieName(), cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
