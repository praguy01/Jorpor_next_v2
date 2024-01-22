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
// pages/api/emergency_notify.js
import { io } from '../../socketServer';

export default async function POST(request, response) {
  if (request.method === 'POST') {
    try {
      const res = await request.json();
      const { date, time, location } = res;
      console.log('MESSAGE NodeMCU: ', res);

      response.setHeader('Content-Type', 'text/event-stream');
      response.setHeader('Cache-Control', 'no-cache');
      response.setHeader('Connection', 'keep-alive');

      const sendData = (data) => {
        response.write(`data: ${JSON.stringify(data)}\n\n`);
      };

      // ปิดการเชื่อมต่อเมื่อ client ตัดการเชื่อมต่อ
      response.on('close', () => {
        console.log('Client disconnected from SSE');
      });

      request.on('data', (chunk) => {
        const rawData = chunk.toString();
        const jsonData = JSON.parse(rawData);

        console.log('MESSAGE NodeMCU: ', jsonData);

        io.emit('emergencyNotify', jsonData);
        sendData(jsonData);

        console.log('SENDD: ', jsonData);
      });

      request.on('end', () => {
        response.end();
      });
    } catch (error) {
      console.error('Error processing the request:', error);
      response.status(500).json({
        success: false,
        error: 'Failed to process the request',
      });
    }
  } else {
    response.status(405).end(); // Method Not Allowed
  }
}





// import { NextResponse } from 'next/server';
// import { io } from '../../socketServer';

// export async function POST(request) {
//   // Allow requests from a specific origin
//   console.log('Received request:', request.method, request.url);

//   const allowedOrigin = 'https://button-emergency-jorpot.vercel.app';
//   const requestOrigin = request.headers.get('origin');
  
//   if (request.method === 'OPTIONS') {
//     // Respond to preflight request
//     return new NextResponse({
//       status: 200,
//       headers: {
//         'Access-Control-Allow-Origin': allowedOrigin,
//         'Access-Control-Allow-Methods': 'POST',
//         'Access-Control-Allow-Headers': 'Content-Type',
//       },
//     });
//   }

//   if (request.method === 'POST' && requestOrigin === allowedOrigin) {
//     try {
//       const res = await request.json();
//       const { date, time, location } = res;
//       console.log('MESSAGE NodeMCU: ', res);

//       // Emit the message to the socket.io server
//       io.emit('emergencyNotify', res);
//       console.log('SENDD: ', res);

//       // Respond with CORS headers and a JSON success message
//       return new NextResponse({
//         status: 200,
//         headers: {
//           'Access-Control-Allow-Origin': allowedOrigin,
//           'Access-Control-Allow-Methods': 'POST',
//           'Access-Control-Allow-Headers': 'Content-Type',
//         },
//         body: {
//           success: true,
//           message: 'Notification has been sent successfully.',
//         },
//       });
//     } catch (error) {
//       console.error('Error processing the request:', error);

//       // Respond with CORS headers and a JSON error message
//       return new NextResponse({
//         status: 500,
//         headers: {
//           'Access-Control-Allow-Origin': allowedOrigin,
//           'Access-Control-Allow-Methods': 'POST',
//           'Access-Control-Allow-Headers': 'Content-Type',
//         },
//         body: {
//           success: false,
//           error: 'Failed to process the request',
//         },
//       });
//     }
//   } else {
//     // Respond with CORS headers and a JSON error message for disallowed requests
//     return new NextResponse({
//       status: 403,
//       headers: {
//         'Access-Control-Allow-Origin': allowedOrigin,
//         'Access-Control-Allow-Methods': 'POST',
//         'Access-Control-Allow-Headers': 'Content-Type',
//       },
//       body: {
//         success: false,
//         error: 'Request from this origin is not allowed.',
//       },
//     });
//   }
// }

