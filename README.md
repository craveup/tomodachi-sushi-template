Tomodachi Sushi Storefront Template (Next.js)
===========================================

A single-location storefront template built with Next.js (App Router), TypeScript, SWR, Tailwind, and shadcn/ui. It integrates with the CraveUp Storefront API and mirrors the multi-location template so external developers have a consistent codebase to work from.

Quickstart
----------
- Copy `.env.example` to `.env.local` and fill in the values.
- Install dependencies with `pnpm install`.
- Run the dev server: `pnpm dev` (defaults to port 3003).
- Navigate to `http://localhost:3003`.

Environment
-----------
Client-visible variables must be prefixed with `NEXT_PUBLIC_`.
- `NEXT_PUBLIC_CRAVEUP_API_KEY` — API key used to talk to the Storefront API.
- `NEXT_PUBLIC_ORG_SLUG` — merchant slug that owns the location.
- `NEXT_PUBLIC_DEFAULT_LOCATION_ID` — required for the single-location template; bypasses the organization landing page and renders the location directly.
- `NEXT_PUBLIC_API_URL` — optional override for the Storefront API base URL.
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — enables delivery address autocomplete and map embeds.

Project Structure
-----------------
The folder layout mirrors the multi-location template for consistency:
- `src/app/` — routes, layouts, and error/loading pages (`/[locationId]` handles the main experience).
- `src/components/` — UI components (primitives live in `components/ui`).
- `src/hooks/` — SWR data hooks (`useOrderingSession`, `useCart`, `useMenus`).
- `src/lib/` — API client wrappers and utilities.
- `src/types/` — TypeScript types that wrap the SDK exports.
- `src/styles/globals.css` — Tailwind v4 setup shared across templates.

API Client & Checkout
---------------------
- `@craveup/storefront-sdk` powers all API access so the code stays concise.
- `useOrderingSession` starts an ordering session automatically and stores the cart id.
- The hosted checkout is used—`CartPanel` simply redirects to `cart.checkoutUrl`.
- Fulfilment operations (delivery/table service room, tips, etc.) are implemented exactly like the reference template so developers can copy-paste between projects.

Testing & Quality
-----------------
- `pnpm lint` uses the shared ESLint config.
- `pnpm build` ensures the app compiles cleanly.
- The template ships without Jest tests, but files are organised for colocated specs should you add them.

Differences vs Multi-Location Template
--------------------------------------
- The landing page automatically redirects to `/[NEXT_PUBLIC_DEFAULT_LOCATION_ID]`.
- Merchant metadata (title/description/OpenGraph) is derived from that location instead of the org overview.
- Everything else—components, hooks, styling, tooling—matches the shared reference so diffs stay small.

Extending
---------
- Update `src/lib/api/*` if you need to call different endpoints; the signatures are typed.
- Replace `src/components` or add pages while keeping the existing shadcn primitives.
- Follow `STYLEGUIDE.md` for naming, spacing, and composition guidelines.
