import { NextResponse } from "next/server";
import { API_BASE_URL, baseHeaders } from "@/lib/api/config";
import { readSession } from "@/lib/auth/session";
import { clearSession } from "@/lib/auth/session-response";

export async function POST() {
  const { accessToken } = await readSession();

  // Best effort: cookies are cleared even if the API call fails.
  if (accessToken) {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: baseHeaders(accessToken),
      cache: "no-store",
    }).catch(() => undefined);
  }

  return clearSession(NextResponse.json({ ok: true }));
}
