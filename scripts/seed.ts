import {writeFileSync} from 'node:fs';
import {people,initialTeams} from '../lib/data';
const uuid=(id:string)=>`00000000-0000-4000-8000-${String(Number(id.slice(1))+(id[0]==='t'?100:0)).padStart(12,'0')}`;
const q=(s:string)=>`'${s.replaceAll("'","''")}'`;
const arr=(a:string[])=>`ARRAY[${a.map(q).join(',')}]::text[]`;
let sql='-- Fictional demonstration data only; no auth users or passwords.\nbegin;\n';
for(const p of people)sql+=`insert into public.profiles(id,username,first_name,last_name,nickname,year,faculty,major,avatar_url,bio,skills,interests,work_style,ideal_teammate) values (${q(uuid(p.id))},${q(p.username)},${q(p.first)},${q(p.last)},${q(p.nick)},${p.year},${q(p.faculty)},${q(p.major)},${q(p.avatar)},${q(p.bio)},${arr(p.skills)},${arr(p.interests)},${q(p.style)},${q(p.ideal)}) on conflict(id) do nothing;\n`;
for(const t of initialTeams){sql+=`insert into public.teams(id,owner_id,title,subtitle,category,description,skills,capacity,starts_on,ends_on,contact_email,work_mode,commitment) values (${q(uuid(t.id))},${q(uuid(t.owner))},${q(t.title)},${q(t.subtitle)},${q(t.category)},${q(t.description)},${arr(t.skills)},${t.capacity},${q(t.start)},${q(t.end)},${q(t.contact)},${q(t.mode)},${q(t.commitment)}) on conflict(id) do nothing;\n`;for(const id of t.members)sql+=`insert into public.team_members(team_id,profile_id) values (${q(uuid(t.id))},${q(uuid(id))}) on conflict do nothing;\n`}
sql+='commit;\n';writeFileSync('supabase/seed.sql',sql);
