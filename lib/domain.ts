import {z} from 'zod';
import type {Team} from './data';
export const teamSchema=z.object({title:z.string().trim().min(3).max(100),subtitle:z.string().trim().max(120),category:z.enum(['Hackathon','Project','Case Competition','Research','อื่น ๆ']),description:z.string().trim().min(20).max(3000),skills:z.array(z.string().trim().min(1)).min(1).max(10),capacity:z.number().int().min(2).max(30),start:z.iso.date(),end:z.iso.date(),contact:z.email(),mode:z.string().trim().min(2),commitment:z.string().trim().min(2)}).refine(v=>v.end>=v.start,{message:'วันปิดรับต้องไม่ก่อนวันเปิดรับ',path:['end']});
export function isOpen(t:Team,today=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Bangkok'})){return t.start<=today&&t.end>=today&&t.members.length<t.capacity}
export function joinTeam(t:Team,id:string,today?:string):Team {if(t.members.includes(id))throw Error('คุณเป็นสมาชิกทีมนี้แล้ว');if(!isOpen(t,today))throw Error('ทีมนี้ไม่เปิดรับสมาชิกในขณะนี้');return {...t,members:[...t.members,id]}}
