import "server-only";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth/session";
import { API_BASE_URL, baseHeaders } from "./config";
import { createEndpoints, type RequestOptions } from "./endpoints";
import { ApiError } from "./errors";
import { buildQuery } from "./query";

// No refresh here: server components cannot write cookies, and proxy.ts has
// already rotated a stale token before rendering. A 401 means the session is gone.
export async function serverApi<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { accessToken } = await readSession();

  const response = await fetch(`${API_BASE_URL}${path}${buildQuery(options.query)}`, {
    method: options.method ?? "GET",
    headers: baseHeaders(accessToken),
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  });

  if (response.status === 401) redirect("/login?reason=expired");
  if (response.status === 403 && options.admin) redirect("/login?reason=forbidden");
  if (!response.ok) throw await ApiError.fromResponse(response);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const backend = createEndpoints(serverApi);
