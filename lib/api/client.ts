import { createEndpoints, type RequestOptions } from "./endpoints";
import { ApiError } from "./errors";
import { buildQuery } from "./query";

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`/api/backend${path}${buildQuery(options.query)}`, {
    method: options.method ?? "GET",
    headers: options.body === undefined ? undefined : { "Content-Type": "application/json" },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    credentials: "same-origin",
    signal: options.signal,
  });

  if (response.status === 401) {
    window.location.replace("/login?reason=expired");
    throw new ApiError(401, ["Session expired"], null);
  }
  if (response.status === 403 && options.admin) {
    window.location.replace("/login?reason=forbidden");
    throw new ApiError(403, ["Admin access revoked"], null);
  }
  if (!response.ok) throw await ApiError.fromResponse(response);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const client = createEndpoints(api);
