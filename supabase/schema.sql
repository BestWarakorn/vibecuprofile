-- Run in Supabase SQL Editor. Prototype accounts are NOT Supabase Auth users.
begin;
create table if not exists public.profiles (
 id uuid primary key default gen_random_uuid(),
 auth_user_id uuid unique references auth.users(id) on delete cascade,
 username text unique not null,
 first_name text not null, last_name text not null,
 nickname text, year smallint check(year between 1 and 8), faculty text not null,
 major text, avatar_url text, bio text, skills text[] not null default '{}',
 interests text[] not null default '{}', work_style text, ideal_teammate text,
 created_at timestamptz not null default now()
);
create table if not exists public.teams (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id),
 title text not null check(char_length(title) between 3 and 100), subtitle text,
 category text not null check(category in ('Hackathon','Project','Case Competition','Research','อื่น ๆ')),
 description text not null check(char_length(description) between 20 and 3000),
 skills text[] not null default '{}', capacity smallint not null check(capacity between 2 and 30),
 starts_on date not null, ends_on date not null check(ends_on>=starts_on),
 contact_email text not null, work_mode text, commitment text,
 created_at timestamptz not null default now()
);
create table if not exists public.team_members (
 team_id uuid references public.teams(id) on delete cascade,
 profile_id uuid references public.profiles(id) on delete cascade,
 joined_at timestamptz not null default now(), primary key(team_id,profile_id)
);
create index if not exists profiles_filter on public.profiles(faculty,year);
create index if not exists teams_recruiting on public.teams(ends_on);
alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
revoke all on public.profiles,public.teams,public.team_members from anon,authenticated;
grant select on public.profiles,public.teams,public.team_members to anon,authenticated;
create policy "Public profiles read" on public.profiles for select using(true);
create policy "Public teams read" on public.teams for select using(true);
create policy "Public memberships read" on public.team_members for select using(true);
-- No write policies until real Supabase Auth + server validation + capacity transaction
-- are implemented. Browser-local demo sessions must never authorize database writes.
commit;
