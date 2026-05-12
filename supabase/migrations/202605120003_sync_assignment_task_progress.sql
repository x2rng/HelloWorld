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
    'NOT_STARTED'
  from public.tasks
  join public.milestones on milestones.id = tasks.milestone_id
  where milestones.track_id = assignment_record.track_id
  on conflict (assignment_id, task_id) do nothing;

  get diagnostics inserted_progress_rows = row_count;

  return inserted_progress_rows;
end;
$$;

grant execute on function public.ensure_assignment_task_progress(uuid) to authenticated;
