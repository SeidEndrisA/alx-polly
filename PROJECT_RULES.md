# Project Rules and Conventions

This document outlines the rules, conventions, and best practices to be followed when working on this project.

## 1. Folder Structure

- **Feature-based Pages:** All new pages related to a specific feature must be created within a subdirectory of the `/app` directory. For example, all polling-related pages are located in `/app/polls`.
- **API Routes:** Server-side API routes should be placed in the `/app/api` directory.
- **Reusable Components:** General-purpose, reusable components should be placed in the `/components` directory.
- **UI Primitives:** Low-level UI components (e.g., Button, Input, Card) provided by `shadcn/ui` should be located in `/components/ui`.

## 2. Form Handling

- **State Management:** All forms must use `react-hook-form` for managing form state and submissions.
- **Validation:** Schema-based validation must be implemented using `zod`.
- **UI Components:** Form elements should be built using components from `shadcn/ui` to ensure a consistent user interface.

## 3. Supabase Usage

- **Client Initialization:** The Supabase client must always be imported from the central file at `@/lib/supabaseClient`. Do not initialize a new client in any other file.
- **Database Operations:** For complex or sensitive database operations, such as incrementing vote counts, use Supabase's RPC (Remote Procedure Call) functions instead of direct table updates from the client.
- **Authentication:** All authentication logic should leverage the `useAuth` hook, which provides access to the user's session and authentication status.

## 4. Component Architecture

- **Function Components:** All React components must be written as function components using hooks.
- **Component Naming:** Component files should be named using PascalCase (e.g., `CreatePollForm.tsx`).

## 5. State Management

- **Local State:** For state that is local to a single component, use React's built-in `useState` and `useEffect` hooks.
- **Global State:** For global state, particularly for authentication context, use React's Context API. The primary example of this is the `AuthProvider`.
