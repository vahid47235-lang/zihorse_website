import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth-constants";

/**
 * Fast, Edge-safe gate: only checks the session cookie's presence.
 * The authoritative check (HMAC signature + expiry) happens in
 * src/app/admin/layout.tsx via getSession(), which needs Node's
 * crypto module and therefore cannot run in the Edge proxy.
 */
export function proxy(request: NextRequest) {
  const hasSessionCookie = request.cookies.has(SESSION_COOKIE);
  if (!hasSessionCookie) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
