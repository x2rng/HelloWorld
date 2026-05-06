create table if not exists public.onboarding_tracks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  description text,
  duration_days integer not null default 30 check (duration_days > 0 and duration_days <= 365),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.onboarding_tracks(id) on delete cascade,
  title text not null,
  description text,
  position integer not null default 1 check (position > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  milestone_id uuid not null references public.milestones(id) on delete cascade,
  title text not null,
  description text,
  position integer not null default 1 check (position > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists onboarding_tracks_workspace_id_idx on public.onboarding_tracks (workspace_id);
create index if not exists milestones_track_id_position_idx on public.milestones (track_id, position);
create index if not exists tasks_milestone_id_position_idx on public.tasks (milestone_id, position);

drop trigger if exists set_onboarding_tracks_updated_at on public.onboarding_tracks;
create trigger set_onboarding_tracks_updated_at
before update on public.onboarding_tracks
for each row
execute function public.set_updated_at();

drop trigger if exists set_milestones_updated_at on public.milestones;
create trigger set_milestones_updated_at
before update on public.milestones
for each row
execute function public.set_updated_at();

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
before update on public.tasks
for each row
execute function public.set_updated_at();

alter table public.onboarding_tracks enable row level security;
alter table public.milestones enable row level security;
alter table public.tasks enable row level security;

drop policy if exists "Workspace admins can manage onboarding tracks" on public.onboarding_tracks;
create policy "Workspace admins can manage onboarding tracks"
on public.onboarding_tracks
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.workspace_id = onboarding_tracks.workspace_id
      and profiles.id = (select auth.uid())
      and profiles.role = 'ADMIN'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.workspace_id = onboarding_tracks.workspace_id
      and profiles.id = (select auth.uid())
      and profiles.role = 'ADMIN'
  )
);

drop policy if exists "Workspace admins can manage milestones" on public.milestones;
create policy "Workspace admins can manage milestones"
on public.milestones
for all
to authenticated
using (
  exists (
    select 1
    from public.onboarding_tracks
    join public.profiles on profiles.workspace_id = onboarding_tracks.workspace_id
    where onboarding_tracks.id = milestones.track_id
      and profiles.id = (select auth.uid())
      and profiles.role = 'ADMIN'
  )
)
with check (
  exists (
    select 1
    from public.onboarding_tracks
    join public.profiles on profiles.workspace_id = onboarding_tracks.workspace_id
    where onboarding_tracks.id = milestones.track_id
      and profiles.id = (select auth.uid())
      and profiles.role = 'ADMIN'
  )
);

drop policy if exists "Workspace admins can manage tasks" on public.tasks;
create policy "Workspace admins can manage tasks"
on public.tasks
for all
to authenticated
using (
  exists (
    select 1
    from public.milestones
    join public.onboarding_tracks on onboarding_tracks.id = milestones.track_id
    join public.profiles on profiles.workspace_id = onboarding_tracks.workspace_id
    where milestones.id = tasks.milestone_id
      and profiles.id = (select auth.uid())
      and profiles.role = 'ADMIN'
  )
)
with check (
  exists (
    select 1
    from public.milestones
    join public.onboarding_tracks on onboarding_tracks.id = milestones.track_id
    join public.profiles on profiles.workspace_id = onboarding_tracks.workspace_id
    where milestones.id = tasks.milestone_id
      and profiles.id = (select auth.uid())
      and profiles.role = 'ADMIN'
  )
);
