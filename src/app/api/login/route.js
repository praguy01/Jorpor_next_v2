
import db from '../../../lib/db'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server';
import { useRouter } from 'next/navigation'; // แทนที่ 'next/router'
import { useSession, signIn, signOut } from "next-auth/react"



export async function POST(request)  {
  if (request.method === 'POST') {
    const res = await request.json();
    try {
      const { employee, password } = res;
      console.log("RES_ROUTE: ",res)

      const getUserQuery = "SELECT * FROM users WHERE employee = ?";
      const [userResult] = await db.query(getUserQuery, [employee]);

      console.log("USER_RUSULT: ",userResult)
      if (userResult.length === 0) {
        return NextResponse.json({ success: false, error: 'Account not found. Please register.' });
      }

      const user = userResult[0];
      const storedPassword = user.password;
      console.log("storedPassword: ",storedPassword)
      console.log("Password: ",password)


      const passwordMatch = await bcrypt.compare(password, storedPassword);

      if (!passwordMatch) {
        return NextResponse.json({ success: false, error: 'Invalid password for user ' + employee });
      } else {
        console.log("Login Pass");
        if (typeof window !== 'undefined') {
          // กำหนดให้มีการ redirect
          await signIn("credentials", {
            username: employee,
          });

          
        }

        return NextResponse.json({ success: true, message: 'Login successful.', redirect: '/examine' , profile: userResult});
      }
    } catch (error) {
      console.error('Error login:', error);
      return NextResponse.json({ success: false, error: error.message }, { res });
    }
  } else {
    return NextResponse.error('Method Not Allowed', { res });
  }
}

