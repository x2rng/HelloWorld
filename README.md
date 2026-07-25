# EXP

EXP is a Next.js foundation for a B2B gamified onboarding platform with real Supabase authentication, workspace-linked profiles, and role-aware routing for admins and employees.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Local storage for fake auth and prototype persistence
- React client components for the prototype flows

## Current foundation flow

1. Admin creates a workspace account
2. Supabase auth session is established
3. Profile bootstrap creates the workspace and admin profile
4. Root route redirects by role
5. Admin lands on `/admin`
6. Employee accounts can land on `/employee` once provisioned

## Routes

- `/`
- `/login`
- `/register`
- `/auth/bootstrap`
- `/auth/callback`
- `/admin`
- `/employee`

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

- `src/lib/supabase/client.ts`
  Browser Supabase client.
- `src/lib/supabase/server.ts`
  Server Supabase client using Next.js cookies.
- `src/lib/supabase/proxy.ts` and `proxy.ts`
  Auth session refresh pipeline for SSR.
- `src/lib/exp-auth.ts`
  Profile bootstrap and role-aware redirects.
- `src/app/admin` and `src/app/employee`
  Minimal role-protected placeholders.
- `supabase/migrations/202604290001_exp_foundation.sql`
  Initial database foundation for workspaces, profiles, and invites.

## Password recovery redirects

Password recovery uses `/auth/callback?next=/reset-password` so the server can
exchange Supabase's PKCE code before the user chooses a new password.

In Supabase Dashboard, open **Authentication → URL Configuration** and set:

- **Site URL** to the production app URL.
- **Redirect URLs** to include
  `https://<production-domain>/auth/callback?next=/reset-password` and
  `http://localhost:3000/auth/callback?next=/reset-password`.
- If Vercel preview deployments need password recovery, add an appropriate
  Vercel preview wildcard redirect URL as well.

Keep `NEXT_PUBLIC_APP_URL` set to the canonical production app URL in Vercel.

## How to extend this later

- Add onboarding tracks, milestones, tasks, assignments, and XP events on top of the workspace/profile foundation.
- Build admin invite management on top of the `invites` table.
- Replace deprecated consumer prototype routes/components once the new employee journey is implemented.
