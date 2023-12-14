import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const fs = require('fs');
  if (request.method === 'POST') {
    
    const res = await request.json();
    try {
console.log("RESS11: ",res)

    if (res.submit_row_3) {
      try {

        const getQuery = `
          UPDATE notify
          SET 
            Verification_status = 'Evalution'
          WHERE id = ?`;

        const [responseResult] = await db.query(getQuery, [res.id]);

        console.log("Result: ", responseResult);

        if (responseResult.affectedRows > 0) {
          console.log("UPdate pass");

          // อัปเดตข้อมูลสำเร็จ
          // ส่งข้อมูลผู้ใช้งานที่อัปเดตแล้วกลับไปยัง client
          // const updatedUserQuery = "SELECT * FROM users WHERE id = ?";
          // const [updatedUser] = await db.query(updatedUserQuery, [id]);
        
          return NextResponse.json({ success: true , message: 'successfully!' , redirect: '/response_row_3'});
        } else {
            return NextResponse.json({success: false,message: 'approve failed',
          });
        }
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }

    
    if (res.submit_row_3) {
      try {

        const getQuery = `
          UPDATE notify
          SET 
            Verification_status = 'Approve'
          WHERE id = ?`;

        const [responseResult] = await db.query(getQuery, [res.id]);

        console.log("Result: ", responseResult);

        if (responseResult.affectedRows > 0) {
          console.log("UPdate pass");

          // อัปเดตข้อมูลสำเร็จ
          // ส่งข้อมูลผู้ใช้งานที่อัปเดตแล้วกลับไปยัง client
          // const updatedUserQuery = "SELECT * FROM users WHERE id = ?";
          // const [updatedUser] = await db.query(updatedUserQuery, [id]);
        
          return NextResponse.json({ success: true , message: 'successfully!' , redirect: '/response_row_3'});
        } else {
            return NextResponse.json({success: false,message: 'approve failed',
          });
        }
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }

    
    } catch (error) {
      console.error('Error notify:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}


