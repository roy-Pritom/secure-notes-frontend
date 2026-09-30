import { NextResponse, type NextRequest } from "next/server";
import { API_BASE_URL, baseHeaders } from "@/lib/api/config";
import type { AuthResponse, User } from "@/lib/api/types";
import { isExpired } from "@/lib/auth/jwt";
import { refreshTokenPair } from "@/lib/auth/refresh";
import { readSession } from "@/lib/auth/session";
import { applySession, applyUser, clearSession } from "@/lib/auth/session-response";

// auth/* is deliberately absent so raw tokens can never reach the browser.
const ALLOWED = new Set(["notes", "profile", "users", "posts"]);

function sessionExpired() {
  return clearSession(NextResponse.json({ message: "Session expired" }, { status: 401 }));
}

async function handle(request: NextRequest, context: RouteContext<"/api/backend/[...path]">) {
  const { path } = await context.params;

  if (!ALLOWED.has(path[0]) || path.some((segment) => segment === ".." || segment === ".")) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const target = `${API_BASE_URL}/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;
  const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.text();
  const { accessToken, refreshToken } = await readSession();

  const call = (token?: string) =>
    fetch(target, { method: request.method, headers: baseHeaders(token), body, cache: "no-store" });

  let rotated: AuthResponse | null = null;
  let token = accessToken;

  if (isExpired(token) && refreshToken) {
    rotated = await refreshTokenPair(refreshToken);
    if (!rotated) return sessionExpired();
    token = rotated.accessToken;
  }
  if (!token) return sessionExpired();

  let upstream = await call(token);

  if (upstream.status === 401 && refreshToken && !rotated) {
    rotated = await refreshTokenPair(refreshToken);
    if (!rotated) return sessionExpired();
    upstream = await call(rotated.accessToken);
  }

  const data = upstream.status === 204 ? null : await upstream.json().catch(() => null);
  const response =
    upstream.status === 204
      ? new NextResponse(null, { status: 204 })
      : NextResponse.json(data, { status: upstream.status });

  if (rotated) applySession(response, rotated);

  // Keep the display cookie in step with profile edits.
  if (upstream.ok && request.method === "PATCH" && path.length === 1 && path[0] === "profile") {
    applyUser(response, data as User);
  }

  return response;
}

export { handle as GET, handle as POST, handle as PATCH, handle as PUT, handle as DELETE };
