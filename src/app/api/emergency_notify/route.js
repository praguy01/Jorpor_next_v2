// // File: D:/SeniorNextjs/jorpor-nextjs/src/app/api/emergency_notify/route.ts
// import db from '../../../lib/db';
// import { NextResponse } from 'next/server';

// export async function POST(request) {
//   // Check if the request method is POST
//   if (request.method === 'POST' ) {
//     try {
//       // Parse the JSON data from the request
//       const res = await request.json();

//       const { date, time, location } = res;



//       const insertSql = "INSERT INTO emergency_notify (date, time, location) VALUES (?, ?, ?)";
//       const insertValues = await db.execute(insertSql , [res.date, res.time ,res.location]);

//       if (insertValues[0].affectedRows === 1) {
//         return NextResponse.json({ success: true, message: 'Notification has been sent successfully.'});
//       } else {
//         return NextResponse.json({ success: false, error: 'Failed to insert notify data' });
//       }
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


import { Server } from 'Socket.IO'

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io
  }
  res.end()
}

export default SocketHandler