# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` or `pnpm dev`
- **Build**: `npm run build` 
- **Production server**: `npm run start`
- **Linting**: `npm run lint`

## Project Overview

This repository contains a **Next.js 15** storefront template for the fictional **Tomodachi Sushi** restaurant. It targets React 19 and TypeScript, and leans on Tailwind CSS plus shadcn/ui primitives for styling and interaction patterns. The template demonstrates a consumer ordering experience with a live cart, product modal, reservation form, and multi-page marketing flow.

### Architecture Highlights

- **App Router** under `src/app/` with server and client components
- **UI Layer** built on shadcn/ui (`src/components/ui/`) with sushi-specific composites in `src/app/components/`
- **Styling** handled by Tailwind CSS and CSS custom properties configured in `src/app/globals.css`
- **Theme Handling** via a tiny inline script + `ThemeToggle` client control (no external theme engine)
- **State & Data** powered by SWR hooks and a lightweight Zustand store (`src/store/cart-store.ts`)
- **API Access** routed through the CraveUp Storefront SDK (`@craveup/storefront-sdk`) plus a small Next.js API helper (`src/lib/api/fetcher.ts`)

### Key Modules

- `src/app/page.tsx` – landing hero composed of `Navbar`, `SideCards`, and `OrderingSessionCompo`
- `src/app/menu/MenuPageClient.tsx` – client-driven menu explorer with category tabs and product modal
- `src/components/crave-ui/cart-component/cart-sidebar.tsx` – cart surface shared across the experience
- `src/components/ui/theme-toggle.tsx` – localStorage-aware dark/light switch used by the navbar
- `src/hooks/useCart.ts` / `src/hooks/useMenus.ts` – SWR hooks for carts and menus
- `src/hooks/use-ordering-session.ts` – ensures a cart exists for the active location; persists IDs via localStorage
- `src/lib/handle-api.ts` & `src/lib/api/fetcher.ts` – shared HTTP helpers that wrap the storefront SDK
- `src/app/components/product-description/*` – product modal, modifier selection, and supporting UI

### Data & State Flow

1. `useOrderingSession` starts an ordering session and seeds the cart ID (stored in Zustand + localStorage).
2. `useCart` reads the active cart via SWR and exposes `cart`, `cartId`, and `mutate` to UI components.
3. `useMenus` fetches menus for the resolved location and active ordering context.
4. `CartSidebar` and `MenuPageClient` share these hooks to keep the cart and product details in sync.

### Styling Notes

- Core palettes and typography live in `src/app/globals.css`.
- Assets are under `public/images/sushi/`.
- No runtime theme engine is present; components consume design tokens directly via CSS variables or Tailwind classes.

### Types & Utilities

- `src/app/types.ts` – shared menu/cart interfaces used by UI components.
- `src/types/menu-types.ts` / `src/types/common.ts` – menu modifier types and dialog props.
- `src/lib/local-storage.ts` – helper for persisting cart IDs client-side.
- `src/lib/format-api-error.ts` – normalises SDK errors for display.

### Environment Variables

Set the following for full functionality:

- `NEXT_PUBLIC_CRAVEUP_API_KEY` – required by `src/lib/storefront-client.ts`
- `NEXT_PUBLIC_LOCATION_ID` – default location consumed by hooks
- `CRAVEUP_API_BASE_URL` – used by `src/api/products/route.ts` when proxying server-side requests
- Optional: `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_CRAVEUP_STOREFRONT_BASE_URL` fallbacks (see `src/constants.ts`)

### Testing

- No automated tests ship with the template. Add React Testing Library suites as needed.

### Development Tips

- Keep client components inside `src/app/components/` when they rely on hooks or browser APIs.
- Use the existing SWR utilities (`useApiResource`, `useCart`, `useMenus`) for new API calls to stay consistent.
- Reuse shadcn/ui primitives from `src/components/ui/` before adding new ones; remove unused exports when pruning.
- When adding assets, place them under `public/images/` and reference with `/images/...`.
