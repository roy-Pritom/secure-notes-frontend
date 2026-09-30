import type { NextResponse } from "next/server";
import type { AuthResponse, User } from "@/lib/api/types";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  USER_COOKIE,
  accessCookieOptions,
  refreshCookieOptions,
  toSessionUser,
  userCookieOptions,
} from "./constants";

export function applySession(response: NextResponse, auth: AuthResponse): NextResponse {
  response.cookies.set(ACCESS_COOKIE, auth.accessToken, accessCookieOptions);
  response.cookies.set(REFRESH_COOKIE, auth.refreshToken, refreshCookieOptions);
  return applyUser(response, auth.user);
}

export function applyUser(response: NextResponse, user: User): NextResponse {
  response.cookies.set(USER_COOKIE, JSON.stringify(toSessionUser(user)), userCookieOptions);
  return response;
}

export function clearSession(response: NextResponse): NextResponse {
  for (const name of [ACCESS_COOKIE, REFRESH_COOKIE, USER_COOKIE]) {
    response.cookies.set(name, "", { path: "/", maxAge: 0 });
  }
  return response;
}
