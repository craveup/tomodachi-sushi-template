# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` or `pnpm dev`
- **Build**: `npm run build` 
- **Production server**: `npm run start`
- **Linting**: `npm run lint`

## Project Architecture

This is a **Next.js 15 restaurant ordering application** built with React 19, TypeScript, and Tailwind CSS. The application showcases **Leclerc Bakery** with a sophisticated theming system and cart functionality.

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
- **Environment Variables**: Requires `CRAVEUP_API_KEY` and `CRAVEUP_API_BASE_URL`
- **API Routes**: Next.js API routes in `src/api/` for server-side API calls
- **Error Handling**: Custom error classes and response handling

### State Management

- **Cart Provider**: `src/app/providers/cart-provider.tsx` manages shopping cart state
- **Address Provider**: `src/app/providers/address-provider.tsx` handles delivery addresses
- **Theme Provider**: Manages theme switching and dark mode

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
- `CRAVEUP_API_KEY` - API key for CraveUp restaurant API
- `CRAVEUP_API_BASE_URL` - Base URL for API calls (defaults to localhost:8000)

### Testing Approach

- **React Testing Library**: Available for component testing
- **Test Utilities**: Custom test helpers in `src/lib/test-utils/`
- **Mock Data**: Predefined mock data for development and testing

### Critical Architecture Details

#### Advanced State Management Patterns
- **Hybrid Cart Strategy**: Primary API-driven state with localStorage fallback for offline functionality
- **Provider Hierarchy**: Error Boundary → Theme → Address → Cart (strict layering order)
- **State Synchronization**: Real-time cart sync between API and local storage with optimistic updates

#### Theme Engine Implementation
- **JSON-Driven Themes**: Load from `public/themes/` with runtime validation
- **CSS Custom Properties**: Dynamic generation with dark mode overrides
- **Performance**: Theme caching and lazy loading patterns

#### API Architecture
- **Dual Strategy**: Direct CraveUp API + Next.js API routes for CORS protection
- **Security**: Server-side API key handling, client calls through `/api/` routes only
- **Error Handling**: Custom `CraveUpAPIError` class with standardized response handling

#### Component Development Guidelines
- **Follow Existing Patterns**: Reference `src/components/ui/example/` for new components
- **Compound Components**: Use for complex UI (cart, menu items)
- **TypeScript**: Strict mode - always define proper interfaces in `src/types/`
- **Styling**: Use theme engine variables, not hardcoded colors

#### Key Files for Development
- `src/lib/theme-engine.ts` - Theme system core
- `src/lib/api/client.ts` - API client with error handling
- `src/app/providers/cart-provider.tsx` - Cart state management
- `src/types/restaurant.ts` - Core type definitions
- `public/themes/leclerc-theme.json` - Theme configuration