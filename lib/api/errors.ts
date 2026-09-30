export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly messages: string[],
    readonly body: unknown,
  ) {
    super(messages[0] ?? `Request failed with ${status}`);
    this.name = "ApiError";
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    let body: unknown = null;
    try {
      body = await response.json();
    } catch {}

    const raw = (body as { message?: string | string[] } | null)?.message;
    const messages = Array.isArray(raw)
      ? raw
      : typeof raw === "string"
        ? [raw]
        : [`Request failed with ${response.status}`];

    return new ApiError(response.status, messages, body);
  }

  get isUnauthorized() {
    return this.status === 401;
  }
  get isForbidden() {
    return this.status === 403;
  }
  get isNotFound() {
    return this.status === 404;
  }
  get isRateLimited() {
    return this.status === 429;
  }
}

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.isRateLimited) return "Too many attempts, try again in a minute.";
    if (error.status === 503) return "Service unavailable, please retry shortly.";
    return error.messages.join(" · ");
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}
