# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` or `pnpm dev`
- **Build**: `npm run build` 
- **Production server**: `npm run start`
- **Linting**: `npm run lint`

## Project Architecture

This is a **Next.js 15 restaurant ordering application template** built with React 19, TypeScript, and Tailwind CSS. The application can be themed for any restaurant type and currently showcases **Leclerc Bakery** as an example, featuring a sophisticated theming system and cart functionality.

### Core Architecture

- **App Router**: Uses Next.js App Router with TypeScript
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom theme system
- **State Management**: React Context for cart and address management
- **Data Fetching**: SWR and TanStack Query for API calls

### Key Features

1. **Dynamic Theming System**: Custom theme engine (`src/lib/theme-engine.ts`) that loads JSON theme configurations and applies CSS custom properties
2. **Restaurant API Integration**: Client for CraveUp API with cart management, product fetching, and payment processing
3. **Multi-Provider Architecture**: Layered providers for theming, cart, and address management
4. **Component Library**: Extensive UI component system in `src/components/ui/` and restaurant-specific components

### Directory Structure

- `src/app/` - Next.js app router pages and layouts
- `src/components/` - Reusable UI components
  - `ui/` - Shadcn/ui base components
  - `crave-ui/` - Restaurant-specific UI components
- `src/lib/` - Utilities and API clients
  - `api/` - CraveUp API integration
  - `theme-engine.ts` - Theme management system
- `src/hooks/` - Custom React hooks
- `public/` - Static assets including theme JSON files

### Theme System

The application uses a sophisticated theming system:

- **Theme Engine**: `src/lib/theme-engine.ts` converts JSON themes to CSS custom properties
- **Theme Provider**: `src/app/hooks/use-restaurant-theme.tsx` provides React context for theme management
- **Theme Configuration**: JSON files in `public/themes/` define color schemes, typography, and animations
- **Dark Mode Support**: Built-in dark mode with localStorage persistence

### API Integration

- **Base Client**: `src/lib/api/client.ts` handles all CraveUp API interactions
- **Environment Variables**: Requires `NEXT_PUBLIC_CRAVEUP_API_KEY` and `CRAVEUP_API_BASE_URL`
- **API Routes**: Next.js API routes in `src/api/` for server-side API calls
- **Error Handling**: Custom error classes and response handling

### State Management

- **Cart Hook**: `src/hooks/useCart.ts` keeps the active cart in sync with the CraveUp API
- **Cart Store**: `src/store/cart-store.ts` (Zustand) persists the current cart ID and loading state
- **Ordering Session Hook**: `src/hooks/use-ordering-session.ts` bootstraps sessions and cart IDs
- **Theme Provider**: `RestaurantThemeProvider` manages theme switching and dark mode

### Component Patterns

- **Compound Components**: Menu items, cart components use compound patterns
- **Error Boundaries**: Application-wide error handling
- **Loading States**: Skeleton loaders and loading indicators throughout
- **Responsive Design**: Mobile-first design with desktop enhancements

### Important Configuration

- **TypeScript**: Strict mode enabled, path aliases configured (`@/*` -> `src/*`)
- **ESLint**: Next.js recommended config with TypeScript support
- **Tailwind**: CSS variables integration for theme system
- **Components.json**: Shadcn/ui configuration with New York style

### Environment Variables

Required for full functionality:
- `NEXT_PUBLIC_CRAVEUP_API_KEY` - Storefront API key exposed to the client
- `CRAVEUP_API_BASE_URL` - Base URL for API calls (defaults to localhost:8000)
- `NEXT_PUBLIC_LOCATION_ID` - Required location ID for restaurant operations

### Testing Approach

- No dedicated automated tests are included; add React Testing Library suites as needed for your project

### Critical Architecture Details

#### Advanced State Management Patterns
- **Hybrid Cart Strategy**: `useCart` pulls live data from the storefront API while `cart-store` keeps the active cart ID cached in Zustand/localStorage
- **Session Bootstrapping**: `use-ordering-session` ensures a valid cart exists for the active location before menu interactions
- **Cart Surface**: `CartSidebar` (used by the Navbar) consumes the live cart hook directly—no extra providers required
- **Hydration Safety**: All cart hooks are client components with guarded localStorage access for SSR compatibility

#### Theme Engine Implementation
- **JSON-Driven Themes**: Load from `public/themes/` with runtime validation via `ThemeEngine.validateTheme()`
- **CSS Custom Properties**: Dynamic generation with dark mode overrides and seasonal adjustments
- **Provider Integration**: `RestaurantThemeProvider` with hooks for component-level theme access
- **Multi-Hook Architecture**: `useRestaurantTheme`, `useThemeClasses`, `useThemeAnimations`, `useSeasonalTheme`
- **Performance**: Theme caching, localStorage persistence, and automatic system preference detection

#### API Architecture
- **Dual Strategy**: Direct CraveUp API + Next.js API routes for CORS protection
- **Security**: Server-side API key handling via `getServerApiKey()`, client calls through `/api/` routes
- **Error Handling**: Custom `CraveUpAPIError` class with standardized response handling
- **Endpoint Management**: Centralized in `src/lib/api/config.ts` with environment-based URL building
- **Hybrid API Approach**: Some endpoints use direct API calls, others use Next.js API routes

#### Component Development Guidelines
- **Follow Existing Patterns**: Mirror production components in `src/app/components/` and `src/components/ui/`
- **Compound Components**: Use for complex UI (cart, menu items)
- **TypeScript**: Strict mode - always define proper interfaces in `src/types/`
- **Styling**: Use theme engine variables, not hardcoded colors

#### Key Files for Development
- `src/lib/theme-engine.ts` - Theme system core with CSS custom properties generation
- `src/lib/api/client.ts` - CraveUp API client with error handling
- `src/lib/api/config.ts` - API configuration, endpoints, and security handling
- `src/hooks/useCart.ts` - Cart data hook shared across screens and the cart sidebar
- `src/components/crave-ui/cart-component/cart-sidebar.tsx` - Reusable cart surface driven by the storefront API
- `src/app/hooks/use-restaurant-theme.tsx` - Theme management hooks and providers
- `src/app/types.ts` - Core application type definitions
- `public/themes/leclerc-theme.json` - Theme configuration with sushi-specific styling
- `components.json` - Shadcn/ui configuration (New York style, CSS variables enabled)
