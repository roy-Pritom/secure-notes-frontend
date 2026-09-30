import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/lib/api/types";
import { ACCESS_COOKIE, REFRESH_COOKIE, USER_COOKIE } from "./constants";
import { decodeJwt } from "./jwt";

export async function readSession() {
  const jar = await cookies();
  return {
    accessToken: jar.get(ACCESS_COOKIE)?.value,
    refreshToken: jar.get(REFRESH_COOKIE)?.value,
    userCookie: jar.get(USER_COOKIE)?.value,
  };
}

// Roles come from the access JWT; the readable cookie only supplies display fields.
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const { accessToken, userCookie } = await readSession();
  const payload = accessToken ? decodeJwt(accessToken) : null;
  if (!payload) return null;

  let hint: Partial<SessionUser> = {};
  try {
    if (userCookie) hint = JSON.parse(userCookie) as SessionUser;
  } catch {}

  return {
    id: payload.sub,
    email: payload.email,
    roles: payload.roles,
    fullName: hint.id === payload.sub && hint.fullName ? hint.fullName : payload.email,
    avatarUrl: hint.id === payload.sub ? (hint.avatarUrl ?? null) : null,
  };
});

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login?reason=expired");
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (!user.roles.includes("admin")) redirect("/forbidden");
  return user;
}
