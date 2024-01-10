// File: D:/SeniorNextjs/jorpor-nextjs/src/app/api/emergency_notify/route.ts
import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  // Check if the request method is POST
  if (request.method === 'POST' ) {
    try {
      // Parse the JSON data from the request
      const res = await request.json();

      // Log the received data
      console.log('Received data from NodeMCU:', res);

      // Access query parameters
      const { date, time, location } = res;

      // Do something with the query parameters (e.g., log them)
      console.log(' - Date:', date, 'Time:', time, 'Location:', location);

      const insertSql = "INSERT INTO emergency_notify (date, time, location) VALUES (?, ?, ?)";
      const insertValues = await db.execute(insertSql , [res.date, res.time ,res.location]);

      if (insertValues[0].affectedRows === 1) {
        return NextResponse.json({ success: true, message: 'Notification has been sent successfully.'});
      } else {
        return NextResponse.json({ success: false, error: 'Failed to insert notify data' });
      }
    } catch (error) {
      // Handle errors during processing
      console.error('Error processing the request:', error);

      // Return a JSON response indicating failure
      return NextResponse.json({ success: false, error: 'Failed to process the request' });
    }
  } else {
    return NextResponse.json('Method not allowed or invalid Content-Type');
  }
}