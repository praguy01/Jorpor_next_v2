
import db from '../../../lib/db'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server';
import { useRouter } from 'next/navigation'; // แทนที่ 'next/router'
import { useSession, signIn, signOut } from "next-auth/react"



export async function POST(request)  {
  if (request.method === 'POST') {

    const res = await request.json();

    try {
      const {
        newpassword,
        confirmpassword,
        email,
        code
      } = res;

      console.log("RES_ROUTE: ",res);


      const passwordMatch = await bcrypt.compare(confirmpassword, newpassword);

      if (!passwordMatch) {
        return NextResponse.json({ success: false, error: 'รหัสผ่านไม่ตรงกัน' });
      } else {

      const getUserQuery = "SELECT * FROM users WHERE email = ?";
      const [userResult] = await db.query(getUserQuery, [email]);

      console.log("USER CHANGE :",userResult)
      const user = userResult[0];
      const storedPassword = user.password;
      console.log("STORAGE_PASS: " , storedPassword)
      console.log("NEW_PASS: " , confirmpassword)


      const newPasswordMatch = await bcrypt.compare(confirmpassword, storedPassword);


      if (!newPasswordMatch) {
        await db.query('UPDATE users SET password = ? WHERE email = ?', [newpassword, email]);

      } else if (newPasswordMatch) {
        return NextResponse.json({ success: false, error: 'This password has recently been changed.'});
      }

      return NextResponse.json({ success: true, message: 'เปลี่ยนรหัสผ่านแล้ว.', redirect: '/login'});
      }

    } catch (error) {
      console.error('Error change password:', error);
      return NextResponse.json({ success: false, error: error.message }, { res });
    }
  } else {
    return NextResponse.error('Method Not Allowed', { res });
  }
}

