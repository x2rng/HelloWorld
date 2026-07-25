create table if not exists public.growth_activities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  employee_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null check (category in (
    'ROLE_SKILL_PRACTICE', 'LEARNING', 'COLLABORATION', 'COMMUNICATION',
    'FOCUS', 'ENERGY', 'WELLBEING', 'DISCIPLINE', 'COMPANY_CONTRIBUTION'
  )),
  skill_name text not null,
  proof_type text not null check (proof_type in (
    'TEXT_NOTE', 'IMAGE_LINK_REFERENCE', 'EXTERNAL_APP_SCREENSHOT',
    'COMPLETED_EXP_STEP', 'OTHER'
  )),
  proof_url text,
  visibility text not null check (visibility in ('PRIVATE', 'DEPARTMENT', 'COMPANY')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  suggested_xp integer not null default 0 check (suggested_xp >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists growth_activities_workspace_id_idx
on public.growth_activities (workspace_id);

create index if not exists growth_activities_employee_created_at_idx
on public.growth_activities (employee_id, created_at desc);

alter table public.growth_activities enable row level security;

drop policy if exists "Employees can view their own growth activities" on public.growth_activities;
create policy "Employees can view their own growth activities"
on public.growth_activities
for select
to authenticated
using (employee_id = (select auth.uid()));

drop policy if exists "Employees can submit their own pending growth activities" on public.growth_activities;
create policy "Employees can submit their own pending growth activities"
on public.growth_activities
for insert
to authenticated
with check (
  employee_id = (select auth.uid())
  and public.is_workspace_member(growth_activities.workspace_id)
  and exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.workspace_id = growth_activities.workspace_id
      and profiles.role = 'EMPLOYEE'
  )
  and status = 'pending'
  and suggested_xp = 0
);

drop policy if exists "Workspace admins can view growth activities" on public.growth_activities;
create policy "Workspace admins can view growth activities"
on public.growth_activities
for select
to authenticated
using (public.is_workspace_admin(growth_activities.workspace_id));
