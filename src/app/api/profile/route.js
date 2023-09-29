import db from '../../../lib/db';
import { NextResponse } from 'next/server';


export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    
    try {
      const {
        id,
        employee,
        name,
        lastname,
        position,
        phone,
        line,
        email
      } = res;
      console.log("RES.Route profile: ", res);

      const getUserQuery = "SELECT * FROM users WHERE id = ?";
      const [userResult] = await db.query(getUserQuery, [id]);

      if (userResult) {
        // ค้นพบข้อมูลผู้ใช้งาน ดังนั้นเราจะตรวจสอบการเปลี่ยนแปลง
        if (res.edit) {
          // มีการเปลี่ยนแปลง ดังนั้นเราจะทำการอัปเดตข้อมูล
          const updateQuery = `
            UPDATE users
            SET
              name = ?,
              lastname = ?,
              position = ?,
              phone = ?,
              line = ?,
              email = ?
            WHERE
              id = ?
          `;
  
          const updatedUserResult = await db.query(updateQuery, [
            name,
            lastname,
            position,
            phone,
            line,
            email,
            id,
          ]);
          
          console.log('update: ',updatedUserResult)
          console.log('Afterrow: ',updatedUserResult[0].affectedRows)

          if (updatedUserResult[0].affectedRows > 0) {
            // อัปเดตข้อมูลสำเร็จ
            // ส่งข้อมูลผู้ใช้งานที่อัปเดตแล้วกลับไปยัง client
            const updatedUserQuery = "SELECT * FROM users WHERE id = ?";
            const [updatedUser] = await db.query(updatedUserQuery, [id]);
            
            return NextResponse.json({success: true ,message: 'User updated successfully',profile: updatedUser,
            });
          } else {
            return NextResponse.json({success: false,message: 'User update failed',
            });
          }
        } else {
          // ไม่มีการเปลี่ยนแปลง ส่งข้อมูลผู้ใช้งานกลับไปยัง client
          return NextResponse.json({ success: true,  message: 'No changes detected', profile: userResult,
          });
        }
          
        
      } else {
        // ถ้าไม่พบข้อมูลผู้ใช้งาน
        return NextResponse.json({ success: false, message: 'User not found' });
      }
    } catch (error) {
      console.error('Error Profile:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  } 
}