-- Player Setup Onboarding V1.
-- Existing employees are treated as already set up so this rollout does not
-- interrupt established accounts. New employee profiles start incomplete.

alter table public.profiles
add column if not exists player_setup_completed boolean,
add column if not exists interests jsonb,
add column if not exists growth_priorities jsonb;

update public.profiles
set interests = '[]'::jsonb
where interests is null;

update public.profiles
set growth_priorities = '[]'::jsonb
where growth_priorities is null;

update public.profiles
set player_setup_completed = true
where role = 'EMPLOYEE'
  and player_setup_completed is distinct from true;

update public.profiles
set player_setup_completed = false
where player_setup_completed is null;

alter table public.profiles
alter column player_setup_completed set default false,
alter column player_setup_completed set not null,
alter column interests set default '[]'::jsonb,
alter column interests set not null,
alter column growth_priorities set default '[]'::jsonb,
alter column growth_priorities set not null;

alter table public.profiles
drop constraint if exists profiles_interests_array_check;

alter table public.profiles
add constraint profiles_interests_array_check
check (jsonb_typeof(interests) = 'array');

alter table public.profiles
drop constraint if exists profiles_growth_priorities_array_check;

alter table public.profiles
add constraint profiles_growth_priorities_array_check
check (jsonb_typeof(growth_priorities) = 'array');
