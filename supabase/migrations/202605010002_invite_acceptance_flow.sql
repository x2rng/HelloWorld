create or replace function public.get_invite_details(invite_token text)
returns table (
  email text,
  status public.invite_status,
  expires_at timestamptz,
  workspace_name text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    invites.email,
    invites.status,
    invites.expires_at,
    workspaces.name as workspace_name
  from public.invites
  join public.workspaces on workspaces.id = invites.workspace_id
  where invites.token = invite_token
  limit 1;
$$;

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

  select *
  into invite_record
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
    update public.invites
    set status = 'EXPIRED'
    where id = invite_record.id;

    raise exception 'Invite has expired.';
  end if;

  if lower(invite_record.email) <> current_email then
    raise exception 'Signed-in email does not match this invite.';
  end if;

  select *
  into existing_profile
  from public.profiles
  where id = (select auth.uid())
  limit 1;

  if existing_profile.id is not null and existing_profile.workspace_id <> invite_record.workspace_id then
    raise exception 'This account already belongs to another workspace.';
  end if;

  if existing_profile.id is null then
    insert into public.profiles (
      id,
      workspace_id,
      role,
      full_name,
      email
    )
    values (
      (select auth.uid()),
      invite_record.workspace_id,
      'EMPLOYEE',
      nullif(trim(employee_full_name), ''),
      invite_record.email
    );
  end if;

  update public.invites
  set status = 'ACCEPTED'
  where id = invite_record.id;
end;
$$;

grant execute on function public.get_invite_details(text) to anon, authenticated;
grant execute on function public.accept_invite(text, text) to authenticated;
