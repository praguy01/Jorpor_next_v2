
import db from '../../../lib/db'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server';
import { useRouter } from 'next/navigation'; // แทนที่ 'next/router'
import { useSession, signIn, signOut } from "next-auth/react"
import jwt from 'jsonwebtoken';



export async function POST(request)  {
  if (request.method === 'POST') {
    const res = await request.json();
    console.log("RES-----------------: ",res)

    if (res.rememberPassword) {
      
      let position = '';
      
      const getUserQuery = "SELECT * FROM users WHERE employee = ?";
      let [userResult] = await db.query(getUserQuery, [res.formData.employee]);
      
      console.log("USER_RESULT33333: ", userResult);
  
      if (userResult.length === 0) {
          console.log("///////////////////////////");
  
          const getUserQueryR2 = "SELECT * FROM users_r2 WHERE employee = ?";
          const [userResultR2] = await db.query(getUserQueryR2, [res.formData.employee]);
          console.log("USER2_RESULT11111111: ", userResultR2);
          if (userResultR2.length > 0) {
            position = userResultR2[0].position;
            userResult = userResultR2;
      }}
  console.log("dddddddddd: ",userResult)
          if (userResult.length === 0) {
            console.log("++++++++++++++++++++++");
              const getUserQueryR3 = "SELECT * FROM users_r3 WHERE employee = ?";
              const [userResultR3] = await db.query(getUserQueryR3, [res.formData.employee]);
              console.log("USER3_RESULT1777777: ", userResultR3);
              position = userResultR3[0].position;
              userResult = userResultR3;
  
              if (userResultR3.length === 0) {
                return NextResponse.json({ success: false, error: 'Account not found. Please register.' });
              }
          
         
      }
  
      console.log("oooooooooooooooo: ", userResult);
  
      const storedPassword = userResult[0].password;
      console.log("storedPassword: ", storedPassword);


      const passwordMatch = await bcrypt.compare(res.formData.password, storedPassword);

      if (!passwordMatch) {
        return NextResponse.json({ success: false, error: 'Invalid password for user ' + res.formData.employee });
      } else if (passwordMatch) {
        console.log("Login Pass");
       
        const currentTimestamp = Math.floor(Date.now() / 1000);

        const tokenPayload = {
          employee: res.rememberPassword ?   '' : res.formData.employee,          
          password: res.rememberPassword ?  '' : res.formData.password , 
          rememberPassword: true,
          exp: currentTimestamp + 86400, 
          iat: currentTimestamp 

        };

        console.log("0000000: ",res.formData.employee)

        const token = jwt.sign(tokenPayload, 'user_login');

        if (userResult[0].position === 'Safety Officer Professional level '){
          console.log("111111")
          return NextResponse.json({ success: true, message: 'Login successful.', redirect: '/select' , profile: userResult ,token});
        } else if (userResult[0].position === 'Safety Officer Technical level'){
          console.log("22222")
          return NextResponse.json({ success: true, message: 'Login successful.', redirect: '/report_role_2' , profile: userResult ,token});
        } else if (userResult[0].position === 'Safety Officer Supervisory level'){
          return NextResponse.json({ success: true, message: 'Login successful.', redirect: '/report_role_3' , profile: userResult ,token});
        } 
        
      }

    }

    try {
      console.log("RES_ROUTE******************: ", res);
      let position = '';
      
      const getUserQuery = "SELECT * FROM users WHERE employee = ?";
      let [userResult] = await db.query(getUserQuery, [res.formData.employee]);
      
      console.log("USER_RESULT33333: ", userResult);
  
      if (userResult.length === 0) {
          console.log("///////////////////////////", res.employee);
  
          const getUserQueryR2 = "SELECT * FROM users_r2 WHERE employee = ?";
          const [userResultR2] = await db.query(getUserQueryR2, [res.formData.employee]);
          console.log("USER2_RESULT11111111: ", userResultR2[0]);
          if (userResultR2.length > 0) {
            position = userResultR2[0].position;
            userResult = userResultR2;
        }}
      
  
          if (userResult.length === 0) {
              console.log("++++++++++++++++++++++");
              const getUserQueryR3 = "SELECT * FROM users_r3 WHERE employee = ?";
              const [userResultR3] = await db.query(getUserQueryR3, [res.formData.employee]);
              console.log("USER3_RESULT177777: ", userResultR3);
              position = userResultR3[0].position;
              userResult = userResultR3;
  
              if (userResultR3.length === 0) {
                  return NextResponse.json({ success: false, error: 'Account not found. Please register.' });
              }
          }
         
  
      console.log("oooooooooooooooo: ", userResult);
  
      const storedPassword = userResult[0].password;
      console.log("storedPassword: ", storedPassword);


      const passwordMatch = await bcrypt.compare(res.formData.password, storedPassword);

      if (!passwordMatch) {
        return NextResponse.json({ success: false, error: 'Invalid password for user ' + res.formData.employee });
      } else if (passwordMatch) {
        console.log("Login Pass");
        if (typeof window !== 'undefined') {
          // กำหนดให้มีการ redirect
          await signIn("credentials", {
            username: employee,
          });

          
        }
        console.log("ddddd: ",res.rememberedDataArray)
        if (res.remember) {
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
        
                if (position === 'Safety Officer Professional level '){
                  console.log("111111")
                  return NextResponse.json({ success: true, message: 'Login successful.', redirect: '/select' , profile: userResult ,token});
                } else if (position === 'Safety Officer Technical level'){
                  console.log("22222")
                  return NextResponse.json({ success: true, message: 'Login successful.', redirect: '/report_role_2' , profile: userResult ,token});
                } else if (position === 'Safety Officer Supervisory level'){
                  return NextResponse.json({ success: true, message: 'Login successful.', redirect: '/report_role_3' , profile: userResult ,token});
                }               }
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
        
        console.log("POSITION/////: ", userResult[0].position);
        const position = userResult[0].position.trim(); // Use trim() to remove leading/trailing spaces
        console.log("POSITION/////+++++: ", position);

        if (position === 'Safety Officer Professional level') {
          console.log("111111");
          return NextResponse.json({ success: true, message: 'Login successful.', redirect: '/select', profile: userResult, token });
        } else if (position === 'Safety Officer Technical level') {
          console.log("22222");
          return NextResponse.json({ success: true, message: 'Login successful.', redirect: '/report_role_2', profile: userResult, token });
        } else if (position === 'Safety Officer Supervisory level') {
          console.log("33333");
          return NextResponse.json({ success: true, message: 'Login successful.', redirect: '/report_role_3', profile: userResult, token });
        }
            
      }

    } catch (error) {
      console.error('Error login:', error);
      return NextResponse.json({ success: false, error: error.message }, { res });
    }
  } else {
    return NextResponse.error('Method Not Allowed', { res });
  }
  return NextResponse.json({ success: false, error: 'Login failed ' });

}

