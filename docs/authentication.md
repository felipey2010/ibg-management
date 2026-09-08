# Authentication and church settings

`GET /church/settings` on the backend is public. It returns `data: null` when the
church has not been configured. The frontend then uses its default settings.
Request failures remain errors rather than being treated as an absent record.

The dashboard (`/`) and business routes are protected by the frontend proxy.
Login, registration, recovery, legal pages, NextAuth endpoints, and static assets
remain public. Add new protected route prefixes to the proxy matcher and retain
server-side authentication checks in their layouts and data-access functions.

The backend validates the access token and database session through `/auth/me`.
That response includes current permissions. The church settings menu and editor
require `church.settings.update` or a system administrator's effective `*`
permission. The editor page checks access independently of the proxy; the save
service and backend PUT endpoint also enforce permission.

Expired access tokens with a live refresh token go through `/renovar-sessao`.
This page requests NextAuth's session endpoint, which rotates the API tokens and
persists the encrypted HttpOnly session cookie before navigation continues.
Server Components do not rotate tokens: they cannot persist cookie changes.
The protected app also monitors expiry and rechecks sessions on tab visibility;
failed renewal redirects to login. Permission changes trigger a server refresh.
Web Locks serialize browser refreshes across tabs where supported. The backend
atomically accepts only one refresh for a given session.

Backend access and refresh JWTs have separate `tokenType` values and required
expiration claims. Access tokens must match the database session's user.
Refresh tokens are SHA-256 hashed before bcrypt to avoid bcrypt's 72-byte input
limit. Rotation and logout invalidate only the current session. Revoked,
suspended, inactive, malformed, and expired sessions are rejected.

Deploy both repositories together. Existing sessions using the old JWT format
must sign in again. No database migration is required.

## Verification

- `npm test`: frontend validation, expiry, renewal, permissions, and redirects.
- `npm run build`, then `node scripts/check-auth-flow.mjs`: production NextAuth
  HTTP and cookie checks against an isolated API fixture, without real accounts.
- In `ibg-management-api`, run `npm test -- src/v1/modules/auth/auth-security.test.ts src/v1/modules/church/church-access.test.ts`.
  These exercise the real controllers, token code, and middleware with mocked
  database and email services.

These checks cover the authentication and church-settings flows. They are not
a certification of all business-module authorization or deployment security.
