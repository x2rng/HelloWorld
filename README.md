# LevelUp

LevelUp is a polished Next.js prototype for a gamified self-development platform where users build a better version of themselves and see that progress reflected in a customizable pixel avatar.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Local storage for fake auth and prototype persistence
- React client components for the prototype flows

## Prototype flow

1. Register
2. Complete onboarding
3. Create an avatar
4. Land on the dashboard
5. Complete actions to earn XP and unlock achievements
6. View profile and achievements

## Routes

- `/`
- `/login`
- `/register`
- `/onboarding`
- `/avatar`
- `/dashboard`
- `/profile`
- `/achievements`

## Local development

Use `pnpm`:

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

Validation commands:

```bash
pnpm lint
pnpm build
```

## Architecture

- `src/providers/app-provider.tsx`
  Central app state, fake auth flow, local persistence, and mutation handlers.
- `src/lib/progression.ts`
  XP curve, category scoring, achievements, avatar unlock logic, and derived dashboard/profile view models.
- `src/lib/catalog.ts`
  Onboarding and avatar option catalogs.
- `src/lib/types.ts`
  Shared product and progression types.
- `src/components/avatar`
  Pixel avatar renderer and avatar customizer.
- `src/components/onboarding`
  Multi-step onboarding flow.
- `src/components/dashboard`
  Main dashboard presentation.
- `src/components/profile`
  Profile summary and progression history view.
- `src/components/auth/route-gate.tsx`
  Lightweight protected-route behavior for guest, onboarding, avatar, and app stages.

## Persistence model

- Auth is simulated locally.
- User records are stored in `localStorage`.
- The current app state is derived from three stages:
  - no onboarding yet
  - onboarding complete, avatar not created
  - full app access
- XP, streaks, achievements, completed actions, and milestone history all persist locally.

## What is included in V1

- Registration and login UI
- Multi-step onboarding
- Pixel avatar creation
- Dashboard with XP, level, streak, actions, and category cards
- Profile summary view
- Achievements view
- Mock future hooks for verification and social features

## What is intentionally mocked

- Authentication
- User database
- Social systems
- Certificate or proof verification
- Notifications and backend jobs

## How to extend this later

- Replace local storage auth with Supabase/Auth.js/Clerk without changing route structure.
- Move progression and achievements logic from `src/lib/progression.ts` into server actions or API routes.
- Persist users, actions, and uploads in a real database.
- Add skill verification and social circles on top of the existing dashboard and achievements model.
