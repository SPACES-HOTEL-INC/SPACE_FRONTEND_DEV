# Spaces Hm — Hotel Owner Platform (Frontend Scaffold)

## Original Problem Statement
Bootstrap the React (Vite + TypeScript + Tailwind) scaffold for the "Spaces Hm" hotel owner/vendor
platform. A premium, data-dense, highly responsive web portal (to be wrapped with Capacitor for
mobile later). Executive corporate palette: Deep Teal (#0f766e) / Ink Black (#0f172a) /
Slate Gray (#cbd5e1) / Pure White (#f8fafc backgrounds). Front-end only with mocked auth and
static dashboard data.

## Tech Stack (user-confirmed)
- Vite + React 18 + TypeScript
- Tailwind CSS (classic v3 config)
- lucide-react icons
- Fonts: Plus Jakarta Sans (primary) / Inter fallback
- Auth: fully mocked (front-end state only)
- Dashboard data: static mock data
- Runs on port 3000 via supervisor (`yarn start` -> `vite`)

## Architecture
- `src/App.tsx` — central state router: page = 'login' | 'signup' | 'dashboard'; holds `session`.
- `src/pages/` — Login.tsx, Register.tsx, Dashboard.tsx (screen-level views).
- `src/components/auth/` — AuthLayout, BrandPanel, SignIn, StepperTracker, SignUpWizard, FormField.
- `src/components/dashboard/` — Sidebar, MiniHeader, StatsRow, StatCard, CheckInsQueue.
- `src/components/ui/` — Brand (logo).
- `src/data/mockData.ts` — KPI stats, check-ins, nav items, dropdown options, demo session.
- `src/types.ts`, `src/lib/ui.ts` — shared types + control styling helpers.

## Implemented (2026-06-14)
- Module 1 — Sign In: split-screen premium login (email/password w/ show-hide, remember me,
  forgot password), "Enter Business Console" -> mock auth -> Dashboard.
- Module 2 — 3-step Registration Wizard with status stepper; centralized form state retained
  across Back/Next; file-upload dropzone mock; submit -> Dashboard.
- Module 3 — Executive Dashboard: mini-header (hotel name, Merchant ID, Online pulse),
  left sidebar nav (Overview/Rooms/Bookings/Payouts + mobile slide-over), KPI stats row
  (Occupancy %, Active Rooms, Daily Revenue in success color), Incoming Check-ins queue with
  "Check In" action -> row status flip + confirmation toast.
- 100% responsive (wide/laptop/mobile), touch-friendly targets, micro-animations.

## Backlog / Next Action Items
- P1: Wire real backend (FastAPI + MongoDB) for auth + dashboard data.
- P1: Build out Manage Rooms, Bookings, Payouts sections (currently placeholders).
- P2: Form validation + inline error states on the wizard.
- P2: Capacitor config + native packaging (`dist/` build ready).
- P2: Real file upload handling in the KYC dropzone.
