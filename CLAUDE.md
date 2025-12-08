# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build & Development
- `bun run dev` - Start development server with hot reload
- `bun run build` - Build for production using Rsbuild
- `bun run preview` - Preview production build locally

### Code Quality
- `bun run check` - Run Biome linter and formatter with auto-fix
- `bun run check <file-path>` - Run Biome check on a specific file (e.g., `bun run check src/app/accounts/schemas/client.schema..ts`)
- `bun run format` - Format code with Biome
- `bun test` - Run tests with Vitest

### Testing
- Tests are configured with Vitest and Happy DOM
- Test files should be named `*.test.tsx` or `*.spec.tsx`
- Setup file: `src/test/setupTests.ts`
- Run specific test: `bun test -- <test-file-pattern>`

## Architecture Overview

### Tech Stack
- **Build Tool**: Rsbuild with React plugin
- **Framework**: React 19 with TypeScript
- **Routing**: TanStack Router with file-based routing
- **State Management**: Zustand stores + TanStack Query for server state
- **Styling**: TailwindCSS with Shadcn/UI components
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest + Testing Library

### Project Structure

#### Core Application Structure
```
src/
├── app/                    # Feature modules (domain-driven)
│   ├── auth/              # Authentication & login
│   ├── bank-deposit/      # Bank deposit management
│   ├── clients/           # Client and plate management
│   ├── collections/       # Document and payment collections
│   ├── common/            # Common shared services
│   ├── companies/         # Company management
│   ├── configurations/    # System configuration & maintenance
│   │   └── maintenance/   # Banks, branches, currencies, users, etc.
│   ├── contometer/        # Fuel contometer readings
│   ├── credits/           # Credit management
│   ├── daily-report/      # Daily report generation & management
│   ├── detail-boxes/      # Cash box detail management
│   ├── dipstick/          # Fuel level measurements
│   ├── inventory/         # Product inventory management
│   │   └── products/      # Product-specific components
│   ├── pdf/               # PDF report generation
│   ├── sales/             # Sales management & vouchers
│   └── support/           # Support and company administration
│       └── companies/     # Company support tools
│   
│   # Each feature contains:
│   ├── components/        # Feature-specific components
│   │   ├── modals/        # Modal dialogs
│   │   └── tables/        # Data tables
│   ├── hooks/             # Custom hooks for API integration
│   ├── lib/               # Feature utilities & column definitions
│   ├── schemas/           # Zod validation schemas
│   ├── services/          # API service layer
│   ├── store/             # Zustand stores (if needed)
│   └── types/             # TypeScript type definitions
│
├── components/ui/         # Reusable UI components (Shadcn/UI)
├── shared/                # Shared utilities and components
│   ├── components/        # Reusable components
│   │   ├── form/          # Form component wrappers
│   │   ├── modals/        # Modal containers
│   │   └── ui/            # Enhanced UI components
│   ├── errors/            # Error handling utilities
│   ├── hooks/             # Shared custom hooks
│   ├── lib/               # Utility functions & constants
│   ├── store/             # Global Zustand stores
│   └── types/             # Shared TypeScript types
├── routes/                # File-based routing structure
│   ├── (sidebar)/         # Authenticated routes with sidebar
│   └── __root.tsx         # Root layout component
├── styles/                # Global CSS styles
├── test/                  # Test configuration and utilities
└── types/                 # Global type declarations
```

#### Key Architecture Patterns

**Feature-Based Organization**: Each business domain (auth, bank-deposit, daily-report, etc.) is organized as a self-contained module with its own components, services, and types.

**Service Layer Pattern**: Each feature has a dedicated service layer for API interactions, typically using TanStack Query for caching and synchronization.

**Store Pattern**: Uses Zustand for local state management with stores like:
- `auth.store.ts` - Authentication state
- `modal.store.ts` - Modal visibility state
- `title-header.store.ts` - Header title management

**Component Patterns**:
- Shared UI components follow Shadcn/UI conventions
- Feature components use controlled/uncontrolled patterns with React Hook Form
- Modal components are centralized with `modal.store.ts`

### Routing Structure
- File-based routing using TanStack Router
- Nested routes under `(sidebar)/` for authenticated pages
- Route generation handled automatically by `@tanstack/router-plugin`

### Data Fetching
- TanStack Query for server state management
- Services layer abstracts API calls
- Custom hooks (e.g., `useBankDepositService`) encapsulate query logic

### Styling & UI
- TailwindCSS for utility-first styling
- Shadcn/UI components in `components/ui/`
- Path aliases: `@shadcn/*` for UI components
- Dark/light theme support via `next-themes`

### Path Aliases
- `@/*` - src directory
- `@shadcn/*` - UI components
- `@utils/*` - Utility functions
- `@auth/*` - Auth module
- `@bank-deposit/*` - Bank deposit module

## Key Business Domains

This is a Point of Sale (POS) backoffice system with the following main modules:

- **Liquidación** (Settlement): Daily reports, cash box details, bank deposits
- **Ventas** (Sales): Sales management and voucher processing
- **Créditos** (Credits): Credit management and client handling
- **Inventario** (Inventory): Product management
- **Configuración** (Configuration): System maintenance and settings
- **Soporte** (Support): Company management
- **PDF**: Report generation and export functionality

## Task Management

### TODO System
When the user asks to "add a task", create or update a todo file in the `todos/` directory with the current date format `DD-MM.todo.md` (e.g., `04-08.todo.md`). 

- Check if a file for today's date already exists
- If it exists, append the new task
- If it doesn't exist, create a new file with the task
- Use markdown format with checkboxes for tasks
- Include timestamp and brief description

## Code Conventions

### File Naming
- Components: kebab-case (`form-login.tsx`, `modal-add-bank-deposit.tsx`)
- Hooks: camelCase with `use` prefix and `.ts` extension (`useAuthService.ts`)
- Services: kebab-case with `.service.ts` suffix (`auth.service.ts`)
- Types: kebab-case with `.type.ts` suffix (`bank-deposit.type.ts`)
- Schemas: kebab-case with `.schema.ts` suffix (`auth.schema.ts`)
- Stores: kebab-case with `.store.ts` suffix (`auth.store.ts`)
- Columns: kebab-case with `-columns.tsx` suffix (`daily-report-columns.tsx`)
- Filters: kebab-case with `-filters.ts` suffix (`daily-report-filters.ts`)

**Note**: The codebase primarily uses kebab-case for most file types to maintain consistency.

### Import Organization
- External libraries first
- Internal imports with path aliases
- Relative imports last
- Biome handles import sorting automatically

### Component Patterns
- Use functional components with hooks
- Prefer controlled components with React Hook Form
- Use Zod schemas for validation
- Follow Shadcn/UI patterns for consistency

### API Integration
- Services use fetch with error handling
- TanStack Query for caching and synchronization
- Custom hooks wrap service calls
- Type-safe API responses with TypeScript

### Mathematical Calculations
- **Always use Big.js** for monetary and mathematical calculations to avoid floating-point precision issues
- Convert to number only at the end with `.toFixed(2)` for 2 decimal precision
- Example:
  ```typescript
  import Big from "big.js"
  
  // ✅ Correct approach
  const price = new Big(product.price)
  const quantity = new Big(product.quantity)
  const total = price.times(quantity)
  const finalAmount = Number(total.toFixed(2))
  
  // ❌ Avoid direct number operations
  const total = product.price * product.quantity // Floating-point errors
  ```

### TypeScript Type Definitions
- When creating a type that contains nested objects, extract each nested object into its own separate type
- Use descriptive names for nested types (e.g., `UserLocal` for a user's local data)
- Always prefer composition over inline object definitions for better maintainability
- Example:
  ```typescript
  // ❌ Avoid inline nested objects
  export type User = {
    id: string
    name: string
    settings: {
      theme: string
      notifications: boolean
    }
  }
  
  // ✅ Extract nested objects into separate types
  export type UserSettings = {
    theme: string
    notifications: boolean
  }
  
  export type User = {
    id: string
    name: string
    settings: UserSettings
  }
  ```