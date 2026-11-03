import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'CUprofile — Find your people. Build something great.', description: 'พื้นที่หาทีมและเพื่อนร่วมโปรเจกต์สำหรับนิสิตจุฬาฯ' };
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="th"><body>{children}</body></html>}
