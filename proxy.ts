import { NextResponse, type NextRequest } from "next/server";
import type { AuthResponse } from "@/lib/api/types";
import {
  ACCESS_COOKIE,
  ADMIN_PREFIX,
  PUBLIC_PATHS,
  REFRESH_COOKIE,
  USER_COOKIE,
  homeFor,
  toSessionUser,
} from "@/lib/auth/constants";
import { decodeJwt, isExpired } from "@/lib/auth/jwt";
import { refreshTokenPair } from "@/lib/auth/refresh";
import { applySession, clearSession } from "@/lib/auth/session-response";

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  // Server code bounces here when the API rejects the session: drop it and show the form.
  if (pathname === "/login" && searchParams.has("reason")) {
    return clearSession(NextResponse.next());
  }

  let accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  let rotated: AuthResponse | null = null;

  if (isExpired(accessToken) && refreshToken) {
    rotated = await refreshTokenPair(refreshToken);
    accessToken = rotated?.accessToken;
  }

  const payload = accessToken && !isExpired(accessToken, 0) ? decodeJwt(accessToken) : null;
  const roles = payload?.roles ?? [];

  if (!payload) {
    if (isPublic) return clearSession(NextResponse.next());
    const login = new URL("/login", request.url);
    if (pathname !== "/") login.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return clearSession(NextResponse.redirect(login));
  }

  if (isPublic || pathname === "/") {
    return finish(NextResponse.redirect(new URL(homeFor(roles), request.url)));
  }

  if (pathname.startsWith(ADMIN_PREFIX) && !roles.includes("admin")) {
    return finish(NextResponse.redirect(new URL("/forbidden", request.url)));
  }

  return finish(forward());

  // Rotated tokens go on the forwarded request too, so this render already sees them.
  function forward() {
    if (!rotated) return NextResponse.next();
    request.cookies.set(ACCESS_COOKIE, rotated.accessToken);
    request.cookies.set(REFRESH_COOKIE, rotated.refreshToken);
    request.cookies.set(USER_COOKIE, JSON.stringify(toSessionUser(rotated.user)));
    return NextResponse.next({ request: { headers: request.headers } });
  }

  function finish(response: NextResponse) {
    return rotated ? applySession(response, rotated) : response;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
