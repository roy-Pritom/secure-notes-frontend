import { NextResponse } from "next/server";
import { API_BASE_URL, baseHeaders } from "@/lib/api/config";
import type { AuthResponse } from "@/lib/api/types";
import { applySession } from "./session-response";

export async function authenticate(request: Request, path: "/auth/login" | "/auth/register") {
  const payload = await request.text();

  const upstream = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: baseHeaders(),
    body: payload,
    cache: "no-store",
  }).catch(() => null);

  if (!upstream) {
    return NextResponse.json({ message: "API is unreachable" }, { status: 503 });
  }

  const body = await upstream.json().catch(() => null);
  if (!upstream.ok) return NextResponse.json(body, { status: upstream.status });

  const auth = body as AuthResponse;
  return applySession(NextResponse.json({ user: auth.user }, { status: upstream.status }), auth);
}
