do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'assignment_status'
  ) then
    create type public.assignment_status as enum ('ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'task_progress_status'
  ) then
    create type public.task_progress_status as enum ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');
  end if;
end $$;

create table if not exists public.track_assignments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  track_id uuid not null references public.onboarding_tracks(id) on delete restrict,
  employee_id uuid not null references public.profiles(id) on delete cascade,
  assigned_by uuid not null references public.profiles(id) on delete restrict,
  start_date date not null default current_date,
  due_date date not null,
  status public.assignment_status not null default 'ASSIGNED',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint track_assignments_due_after_start check (due_date >= start_date),
  constraint track_assignments_one_per_employee unique (workspace_id, employee_id)
);

create table if not exists public.task_progress (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.track_assignments(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  employee_id uuid not null references public.profiles(id) on delete cascade,
  status public.task_progress_status not null default 'NOT_STARTED',
  response_text text,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint task_progress_unique_assignment_task unique (assignment_id, task_id)
);

create index if not exists track_assignments_workspace_id_idx on public.track_assignments (workspace_id);
create index if not exists track_assignments_employee_id_idx on public.track_assignments (employee_id);
create index if not exists track_assignments_track_id_idx on public.track_assignments (track_id);
create index if not exists task_progress_assignment_id_idx on public.task_progress (assignment_id);
create index if not exists task_progress_employee_id_idx on public.task_progress (employee_id);

drop trigger if exists set_track_assignments_updated_at on public.track_assignments;
create trigger set_track_assignments_updated_at
before update on public.track_assignments
for each row
execute function public.set_updated_at();

drop trigger if exists set_task_progress_updated_at on public.task_progress;
create trigger set_task_progress_updated_at
before update on public.task_progress
for each row
execute function public.set_updated_at();

alter table public.track_assignments enable row level security;
alter table public.task_progress enable row level security;

drop policy if exists "Workspace admins can manage track assignments" on public.track_assignments;
create policy "Workspace admins can manage track assignments"
on public.track_assignments
for all
to authenticated
using (public.is_workspace_admin(track_assignments.workspace_id))
with check (
  public.is_workspace_admin(track_assignments.workspace_id)
  and exists (
    select 1
    from public.profiles
    where profiles.id = track_assignments.employee_id
      and profiles.workspace_id = track_assignments.workspace_id
      and profiles.role = 'EMPLOYEE'
  )
  and exists (
    select 1
    from public.onboarding_tracks
    where onboarding_tracks.id = track_assignments.track_id
      and onboarding_tracks.workspace_id = track_assignments.workspace_id
  )
);

drop policy if exists "Employees can view their own track assignment" on public.track_assignments;
create policy "Employees can view their own track assignment"
on public.track_assignments
for select
to authenticated
using (employee_id = (select auth.uid()));

drop policy if exists "Workspace admins can manage task progress" on public.task_progress;
create policy "Workspace admins can manage task progress"
on public.task_progress
for all
to authenticated
using (
  exists (
    select 1
    from public.track_assignments
    where track_assignments.id = task_progress.assignment_id
      and public.is_workspace_admin(track_assignments.workspace_id)
  )
)
with check (
  exists (
    select 1
    from public.track_assignments
    where track_assignments.id = task_progress.assignment_id
      and track_assignments.employee_id = task_progress.employee_id
      and public.is_workspace_admin(track_assignments.workspace_id)
  )
);

drop policy if exists "Employees can view their own task progress" on public.task_progress;
create policy "Employees can view their own task progress"
on public.task_progress
for select
to authenticated
using (employee_id = (select auth.uid()));
