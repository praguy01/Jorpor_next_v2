import db from '../../../lib/db';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request)  {
  if (request.method === 'POST') {
    const res = await request.json();

    if (res.confirm) {
      try {
        const {
          PIN_confirm,
          PIN,
        } = res;
  

      console.log("JSON.DATA route: ", res);
      
      if (PIN_confirm === PIN) {
         

        const insertSql = "INSERT INTO users (name, lastname, email, position, employee, password) VALUES (?, ?, ?, ?, ?, ?)";
        const insertValues = [res.requestDataUser.name, res.requestDataUser.last_name, res.requestDataUser.email, res.requestDataUser.position, res.requestDataUser.employee, res.requestDataUser.password];
        const result = await db.query(insertSql, insertValues);

        console.log("result :",result);
        console.log("result.affectedRows :",result[0].affectedRows);


        if (result[0].affectedRows === 1) {
          const insertedId = result.insertId;
          return NextResponse.json({ success: true, id: insertedId ,redirect: '/login'}, { res });

        } else {
          return NextResponse.json({ success: false, error: 'Failed to insert user data' }, { res });
        }
      } else {
        return NextResponse.json({ success: false, error: 'รหัสผ่านไม่ตรงกัน' });
      }
    }
  catch (error) {
      console.error('Error registering:', error);
      return NextResponse.json({ success: false, error: error.message }, { res });
    }
  } 

    try {
      const data = JSON.parse(res.data); 

      const {
        name,
        last_name,
        email,
        position,
        employee,
        password,
      } = data;

      console.log("ress: ",data)

      const checkEmailQuery = "SELECT COUNT(*) AS emailCount FROM users WHERE email = ?";
      const [emailCountResult] = await db.query(checkEmailQuery, [data.email]);
      console.log("emailCountResult: ", emailCountResult);

      const checkemployeeQuery = "SELECT COUNT(*) AS employeeCount FROM users WHERE employee = ?";
      const [employeeCountResult] = await db.query(checkemployeeQuery, [data.employee]);
      console.log("employeeCountResult: ", employeeCountResult);

      if (emailCountResult[0].emailCount > 0) {
        return NextResponse.json({ success: false, error: 'Email is already in use.' }, { res });
      } else if (employeeCountResult[0].employeeCount > 0) {
        return NextResponse.json({ success: false, error: 'Employee is already in use.' }, { res });
      }


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
        to: data.email,
        subject: 'ยืนยันการเปลี่ยนรหัสผ่าน',
        text: `รหัสยืนยัน: ${confirmationCode}`,
      };

      await transporter.sendMail(mailOptions);

      // บันทึกรหัสยืนยันลงในฐานข้อมูล หรือส่งไปยังส่วนที่เกี่ยวข้องกับการยืนยัน

      return NextResponse.json({ success: true, message: 'รหัสผ่านได้ถูกส่งไปยังอีเมลของคุณแล้ว โปรดยืยยันรหัสผ่าน', email: data.email ,PINconfirm: confirmationCode });
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการส่งอีเมล์:', error);
      return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการส่งอีเมล์' }, { res });
    }

     
    } 

}
