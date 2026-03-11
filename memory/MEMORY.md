# TutorLMS Project Memory

## Project Overview

Multi-tenant LMS SaaS for coaching centers. Next.js 15 (App Router), TypeScript, Tailwind CSS v4.

## Key Architecture

- Subdomain routing: middleware.ts rewrites [slug].domain.com → /org/[slug]
- Super admin: app.domain.com → /super-admin
- Root: marketing landing page
- Student portal: /student/\* routes

## Tech Stack

- Next.js 16.1.6, React 19, TypeScript 5
- Tailwind CSS v4 (no tailwind.config.js, uses @theme inline in globals.css)
- Redux Toolkit (store/, store/slices/)
- TanStack Query for server state
- React Hook Form + Zod for forms
- Radix UI primitives (shadcn-style components in components/ui/)
- Recharts for analytics
- Sonner for toasts
- date-fns for date formatting
- lucide-react for icons

## Important: Next.js 15 Params

ALL pages/layouts with dynamic params MUST use async params:

- Server components: `async function Page({ params }: { params: Promise<{...}> }) { const x = await params; }`
- Client components: `import { use } from "react"; const x = use(params);`

## Key File Paths

- middleware.ts — subdomain routing
- lib/utils.ts — cn(), formatDate, getInitials, etc.
- lib/constants.ts — SUBJECTS, ORG_STATUS, etc.
- lib/mock-data.ts — All mock data (no backend yet)
- types/index.ts — All TypeScript types
- store/index.ts — Redux store (auth, org, ui slices)
- providers/index.tsx — Redux + TanStack Query + Sonner providers
- app/globals.css — Tailwind v4 @theme inline design tokens
- components/ui/ — All shadcn-style UI components
- components/layout/ — Sidebars (super-admin, org, student) + Header + PageHeader

## Route Structure

- / → marketing landing page
- /login → login
- /register → coaching center registration (3-step)
- /join/[token] → student invite join
- /super-admin/dashboard → platform stats
- /super-admin/organizations → org list/approve
- /org/[slug]/dashboard → org admin dashboard
- /org/[slug]/batches → batch management
- /org/[slug]/batches/[batchId]/\* → notes, videos, tests, attendance, students
- /org/[slug]/students → all students + invite
- /org/[slug]/teachers → teacher management
- /org/[slug]/reports → recharts analytics
- /org/[slug]/settings → org settings tabs
- /student/dashboard → student home
- /student/batches/[batchId]/\* → notes, videos, tests, attendance

## Build Status

✅ Build passes (npm run build)

- 67 TypeScript files created
- All async params fixed for Next.js 15

## Design System (globals.css @theme)

Primary color: indigo-600 (#4f46e5)
Sidebar: slate-900 (#0f172a)
Border: slate-200
Card bg: white

## User Preferences

- Redux Toolkit (not Zustand) for client state
- Prettier with double quotes (singleQuote: false)
- Husky pre-commit: runs lint-staged + npm run build
