import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request)  {
  if (request.method === 'POST') {
    const res = await request.json();
    try {
      const data = JSON.parse(res.data); 
      const {
        name,
        last_name,
        email,
        position,
        employee,
        password,
      } = data;

      console.log("JSON.DATA route: ", data);

      const checkEmailQuery = "SELECT COUNT(*) AS emailCount FROM users WHERE email = ?";
      const [emailCountResult] = await db.query(checkEmailQuery, [email]);
      console.log("emailCountResult: ", emailCountResult);

      const checkemployeeQuery = "SELECT COUNT(*) AS employeeCount FROM users WHERE employee = ?";
      const [employeeCountResult] = await db.query(checkemployeeQuery, [employee]);
      console.log("employeeCountResult: ", employeeCountResult);

      if (emailCountResult[0].emailCount > 0) {
        return NextResponse.json({ success: false, error: 'Email is already in use.' }, { res });
      } else if (employeeCountResult[0].employeeCount > 0) {
        return NextResponse.json({ success: false, error: 'Employee is already in use.' }, { res });
      }

      const insertSql = "INSERT INTO users (name, lastname, email, position, employee, password) VALUES (?, ?, ?, ?, ?, ?)";
      const insertValues = [name, last_name, email, position, employee, password];
      const result = await db.query(insertSql, insertValues);

      console.log("result :",result);
      console.log("result.affectedRows :",result[0].affectedRows);


      if (result[0].affectedRows === 1) {
        const insertedId = result.insertId;
        return NextResponse.json({ success: true, id: insertedId ,redirect: '/login'}, { res });

      } else {
        return NextResponse.json({ success: false, error: 'Failed to insert user data' }, { res });
      }
    } catch (error) {
      console.error('Error registering:', error);
      return NextResponse.json({ success: false, error: error.message }, { res });
    }
  } else {
    return NextResponse.error('Method Not Allowed', { res });
  }
}
