create index if not exists growth_activities_workspace_status_created_at_idx
on public.growth_activities (workspace_id, status, created_at desc);

create or replace function public.review_growth_activity(
  target_activity_id uuid,
  target_status text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  activity_workspace_id uuid;
  activity_status text;
begin
  if (select auth.uid()) is null then
    raise exception 'You must be signed in to review growth activities.';
  end if;

  if target_status not in ('approved', 'rejected') then
    raise exception 'Review status must be approved or rejected.';
  end if;

  select workspace_id, status
  into activity_workspace_id, activity_status
  from public.growth_activities
  where id = target_activity_id
  for update;

  if activity_workspace_id is null then
    raise exception 'Growth activity was not found.';
  end if;

  if not public.is_workspace_admin(activity_workspace_id) then
    raise exception 'You cannot review activities outside your workspace.';
  end if;

  if activity_status <> 'pending' then
    raise exception 'This growth activity has already been reviewed.';
  end if;

  update public.growth_activities
  set status = target_status
  where id = target_activity_id;

  return target_status;
end;
$$;

revoke all on function public.review_growth_activity(uuid, text) from public;
grant execute on function public.review_growth_activity(uuid, text) to authenticated;
