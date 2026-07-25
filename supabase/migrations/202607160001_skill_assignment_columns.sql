-- role_focus is the canonical application field. occupation is retained only
-- for compatibility with local/manual schemas created during early testing.
alter table public.profiles
add column if not exists occupation text,
add column if not exists role_focus text,
add column if not exists assigned_skills jsonb;

alter table public.invites
add column if not exists occupation text,
add column if not exists role_focus text,
add column if not exists assigned_skills jsonb;

-- Align manually created invite columns with the application defaults.
alter table public.invites
alter column role_focus set default 'GENERAL_EMPLOYEE',
alter column assigned_skills set default '[]'::jsonb;

update public.invites
set role_focus = 'GENERAL_EMPLOYEE'
where role_focus is null;

update public.invites
set assigned_skills = '[]'::jsonb
where assigned_skills is null;

alter table public.invites
alter column role_focus set not null,
alter column assigned_skills set not null;
