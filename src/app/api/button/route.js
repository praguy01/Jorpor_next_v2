import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  if (request.method === 'GET') {
    try {

      const getExaminelistQuery = "SELECT * FROM examinelist ";
      const [examinelistResult] = await db.query(getExaminelistQuery);

      console.log("Data_examine: ",examinelistResult)

      return NextResponse.json({ success: true ,dbexaminelist_name: examinelistResult});
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}