
import db from '../../../lib/db'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server';
import { useRouter } from 'next/navigation'; // แทนที่ 'next/router'
import { useSession, signIn, signOut } from "next-auth/react"
import jwt from 'jsonwebtoken';



export async function POST(request)  {
  if (request.method === 'POST') {
    const res = await request.json();
    console.log("RES: 0",res)

    if (res.remember) {
      
      const getUserQuery = "SELECT * FROM users WHERE employee = ?";
      const [userResult] = await db.query(getUserQuery, [res.employee]);

      console.log("USER_RUSULT: ",userResult)
      if (userResult.length === 0) {
        return NextResponse.json({ success: false, error: 'Account not found. Please register.' });
      }

      const user = userResult[0];
      const storedPassword = user.password;
      console.log("storedPassword: ",storedPassword)
      console.log("Password: ",res.password)


      const passwordMatch = await bcrypt.compare(res.password, storedPassword);

      if (!passwordMatch) {
        return NextResponse.json({ success: false, error: 'Invalid password for user ' + res.employee });
      } else {
        console.log("Login Pass");
       
        const tokenPayload = {
          employee: res.rememberPassword ?   '' : res.employee,          
          password: res.rememberPassword ?  '' : res.password , 
          rememberPassword: true,
          exp: Math.floor(res.oldTokemExp) + 86400, 
          iat: Math.floor(Date.now() / 1000) 

        };

        console.log("0000000: ",res.employee)

        const token = jwt.sign(tokenPayload, 'user_login');

        return NextResponse.json({ success: true, message: 'Login successful.', redirect: '/examineList' , profile: userResult ,token});
      }

    }

    try {
      const { employee, password } = res;
      console.log("RES_ROUTE: ",res)

      const getUserQuery = "SELECT * FROM users WHERE employee = ?";
      const [userResult] = await db.query(getUserQuery, [res.formData.employee]);

      console.log("USER_RUSULT: ",userResult)
      if (userResult.length === 0) {
        return NextResponse.json({ success: false, error: 'Account not found. Please register.' });
      }

      const user = userResult[0];
      const storedPassword = user.password;
      console.log("storedPassword: ",storedPassword)
      console.log("Password: ",res.formData.password)


      const passwordMatch = await bcrypt.compare(res.formData.password, storedPassword);

      if (!passwordMatch) {
        return NextResponse.json({ success: false, error: 'Invalid password for user ' + res.formData.employee });
      } else {
        console.log("Login Pass");
        if (typeof window !== 'undefined') {
          // กำหนดให้มีการ redirect
          await signIn("credentials", {
            username: employee,
          });

          
        }
        console.log("ddddd: ",res.rememberedDataArray)
        if (res.rememberedDataArray) {
          for (const item of res.rememberedDataArray) {
            if (item.hasOwnProperty('employee')) {
              console.log("TTTT ", res.formData.employee)
              console.log("oooo ", item.employee)
              if (res.formData.employee === item.employee) {
                const tokenPayload = {
                  employee: res.formData.employee,
                  password: res.formData.password,
                  rememberPassword: true,
                  exp: Math.floor(Date.now() / 1000) + 86400, // 1 ชั่วโมงหลังจากนี้ (ในรูปแบบของ UNIX timestamp)
                  iat: Math.floor(Date.now() / 1000) // เวลาปัจจุบัน (ในรูปแบบของ UNIX timestamp)
                };
                console.log("88788: ", tokenPayload)
        
                const token = jwt.sign(tokenPayload, 'user_login');
        
                return NextResponse.json({ success: true, message: 'Login successful.', redirect: '/examineList', profile: userResult, token });
              }
            }
          }
        }
        
        const tokenPayload = {
          employee: res.rememberPassword ? res.formData.employee : '',
          password: res.rememberPassword ? res.formData.password : '',
          rememberPassword: res.rememberPassword,
          exp: Math.floor(Date.now() / 1000) + 86400, // 1 ชั่วโมงหลังจากนี้ (ในรูปแบบของ UNIX timestamp)
          iat: Math.floor(Date.now() / 1000) // เวลาปัจจุบัน (ในรูปแบบของ UNIX timestamp)
        };
        console.log("0000000: ", tokenPayload)
        
        const token = jwt.sign(tokenPayload, 'user_login');
        
        return NextResponse.json({ success: true, message: 'Login successful.', redirect: '/examineList', profile: userResult, token });
        
      }

    } catch (error) {
      console.error('Error login:', error);
      return NextResponse.json({ success: false, error: error.message }, { res });
    }
  } else {
    return NextResponse.error('Method Not Allowed', { res });
  }
}

