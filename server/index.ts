import express from 'express';
import cors from 'cors';
import {createClient} from '@supabase/supabase-js';
import {people,initialTeams} from '../lib/data';
// Read-only public API for this prototype. Demo credentials never reach Supabase.
const app=express();app.use(cors({origin:process.env.FRONTEND_ORIGIN||'http://localhost:3000'}));app.use(express.json({limit:'32kb'}));
const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_ANON_KEY;
const db=url&&key?createClient(url,key,{auth:{persistSession:false}}):null;
app.get('/api/health',(_req,res)=>res.json({ok:true,mode:db?'supabase':'demo'}));
app.get('/api/profiles',async(_req,res)=>{if(!db)return res.json(people);const {data,error}=await db.from('profiles').select('*');if(error)return res.status(502).json({error:'Database unavailable'});res.json(data)});
app.get('/api/teams',async(_req,res)=>{if(!db)return res.json(initialTeams);const {data,error}=await db.from('teams').select('*, team_members(profile_id)');if(error)return res.status(502).json({error:'Database unavailable'});res.json(data)});
app.use((_req,res)=>res.status(404).json({error:'Not found'}));
const port=Number(process.env.PORT)||4000;app.listen(port,()=>console.log(`CUprofile API: http://localhost:${port}`));
