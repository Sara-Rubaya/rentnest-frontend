import { NextRequest, NextResponse } from "next/server";

/**
 * Route protection. The auth cookie is set by lib/api.ts (setSession) on
 * login/register. Middleware only checks presence + role from cookies —
 * the backend must still verify the JWT on every request it receives.
 */

const roleForPrefix: Record<string, string> = {
  "/dashboard/tenant": "TENANT",
  "/dashboard/landlord": "LANDLORD",
  "/dashboard/admin": "ADMIN",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("rentnest_token")?.value;
  const role = request.cookies.get("rentnest_role")?.value;

  const matchedPrefix = Object.keys(roleForPrefix).find((prefix) => pathname.startsWith(prefix));

  if (matchedPrefix) {
    if (!token) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role && role !== roleForPrefix[matchedPrefix]) {
      // Logged in, but wrong role for this area — send them to their own dashboard.
      return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
