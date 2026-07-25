alter table public.workspaces
add column if not exists industry text,
add column if not exists company_size text,
add column if not exists setup_completed boolean,
add column if not exists setup_profile jsonb;

alter table public.workspaces
alter column setup_completed set default false,
alter column setup_profile set default '{}'::jsonb;

update public.workspaces set setup_completed = false where setup_completed is null;
update public.workspaces set setup_profile = '{}'::jsonb where setup_profile is null;

alter table public.workspaces
alter column setup_completed set not null,
alter column setup_profile set not null;

alter table public.workspaces
drop constraint if exists workspaces_setup_profile_object_check;
alter table public.workspaces
add constraint workspaces_setup_profile_object_check
check (jsonb_typeof(setup_profile) = 'object');

create table if not exists public.workspace_departments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default timezone('utc', now())
);

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
