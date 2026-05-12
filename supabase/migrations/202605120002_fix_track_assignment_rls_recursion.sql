create or replace function public.is_employee_in_workspace(
  target_employee_id uuid,
  target_workspace_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.id = target_employee_id
      and profiles.workspace_id = target_workspace_id
      and profiles.role = 'EMPLOYEE'
  );
$$;

create or replace function public.is_onboarding_track_in_workspace(
  target_track_id uuid,
  target_workspace_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.onboarding_tracks
    where onboarding_tracks.id = target_track_id
      and onboarding_tracks.workspace_id = target_workspace_id
  );
$$;

drop policy if exists "Workspace admins can manage track assignments" on public.track_assignments;
create policy "Workspace admins can manage track assignments"
on public.track_assignments
for all
to authenticated
using (public.is_workspace_admin(track_assignments.workspace_id))
with check (
  public.is_workspace_admin(track_assignments.workspace_id)
  and public.is_employee_in_workspace(
    track_assignments.employee_id,
    track_assignments.workspace_id
  )
  and public.is_onboarding_track_in_workspace(
    track_assignments.track_id,
    track_assignments.workspace_id
  )
);

grant execute on function public.is_employee_in_workspace(uuid, uuid) to authenticated;
grant execute on function public.is_onboarding_track_in_workspace(uuid, uuid) to authenticated;
