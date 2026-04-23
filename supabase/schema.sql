create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  xp integer not null default 0,
  level integer not null default 1,
  streak integer not null default 0,
  longest_streak integer not null default 0,
  last_check_in date,
  created_at timestamptz not null default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null default 'General',
  xp_reward integer not null default 20,
  created_at timestamptz not null default now()
);

create table if not exists public.goal_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid not null references public.goals(id) on delete cascade,
  progress_date date not null default current_date,
  notes text,
  xp_earned integer not null default 0,
  created_at timestamptz not null default now(),
  unique (goal_id, progress_date)
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null,
  title text not null,
  description text not null,
  icon text not null default '++',
  unlocked_at timestamptz not null default now(),
  unique (user_id, key)
);

alter table public.profiles enable row level security;
alter table public.goals enable row level security;
alter table public.goal_progress enable row level security;
alter table public.achievements enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "goals_select_own"
on public.goals
for select
using (auth.uid() = user_id);

create policy "goals_insert_own"
on public.goals
for insert
with check (auth.uid() = user_id);

create policy "goals_update_own"
on public.goals
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "goals_delete_own"
on public.goals
for delete
using (auth.uid() = user_id);

create policy "progress_select_own"
on public.goal_progress
for select
using (auth.uid() = user_id);

create policy "progress_insert_own"
on public.goal_progress
for insert
with check (auth.uid() = user_id);

create policy "progress_update_own"
on public.goal_progress
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "achievements_select_own"
on public.achievements
for select
using (auth.uid() = user_id);

create policy "achievements_insert_own"
on public.achievements
for insert
with check (auth.uid() = user_id);
