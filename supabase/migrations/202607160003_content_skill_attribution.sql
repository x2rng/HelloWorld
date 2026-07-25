alter table public.onboarding_tracks
add column if not exists skill_focus jsonb;

alter table public.milestones
add column if not exists skill_focus jsonb;

alter table public.tasks
add column if not exists skill_contributions jsonb;

alter table public.onboarding_tracks
alter column skill_focus set default '[]'::jsonb;
alter table public.milestones
alter column skill_focus set default '[]'::jsonb;
alter table public.tasks
alter column skill_contributions set default '[]'::jsonb;

update public.onboarding_tracks set skill_focus = '[]'::jsonb where skill_focus is null;
update public.milestones set skill_focus = '[]'::jsonb where skill_focus is null;
update public.tasks set skill_contributions = '[]'::jsonb where skill_contributions is null;

alter table public.onboarding_tracks alter column skill_focus set not null;
alter table public.milestones alter column skill_focus set not null;
alter table public.tasks alter column skill_contributions set not null;

alter table public.onboarding_tracks drop constraint if exists onboarding_tracks_skill_focus_array_check;
alter table public.onboarding_tracks add constraint onboarding_tracks_skill_focus_array_check
check (jsonb_typeof(skill_focus) = 'array');

alter table public.milestones drop constraint if exists milestones_skill_focus_array_check;
alter table public.milestones add constraint milestones_skill_focus_array_check
check (jsonb_typeof(skill_focus) = 'array');

alter table public.tasks drop constraint if exists tasks_skill_contributions_array_check;
alter table public.tasks add constraint tasks_skill_contributions_array_check
check (jsonb_typeof(skill_contributions) = 'array');
