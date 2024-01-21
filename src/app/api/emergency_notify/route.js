// // File: D:/SeniorNextjs/jorpor-nextjs/src/app/api/emergency_notify/route.ts
// import db from '../../../lib/db';
// import { NextResponse } from 'next/server';
// import { Server } from "socket.io";

// const io = new Server();


// export async function POST(request) {
  
//   // Check if the request method is POST
//   if (request.method === 'POST' ) {
//     try {
//       // Parse the JSON data from the request
//       const res = await request.json();

//       const { date, time, location } = res;
//       console.log("MESSAGE NodeMCU: ",res)


//       // ตั้งค่า socket.io รับ request ทุกรอบของลูป
//       io.emit("emergencyNotify", res);
//       console.log("SENDD");
      
//       // ปิดการเชื่อมต่อ socket.io เมื่อไม่ได้ใช้งานแล้ว

//       // const insertSql = "INSERT INTO emergency_notify (date, time, location) VALUES (?, ?, ?)";
//       // const insertValues = await db.execute(insertSql , [res.date, res.time ,res.location]);

//       // if (insertValues[0].affectedRows === 1) {
//         return NextResponse.json({ success: true, message: 'Notification has been sent successfully.'});
//       // } else {
//       //   return NextResponse.json({ success: false, error: 'Failed to insert notify data' });
//       // }
//     } catch (error) {
//       // Handle errors during processing
//       console.error('Error processing the request:', error);

//       // Return a JSON response indicating failure
//       return NextResponse.json({ success: false, error: 'Failed to process the request' });
//     }
//   } else {
//     return NextResponse.json('Method not allowed or invalid Content-Type');
//   }
// }
// process.on('SIGTERM', () => {
//   // ตรวจสอบว่ามีการเชื่อมต่อ WebSocket หรือไม่
//   if (io.engine.clientsCount === 0) {
//     io.close();
//     process.exit();
//   } else {
//     // ถ้ายังมีการเชื่อมต่อ WebSocket ทำอะไรสักอย่าง...
//     console.log('Waiting for active connections to close...');
//     // อาจต้องให้เวลารอให้การเชื่อมต่อทาง WebSocket ปิดก่อน
//     // หรือทำการแจ้งเตือนผู้ใช้งานว่ามีการเชื่อมต่อที่กำลังทำงาน
//   }
// });


// File: D:/SeniorNextjs/jorpor-nextjs/src/app/api/emergency_notify/route.ts
// File: api/socket.js
// import { NextResponse } from 'next/server';
// import socketIoClient from 'socket.io-client';
// import { io } from '../../socketServer'

// export async function POST(request) {
//   if (request.method === 'POST') {
//     try {
//       const res = await request.json();
//       const { date, time, location } = res;
//       console.log('MESSAGE NodeMCU: ', res);

//       io.emit('emergencyNotify', res);
//       console.log('SENDD: ',res);

//       return NextResponse.json({
//         success: true,
//         message: 'Notification has been sent successfully.',
//       });
//     } catch (error) {
//       console.error('Error processing the request:', error);
//       return NextResponse.json({
//         success: false,
//         error: 'Failed to process the request',
//       });
//     }
//   } else {
//     return NextResponse.json('Method not allowed or invalid Content-Type');
//   }
// }


const express = require('express');
const app = express();

app.use((req, res, next) => {
  // Allow requests from a specific origin
  res.header('Access-Control-Allow-Origin', 'https://button-emergency-jorpot.vercel.app');
  // Allow specific headers
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// เพิ่ม route ที่คุณสร้างไว้
app.post('/api/emergency_notify', async (req, res) => {
  try {
    const requestData = req.body;
    const { date, time, location } = requestData;
    console.log('Received emergency notification:', requestData);

    // ทำตามที่คุณต้องการกับข้อมูลที่รับมา

    res.json({
      success: true,
      message: 'Notification has been processed successfully.',
    });
  } catch (error) {
    console.error('Error processing the request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process the request',
    });
  }
});

// Start เซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
