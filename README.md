# Secure Notes — Frontend

Next.js 16 (App Router) + shadcn/ui + TanStack Table v9 client for the Secure Notes API.
See `doc/FRONTEND_INTEGRATION.md` for the API contract.

## Setup

```bash
cp .env.example .env.local   # API_BASE_URL=http://localhost:8000/api/v1
npm install
npm run dev                  # http://localhost:3000
```

The API must run on port 8000 with `CORS_ORIGINS=http://localhost:3000`.

## How it fits together

- **Sessions** — tokens live in `httpOnly` cookies (`sn_access`, `sn_refresh`); `sn_user` is a readable UI hint only.
- **`proxy.ts`** — refreshes stale tokens before render, redirects signed-out users to `/login`, and sends non-admins on `/admin/*` to `/forbidden`. Roles come from the JWT, never the readable cookie.
- **BFF** — browser calls go through `/api/backend/*` (allowlisted to `notes`, `profile`, `users`, `posts`), which attaches the bearer token and rotates on `401`. Auth goes through `/api/auth/*`.
- **Refresh** — single-flight and shared across the proxy and route handlers, so a single-use refresh token is never replayed.
- **Tables** — server components fetch the data; search, filters, sort and pagination live in the URL (`components/data-table`).

## Structure

```
proxy.ts                 route protection + token rotation
app/(auth)               login, register
app/(dashboard)          notes, posts, profile, admin/*
app/api                  auth + backend proxy route handlers
components/data-table    reusable server-driven table kit
components/form          reusable react-hook-form fields
lib/api                  endpoints, server/client requesters, types
lib/auth                 cookies, jwt, refresh, session
```
