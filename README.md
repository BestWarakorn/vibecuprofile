# CUprofile
พื้นที่หาทีมแข่งขันและเพื่อนร่วมโปรเจกต์สำหรับนิสิตจุฬาฯ

Tech stack ตามเอกสาร: **Next.js + TypeScript + Tailwind CSS**, **Express.js**; เตรียม schema สำหรับ **Supabase PostgreSQL**

## เริ่มใช้งาน
```sh
npm ci
npm run dev
```
เปิด http://localhost:3000 — UI ภาษาไทย รองรับมือถือ
```sh
npm run typecheck
npm test
npm run build
npm run api
```
Express API แยกที่ http://localhost:4000/api/health, /api/profiles, /api/teams

## ฟังก์ชัน
- ฟีดพร้อมตัวกรองประเภทและค้นหาทักษะ รายละเอียดทีม สมาชิก วันที่ สถานที่ และอีเมลติดต่อ
- สร้างทีม ตรวจสอบช่วงวันและจำนวนสมาชิก เข้าร่วมทีมเมื่อยังรับสมัครและมีที่ว่าง
- ค้นหานิสิตจากชื่อ นามสกุล ชื่อเล่น พร้อมตัวกรองคณะและชั้นปีที่แสดงเป็น tags กดล้างได้
- โปรไฟล์ครบทั้งความถนัด ความสนใจ สไตล์การทำงาน เพื่อนร่วมทีมที่ต้องการ โปรเจกต์ที่เข้าร่วมและเปิดรับ
- แก้ไขโปรไฟล์ตนเอง รวม URL รูปโปรไฟล์ บันทึกทีม และสมัครสมาชิก/เข้าสู่ระบบจำลอง
- นิสิตจำลอง 10 คน หัวหน้าทีม 3 คน แต่ละคนเปิดทีม 1 ทีม รวม 3 ทีม

## บัญชีทดลอง
ดู `DEMO_ACCOUNTS.csv` ใช้ cu01 / CuDemo01! เป็นต้น
บัญชีทั้งหมดเป็นบุคคลและข้อมูลสมมติ อีเมล example.com ส่งจริงไม่ได้
**Demo only:** ไม่มี OAuth หรือ Supabase Auth เก็บบัญชีทดลอง รหัสผ่านทดลอง และข้อมูลที่เปลี่ยนใน localStorage ของเบราว์เซอร์นี้ ข้อมูลไม่แชร์ข้ามเครื่อง ไม่ใช้รหัสผ่านจริงกับการทดลอง ล้าง site storage เพื่อรีเซ็ตข้อมูล เริ่มต้นแบบไม่เข้าสู่ระบบ

## Supabase (เตรียมไว้ ยังไม่เชื่อม UI)
1. สร้าง Supabase project แล้วรัน `supabase/schema.sql` ผ่าน SQL Editor หนึ่งครั้ง แล้วรัน `supabase/seed.sql` เพื่อเพิ่มข้อมูลจำลอง
2. คัดลอก `.env.example` เป็น `.env` ใส่ URL และ anon/publishable key
3. รัน `node --env-file=.env --import tsx server/index.ts` จะเปิด Express API แบบอ่านจาก Supabase เมื่อมี key หากไม่ตั้งค่าจะอ่านข้อมูลตัวอย่าง
4. SQL มี RLS และอนุญาตอ่านอย่างเดียว ไม่เก็บรหัสผ่าน demo ในฐานข้อมูล
5. ก่อนเปิดระบบจริง ต้องเชื่อม Supabase Auth, ผูก auth_user_id, เพิ่ม mutation API พร้อมตรวจสิทธิ์และ transaction จำกัดจำนวนสมาชิก แล้วเปลี่ยน frontend data layer จาก localStorage ไป API ขณะนี้ UI ใช้ localStorage โดยเจตนา แม้ตั้งค่า key ให้ API แล้วก็ตาม

## เผยแพร่บน GitHub Pages
Next.js ใช้ static export (`out/`) จึงทำงานบน GitHub Pages ได้ โดย Express ไม่รันบน Pages ต้อง deploy แยกเมื่อเริ่มเชื่อมระบบจริง
- ใน GitHub Settings → Pages → Source เลือก GitHub Actions
- Push ไป main เพื่อรัน `.github/workflows/deploy.yml`
- Workflow ตั้ง base path จากชื่อ repo และรัน typecheck, tests, build ก่อน deploy
- ถ้ารัน build สำหรับ Pages เอง: `NEXT_PUBLIC_BASE_PATH=/vibecuprofile npm run build`

อ้างอิง: [Next.js static export](https://nextjs.org/docs/app/guides/static-exports), [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).
