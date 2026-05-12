do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'xp_event_type'
  ) then
    create type public.xp_event_type as enum ('TASK_COMPLETED');
  end if;
end $$;

create table if not exists public.xp_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  employee_id uuid not null references public.profiles(id) on delete cascade,
  assignment_id uuid not null references public.track_assignments(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  event_type public.xp_event_type not null,
  xp_amount integer not null check (xp_amount > 0),
  created_at timestamptz not null default timezone('utc', now()),
  constraint xp_events_unique_task_event unique (employee_id, assignment_id, task_id, event_type)
);

create table if not exists public.employee_stats (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  employee_id uuid not null references public.profiles(id) on delete cascade,
  total_xp integer not null default 0 check (total_xp >= 0),
  current_level integer not null default 1 check (current_level >= 1),
  completed_tasks_count integer not null default 0 check (completed_tasks_count >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint employee_stats_one_per_employee_workspace unique (workspace_id, employee_id)
);

create index if not exists xp_events_workspace_employee_idx on public.xp_events (workspace_id, employee_id);
create index if not exists xp_events_assignment_id_idx on public.xp_events (assignment_id);
create index if not exists employee_stats_workspace_id_idx on public.employee_stats (workspace_id);
create index if not exists employee_stats_employee_id_idx on public.employee_stats (employee_id);

drop trigger if exists set_employee_stats_updated_at on public.employee_stats;
create trigger set_employee_stats_updated_at
before update on public.employee_stats
for each row
execute function public.set_updated_at();

alter table public.xp_events enable row level security;
alter table public.employee_stats enable row level security;

create or replace function public.exp_level_for_xp(total_xp integer)
returns integer
language sql
immutable
as $$
  select case
    when total_xp >= 800 then 5
    when total_xp >= 500 then 4
    when total_xp >= 250 then 3
    when total_xp >= 100 then 2
    else 1
  end;
$$;

drop policy if exists "Employees can view their own xp events" on public.xp_events;
create policy "Employees can view their own xp events"
on public.xp_events
for select
to authenticated
using (employee_id = (select auth.uid()));

drop policy if exists "Workspace admins can view workspace xp events" on public.xp_events;
create policy "Workspace admins can view workspace xp events"
on public.xp_events
for select
to authenticated
using (public.is_workspace_admin(xp_events.workspace_id));

drop policy if exists "Employees can view their own stats" on public.employee_stats;
create policy "Employees can view their own stats"
on public.employee_stats
for select
to authenticated
using (employee_id = (select auth.uid()));

drop policy if exists "Workspace admins can view workspace employee stats" on public.employee_stats;
create policy "Workspace admins can view workspace employee stats"
on public.employee_stats
for select
to authenticated
using (public.is_workspace_admin(employee_stats.workspace_id));

create or replace function public.complete_assignment_task(target_assignment_id uuid, target_task_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  assignment_record public.track_assignments%rowtype;
  total_tasks integer;
  completed_tasks integer;
  awarded_xp integer := 10;
  inserted_xp_events integer := 0;
begin
  if (select auth.uid()) is null then
    raise exception 'You must be signed in to complete a task.';
  end if;

  select *
  into assignment_record
  from public.track_assignments
  where id = target_assignment_id
    and employee_id = (select auth.uid())
  limit 1;

  if assignment_record.id is null then
    raise exception 'Assignment was not found for this employee.';
  end if;

  if not exists (
    select 1
    from public.tasks
    join public.milestones on milestones.id = tasks.milestone_id
    where tasks.id = target_task_id
      and milestones.track_id = assignment_record.track_id
  ) then
    raise exception 'Task does not belong to this assigned track.';
  end if;

  if not exists (
    select 1
    from public.task_progress
    where assignment_id = target_assignment_id
      and task_id = target_task_id
      and employee_id = (select auth.uid())
  ) then
    raise exception 'Task progress row was not found for this assignment.';
  end if;

  update public.task_progress
  set
    status = 'COMPLETED',
    completed_at = coalesce(completed_at, timezone('utc', now()))
  where assignment_id = target_assignment_id
    and task_id = target_task_id
    and employee_id = (select auth.uid())
    and status <> 'COMPLETED';

  insert into public.xp_events (
    workspace_id,
    employee_id,
    assignment_id,
    task_id,
    event_type,
    xp_amount
  )
  values (
    assignment_record.workspace_id,
    assignment_record.employee_id,
    target_assignment_id,
    target_task_id,
    'TASK_COMPLETED',
    awarded_xp
  )
  on conflict (employee_id, assignment_id, task_id, event_type) do nothing;

  get diagnostics inserted_xp_events = row_count;

  if inserted_xp_events > 0 then
    insert into public.employee_stats (
      workspace_id,
      employee_id,
      total_xp,
      current_level,
      completed_tasks_count
    )
    values (
      assignment_record.workspace_id,
      assignment_record.employee_id,
      0,
      1,
      0
    )
    on conflict (workspace_id, employee_id) do nothing;

    update public.employee_stats
    set
      total_xp = coalesce((
        select sum(xp_amount)
        from public.xp_events
        where xp_events.workspace_id = assignment_record.workspace_id
          and xp_events.employee_id = assignment_record.employee_id
      ), 0),
      completed_tasks_count = (
        select count(*)
        from public.xp_events
        where xp_events.workspace_id = assignment_record.workspace_id
          and xp_events.employee_id = assignment_record.employee_id
          and xp_events.event_type = 'TASK_COMPLETED'
      ),
      current_level = public.exp_level_for_xp(coalesce((
        select sum(xp_amount)
        from public.xp_events
        where xp_events.workspace_id = assignment_record.workspace_id
          and xp_events.employee_id = assignment_record.employee_id
      ), 0))
    where workspace_id = assignment_record.workspace_id
      and employee_id = assignment_record.employee_id;
  end if;

  select count(*)
  into total_tasks
  from public.task_progress
  where assignment_id = target_assignment_id
    and employee_id = (select auth.uid());

  select count(*)
  into completed_tasks
  from public.task_progress
  where assignment_id = target_assignment_id
    and employee_id = (select auth.uid())
    and status = 'COMPLETED';

  update public.track_assignments
  set status = case
    when total_tasks = 0 then 'ASSIGNED'::public.assignment_status
    when completed_tasks = 0 then 'ASSIGNED'::public.assignment_status
    when completed_tasks = total_tasks then 'COMPLETED'::public.assignment_status
    else 'IN_PROGRESS'::public.assignment_status
  end
  where id = target_assignment_id
    and employee_id = (select auth.uid());
end;
$$;

grant execute on function public.exp_level_for_xp(integer) to anon, authenticated;
grant execute on function public.complete_assignment_task(uuid, uuid) to authenticated;
