import type { UserRole } from "@/lib/api/types";

export interface AccessTokenPayload {
  sub: string;
  email: string;
  roles: UserRole[];
  jti: string;
  iat: number;
  exp: number;
}

export function decodeJwt<T = AccessTokenPayload>(token: string): T | null {
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    const binary = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as T;
  } catch {
    return null;
  }
}

export function isExpired(token: string | undefined, skewSeconds = 30): boolean {
  if (!token) return true;
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 - skewSeconds * 1000 <= Date.now();
}
