-- Admin-assigned invite role/skills are authoritative during acceptance.
-- A non-empty invite skill list identifies invites configured by the admin.
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
  invite_has_role_skills boolean;
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

  invite_has_role_skills := invite_record.role_focus is not null
    and jsonb_typeof(invite_record.assigned_skills) = 'array'
    and jsonb_array_length(invite_record.assigned_skills) > 0;

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
      role_focus = case
        when invite_has_role_skills then invite_record.role_focus
        else existing_profile.role_focus
      end,
      assigned_skills = case
        when invite_has_role_skills then invite_record.assigned_skills
        else existing_profile.assigned_skills
      end
    where id = existing_profile.id;
  end if;

  update public.invites
  set status = 'ACCEPTED'
  where id = invite_record.id;
end;
$$;

grant execute on function public.accept_invite(text, text) to authenticated;

-- Repair previously accepted invites only when the matching employee profile
-- still has missing/empty role-skill data. Populated profiles are untouched.
with latest_assigned_invites as (
  select distinct on (workspace_id, lower(email))
    workspace_id,
    lower(email) as normalized_email,
    role_focus,
    assigned_skills
  from public.invites
  where status = 'ACCEPTED'
    and role_focus is not null
    and jsonb_typeof(assigned_skills) = 'array'
    and jsonb_array_length(assigned_skills) > 0
  order by workspace_id, lower(email), created_at desc
)
update public.profiles as profile
set
  role_focus = assigned_invite.role_focus,
  assigned_skills = assigned_invite.assigned_skills
from latest_assigned_invites as assigned_invite
where profile.workspace_id = assigned_invite.workspace_id
  and lower(profile.email) = assigned_invite.normalized_email
  and profile.role = 'EMPLOYEE'
  and (
    profile.role_focus is null
    or profile.assigned_skills is null
    or jsonb_typeof(profile.assigned_skills) <> 'array'
    or jsonb_array_length(profile.assigned_skills) = 0
  );
