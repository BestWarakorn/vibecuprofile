import {z} from 'zod';
import type {Team} from './data';
export const teamSchema=z.object({title:z.string().trim().min(3).max(100),subtitle:z.string().trim().max(120),category:z.enum(['Hackathon','Project','Case Competition','Research','อื่น ๆ']),description:z.string().trim().min(20).max(3000),skills:z.array(z.string().trim().min(1)).min(1).max(10),capacity:z.number().int().min(2).max(30),start:z.iso.date(),end:z.iso.date(),contact:z.email(),mode:z.string().trim().min(2),commitment:z.string().trim().min(2)}).refine(v=>v.end>=v.start,{message:'วันปิดรับต้องไม่ก่อนวันเปิดรับ',path:['end']});
export function isOpen(t:Team,today=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Bangkok'})){return t.start<=today&&t.end>=today&&t.members.length<t.capacity}
export function joinTeam(t:Team,id:string,today?:string):Team {if(t.members.includes(id))throw Error('คุณเป็นสมาชิกทีมนี้แล้ว');if(!isOpen(t,today))throw Error('ทีมนี้ไม่เปิดรับสมาชิกในขณะนี้');return {...t,members:[...t.members,id]}}

export const joinRequestSchema=z.object({
 id:z.string(),teamId:z.string(),applicantId:z.string(),
 status:z.enum(['pending','accepted','rejected']),
 createdAt:z.iso.datetime(),decidedAt:z.iso.datetime().optional()
});
export type JoinRequest=z.infer<typeof joinRequestSchema>;
export function submitJoinRequest(team:Team,requests:JoinRequest[],applicantId:string,now=new Date().toISOString()):JoinRequest[]{
 if(team.owner===applicantId||team.members.includes(applicantId))throw Error('คุณเป็นสมาชิกทีมนี้แล้ว');
 if(!isOpen(team,new Date(now).toLocaleDateString('en-CA',{timeZone:'Asia/Bangkok'})))throw Error('ทีมนี้ไม่เปิดรับสมาชิกในขณะนี้');
 const existing=requests.find(r=>r.teamId===team.id&&r.applicantId===applicantId);
 if(existing?.status==='pending')throw Error('คุณส่งคำขอแล้ว กรุณารอหัวหน้าทีมพิจารณา');
 if(existing?.status==='accepted')throw Error('คำขอของคุณได้รับการอนุมัติแล้ว');
 const request:JoinRequest={id:existing?.id||crypto.randomUUID(),teamId:team.id,applicantId,status:'pending',createdAt:now};
 return existing?requests.map(r=>r.id===existing.id?request:r):[request,...requests];
}
export function decideJoinRequest(team:Team,requests:JoinRequest[],actorId:string,requestId:string,decision:'accepted'|'rejected',now=new Date().toISOString()):{team:Team;requests:JoinRequest[]}{
 if(team.owner!==actorId)throw Error('เฉพาะหัวหน้าทีมเท่านั้นที่จัดการคำขอได้');
 const request=requests.find(r=>r.id===requestId&&r.teamId===team.id);
 if(!request||request.status!=='pending')throw Error('คำขอนี้ถูกพิจารณาแล้วหรือไม่พบคำขอ');
 const updated=decision==='accepted'?joinTeam(team,request.applicantId,new Date(now).toLocaleDateString('en-CA',{timeZone:'Asia/Bangkok'})):team;
 return {team:updated,requests:requests.map(r=>r.id===requestId?{...r,status:decision,decidedAt:now}:r)};
}
