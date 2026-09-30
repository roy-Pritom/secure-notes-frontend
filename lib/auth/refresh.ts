import { API_BASE_URL, baseHeaders } from "@/lib/api/config";
import type { AuthResponse } from "@/lib/api/types";

type Pending = Promise<AuthResponse | null>;

// Refresh tokens are single-use: a replay revokes every session. Callers that
// arrive with the same (possibly just-spent) token share one result, and the
// result is kept briefly for requests that were already in flight.
const GRACE_MS = 30_000;
const store = globalThis as typeof globalThis & { __snRefresh?: Map<string, Pending> };
const inFlight = (store.__snRefresh ??= new Map<string, Pending>());

export function refreshTokenPair(refreshToken: string): Pending {
  const existing = inFlight.get(refreshToken);
  if (existing) return existing;

  const attempt: Pending = fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: baseHeaders(),
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  })
    .then((response) => (response.ok ? (response.json() as Promise<AuthResponse>) : null))
    .catch(() => null)
    .finally(() => setTimeout(() => inFlight.delete(refreshToken), GRACE_MS));

  inFlight.set(refreshToken, attempt);
  return attempt;
}
