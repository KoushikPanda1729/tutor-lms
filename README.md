# Tutor LMS — Frontend

Multi-tenant LMS SaaS for coaching centers. Each coaching center gets their own subdomain (`allen.yourdomain.com`). One Next.js codebase, three distinct apps.

---

## What We're Building (Frontend Only)

Three apps sharing one codebase, split by subdomain:

```
yourdomain.com              → Marketing / Landing Page
app.yourdomain.com          → Super Admin Panel (you)
[slug].yourdomain.com       → Coaching Center App (admin + teacher + student)
```

---

## User Roles & Screens

### Super Admin

- View all coaching center registrations (pending / active / suspended)
- Approve or reject registration requests
- Platform analytics dashboard

### Coaching Center Admin

- Org setup: name, logo, subjects, branding
- Batch management: create, edit, archive batches
- Student management: invite via link, approve join requests
- Teacher management: add/remove teachers, assign to batches
- Content: upload notes, schedule tests, add videos per batch
- Attendance: mark per batch per day
- Reports: per batch, per student

### Teacher

- View assigned batches
- Upload notes, create tests, mark attendance

### Student

- View enrolled batches
- Access notes, videos, tests (only when window is open)
- View own attendance record and test scores

---

## Page Structure

```
app/
│
├── (marketing)/                        # yourdomain.com
│   ├── page.tsx                        # Landing page
│   ├── pricing/page.tsx                # Pricing page
│   └── register/page.tsx              # Coaching center registration form
│
├── (auth)/                             # Shared auth pages
│   ├── login/page.tsx
│   ├── forgot-password/page.tsx
│   └── join/[token]/page.tsx          # Student invite link
│
├── (super-admin)/                      # app.yourdomain.com
│   ├── layout.tsx                      # Super admin shell
│   ├── dashboard/page.tsx             # Platform overview stats
│   ├── organizations/
│   │   ├── page.tsx                    # All orgs list (pending, active, suspended)
│   │   └── [orgId]/page.tsx           # Org detail + approve/reject action
│   └── settings/page.tsx
│
├── (org)/                              # [slug].yourdomain.com — admin/teacher views
│   ├── layout.tsx                      # Org shell (sidebar, header)
│   ├── dashboard/page.tsx             # Org overview: batches, recent activity
│   │
│   ├── batches/
│   │   ├── page.tsx                    # All batches grid
│   │   ├── new/page.tsx               # Create batch form
│   │   └── [batchId]/
│   │       ├── layout.tsx             # Batch shell (sub-tabs)
│   │       ├── page.tsx               # Batch overview
│   │       ├── notes/
│   │       │   ├── page.tsx           # Notes list
│   │       │   └── upload/page.tsx    # Upload note
│   │       ├── videos/
│   │       │   ├── page.tsx           # Videos list
│   │       │   └── add/page.tsx       # Add video (upload or embed)
│   │       ├── tests/
│   │       │   ├── page.tsx           # Tests list
│   │       │   ├── new/page.tsx       # Create test + question builder
│   │       │   └── [testId]/
│   │       │       ├── page.tsx       # Test detail + results
│   │       │       └── leaderboard/page.tsx
│   │       ├── attendance/
│   │       │   ├── page.tsx           # Attendance sheet (mark today)
│   │       │   └── history/page.tsx   # Past attendance records
│   │       └── students/page.tsx      # Students enrolled in this batch
│   │
│   ├── students/
│   │   ├── page.tsx                    # All students in org
│   │   ├── invite/page.tsx            # Generate invite links
│   │   └── [studentId]/page.tsx       # Student profile + report
│   │
│   ├── teachers/
│   │   ├── page.tsx                    # All teachers
│   │   └── invite/page.tsx
│   │
│   ├── reports/page.tsx               # Org-wide analytics
│   └── settings/
│       ├── page.tsx                    # Org profile (name, logo, etc.)
│       └── billing/page.tsx
│
└── (student)/                          # [slug].yourdomain.com — student views
    ├── layout.tsx                      # Student shell
    ├── dashboard/page.tsx             # My batches overview
    └── batches/[batchId]/
        ├── page.tsx                    # Batch home
        ├── notes/page.tsx             # Notes list + download
        ├── videos/page.tsx            # Video list + player
        ├── tests/
        │   ├── page.tsx               # Available / upcoming / past tests
        │   ├── [testId]/page.tsx      # Test attempt screen (full screen)
        │   └── [testId]/result/page.tsx
        └── attendance/page.tsx        # My attendance % + calendar view
```

---

## Key UI Flows

### 1. Coaching Center Registration

```
yourdomain.com
  └── /register
        ├── Step 1: Center details (name, city, phone, email)
        ├── Step 2: Admin account setup (name, password)
        └── Step 3: Confirmation screen ("We'll review and get back in 24hrs")
```

### 2. Super Admin Approves Org

```
app.yourdomain.com/organizations
  └── Pending tab → Click org → Review details
        ├── Approve → org status = active, subdomain activated, email sent
        └── Reject  → org status = rejected, reason sent via email
```

### 3. Student Joins via Invite Link

```
yourdomain.com/join/[token]
  └── Token decoded → shows: "You're joining [Batch Name] at [Org Name]"
        ├── If new user → register form (name, email, phone, password)
        └── If existing user → login → auto-enrolled in batch
```

### 4. Student Attempts a Test

```
/batches/[batchId]/tests
  └── Test card shows: Available | Upcoming | Closed
        └── Click available test
              ├── Instructions screen → "Start Test" button
              ├── Full-screen test UI
              │   ├── Timer (top right)
              │   ├── Question panel (left)
              │   ├── Answer options (center)
              │   └── Question navigator (right: answered / skipped / not visited)
              └── Submit → Results screen (if immediate result enabled)
```

### 5. Admin Marks Attendance

```
/batches/[batchId]/attendance
  └── Today's date selected by default
        └── Student list with toggles (Present / Absent)
              └── Save → locked for the day
```

---

## Component Architecture

```
components/
│
├── ui/                                 # Base design system (shadcn/ui)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── badge.tsx
│   └── ...
│
├── layout/
│   ├── SuperAdminSidebar.tsx
│   ├── OrgSidebar.tsx
│   ├── StudentSidebar.tsx
│   ├── Header.tsx
│   └── MobileNav.tsx
│
├── org/
│   ├── BatchCard.tsx
│   ├── BatchList.tsx
│   ├── CreateBatchForm.tsx
│   └── OrgStatsCard.tsx
│
├── student/
│   ├── StudentCard.tsx
│   ├── EnrollmentBadge.tsx
│   └── AttendanceCalendar.tsx
│
├── content/
│   ├── NoteCard.tsx
│   ├── NoteUploadForm.tsx
│   ├── VideoCard.tsx
│   └── VideoPlayer.tsx
│
├── tests/
│   ├── TestCard.tsx                    # Shows status: available / upcoming / closed
│   ├── QuestionBuilder.tsx            # Admin: build test questions
│   ├── TestAttemptScreen.tsx          # Student: full-screen test UI
│   ├── QuestionNavigator.tsx          # Answered / skipped / not visited grid
│   └── TestResultCard.tsx
│
└── attendance/
    ├── AttendanceSheet.tsx            # Mark today's attendance
    └── AttendanceHistory.tsx          # Past records table
```

---

## Subdomain Routing (Middleware)

```
middleware.ts
│
├── host = yourdomain.com             → rewrite to /(marketing)
├── host = app.yourdomain.com         → rewrite to /(super-admin)
└── host = *.yourdomain.com
      ├── extract slug
      ├── fetch org by slug
      ├── not found → redirect to yourdomain.com/not-found
      └── found → set x-org-slug header → rewrite to /(org) or /(student)
                  (role determined after auth check)
```

---

## Tech Stack (Frontend)

| What         | Choice                                                       |
| ------------ | ------------------------------------------------------------ |
| Framework    | Next.js 15 (App Router)                                      |
| Language     | TypeScript                                                   |
| Styling      | Tailwind CSS v4                                              |
| Components   | shadcn/ui                                                    |
| Auth (UI)    | Clerk                                                        |
| Forms        | React Hook Form + Zod                                        |
| State        | Redux Toolkit (client state) + TanStack Query (server state) |
| Tables       | TanStack Table                                               |
| Charts       | Recharts                                                     |
| File Upload  | react-dropzone                                               |
| Video Player | Mux Player (React)                                           |
| Rich Text    | Tiptap (for test questions)                                  |
| Date/Time    | date-fns                                                     |
| Icons        | Lucide React                                                 |

---

## Build Order (Frontend)

### Phase 1 — Foundation

- [ ] Subdomain middleware setup
- [ ] Route group structure (`marketing`, `auth`, `super-admin`, `org`, `student`)
- [ ] Shared layout components (sidebars, header)
- [ ] Design system setup (shadcn/ui + Tailwind config)
- [ ] Auth screens (login, register)

### Phase 2 — Marketing + Registration

- [ ] Landing page (`yourdomain.com`)
- [ ] Coaching center registration form (multi-step)
- [ ] Registration success/pending screen

### Phase 3 — Super Admin

- [ ] Dashboard with platform stats (mock data first)
- [ ] Org list with filters (pending / active / suspended)
- [ ] Org detail + approve/reject UI

### Phase 4 — Org Admin Core

- [ ] Org dashboard
- [ ] Batch list + create batch form
- [ ] Student invite flow (generate link UI)
- [ ] Student list + join request approvals

### Phase 5 — Content

- [ ] Notes: upload form + list view per batch
- [ ] Videos: add form + list view per batch

### Phase 6 — Tests

- [ ] Test list per batch (status badges)
- [ ] Question builder (MCQ, integer, multi-select)
- [ ] Student test attempt screen (timer, navigator, full-screen)
- [ ] Test results + leaderboard

### Phase 7 — Attendance & Reports

- [ ] Attendance marking sheet
- [ ] Attendance history + calendar view
- [ ] Student report card (per student: scores + attendance)
- [ ] Batch reports (admin view)

### Phase 8 — Polish

- [ ] Mobile responsive layouts
- [ ] Loading skeletons
- [ ] Empty states
- [ ] Error boundaries
- [ ] Toast notifications

---

## Environment Variables

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_MUX_ENV_KEY=
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

```bash
npm run lint:check       # check lint errors
npm run lint:fix         # auto fix lint
npm run format:check     # check prettier
npm run format:fix       # auto fix formatting
npm run build            # production build
```
