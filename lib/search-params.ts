import type { SortOrder } from "@/lib/api/types";

export type SearchParams = Record<string, string | string[] | undefined>;

export function param(params: SearchParams, key: string): string | undefined {
  const value = params[key];
  const single = Array.isArray(value) ? value[0] : value;
  return single?.trim() || undefined;
}

function int(value: string | undefined, fallback: number, max: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 1 ? Math.min(parsed, max) : fallback;
}

function bool(value: string | undefined): boolean | undefined {
  return value === "true" ? true : value === "false" ? false : undefined;
}

export function listParams(params: SearchParams, defaultLimit = 10) {
  return {
    page: int(param(params, "page"), 1, 100_000),
    limit: int(param(params, "limit"), defaultLimit, 100),
    sortOrder: (param(params, "sortOrder") === "asc" ? "asc" : "desc") as SortOrder,
    searchTerm: param(params, "search")?.slice(0, 100),
  };
}

export function noteParams(params: SearchParams) {
  return {
    ...listParams(params),
    tag: param(params, "tag")?.toLowerCase(),
    pinned: bool(param(params, "pinned")),
    archived: param(params, "view") === "archived",
  };
}
