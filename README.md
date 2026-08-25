# RentNest 🏠 — Frontend

A modern, responsive rental property marketplace built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**. Tenants browse and request properties, landlords manage listings and requests, and admins moderate the platform — all consuming a separate [RentNest backend API](https://github.com/your-username/rentnest-backend).

**Live demo:** https://rentnest-frontend-dusky.vercel.app

## Features

- 🔍 **Public browsing** — searchable, filterable property grid with skeleton loading states
- 🔐 **Role-based auth** — Tenant / Landlord / Admin, protected routes via Next.js Middleware
- 📝 **Rental request flow** — request to rent, approve/reject, with optimistic UI updates
- 💳 **Stripe Checkout** — secure payment flow with dedicated success/cancel pages
- 🏘️ **Landlord dashboard** — create/manage listings, review incoming requests
- 🛡️ **Admin dashboard** — user management (ban/unban), platform-wide moderation
- ⭐ **Reviews** — tenants can rate completed stays
- 📱 Fully responsive, accessible UI with a custom design system

## Tech Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | JWT (cookie-based, read by Middleware) |
| Payments | Stripe Checkout |
| Fonts | Fraunces + Inter (next/font) |

## Getting Started

```bash
git clone https://github.com/your-username/rentnest-frontend.git
cd rentnest-frontend
npm install
cp .env.local.example .env.local
```

Edit `.env.local` and point it at your backend:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> Also set `CLIENT_URL` on the **backend** to match wherever this frontend runs — it's used to build Stripe's `success_url` / `cancel_url`.

## Project Structure

```
src/
  app/            Next.js App Router pages — routes mirror the assignment spec
    properties/       browse + property details
    auth/             register / login
    dashboard/        tenant / landlord / admin, role-protected
    payment/          success / cancel
  components/     Navbar, PropertyCard, StatusBadge, FilterBar, skeletons
  lib/            api.ts (typed fetch wrapper), auth-context.tsx, toast-context.tsx
  types/          Shared TypeScript types mirroring the backend's Prisma schema
  middleware.ts   Role-based route protection, reads the auth cookie
```

## API Integration Notes

The backend wraps every response as `{ success, message, meta, data }` and every error as `{ success: false, message }`. `src/lib/api.ts` unwraps `data` automatically; use `apiWithMeta()` when you also need `meta.total` for pagination.

Key endpoint mappings:

| Feature | Endpoint |
|---|---|
| Register / Login | `POST /auth/register`, `POST /auth/login` → `{ user, token }` |
| Browse properties | `GET /properties?location=&type=&minPrice=&maxPrice=` |
| Property details | `GET /properties/:id` |
| Request to rent | `POST /rentals` · tenant history `GET /rentals` |
| Landlord listings | `GET/POST /landlord/properties` |
| Landlord requests | `GET /landlord/requests` · `PATCH /landlord/requests/:id` |
| Start payment | `POST /payments/create` → Stripe `checkoutUrl` |
| Verify payment | `GET /payments/verify/:sessionId` |
| Admin users | `GET/PATCH /admin/users` (`status: ACTIVE \| BANNED`) |

## Demo Admin Credentials

```
Email:    admin@rentnest.com
Password: admin123
```


---

Built by Sara as part of a full-stack rental marketplace assignment (frontend consumes [RentNest backend](https://rentnest-backend-seven.vercel.app/api-docs)).
