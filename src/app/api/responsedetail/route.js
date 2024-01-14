import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const fs = require('fs');
  if (request.method === 'POST') {
    
    const res = await request.json();
    try {
console.log("RESS11: ",res)

    if (res.submit_role_3) {
      try {

        const getQuery = `
          UPDATE notify
          SET 
            Verification_status = ?
          WHERE id = ?`;

        const [responseResult] = await db.query(getQuery, [res.id,3]);

        console.log("Result: ", responseResult);

        if (responseResult.affectedRows > 0) {
          console.log("UPdate pass");

          // อัปเดตข้อมูลสำเร็จ
          // ส่งข้อมูลผู้ใช้งานที่อัปเดตแล้วกลับไปยัง client
          // const updatedUserQuery = "SELECT * FROM users WHERE id = ?";
          // const [updatedUser] = await db.query(updatedUserQuery, [id]);
        
          return NextResponse.json({ success: true , message: 'successfully!' , redirect: '/response_role_3'});
        } else {
            return NextResponse.json({success: false,message: 'approve failed',
          });
        }
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }

    
    if (res.submit_role_2) {
      try {

        const getQuery = `
          UPDATE notify
          SET 
            Verification_status = ?
          WHERE id = ?`;

        const [responseResult] = await db.query(getQuery, [res.id,2]);

        console.log("Result: ", responseResult);

        if (responseResult.affectedRows > 0) {
          console.log("UPdate pass");

          // อัปเดตข้อมูลสำเร็จ
          // ส่งข้อมูลผู้ใช้งานที่อัปเดตแล้วกลับไปยัง client
          // const updatedUserQuery = "SELECT * FROM users WHERE id = ?";
          // const [updatedUser] = await db.query(updatedUserQuery, [id]);
        
          return NextResponse.json({ success: true , message: 'successfully!' , redirect: '/response_role_2'});
        } else {
            return NextResponse.json({success: false,message: 'approve failed',
          });
        }
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }

    return NextResponse.json({ success: true });

    } catch (error) {
      console.error('Error notify:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}


