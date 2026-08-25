set check_function_bodies = off;

-- Pending requests no longer disqualify a suggestion.
--
-- Onboarding is the only caller, and dropping somebody the moment a request is
-- sent made their card vanish out from under the tap that sent it. Both
-- directions of `pending` now stay in the list; the card renders the pending
-- state instead of disappearing. Accepted friends are still excluded — they
-- are not people you need to be told about.
CREATE OR REPLACE FUNCTION public.suggested_friends(p_term bigint, p_limit integer DEFAULT 12)
 RETURNS TABLE(id uuid, username text, name text, major text, avatar text, shared_courses integer, mutual_friends integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with viewer as (
    select auth.uid() as id
  ),
  -- Courses the viewer is taking in the term being asked about.
  my_courses as (
    select distinct e.course
    from public.events e
    cross join viewer v
    where e."user" = v.id
      and e.term = p_term
      and e.course is not null
  ),
  my_friends as (
    select case when f.requester = v.id then f.addressee else f.requester end as id
    from public.friendships f
    cross join viewer v
    where f.status = 'accepted'
      and v.id in (f.requester, f.addressee)
  ),
  -- Signal 1: people sitting in the same courses this term.
  classmates as (
    select e."user" as id, count(distinct e.course)::integer as shared_courses
    from public.events e
    cross join viewer v
    where e.term = p_term
      and e."user" <> v.id
      and e.course in (select course from my_courses)
    group by e."user"
  ),
  -- Signal 2: people your friends are friends with. Counts how many of your
  -- friends bridge to them.
  friends_of_friends as (
    select case when f.requester = mf.id then f.addressee else f.requester end as id,
           count(*)::integer as mutual_friends
    from public.friendships f
    join my_friends mf on mf.id in (f.requester, f.addressee)
    where f.status = 'accepted'
    group by 1
  ),
  -- FULL OUTER so somebody who is only a classmate, only a mutual, or both
  -- all reach the ranking with the other score defaulted to zero.
  candidates as (
    select coalesce(c.id, ff.id) as id,
           coalesce(c.shared_courses, 0) as shared_courses,
           coalesce(ff.mutual_friends, 0) as mutual_friends
    from classmates c
    full outer join friends_of_friends ff on ff.id = c.id
  )
  select u.id, u.username, u.name, u.major, u.avatar,
         cand.shared_courses, cand.mutual_friends
  from candidates cand
  join public.users u on u.id = cand.id
  cross join viewer v
  where cand.id <> v.id
    and not exists (select 1 from my_friends mf where mf.id = cand.id)
  order by cand.shared_courses desc, cand.mutual_friends desc, u.username
  limit p_limit;
$function$
;
