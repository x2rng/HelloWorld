-- Consolidated schema safety net for the EXP skills, content attribution,
-- and workspace setup features. Safe to run after manual column creation.

-- role_focus is the canonical application field. occupation is retained as
-- a nullable compatibility column for early local schemas.
alter table public.profiles
add column if not exists occupation text,
add column if not exists role_focus text,
add column if not exists assigned_skills jsonb;

alter table public.invites
add column if not exists occupation text,
add column if not exists role_focus text,
add column if not exists assigned_skills jsonb;

alter table public.invites
alter column role_focus set default 'GENERAL_EMPLOYEE',
alter column assigned_skills set default '[]'::jsonb;

update public.invites
set role_focus = 'GENERAL_EMPLOYEE'
where role_focus is null;

update public.invites
set assigned_skills = '[]'::jsonb
where assigned_skills is null;

alter table public.invites
alter column role_focus set not null,
alter column assigned_skills set not null;

alter table public.onboarding_tracks
add column if not exists skill_focus jsonb;

alter table public.milestones
add column if not exists skill_focus jsonb;

alter table public.tasks
add column if not exists skill_contributions jsonb;

alter table public.onboarding_tracks
alter column skill_focus set default '[]'::jsonb;

alter table public.milestones
alter column skill_focus set default '[]'::jsonb;

alter table public.tasks
alter column skill_contributions set default '[]'::jsonb;

update public.onboarding_tracks
set skill_focus = '[]'::jsonb
where skill_focus is null;

update public.milestones
set skill_focus = '[]'::jsonb
where skill_focus is null;

update public.tasks
set skill_contributions = '[]'::jsonb
where skill_contributions is null;

alter table public.onboarding_tracks
alter column skill_focus set not null;

alter table public.milestones
alter column skill_focus set not null;

alter table public.tasks
alter column skill_contributions set not null;

alter table public.workspaces
add column if not exists industry text,
add column if not exists company_size text,
add column if not exists setup_completed boolean,
add column if not exists setup_profile jsonb;

alter table public.workspaces
alter column setup_completed set default false,
alter column setup_profile set default '{}'::jsonb;

update public.workspaces
set setup_completed = false
where setup_completed is null;

update public.workspaces
set setup_profile = '{}'::jsonb
where setup_profile is null;

alter table public.workspaces
alter column setup_completed set not null,
alter column setup_profile set not null;

create table if not exists public.workspace_departments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists workspace_departments_workspace_id_idx
on public.workspace_departments (workspace_id);

create unique index if not exists workspace_departments_workspace_name_idx
on public.workspace_departments (workspace_id, lower(name));

alter table public.workspace_departments enable row level security;

drop policy if exists "Workspace members can view departments" on public.workspace_departments;
create policy "Workspace members can view departments"
on public.workspace_departments
for select
to authenticated
using (public.is_workspace_member(workspace_departments.workspace_id));

drop policy if exists "Workspace admins can manage departments" on public.workspace_departments;
create policy "Workspace admins can manage departments"
on public.workspace_departments
for all
to authenticated
using (public.is_workspace_admin(workspace_departments.workspace_id))
with check (public.is_workspace_admin(workspace_departments.workspace_id));
