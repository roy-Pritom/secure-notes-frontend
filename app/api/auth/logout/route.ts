import { NextResponse } from "next/server";
import { API_BASE_URL, baseHeaders } from "@/lib/api/config";
import { isExpired } from "@/lib/auth/jwt";
import { refreshTokenPair } from "@/lib/auth/refresh";
import { readSession } from "@/lib/auth/session";
import { clearSession } from "@/lib/auth/session-response";

export async function POST() {
  const { accessToken, refreshToken } = await readSession();

  // The API revokes sessions only for a valid access token, so a stale one is
  // rotated first; otherwise the refresh token would outlive the sign-out.
  let token = accessToken;
  if (isExpired(token) && refreshToken) {
    token = (await refreshTokenPair(refreshToken))?.accessToken;
  }

  // Best effort: cookies are cleared even if the API call fails.
  if (token) {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: baseHeaders(token),
      cache: "no-store",
    }).catch(() => undefined);
  }

  return clearSession(NextResponse.json({ ok: true }));
}
