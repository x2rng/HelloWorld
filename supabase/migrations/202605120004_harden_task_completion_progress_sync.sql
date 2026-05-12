create or replace function public.ensure_assignment_task_progress(
  target_assignment_id uuid
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  assignment_record public.track_assignments%rowtype;
  inserted_progress_rows integer := 0;
begin
  if (select auth.uid()) is null then
    raise exception 'You must be signed in to initialize task progress.';
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

  insert into public.task_progress (
    assignment_id,
    task_id,
    employee_id,
    status
  )
  select
    assignment_record.id,
    tasks.id,
    assignment_record.employee_id,
    'NOT_STARTED'::public.task_progress_status
  from public.tasks
  join public.milestones on milestones.id = tasks.milestone_id
  where milestones.track_id = assignment_record.track_id
  on conflict (assignment_id, task_id) do nothing;

  get diagnostics inserted_progress_rows = row_count;

  return inserted_progress_rows;
end;
$$;

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

grant execute on function public.ensure_assignment_task_progress(uuid) to authenticated;
grant execute on function public.complete_assignment_task(uuid, uuid) to authenticated;
