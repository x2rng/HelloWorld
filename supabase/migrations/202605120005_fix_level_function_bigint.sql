create or replace function public.exp_level_for_xp(total_xp bigint)
returns integer
language sql
immutable
as $$
  select case
    when total_xp >= 800 then 5
    when total_xp >= 500 then 4
    when total_xp >= 250 then 3
    when total_xp >= 100 then 2
    else 1
  end;
$$;

grant execute on function public.exp_level_for_xp(bigint) to anon, authenticated;
