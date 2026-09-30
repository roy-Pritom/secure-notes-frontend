import { ApiError } from "./errors";
import type { LoginBody, RegisterBody, User } from "./types";

async function post<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "same-origin",
  });
  if (!response.ok) throw await ApiError.fromResponse(response);
  return (await response.json()) as T;
}

export const authApi = {
  login: (body: LoginBody) => post<{ user: User }>("/api/auth/login", body),
  register: (body: RegisterBody) => post<{ user: User }>("/api/auth/register", body),
  logout: () => post<{ ok: true }>("/api/auth/logout"),
};
