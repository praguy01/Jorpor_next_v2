import db from '../../../lib/db';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';


export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    
    try {
      const checkEmailQuery = "SELECT COUNT(*) AS emailCount FROM users WHERE email = ?";
      const [emailCountResult] = await db.query(checkEmailQuery, [res.email]);

      if (emailCountResult[0].emailCount === 0) {
        return NextResponse.json({ success: false, error: 'Account not found.' }, { res });
      }

      // ส่งอีเมล์ไปยังอีเมล์ผู้ใช้เพื่อยืนยันการเปลี่ยนรหัสผ่าน
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // สร้างรหัสยืนยันแบบสุ่ม 6 ตัว
      const confirmationCode = Math.floor(100000 + Math.random() * 900000);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: res.email,
        subject: 'ยืนยันการเปลี่ยนรหัสผ่าน',
        text: `รหัสยืนยัน: ${confirmationCode}`,
      };

      await transporter.sendMail(mailOptions);

      // บันทึกรหัสยืนยันลงในฐานข้อมูล หรือส่งไปยังส่วนที่เกี่ยวข้องกับการยืนยัน

      return NextResponse.json({ success: true, message: 'ส่งรหัสยืนยันสำเร็จ', redirect: '/confirm' , email: res.email ,PIN: confirmationCode });
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการส่งอีเมล์:', error);
      return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการส่งอีเมล์' }, { res });
    }
  } else {
    return NextResponse.json('Method not allowed', { res });
  }
}
