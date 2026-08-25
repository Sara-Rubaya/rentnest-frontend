# RentNest Frontend

Next.js 14 (App Router) frontend for RentNest, wired directly to your
`rentnest-backend` API (Node/Express/Prisma/PostgreSQL, Stripe Checkout).

## Setup

```bash
npm install
cp .env.local.example .env.local
# edit .env.local and point NEXT_PUBLIC_API_BASE_URL at your backend, e.g.
# NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
npm run dev
```

Make sure your backend's `CLIENT_URL` env var matches wherever this frontend
runs (e.g. `http://localhost:3000`) — `payment.service.ts` uses it to build
the Stripe `success_url` / `cancel_url`.

## How it's wired to your backend

- **Response envelope** — every backend response is `{ success, message, meta, data }`
  and every error is `{ success: false, message, errorDetails }`
  (`src/utils/sendResponse.ts` / `errorHandler.ts`). `src/lib/api.ts` unwraps
  `data` for you; use `apiWithMeta()` when you also need `meta.total` (used on
  the `/properties` browse page for server-side pagination/filtering).
- **Auth** — `POST /auth/register` and `POST /auth/login` return `{ user, token }`.
  The token is stored in a cookie (not localStorage) so `middleware.ts` can
  read it server-side to protect `/dashboard/*` routes by role.
- **Properties** — public `GET /properties` (supports `location`, `type`,
  `minPrice`, `maxPrice`, `search`, `page`, `limit` query params — see
  `property.service.ts`) and `GET /properties/:id`. Landlord CRUD lives under
  `/landlord/properties`, not `/properties`, matching `landlord.routes.ts`.
- **Rentals** — tenants create/read via `POST /rentals` and `GET /rentals`;
  landlords manage via `GET /landlord/requests` and
  `PATCH /landlord/requests/:id` (`status: APPROVED | REJECTED`).
- **Payments** — `POST /payments/create` returns a Stripe Checkout
  `{ checkoutUrl, sessionId, payment }`; the pay page redirects the browser
  to `checkoutUrl`. `/payment/success` reads `?session_id=` and calls
  `GET /payments/verify/:sessionId` as a manual-confirm fallback to the
  webhook (useful since there's no local webhook listener in dev).
- **Admin** — `GET/PATCH /admin/users` (`status: ACTIVE | BANNED`, not a
  boolean), `GET /admin/properties`, `GET /admin/rentals`.
- **Types** (`src/types/index.ts`) mirror `prisma/schema.prisma` exactly —
  e.g. `isAvailable` not `available`, nested `landlord`/`property`/`tenant`
  summaries, `PaymentStatus` = `PENDING | COMPLETED | FAILED`.

## What's stubbed / left for you

- **Image upload** — the "new listing" form takes comma-separated image
  URLs for now (there's no file upload endpoint in the backend). Swap in a
  real uploader if you add one.
- **Toast notifications** — a small custom `ToastProvider`
  (`src/lib/toast-context.tsx`) instead of an external library, to keep
  `npm install` light. Swap for `react-hot-toast` if you prefer.
- **Categories** — `GET /categories` exists on the backend but isn't wired
  into the listing form yet; add a `<select>` there if you want tenants to
  filter by category too.

## Project structure

```
src/
  app/            Next.js App Router pages (routes match the assignment table)
  components/     Navbar, PropertyCard, StatusBadge, FilterBar, skeletons
  lib/            api.ts (fetch wrapper), auth-context.tsx, toast-context.tsx
  types/          Shared TypeScript types matching the Prisma schema
  middleware.ts   Route protection by role, reading the auth cookie
```
