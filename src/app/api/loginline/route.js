import db from '../../../lib/db'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server';
//import { useRouter } from 'next/navigation'; // แทนที่ 'next/router'
//import { useSession, signIn, signOut } from "next-auth/react"
import jwt from 'jsonwebtoken';
import { Client } from '@line/bot-sdk';

const client = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.SECRETCODE
});

export async function POST(request)  {
  if (request.method === 'POST') {
    const res = await request.json();
    if (!res.formData || !res.formData.employee || !res.formData.password) {
  return NextResponse.json({ success: false, error: 'Invalid form data' });
}

    console.log("RES-----------------: ",res )

    try{
      //console.log("RES_ROUTE******************: ", res);
      const checkemployeeQuery1 = "SELECT COUNT(*) AS employeeCount FROM users WHERE employee = ?";
      const [employeeCountResult1] = await db.query(checkemployeeQuery1, [res.formData.employee]);
    
      const checkemployeeQuery2 = "SELECT COUNT(*) AS employeeCount FROM users_r2 WHERE employee = ?";
      const [employeeCountResult2] = await db.query(checkemployeeQuery2, [res.formData.employee]);
    
      const checkemployeeQuery3 = "SELECT COUNT(*) AS employeeCount FROM users_r3 WHERE employee = ?";
      const [employeeCountResult3] = await db.query(checkemployeeQuery3, [res.formData.employee]);
    
      let userEmployeeTable = false;
      let foundInTable = '';
      let userResult = null; // Initialize to null
      //let newuserResult = null;

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
        const getUserQuery = `SELECT * FROM ${foundInTable} WHERE employee = ? `;
        const [userQueryResult] = await db.query(getUserQuery, [res.formData.employee]);
        userResult = userQueryResult[0]; // Assign the result to the outer-scope variable
        console.log("User found88888888888888:", userResult)
        //console.log("88888888888888:", userResult, userResult?.position);
        // const getUserResult = `SELECT * FROM ${foundInTable} WHERE password = ? `;
        // const [userResultnew] = await db.query(getUserResult, [res.formData.password]);
        // newuserResult = userResultnew[0];
        // console.log("88888888888888:", userResult, newuserResult ,userResult?.position);
        // console.log("8888888ssghsh8888888:",  newuserResult ,userResult?.position);
  
         
      }
      
      // console.log("User comes from table:", userEmployeeTable, userResult);
    
      if (!userEmployeeTable) {
        return NextResponse.json({ success: false, error: 'Account not found. Please register.' });
      }
      
      const storedPassword = userResult.password;
      if (!userResult) {
        return NextResponse.json({ success: false, error: 'User data not found' });
      }
      console.log("storedPassword: ", userResult);

      const passwordMatch = await bcrypt.compare(res.formData.password, storedPassword);
      console.log("stored ", passwordMatch);
    
      if (!passwordMatch) {
        return NextResponse.json({ success: false, error: 'Invalid password for user ' + res.formData.employee });
      } else if (passwordMatch) {
        // console.log("Login Pass"); 
        if (employeeCountResult1[0].employeeCount > 0) {
          foundInTable = 'users';
          userEmployeeTable = true;
          const updatelineidSql = "UPDATE users SET lineUserId = ? WHERE employee = ?";
          await db.query(updatelineidSql, [res.formData.lineUserId, res.formData.employee ]);
          console.log('line',res.formData.lineUserId);
      
          
        } else if (employeeCountResult2[0].employeeCount > 0) {
          foundInTable = 'users_r2';
          userEmployeeTable = true;
          const updatelineidSql = "UPDATE users_r2 SET lineUserId = ? WHERE employee = ? ";
          await db.query(updatelineidSql, [res.formData.lineUserId, res.formData.employee ]);
          console.log('line',res.formData.lineUserId);
      
        } else if (employeeCountResult3[0].employeeCount > 0) {
          foundInTable = 'users_r3';
          userEmployeeTable = true;
          const updatelineidSql = "UPDATE users_r3 SET lineUserId = ? WHERE employee = ?";
          await db.query(updatelineidSql, [res.formData.lineUserId, res.formData.employee]);
          console.log('line',res.formData.lineUserId); 

      
        }
        const tokenPayload = {
          employee:  res.formData.employee ,
          password:  res.formData.password ,
          rememberPassword: res.rememberPassword,
          user_id: userResult.id,
          lineUserId:userResult.lineUserId,
          exp: Math.floor(Date.now() / 1000) + 86400, // 1 ชั่วโมงหลังจากนี้ (ในรูปแบบของ UNIX timestamp)
         iat: Math.floor(Date.now() / 1000) // เวลาปัจจุบัน (ในรูปแบบของ UNIX timestamp)
         };
  

      
        const token = jwt.sign(tokenPayload, 'user_login');
        
        console.log("POSITION/////9999999: ",tokenPayload,token, [userResult])

        const richMenuIds = {
          'Safety Officer Professional level': 'richmenu-36be0a19f8f4b0618e173213f48ad36d',
          'Safety Officer Technical level': 'richmenu-36be0a19f8f4b0618e173213f48ad36d',
          'Safety Officer Supervisory level': 'richmenu-36be0a19f8f4b0618e173213f48ad36d'
          // 'Safety Officer Professional level': 'richmenu-de77ed2e2f5999ba7a5d0af94fc6927f',
          // 'Safety Officer Technical level': 'richmenu-5884d7b3d3440b9ca8186eaea045d093',
          // 'Safety Officer Supervisory level': 'richmenu-c59303b973f1f7805d6020a6cab58149'
        };

       // กำหนด rich menu สำหรับตำแหน่งต่างๆ
      const richMenuId = richMenuIds[userResult.position];

      if (richMenuId) {
        try {
          // สลับ rich menu ตามตำแหน่ง
          await client.linkRichMenuToUser(userResult.lineUserId, richMenuId);
          console.log('Rich menu changed successfully for user:', userResult.lineUserId);
        } catch (error) {
          console.error('Error changing rich menu:', error);
          return NextResponse.json({ success: false, message: 'Failed to change rich menu.' });
        }
      }
      return NextResponse.json({ 
        success: true, 
        message: 'Login successful.', 
        profile: [userResult], 
        token,tokenPayload
      });

            
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