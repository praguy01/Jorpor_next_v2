import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (request.method === 'POST') {
    const formData = await request.formData();

    try {


      const file = formData.get('file');
      const fileBuffer = await file.arrayBuffer();
      console.log("buffer: ",fileBuffer)
      console.log("bufferfile: ",file)



      const {
        title,
        employee,
        location,
        work_owner,
        position,
        dateTime,
        detail,
        id,
      } = Object.fromEntries(formData);

      console.log("Test: ",formData)

      const insertSql =
        "INSERT INTO notify (title, employee, location, work_owner, status, date, file, file_name, detail,user_id, Verification_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const insertValues = [title, employee, location, work_owner, position, dateTime, fileBuffer, file.name, detail,id, "Pending approval"];
      const result = await db.execute(insertSql, insertValues);

      if (result[0].affectedRows === 1) {
        const insertedId = result[0].insertId;
        return NextResponse.json({ success: true, id: insertedId, message: 'Notification has been sent successfully.', redirect: '/response_role_1' });
      } else {
        return NextResponse.json({ success: false, error: 'Failed to insert notify data' });
      }
    } catch (error) {
      console.error('Error notify:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}



export async function GET(request) {
  if (request.method === 'GET') {
    try {
  

      const getQuery = "SELECT * FROM notify ";
      const [Result] = await db.query(getQuery);

      console.log("Data_examine: ",Result)


      return NextResponse.json({ success: true ,dbnotify_name: Result});
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}
