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

        // const getfileQuery = 'SELECT file FROM notify WHERE title = ?';
        // const [fileResult] = await db.query(getfileQuery,[res.responseValue]);
      
        // console.log("file: ",fileResult[0].file)



        const getQuery = 'SELECT * FROM notify WHERE id = ?';
        const [responseResult] = await db.query(getQuery ,[res.idValue]);

        console.log("rusultRoot: ",responseResult)

        return NextResponse.json({ success: true , message: 'successfully!' , responseResult: responseResult});
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }

    if (res.responseDetail_row_3) {
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


    
    if (res.response_row_2) {
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

    if (res.response_row_3) {
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


export async function GET(request) {
  if (request.method === 'GET') {
    try {
      const getQuery = "SELECT file FROM notify";
      const [Result] = await db.query(getQuery);

      if (Result.length > 0) {
        const pdfData = Result[0].file;

        if (pdfData) {
          const pdfBuffer = Buffer.from(pdfData, 'binary');
          // ส่งไฟล์ PDF กลับไปยังผู้ใช้
          return NextResponse.json({
            status: 200,
            success: true,
            body: pdfBuffer,
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': 'attachment; filename="your_pdf_file.pdf"',
            },
          });
          
        } else {
          console.error('PDF data is undefined.');
          return {
            status: 500,
            body: 'PDF data is undefined.',
          };
        }
      } else {
        console.error('No data found in the database.');
        return {
          status: 500,
          body: 'No data found in the database.',
        };
      }
    } catch (error) {
      console.error('Error:', error);
      return {
        status: 500,
        body: 'Internal Server Error',
      };
    }
  } else {
    return {
      status: 405,
      body: 'Method Not Allowed',
    };
  }
}

