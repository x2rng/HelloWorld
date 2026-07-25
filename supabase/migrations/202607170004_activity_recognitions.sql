create table if not exists public.activity_recognitions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  activity_id uuid not null references public.growth_activities(id) on delete cascade,
  giver_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  points integer not null check (points between 1 and 10),
  created_at timestamptz not null default timezone('utc', now()),
  constraint activity_recognitions_no_self_recognition check (giver_id <> receiver_id)
);

create index if not exists activity_recognitions_activity_id_idx
on public.activity_recognitions (activity_id);

create index if not exists activity_recognitions_giver_created_at_idx
on public.activity_recognitions (giver_id, created_at desc);

create index if not exists activity_recognitions_workspace_id_idx
on public.activity_recognitions (workspace_id);

alter table public.activity_recognitions enable row level security;

drop policy if exists "Employees can view recognition on visible activities" on public.activity_recognitions;
create policy "Employees can view recognition on visible activities"
on public.activity_recognitions
for select
to authenticated
using (
  public.is_workspace_member(activity_recognitions.workspace_id)
  and exists (
    select 1
    from public.growth_activities
    where growth_activities.id = activity_recognitions.activity_id
      and growth_activities.workspace_id = activity_recognitions.workspace_id
      and (
        growth_activities.employee_id = (select auth.uid())
        or growth_activities.visibility in ('DEPARTMENT', 'COMPANY')
      )
  )
);

drop policy if exists "Employees can give recognition as themselves" on public.activity_recognitions;
create policy "Employees can give recognition as themselves"
on public.activity_recognitions
for insert
to authenticated
with check (
  giver_id = (select auth.uid())
  and giver_id <> receiver_id
  and public.is_workspace_member(activity_recognitions.workspace_id)
  and exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.workspace_id = activity_recognitions.workspace_id
      and profiles.role = 'EMPLOYEE'
  )
  and exists (
    select 1
    from public.growth_activities
    where growth_activities.id = activity_recognitions.activity_id
      and growth_activities.workspace_id = activity_recognitions.workspace_id
      and growth_activities.employee_id = activity_recognitions.receiver_id
      and growth_activities.visibility in ('DEPARTMENT', 'COMPANY')
  )
);

drop policy if exists "Workspace admins can view recognition" on public.activity_recognitions;
create policy "Workspace admins can view recognition"
on public.activity_recognitions
for select
to authenticated
using (public.is_workspace_admin(activity_recognitions.workspace_id));

create or replace function public.enforce_activity_recognition_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  activity_record public.growth_activities%rowtype;
  daily_points integer;
  activity_points integer;
  utc_today date := (timezone('utc', now()))::date;
begin
  if (select auth.uid()) is null then
    raise exception 'You must be signed in to give recognition.';
  end if;

  if new.giver_id <> (select auth.uid()) then
    raise exception 'Recognition must be given as the signed-in employee.';
  end if;

  select * into activity_record
  from public.growth_activities
  where id = new.activity_id
  limit 1;

  if activity_record.id is null then
    raise exception 'Growth activity was not found.';
  end if;

  if new.workspace_id <> activity_record.workspace_id
    or new.receiver_id <> activity_record.employee_id then
    raise exception 'Recognition does not match this activity.';
  end if;

  if new.giver_id = new.receiver_id then
    raise exception 'You cannot recognize your own activity.';
  end if;

  if activity_record.visibility not in ('DEPARTMENT', 'COMPANY') then
    raise exception 'This activity is not shared for recognition.';
  end if;

  if not exists (
    select 1 from public.profiles
    where profiles.id = new.giver_id
      and profiles.workspace_id = new.workspace_id
      and profiles.role = 'EMPLOYEE'
  ) then
    raise exception 'Recognition must stay within your workspace.';
  end if;

  perform pg_advisory_xact_lock(hashtext(new.giver_id::text));
  new.created_at := timezone('utc', now());

  select coalesce(sum(points), 0) into daily_points
  from public.activity_recognitions
  where giver_id = new.giver_id
    and (created_at at time zone 'utc')::date = utc_today;

  if daily_points + new.points > 100 then
    raise exception 'This recognition would exceed your daily 100-point budget.';
  end if;

  select coalesce(sum(points), 0) into activity_points
  from public.activity_recognitions
  where giver_id = new.giver_id
    and activity_id = new.activity_id;

  if activity_points + new.points > 10 then
    raise exception 'You can give at most 10 recognition points to one activity.';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_activity_recognition_rules on public.activity_recognitions;
create trigger enforce_activity_recognition_rules
before insert on public.activity_recognitions
for each row execute function public.enforce_activity_recognition_rules();

create or replace function public.give_activity_recognition(
  target_activity_id uuid,
  target_points integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_recognition public.activity_recognitions%rowtype;
  activity_total integer;
  giver_daily_total integer;
  giver_activity_total integer;
begin
  insert into public.activity_recognitions (
    workspace_id, activity_id, giver_id, receiver_id, points
  )
  select
    growth_activities.workspace_id,
    growth_activities.id,
    (select auth.uid()),
    growth_activities.employee_id,
    target_points
  from public.growth_activities
  where growth_activities.id = target_activity_id
  returning * into inserted_recognition;

  if inserted_recognition.id is null then
    raise exception 'This growth activity is not available for recognition.';
  end if;

  select coalesce(sum(points), 0) into activity_total
  from public.activity_recognitions
  where activity_id = target_activity_id;

  select coalesce(sum(points), 0) into giver_daily_total
  from public.activity_recognitions
  where giver_id = (select auth.uid())
    and (created_at at time zone 'utc')::date = (timezone('utc', now()))::date;

  select coalesce(sum(points), 0) into giver_activity_total
  from public.activity_recognitions
  where giver_id = (select auth.uid())
    and activity_id = target_activity_id;

  return jsonb_build_object(
    'activity_total', activity_total,
    'daily_used', giver_daily_total,
    'activity_given', giver_activity_total
  );
end;
$$;

grant execute on function public.give_activity_recognition(uuid, integer) to authenticated;
