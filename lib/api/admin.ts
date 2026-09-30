import "server-only";
import { backend } from "./server";
import type { UserSummary } from "./types";

// The API has no role filter, so admins are counted page by page.
export async function countAdmins(): Promise<number> {
  let page = 1;
  let count = 0;
  for (;;) {
    const { items, meta } = await backend.users.list({ page, limit: 100 });
    count += items.filter((user) => user.roles.includes("admin")).length;
    if (!meta.hasNextPage) return count;
    page += 1;
  }
}

export async function resolveUsers(ids: string[]): Promise<Record<string, UserSummary>> {
  const unique = [...new Set(ids)];
  const users = await Promise.all(unique.map((id) => backend.users.get(id).catch(() => null)));
  return Object.fromEntries(
    users
      .filter((user) => user !== null)
      .map(({ id, fullName, email, avatarUrl }) => [id, { id, fullName, email, avatarUrl }])
  );
}
