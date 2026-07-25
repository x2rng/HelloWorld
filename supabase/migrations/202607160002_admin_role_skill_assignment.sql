alter table public.invites
drop constraint if exists invites_role_focus_check;
alter table public.invites
add constraint invites_role_focus_check check (
  role_focus in (
    'GENERAL_EMPLOYEE', 'SOCIAL_MEDIA_MARKETING', 'MARKETING',
    'UI_UX_DESIGNER', 'FRONTEND_DEVELOPER', 'BACKEND_DEVELOPER',
    'FULL_STACK_DEVELOPER', 'SALES', 'PROJECT_MANAGER',
    'CUSTOMER_SUCCESS', 'OPERATIONS'
  )
);

alter table public.profiles
drop constraint if exists profiles_role_focus_check;
alter table public.profiles
add constraint profiles_role_focus_check check (
  role_focus is null
  or role_focus in (
    'GENERAL_EMPLOYEE', 'SOCIAL_MEDIA_MARKETING', 'MARKETING',
    'UI_UX_DESIGNER', 'FRONTEND_DEVELOPER', 'BACKEND_DEVELOPER',
    'FULL_STACK_DEVELOPER', 'SALES', 'PROJECT_MANAGER',
    'CUSTOMER_SUCCESS', 'OPERATIONS'
  )
);

alter table public.invites
drop constraint if exists invites_assigned_skills_array_check;
alter table public.invites
add constraint invites_assigned_skills_array_check
check (jsonb_typeof(assigned_skills) = 'array');

alter table public.profiles
drop constraint if exists profiles_assigned_skills_array_check;
alter table public.profiles
add constraint profiles_assigned_skills_array_check
check (assigned_skills is null or jsonb_typeof(assigned_skills) = 'array');

create or replace function public.accept_invite(invite_token text, employee_full_name text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  invite_record public.invites%rowtype;
  current_email text;
  existing_profile public.profiles%rowtype;
begin
  if (select auth.uid()) is null then
    raise exception 'You must be signed in to accept this invite.';
  end if;

  current_email := lower(coalesce((select auth.jwt() ->> 'email'), ''));

  select * into invite_record
  from public.invites
  where token = invite_token
  limit 1;

  if invite_record.id is null then
    raise exception 'Invite was not found.';
  end if;
  if invite_record.status <> 'PENDING' then
    raise exception 'Invite is no longer pending.';
  end if;
  if invite_record.expires_at is not null and invite_record.expires_at < timezone('utc', now()) then
    update public.invites set status = 'EXPIRED' where id = invite_record.id;
    raise exception 'Invite has expired.';
  end if;
  if lower(invite_record.email) <> current_email then
    raise exception 'Signed-in email does not match this invite.';
  end if;

  select * into existing_profile
  from public.profiles
  where id = (select auth.uid())
  limit 1;

  if existing_profile.id is not null and existing_profile.workspace_id <> invite_record.workspace_id then
    raise exception 'This account already belongs to another workspace.';
  end if;

  if existing_profile.id is null then
    insert into public.profiles (
      id, workspace_id, role, full_name, email, role_focus, assigned_skills
    )
    values (
      (select auth.uid()), invite_record.workspace_id, 'EMPLOYEE',
      nullif(trim(employee_full_name), ''), invite_record.email,
      invite_record.role_focus, invite_record.assigned_skills
    );
  else
    update public.profiles
    set
      role_focus = coalesce(existing_profile.role_focus, invite_record.role_focus),
      assigned_skills = coalesce(existing_profile.assigned_skills, invite_record.assigned_skills)
    where id = existing_profile.id;
  end if;

  update public.invites
  set status = 'ACCEPTED'
  where id = invite_record.id;
end;
$$;

grant execute on function public.accept_invite(text, text) to authenticated;
