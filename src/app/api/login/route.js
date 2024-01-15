
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
      
      const checkemployeeQuery1 = "SELECT COUNT(*) AS employeeCount FROM users WHERE employee = ?";
      const [employeeCountResult1] = await db.query(checkemployeeQuery1, [res.formData.employee]);
      
      const checkemployeeQuery2 = "SELECT COUNT(*) AS employeeCount FROM users_r2 WHERE employee = ?";
      const [employeeCountResult2] = await db.query(checkemployeeQuery2, [res.formData.employee]);
      
      const checkemployeeQuery3 = "SELECT COUNT(*) AS employeeCount FROM users_r3 WHERE employee = ?";
      const [employeeCountResult3] = await db.query(checkemployeeQuery3, [res.formData.employee]);
      
      let userEmployeeTable = false;
      let foundInTable = '';
      let userResult = null; // Initialize to null
      
      if (employeeCountResult1[0].employeeCount > 0) {
        foundInTable = 'users';
        userEmployeeTable = true;
      } else if (employeeCountResult2[0].employeeCount > 0) {
        foundInTable = 'users_r2';
        userEmployeeTable = true;
      } else if (employeeCountResult3[0].employeeCount > 0) {
        foundInTable = 'users_r3';
        userEmployeeTable = true;
      }
      
      if (userEmployeeTable) {
        const getUserQuery = `SELECT * FROM ${foundInTable} WHERE employee = ?`;
        const [userQueryResult] = await db.query(getUserQuery, [res.formData.employee]);
        userResult = userQueryResult[0]; // Assign the result to the outer-scope variable
        console.log("88888888888888:", userResult, userResult?.position);
      }
      
      console.log("User comes from table:", userEmployeeTable, userResult);
      
      if (!userEmployeeTable) {
        return NextResponse.json({ success: false, error: 'Account not found. Please register.' });
      }
      
    
      
  //     const getUserQuery = "SELECT * FROM users WHERE employee = ?";
  //     let [userResult] = await db.query(getUserQuery, [res.formData.employee]);
      
  //     console.log("USER_RESULT33333: ", userResult);
  
  //     if (userResult.length === 0) {
  //         console.log("///////////////////////////");
  
  //         const getUserQueryR2 = "SELECT * FROM users_r2 WHERE employee = ?";
  //         const [userResultR2] = await db.query(getUserQueryR2, [res.formData.employee]);
  //         console.log("USER2_RESULT11111111: ", userResultR2);
  //         if (userResultR2.length > 0) {
  //           position = userResultR2[0].position;
  //           userResult = userResultR2;
  //     }}
  // console.log("dddddddddd: ",userResult)
  //         if (userResult.length === 0) {
  //           console.log("++++++++++++++++++++++");
  //             const getUserQueryR3 = "SELECT * FROM users_r3 WHERE employee = ?";
  //             const [userResultR3] = await db.query(getUserQueryR3, [res.formData.employee]);
  //             console.log("USER3_RESULT1777777: ", userResultR3);
  //             position = userResultR3[0].position;
  //             userResult = userResultR3;
  
  //             if (userResultR3.length === 0) {
  //               return NextResponse.json({ success: false, error: 'Account not found. Please register.' });
  //             }
          
         
  //     }
  
      console.log("oooooooooooooooo: ", userResult);
  
      const storedPassword = userResult.password;
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

        if (userResult.position === 'Safety Officer Professional level '){
          console.log("111111")
          return NextResponse.json({ success: true, message: 'Login successful.', redirect: '/select' , profile: [userResult] ,token});
        } else if (userResult.position === 'Safety Officer Technical level'){
          console.log("22222")
          return NextResponse.json({ success: true, message: 'Login successful.', redirect: '/report_role_2' , profile: [userResult] ,token});
        } else if (userResult.position === 'Safety Officer Supervisory level'){
          return NextResponse.json({ success: true, message: 'Login successful.', redirect: '/report_role_3' , profile: [userResult] ,token});
        } 
        
      }

    }

    try {
      console.log("RES_ROUTE******************: ", res);
      const checkemployeeQuery1 = "SELECT COUNT(*) AS employeeCount FROM users WHERE employee = ?";
      const [employeeCountResult1] = await db.query(checkemployeeQuery1, [res.formData.employee]);

      const checkemployeeQuery2 = "SELECT COUNT(*) AS employeeCount FROM users_r2 WHERE employee = ?";
      const [employeeCountResult2] = await db.query(checkemployeeQuery2, [res.formData.employee]);

      const checkemployeeQuery3 = "SELECT COUNT(*) AS employeeCount FROM users_r3 WHERE employee = ?";
      const [employeeCountResult3] = await db.query(checkemployeeQuery3, [res.formData.employee]);

      let userEmployeeTable = false;
      let foundInTable = '';
      let userResult = null; // Initialize to null

      if (employeeCountResult1[0].employeeCount > 0) {
        foundInTable = 'users';
        userEmployeeTable = true;
      } else if (employeeCountResult2[0].employeeCount > 0) {
        foundInTable = 'users_r2';
        userEmployeeTable = true;
      } else if (employeeCountResult3[0].employeeCount > 0) {
        foundInTable = 'users_r3';
        userEmployeeTable = true;
      }

      if (userEmployeeTable) {
        const getUserQuery = `SELECT * FROM ${foundInTable} WHERE employee = ?`;
        const [userQueryResult] = await db.query(getUserQuery, [res.formData.employee]);
        userResult = userQueryResult[0]; // Assign the result to the outer-scope variable
        console.log("88888888888888:", userResult, userResult?.position);
      }

      console.log("User comes from table:", userEmployeeTable, userResult);

      if (!userEmployeeTable) {
        return NextResponse.json({ success: false, error: 'Account not found. Please register.' });
      }

         
  
      console.log("oooooooooooooooo: ", userResult);
  
      const storedPassword = userResult.password;
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
        
                if (userResult.position === 'Safety Officer Professional level '){
                  console.log("111111")
                  return NextResponse.json({ success: true, message: 'Login successful.', redirect: '/select' , profile: [userResult] ,token});
                } else if (userResult.position === 'Safety Officer Technical level'){
                  console.log("22222")
                  return NextResponse.json({ success: true, message: 'Login successful.', redirect: '/report_role_2' , profile: [userResult] ,token});
                } else if (userResult.position === 'Safety Officer Supervisory level'){
                  return NextResponse.json({ success: true, message: 'Login successful.', redirect: '/report_role_3' , profile: [userResult] ,token});
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
        
        console.log("POSITION/////: ", userResult.position ,[userResult]);

        if (userResult.position === 'Safety Officer Professional level') {
          console.log("111111");
          return NextResponse.json({ success: true, message: 'Login successful.', redirect: '/select', profile: [userResult], token });
        } else if (userResult.position === 'Safety Officer Technical level') {
          console.log("22222");
          return NextResponse.json({ success: true, message: 'Login successful.', redirect: '/report_role_2', profile: [userResult], token });
        } else if (userResult.position === 'Safety Officer Supervisory level') {
          console.log("33333");
          return NextResponse.json({ success: true, message: 'Login successful.', redirect: '/report_role_3', profile: [userResult], token });
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

