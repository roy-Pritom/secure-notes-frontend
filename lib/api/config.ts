export const API_BASE_URL =
  process.env.API_BASE_URL ?? "http://localhost:8000/api/v1";

export const API_KEY = process.env.API_KEY ?? "";

export const API_ORIGIN = new URL(API_BASE_URL).origin;

export function baseHeaders(accessToken?: string): Headers {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (API_KEY) headers.set("x-api-key", API_KEY);
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  return headers;
}
