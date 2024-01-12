import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const fs = require('fs');
  if (request.method === 'POST') {
    
    const res = await request.json();
    try {
    console.log("RESS: ",res ,res.storedId)

    if (res.fetch){
      const getQuery = "SELECT * FROM notify WHERE user_id = ?";
      const [Result] = await db.query(getQuery , [res.storedId]);

      console.log("Data_examine: ",Result)


      return NextResponse.json({ success: true ,dbnotify_name: Result});
    }

    if (res.responseDetail) {
      try {

        const getQuery = 'SELECT * FROM notify WHERE id = ?';
        const [responseResult] = await db.query(getQuery ,[res.idValue]);

        console.log("rusultRoot: ",responseResult)

        return NextResponse.json({ success: true , message: 'successfully!' , responseResult: responseResult});
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }

    if (res.responseDetail_role_3) {
      try {


        const getQuery = "SELECT * FROM notify WHERE id = ?";
        const [responseResult] = await db.query(getQuery , [res.idValue]);


        console.log("rusultRoot: ",responseResult)

        return NextResponse.json({ success: true , message: 'successfully!' , responseResult: responseResult});
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }


    
    if (res.response_role_2) {
      try {


        const getQuery = "SELECT * FROM notify WHERE Verification_status = 'Pending approval'";
        const [responseResult] = await db.query(getQuery);


        console.log("rusultRoot: ",responseResult)

        return NextResponse.json({ success: true , message: 'successfully!' , responseResult: responseResult});
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }

    if (res.response_role_3) {
      try {


        const getQuery = "SELECT * FROM notify WHERE Verification_status = 'Approve'";
        const [responseResult] = await db.query(getQuery);


        console.log("rusultRoot: ",responseResult)

        return NextResponse.json({ success: true , message: 'successfully!' , responseResult: responseResult});
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }



    
    } catch (error) {
      console.error('Error notify:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}

