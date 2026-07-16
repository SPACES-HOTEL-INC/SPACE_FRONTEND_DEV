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
- P1: Wire real backend (FastAPI + MongoDB) for auth + dashboard/rooms/bookings/payouts data.
- P2: Form validation + inline error states on the room form (clamp negative price/inventory).
- P2: Capacitor config + native packaging (`dist/` build ready).
- P2: Real file upload handling (currently a mock URL pool) in the room image matrix.
- P3: Confirm-before-close on dirty room form; centralise business constants (MIN_WITHDRAWAL, fees).

## Update — 2026-06-14 (Tabs build-out)
- Made sidebar tabs functional: `Dashboard.tsx` is now a tab router on `activeNav`
  (overview | rooms | bookings | payouts) rendering the matching sub-panel.
- **Manage Rooms**: card grid of room types + "Add New Room Type" slide-over
  (`RoomFormPanel`) with title/description/pricing+currency/inventory/capacity/amenities
  and a mock image matrix enforcing the strict 3–7 image rule (Save gated + dynamic helper).
- **Bookings**: filterable reservation ledger (search by guest + status filter); inline
  Confirmed→Check In→Checked-In→Check Out→Completed transitions with toasts.
- **Payouts**: 3 financial widgets (Total Earnings / Available Balance via
  `Total − (Fee + Pending + Withdrawn)` / Pending Clearance), bank settings card,
  withdrawal button disabled when balance < $50, and a historic payout ledger.
- Global `app-toast` shared by all tabs. Verified 100% by testing agent (iteration_3).

## Update — 2026-06-14 (Manage Rooms polish)
- Currency selector restricted to **USD ($) and NGN (₦)**; room cards render the
  chosen symbol dynamically ($420/night, ₦180,000/night).
- New **image carousel** on every room card (`RoomImageCarousel`): crisp
  `aspect-[4/3]` + `object-cover`, hover/tap chevrons, dot indicators, cycles the
  room's 3–7 images (controls stopPropagation).
- Amenities restructured into **categorised checklists** (Bathroom · Media & Tech ·
  Room Amenities · Food & Drink · General Services) in the Add Room form
  (`AMENITY_CATEGORIES` / `AMENITY_MAP`).
- Cards show a "Show all facilities and services" link opening `FacilitiesModal`,
  which lists the room's selected features grouped by category.
- Strict 3–7 image rule preserved. Verified 100% by testing agent (iteration_4).

## Update — 2026-06-14 (Elite operational upgrades)
- **Payouts → Nigerian banks**: bank dropdown now lists 8 NG institutions (Access,
  GTBank, Zenith, UBA, First Bank, Moniepoint MFB, OPay, Kuda).
- **NUBAN verification**: at exactly 10 digits, a teal "Verifying NUBAN…" loader shows,
  then a read-only "Account Name: Spaces Partner Ltd (Verified)" label auto-fills.
- **Dual-currency wallet**: top-right USD/NGN toggle re-renders all widgets, withdrawal
  card and history at a ×1500 rate (USD $41,996.25 ⇄ NGN ₦62,994,375). Flat-10%
  platform-fee caption under Total Earnings.
- **KYC gating**: a "Withdrawals are locked" banner shows until bank details are saved
  (requires a selected bank + verified NUBAN); saving hides the banner and unlocks the
  Request Withdrawal button.
- **Bookings**: special-request message badge → popover (bottom-sheet on mobile) per
  guest; plus a weekly visual timeline matrix (rooms × Mon–Sun) with teal duration blocks.
- Verified 100% by testing agent (iteration_5); mobile popover overflow fixed post-test.
