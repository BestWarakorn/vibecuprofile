'use client';
import {useState} from 'react';
import {ArrowUpRight,Check,Clock3,Inbox,Users,X} from 'lucide-react';
import type {Person,Team} from '@/lib/data';
import {isOpen,type JoinRequest} from '@/lib/domain';
const base=process.env.NEXT_PUBLIC_BASE_PATH||'';
export const requestLabels={pending:'รอพิจารณา',accepted:'ได้รับการอนุมัติ',rejected:'ไม่ได้รับการอนุมัติ'};
export default function RequestsPanel({me,profiles,teams,requests,onProfile,onTeam,onDecide}:{
 me:Person;profiles:Person[];teams:Team[];requests:JoinRequest[];
 onProfile:(id:string)=>void;onTeam:(team:Team)=>void;
 onDecide:(request:JoinRequest,decision:'accepted'|'rejected')=>void;
}){
 const owned=teams.filter(t=>t.owner===me.id);
 const incoming=requests.filter(r=>owned.some(t=>t.id===r.teamId));
 const outgoing=requests.filter(r=>r.applicantId===me.id);
 const pending=incoming.filter(r=>r.status==='pending').length;
 const [tab,setTab]=useState<'incoming'|'outgoing'>(owned.length?'incoming':'outgoing');
 const sorted=[...(tab==='incoming'?incoming:outgoing)].sort((a,b)=>Number(b.status==='pending')-Number(a.status==='pending')||b.createdAt.localeCompare(a.createdAt));
 return <section className="content-area page-section requests-page">
 <div className="eyebrow muted">FIND YOUR TEAM, TOGETHER</div><h1 className="page-title">คำขอเข้าทีม</h1><p className="page-subtitle">ดูโปรไฟล์ ทำความรู้จัก และเลือกเพื่อนที่มาเติมเต็มทีมของคุณ</p>
 <div className="request-tabs" role="tablist" aria-label="ประเภทคำขอ"><button id="incoming-tab" role="tab" aria-controls="requests-list" aria-selected={tab==='incoming'} onClick={()=>setTab('incoming')}><Inbox size={18}/>คำขอถึงทีมของฉัน <span>{pending}</span></button><button id="outgoing-tab" role="tab" aria-controls="requests-list" aria-selected={tab==='outgoing'} onClick={()=>setTab('outgoing')}><ArrowUpRight size={18}/>คำขอที่ฉันส่ง <span>{outgoing.length}</span></button></div>
 <div className="requests-summary">{tab==='incoming'?`คุณมี ${owned.length} ทีม · รอพิจารณา ${pending} คำขอ`:'สถานะคำขอของคุณจะอัปเดตเมื่อหัวหน้าทีมพิจารณา'}</div>
 <div id="requests-list" role="tabpanel" aria-labelledby={tab==='incoming'?'incoming-tab':'outgoing-tab'} className="requests-list">{sorted.map(r=>{
 const t=teams.find(t=>t.id===r.teamId),p=profiles.find(p=>p.id===r.applicantId);if(!t||!p)return null;
 return <article className="request-card" key={r.id}>
 <div className="request-card-heading"><button className="request-team-link" onClick={()=>onTeam(t)}>{t.title}<ArrowUpRight size={16}/></button><span className={`request-status ${r.status}`}>{r.status==='pending'?<Clock3 size={13}/>:r.status==='accepted'?<Check size={13}/>:<X size={13}/>} {requestLabels[r.status]}</span></div>
 {tab==='incoming'?<div className="request-applicant"><img className="avatar" src={p.avatar.startsWith('/avatars')?base+p.avatar:p.avatar} width={52} height={52} alt={`${p.first} ${p.last}`}/><div><h3>{p.first} {p.last}</h3><p>ชั้นปี {p.year} · {p.faculty}</p><div className="tags">{p.skills.map(s=><span key={s}>{s}</span>)}</div></div></div>:<p className="request-description">{t.subtitle}<br/><span><Users size={14}/> สมาชิก {t.members.length}/{t.capacity} คน</span></p>}
 <div className="request-card-footer"><small>ส่งเมื่อ {new Date(r.createdAt).toLocaleString('th-TH',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Bangkok'})}{r.decidedAt&&<span>พิจารณาเมื่อ {new Date(r.decidedAt).toLocaleString('th-TH',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Bangkok'})}</span>}</small><div className="request-buttons">{tab==='incoming'?<><button className="secondary" onClick={()=>onProfile(p.id)}>ดูโปรไฟล์ผู้สมัคร<ArrowUpRight size={15}/></button>{r.status==='pending'&&<><button className="reject-button" onClick={()=>onDecide(r,'rejected')}><X size={16}/>ปฏิเสธ</button><button className="primary" disabled={!isOpen(t)} onClick={()=>onDecide(r,'accepted')}><Check size={16}/>รับเข้าทีม</button></>}</>:<button className="secondary" onClick={()=>onTeam(t)}>ดูรายละเอียดทีม<ArrowUpRight size={15}/></button>}</div></div>
 {tab==='incoming'&&r.status==='pending'&&!isOpen(t)&&<p className="request-unavailable">ทีมเต็มหรืออยู่นอกช่วงรับสมัคร จึงยังรับสมาชิกเพิ่มไม่ได้</p>}
 </article>
 })}{!sorted.length&&<div className="empty"><Inbox size={34}/><h3>{tab==='incoming'?'ยังไม่มีคำขอเข้าทีม':'คุณยังไม่ได้ส่งคำขอ'}</h3><p>{tab==='incoming'?'เมื่อมีเพื่อนสนใจทีมของคุณ คำขอจะแสดงที่นี่':'ค้นหาทีมที่สนใจ แล้วกด “ส่งคำขอเข้าทีม” จากหน้ารายละเอียด'}</p></div>}</div>
 <p className="requests-demo-note">โหมดทดลอง: คำขอและผลการพิจารณาบันทึกเฉพาะเบราว์เซอร์นี้ สามารถสลับบัญชีเพื่อทดลองเป็นผู้สมัครและหัวหน้าทีมได้</p>
 </section>
}
