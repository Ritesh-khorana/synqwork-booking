import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminCookieName, verifyAdminCookieValue } from "@/lib/admin-auth";

export default async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/admin/");
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login" || pathname === "/api/admin/logout";

  if ((isAdminPage && !isLoginPage) || (isAdminApi && !isLoginApi)) {
    const cookie = request.cookies.get(getAdminCookieName())?.value;
    const ok = await verifyAdminCookieValue(cookie);

    if (!ok) {
      if (isAdminApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
Message Md Zunaid
