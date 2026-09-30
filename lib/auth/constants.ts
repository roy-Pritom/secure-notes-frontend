import type { SessionUser, User } from "@/lib/api/types";

export const ACCESS_COOKIE = "sn_access";
export const REFRESH_COOKIE = "sn_refresh";
export const USER_COOKIE = "sn_user";

const ACCESS_MAX_AGE = 15 * 60;
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60;

const shared = {
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
} as const;

export const accessCookieOptions = { ...shared, httpOnly: true, maxAge: ACCESS_MAX_AGE };
export const refreshCookieOptions = { ...shared, httpOnly: true, maxAge: REFRESH_MAX_AGE };
export const userCookieOptions = { ...shared, httpOnly: false, maxAge: REFRESH_MAX_AGE };

export const PUBLIC_PATHS = ["/login", "/register"];
export const ADMIN_PREFIX = "/admin";

export function toSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    roles: user.roles,
    avatarUrl: user.avatarUrl,
  };
}

export function homeFor(roles: readonly string[] | undefined): string {
  return roles?.includes("admin") ? "/admin" : "/notes";
}

// Relative paths only (no open redirect), and never into an area the role can't enter.
export function afterLogin(next: string | null | undefined, roles: readonly string[]): string {
  const safe = next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\");
  if (!safe || (next.startsWith(ADMIN_PREFIX) && !roles.includes("admin"))) return homeFor(roles);
  return next;
}
