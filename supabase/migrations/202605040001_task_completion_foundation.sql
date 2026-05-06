drop policy if exists "Employees can view assigned onboarding track" on public.onboarding_tracks;
create policy "Employees can view assigned onboarding track"
on public.onboarding_tracks
for select
to authenticated
using (
  exists (
    select 1
    from public.track_assignments
    where track_assignments.track_id = onboarding_tracks.id
      and track_assignments.employee_id = (select auth.uid())
  )
);

drop policy if exists "Employees can view assigned milestones" on public.milestones;
create policy "Employees can view assigned milestones"
on public.milestones
for select
to authenticated
using (
  exists (
    select 1
    from public.track_assignments
    where track_assignments.track_id = milestones.track_id
      and track_assignments.employee_id = (select auth.uid())
  )
);

drop policy if exists "Employees can view assigned tasks" on public.tasks;
create policy "Employees can view assigned tasks"
on public.tasks
for select
to authenticated
using (
  exists (
    select 1
    from public.milestones
    join public.track_assignments on track_assignments.track_id = milestones.track_id
    where milestones.id = tasks.milestone_id
      and track_assignments.employee_id = (select auth.uid())
  )
);

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

grant execute on function public.complete_assignment_task(uuid, uuid) to authenticated;
