# rubiks-cube-solver-web

The web frontend for the Rubik's Cube Solver project. Users upload a photo of each face of their cube, the app submits a solving job, polls for completion, and presents a step-by-step solution in standard WCA notation.

---

## Tech stack

| Layer        | Choice                  | Why                                                              |
|--------------|-------------------------|------------------------------------------------------------------|
| Build tool   | Vite 6                  | Fast dev server, simple config, native ES modules               |
| Framework    | React 19 + TypeScript   | Component model without Next.js server/client complexity        |
| Routing      | React Router v7         | Client-side SPA routing with nested layout support              |
| Server state | TanStack React Query v5 | Handles fetching, caching, loading states, and job polling      |
| Global state | Zustand v5              | Auth state (user, token) accessible anywhere without prop drilling |
| Styling      | Tailwind CSS v4         | CSS-first config, always-dark design system                     |
| UI utilities | CVA, clsx, tailwind-merge | Composable variant system for components                      |
| Icons        | lucide-react            | Consistent, tree-shakeable icon set                             |

---

## Project structure

```
src/
  main.tsx              Entry point — mounts React app
  App.tsx               Router setup, QueryClient provider, session init
  vite-env.d.ts         Vite type declarations (import.meta.env)
  index.css             Design system — Tailwind @theme tokens, animations

  store/
    authStore.ts        Zustand store — user session, tokens, auth actions

  lib/
    authApi.ts          Raw fetch calls to the auth service
    jobApi.ts           Raw fetch calls to the backend API (mock data while backend is built)
    utils.ts            cn() helper (clsx + tailwind-merge)

  layouts/
    DashboardLayout.tsx Authenticated shell — sidebar + header + <Outlet />

  pages/
    LandingPage.tsx     Public homepage with 3D cube animation
    auth/
      LoginPage.tsx     Email + password sign in
      SignupPage.tsx    Account creation
      VerifyPage.tsx    Cognito email verification code
    dashboard/
      DashboardPage.tsx Overview with stats and quick-action
      JobsPage.tsx      Full job history list
      JobDetailPage.tsx Job status + solution display (polls until terminal)
      SubmitPage.tsx    6-face photo upload form
      AccountPage.tsx   User profile and sign out

  components/
    cube/
      RubiksCubeAnimation.tsx   Pure CSS 3D rotating cube (landing page hero)
    jobs/
      JobCard.tsx               Summary card linking to job detail
      JobStatusBadge.tsx        Coloured status pill (pending/processing/solved/failed)
    layout/
      AuthGuard.tsx             Redirects unauthenticated users to /auth/login
      Sidebar.tsx               Left nav with active route highlighting
      UserMenu.tsx              User name + logout button in the header
    ui/
      button.tsx                Button with variants (default/outline/ghost/danger)
      badge.tsx                 Badge with status variants
      card.tsx                  Card, CardHeader, CardTitle, CardContent, CardFooter
      input.tsx                 Styled text input
      label.tsx                 Form label

  types/
    index.ts            Shared types — User, Job, JobStatus, RubiksCubeResult
```

---

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in service URLs
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Environment variables

Create a `.env.local` file (never commit this):

```
VITE_AUTH_SERVICE_URL=http://localhost:3001
VITE_API_URL=http://localhost:3002
```

| Variable               | Points to                                  |
|------------------------|--------------------------------------------|
| `VITE_AUTH_SERVICE_URL` | rubiks-auth-service (login, signup, tokens) |
| `VITE_API_URL`          | rubiks-backend-service (jobs, S3 URLs)      |

> Variables must be prefixed with `VITE_` to be accessible in the browser via `import.meta.env`.

---

## Routes

| Path                    | Page             | Auth required |
|-------------------------|------------------|---------------|
| `/`                     | Landing page     | No            |
| `/auth/login`           | Sign in          | No            |
| `/auth/signup`          | Create account   | No            |
| `/auth/verify`          | Verify email     | No            |
| `/dashboard`            | Overview         | Yes           |
| `/jobs`                 | Job history      | Yes           |
| `/jobs/:jobId`          | Job detail       | Yes           |
| `/submit/rubiks-cube`   | Upload photos    | Yes           |
| `/account`              | Profile settings | Yes           |

Authenticated routes are wrapped in `DashboardLayout`, which renders `AuthGuard`. If no session is found, the guard redirects to `/auth/login`.

---

## State management

### Auth — Zustand (`src/store/authStore.ts`)

Zustand holds the auth session. Components subscribe only to what they need:

```tsx
const user = useAuthStore((state) => state.user);
const login = useAuthStore((state) => state.login);
```

The access token is stored in-memory only (never in localStorage) for security. On page load, `restoreSession()` uses the stored refresh token to silently re-authenticate.

`fetchWithAuth(url, options)` is an action on the store that automatically attaches the Bearer token to every request and retries once with a refreshed token if a 401 is received.

### Server data — React Query (`@tanstack/react-query`)

All API calls go through React Query hooks, giving us automatic loading states, error states, caching, and background refetching for free:

```tsx
// Fetch job list
const { data: jobs, isLoading } = useQuery({
  queryKey: ['jobs'],
  queryFn: jobApi.getJobs,
});

// Poll job status until it reaches a terminal state
const { data: job } = useQuery({
  queryKey: ['jobs', jobId],
  queryFn: () => jobApi.getJob(jobId),
  refetchInterval: (query) =>
    TERMINAL_STATUSES.has(query.state.data?.status) ? false : 5000,
});

// Submit a new job
const { mutate, isPending } = useMutation({
  mutationFn: jobApi.createJob,
  onSuccess: (jobId) => navigate(`/jobs/${jobId}`),
});
```

---

## API integration status

The backend services are in active development. `src/lib/jobApi.ts` has the correct function signatures wired up. Each function currently returns mock data with a TODO comment showing the real fetch call to uncomment when the backend is ready.

`createJob` and `uploadFaceImage` are fully implemented — they call the real API. The read operations (`getJobs`, `getJob`) still use mock data.

**To wire up a real endpoint**, find the TODO in `jobApi.ts` and swap the mock return for the commented fetch call. No changes needed in the components or hooks.

---

## Design system

Forced dark mode — no light mode. Key tokens from `src/index.css`:

| Token                  | Value      | Use                                          |
|------------------------|------------|----------------------------------------------|
| `--color-background`   | `#0d0d0d`  | Page background                              |
| `--color-surface`      | `#141414`  | Cards, sidebars                              |
| `--color-surface-2`    | `#1c1c1c`  | Nested surfaces, hover states                |
| `--color-primary`      | `#f97316`  | Orange accent (Rubik's cube orange face)     |
| `--color-success`      | `#22c55e`  | Solved jobs                                  |
| `--color-danger`       | `#ef4444`  | Failed jobs, destructive actions             |
| `--color-info`         | `#3b82f6`  | Processing jobs                              |

---

## Scripts

```bash
npm run dev      # Start dev server at localhost:5173
npm run build    # Type-check + production build → dist/
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```
