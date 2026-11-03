-- Prepare storage for future Supabase Auth integration. Demo UI uses localStorage.
begin;
create table if not exists public.team_join_requests (
 id uuid primary key default gen_random_uuid(),
 team_id uuid not null references public.teams(id) on delete cascade,
 applicant_id uuid not null references public.profiles(id) on delete cascade,
 status text not null default 'pending' check(status in ('pending','accepted','rejected')),
 created_at timestamptz not null default now(),
 decided_at timestamptz,
 unique(team_id,applicant_id),
 check((status='pending' and decided_at is null) or (status<>'pending' and decided_at is not null))
);
create index if not exists team_requests_inbox on public.team_join_requests(team_id,status);
alter table public.team_join_requests enable row level security;
revoke all on public.team_join_requests from anon,authenticated;
grant select on public.team_join_requests to authenticated;
create policy "Applicant and owner read requests" on public.team_join_requests for select to authenticated using (
 exists(select 1 from public.profiles p where p.id=applicant_id and p.auth_user_id=(select auth.uid()))
 or exists(select 1 from public.teams t join public.profiles p on p.id=t.owner_id where t.id=team_id and p.auth_user_id=(select auth.uid()))
);
-- Future writes require authenticated server validation and a transaction that locks
-- the team row and checks capacity before accepting a request and adding membership.
commit;
