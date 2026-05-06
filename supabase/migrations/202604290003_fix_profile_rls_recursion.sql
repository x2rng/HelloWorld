create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.workspace_id = target_workspace_id
  );
$$;

create or replace function public.is_workspace_admin(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.workspace_id = target_workspace_id
      and profiles.role = 'ADMIN'
  );
$$;

drop policy if exists "Workspace members can view their workspace" on public.workspaces;
create policy "Workspace members can view their workspace"
on public.workspaces
for select
to authenticated
using (public.is_workspace_member(workspaces.id));

drop policy if exists "Workspace admins can update workspace" on public.workspaces;
create policy "Workspace admins can update workspace"
on public.workspaces
for update
to authenticated
using (public.is_workspace_admin(workspaces.id))
with check (public.is_workspace_admin(workspaces.id));

drop policy if exists "Workspace admins can view workspace profiles" on public.profiles;
create policy "Workspace admins can view workspace profiles"
on public.profiles
for select
to authenticated
using (
  (select auth.uid()) = id
  or public.is_workspace_admin(profiles.workspace_id)
);

drop policy if exists "Workspace admins can create invites" on public.invites;
create policy "Workspace admins can create invites"
on public.invites
for insert
to authenticated
with check (
  invited_by = (select auth.uid())
  and public.is_workspace_admin(invites.workspace_id)
);

drop policy if exists "Workspace admins can view invites" on public.invites;
create policy "Workspace admins can view invites"
on public.invites
for select
to authenticated
using (public.is_workspace_admin(invites.workspace_id));

drop policy if exists "Workspace admins can update invites" on public.invites;
create policy "Workspace admins can update invites"
on public.invites
for update
to authenticated
using (public.is_workspace_admin(invites.workspace_id))
with check (public.is_workspace_admin(invites.workspace_id));

drop policy if exists "Workspace admins can manage onboarding tracks" on public.onboarding_tracks;
create policy "Workspace admins can manage onboarding tracks"
on public.onboarding_tracks
for all
to authenticated
using (public.is_workspace_admin(onboarding_tracks.workspace_id))
with check (public.is_workspace_admin(onboarding_tracks.workspace_id));

drop policy if exists "Workspace admins can manage milestones" on public.milestones;
create policy "Workspace admins can manage milestones"
on public.milestones
for all
to authenticated
using (
  exists (
    select 1
    from public.onboarding_tracks
    where onboarding_tracks.id = milestones.track_id
      and public.is_workspace_admin(onboarding_tracks.workspace_id)
  )
)
with check (
  exists (
    select 1
    from public.onboarding_tracks
    where onboarding_tracks.id = milestones.track_id
      and public.is_workspace_admin(onboarding_tracks.workspace_id)
  )
);

drop policy if exists "Workspace admins can manage tasks" on public.tasks;
create policy "Workspace admins can manage tasks"
on public.tasks
for all
to authenticated
using (
  exists (
    select 1
    from public.milestones
    join public.onboarding_tracks on onboarding_tracks.id = milestones.track_id
    where milestones.id = tasks.milestone_id
      and public.is_workspace_admin(onboarding_tracks.workspace_id)
  )
)
with check (
  exists (
    select 1
    from public.milestones
    join public.onboarding_tracks on onboarding_tracks.id = milestones.track_id
    where milestones.id = tasks.milestone_id
      and public.is_workspace_admin(onboarding_tracks.workspace_id)
  )
);
