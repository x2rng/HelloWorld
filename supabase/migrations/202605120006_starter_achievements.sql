create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text not null,
  sort_order integer not null default 1,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.employee_achievements (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  employee_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  unlocked_at timestamptz not null default timezone('utc', now()),
  constraint employee_achievements_one_per_employee unique (
    workspace_id,
    employee_id,
    achievement_id
  )
);

create index if not exists employee_achievements_workspace_employee_idx
on public.employee_achievements (workspace_id, employee_id);

alter table public.achievements enable row level security;
alter table public.employee_achievements enable row level security;

insert into public.achievements (code, title, description, sort_order)
values
  ('first_step', 'First Step', 'Complete your first onboarding task.', 1),
  ('getting_started', 'Getting Started', 'Complete 3 onboarding tasks.', 2),
  ('first_milestone_complete', 'First Milestone Complete', 'Complete every task in one milestone.', 3),
  ('halfway_there', 'Halfway There', 'Reach at least 50% journey completion.', 4),
  ('journey_complete', 'Journey Complete', 'Complete every task in your assigned track.', 5),
  ('level_2_reached', 'Level 2 Reached', 'Reach Level 2 through onboarding progress.', 6)
on conflict (code) do update
set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

drop policy if exists "Authenticated users can view achievements" on public.achievements;
create policy "Authenticated users can view achievements"
on public.achievements
for select
to authenticated
using (true);

drop policy if exists "Employees can view their own achievements" on public.employee_achievements;
create policy "Employees can view their own achievements"
on public.employee_achievements
for select
to authenticated
using (employee_id = (select auth.uid()));

drop policy if exists "Workspace admins can view workspace employee achievements" on public.employee_achievements;
create policy "Workspace admins can view workspace employee achievements"
on public.employee_achievements
for select
to authenticated
using (public.is_workspace_admin(employee_achievements.workspace_id));

drop function if exists public.complete_assignment_task(uuid, uuid);
create function public.complete_assignment_task(target_assignment_id uuid, target_task_id uuid)
returns text[]
language plpgsql
security definer
set search_path = public
as $$
declare
  assignment_record public.track_assignments%rowtype;
  total_tasks integer;
  completed_tasks integer;
  current_level integer := 1;
  has_complete_milestone boolean := false;
  awarded_xp integer := 10;
  inserted_xp_events integer := 0;
  unlocked_achievement_names text[] := '{}';
  unlocked_title text;
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

  perform public.ensure_assignment_task_progress(target_assignment_id);

  update public.task_progress
  set
    status = 'COMPLETED'::public.task_progress_status,
    completed_at = coalesce(completed_at, timezone('utc', now()))
  where assignment_id = target_assignment_id
    and task_id = target_task_id
    and employee_id = (select auth.uid())
    and status <> 'COMPLETED'::public.task_progress_status;

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
    'TASK_COMPLETED'::public.xp_event_type,
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
          and xp_events.event_type = 'TASK_COMPLETED'::public.xp_event_type
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
    and status = 'COMPLETED'::public.task_progress_status;

  select coalesce(employee_stats.current_level, 1)
  into current_level
  from public.employee_stats
  where workspace_id = assignment_record.workspace_id
    and employee_id = assignment_record.employee_id
  limit 1;

  select exists (
    select 1
    from public.milestones
    where milestones.track_id = assignment_record.track_id
      and exists (
        select 1
        from public.tasks
        where tasks.milestone_id = milestones.id
      )
      and not exists (
        select 1
        from public.tasks
        left join public.task_progress on task_progress.task_id = tasks.id
          and task_progress.assignment_id = target_assignment_id
          and task_progress.employee_id = assignment_record.employee_id
          and task_progress.status = 'COMPLETED'::public.task_progress_status
        where tasks.milestone_id = milestones.id
          and task_progress.id is null
      )
  )
  into has_complete_milestone;

  update public.track_assignments
  set status = case
    when total_tasks = 0 then 'ASSIGNED'::public.assignment_status
    when completed_tasks = 0 then 'ASSIGNED'::public.assignment_status
    when completed_tasks = total_tasks then 'COMPLETED'::public.assignment_status
    else 'IN_PROGRESS'::public.assignment_status
  end
  where id = target_assignment_id
    and employee_id = (select auth.uid());

  for unlocked_title in
    with achievement_candidates(code, should_unlock) as (
      values
        ('first_step', completed_tasks >= 1),
        ('getting_started', completed_tasks >= 3),
        ('first_milestone_complete', has_complete_milestone),
        ('halfway_there', total_tasks > 0 and completed_tasks * 2 >= total_tasks),
        ('journey_complete', total_tasks > 0 and completed_tasks = total_tasks),
        ('level_2_reached', current_level >= 2)
    ),
    inserted_achievements as (
      insert into public.employee_achievements (
        workspace_id,
        employee_id,
        achievement_id
      )
      select
        assignment_record.workspace_id,
        assignment_record.employee_id,
        achievements.id
      from achievement_candidates
      join public.achievements on achievements.code = achievement_candidates.code
      where achievement_candidates.should_unlock
      on conflict (workspace_id, employee_id, achievement_id) do nothing
      returning achievement_id
    )
    select achievements.title
    from inserted_achievements
    join public.achievements on achievements.id = inserted_achievements.achievement_id
    order by achievements.sort_order
  loop
    unlocked_achievement_names := array_append(unlocked_achievement_names, unlocked_title);
  end loop;

  return unlocked_achievement_names;
end;
$$;

grant execute on function public.complete_assignment_task(uuid, uuid) to authenticated;
