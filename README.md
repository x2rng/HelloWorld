# Questline

Questline is a minimal black, white, and gray self-improvement tracker with game mechanics layered on top. Users sign up, define their goals during onboarding, and then track progress through streaks, XP, levels, quick check-ins, and achievement badges.

## Stack

- Static frontend: `index.html`, `styles.css`, `app.js`
- Supabase Auth + Postgres for users, goals, progress, and achievements
- Vercel serverless endpoint: `api/env.js`
- ESM package config in `package.json` for Vercel's Node.js function loader

## Features

- Email/password sign up and login with Supabase Auth
- Goal creation during sign up through auth metadata and first-session onboarding
- Gamified dashboard with XP, levels, streaks, quests, and badges
- One-tap daily check-ins for each goal
- Achievement unlocks for consistency and progress milestones
- Mobile-friendly monochrome UI with a clean Apple-inspired visual language

## Supabase setup

1. Create a Supabase project.
2. In the SQL editor, run [`supabase/schema.sql`](./supabase/schema.sql).
3. In Authentication, enable Email/Password.
4. Decide whether you want email confirmation on or off.
   If confirmation is on, sign-up stores the goals in user metadata and the first login finishes onboarding.
5. Copy your project URL and anon key.

## Vercel setup

Add these environment variables in Vercel:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

The frontend fetches those values through `/api/env`, so you do not have to hardcode public keys in the client source.

## Local preview

This project is intentionally zero-build. Any static server works.

Examples:

```bash
python -m http.server 3000
```

or

```bash
npx serve .
```

## Notes

- `goal_progress` prevents duplicate daily check-ins for the same goal with a unique constraint on `(goal_id, progress_date)`.
- Achievements are unlocked from the client after each check-in, which keeps the initial setup simple for an empty repo.
- If you want richer server-side validation later, the next step would be adding Supabase Edge Functions or SQL triggers.
