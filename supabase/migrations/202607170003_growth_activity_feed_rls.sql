drop policy if exists "Workspace employees can view shared growth activities" on public.growth_activities;
create policy "Workspace employees can view shared growth activities"
on public.growth_activities
for select
to authenticated
using (
  visibility in ('DEPARTMENT', 'COMPANY')
  and public.is_workspace_member(growth_activities.workspace_id)
);

create or replace function public.get_workspace_profile_display_names(target_profile_ids uuid[])
returns table (
  id uuid,
  display_name text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    target.id,
    coalesce(
      nullif(trim(target.full_name), ''),
      nullif(split_part(target.email, '@', 1), ''),
      'Employee'
    ) as display_name
  from public.profiles as target
  where target.id = any(coalesce(target_profile_ids, array[]::uuid[]))
    and exists (
      select 1
      from public.profiles as viewer
      where viewer.id = (select auth.uid())
        and viewer.workspace_id = target.workspace_id
    );
$$;

grant execute on function public.get_workspace_profile_display_names(uuid[]) to authenticated;
