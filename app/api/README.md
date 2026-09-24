# Planned route handlers

These directories mirror the agreed frontend BFF contract. Add `route.ts` only
when an endpoint is implemented; an empty directory does not expose a route.

- `auth/register`, `auth/login`, `auth/logout`, `auth/refresh`
- `users/me`, `users/[userId]`, `users/[userId]/locations`
- `categories/regions`, `categories/types`
- `locations`, `locations/[locationId]`
- `feedbacks`
