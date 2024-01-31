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
// import { io } from '../../socketServer';


import db from '../../../lib/db';
import { NextResponse } from 'next/server';
import { createServer } from 'http'
import { Server } from 'socket.io'

let httpServer;

// const allowCors = (req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://192.168.2.38:3000');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// };


export async function POST(request, response) {
  if (request.method === 'POST') {
    try {

      const data = await request.json();
      const { date, time, location } = data;
      console.log("res: ",data)
      console.log("Request URL:", request.url); // log URL ที่ถูกเรียก

      if (data.change) {
        
        console.log("res change: ",data,data.notification.date, data.notification.time, data.notification.location)

        const updateStatusQuery = "UPDATE emergency_notify SET status = 1 WHERE date = ? AND time = ? AND location = ? AND status = 0";

        const [updateResult] = await db.query(updateStatusQuery, [data.notification.date, data.notification.time, data.notification.location]);
        
        if (updateResult.affectedRows > 0) {
          // การอัปเดตสำเร็จ
          console.log("Status updated successfully");
          console.log("Data in res.notification matches a record in emergency_notify");
        } else {
          // ไม่พบรายการที่ต้องการอัปเดตหรือมีปัญหาในการอัปเดต
          console.log("Failed to update status or no matching records");
          console.log("Data in res.notification does not match any record in emergency_notify");
        }
        return NextResponse.json({ success: true});
      }

      let count = 0

      if (!httpServer) {
        console.log("http working")
      httpServer = createServer()
 
      const io = new Server(httpServer, {
        cors: {
          origin: ['http://192.168.2.38:80', 'http://192.168.2.38:3000'],
          methods: ['GET', 'POST'],
          credentials: true,
        },
      });
  
      io.on('connection', (socket) => {
        count++;
        console.log("connected: ", count);
        socket.on('disconnect', () => {
          count--;
          console.log("disconnected1: ", count);

          if (count === 0) {
            httpServer.close(() => {
            console.log('Server stopped');
            });
            httpServer = null;           
          }
        });
        socket.emit("emergencyNotify", data);
        socket.broadcast.emit("emergencyNotify", data);
      });

    }
     
      httpServer.listen(3000,'0.0.0.0',() => {
        console.log('Server is running on port 3000');
      });     

      const insertSql = "INSERT INTO emergency_notify (date, time, location , status) VALUES (?, ?, ? , 0)";
      const insertValues = await db.execute(insertSql , [data.date, data.time ,data.location]);

      if (insertValues[0].affectedRows === 1) {
        return NextResponse.json({ success: true, message: 'Notification has been sent successfully.'});
      } else {
        return NextResponse.json({ success: false, error: 'Failed to insert notify data' });
      }

    } catch (error) {
      console.error('Error processing the request:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to process the request',
      });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}

// ในไฟล์ api.js
// export function stopServer() {
//   console.log("STOPP");
//   if (httpServer) {
//     httpServer.close(() => {
//       console.log('Server stopped');
//     });
//     httpServer = null; // ให้ httpServer เป็น null เพื่อให้สามารถสร้าง server ใหม่ได้
//   }
// }


export async function GET(request) {
  if (request.method === 'GET') {
    try {
  
      const currentDate = new Date();

      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      // Create the formatted string
      const formattedDate = `${month}/${day}/${year}`;
      
      console.log('Formatted Date:', formattedDate);
      

      const getExamineQuery = "SELECT * FROM emergency_notify WHERE date = ? AND status = 0";
      const [examineResult] = await db.query(getExamineQuery, formattedDate);

      console.log("Data_examine: ",examineResult)


      return NextResponse.json({ success: true ,dbexamine_name: examineResult});
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
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


