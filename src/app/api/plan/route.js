import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    try {
      const {data } = res;
      console.log("RES_ROUTE_employee: ", res);




      if (res.add) {
        try {
          // const dateString = res.selectedDate;
          // const inputDate = new Date(dateString);
          // const options = { day: "2-digit", month: "2-digit", year: "numeric" };
          // const formattedDate = inputDate.toLocaleDateString("th-TH", options);
          // console.log("วันที่:", formattedDate);

          const insertSql = `INSERT INTO plan ( date, startTime, endTime ,activity,user_id) VALUES (?,?,?,?,?)`;
          const insertValues = [res.formattedDate ,res.newStartTime , res.newEndTime ,res.newActivity ,res.storedUser_id];
          await db.query(insertSql, insertValues);

          const getPlanQuery = "SELECT * FROM plan WHERE user_id = ?";
          const [planResult] = await db.query(getPlanQuery, [res.storedUser_id]);
        
          return NextResponse.json({ success: true, message: `new activity created successfully` ,dbemployee: res , dbPlan: planResult});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.edit) {
        try {
          const getExamineEditQuery = "SELECT * FROM plan WHERE id = ?";
          const [ExamineEditResult] = await db.query(getExamineEditQuery, [res.item.id]);
    
          console.log("Data_examinelistEdit: ",ExamineEditResult)

          const deleteExamineQuery = "DELETE FROM plan WHERE id = ?";
          await db.query(deleteExamineQuery, [res.item.id]);

          return NextResponse.json({ success: true , message: 'delete successfully!'});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.fetch) {
        try {

          const getIDExamineListQuery = "SELECT id FROM examinelist WHERE name = ?";
          const [idExamineListResult] = await db.query(getIDExamineListQuery, [ res.selectedOption ]);
          console.log("WWW: ",idExamineListResult)

          const getEmployeeQuery = "SELECT * FROM employee WHERE examinelist_id  = ?";
          const [employeeResult] = await db.query(getEmployeeQuery, [ idExamineListResult[0].id ]);

         
        
          return NextResponse.json({ success: true ,dbemployee_name: employeeResult});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      const getPlanQuery = "SELECT * FROM plan WHERE user_id = ?";
      const [planResult] = await db.query(getPlanQuery, [res.storedId]);


      return NextResponse.json({ success: true, dbPlan: planResult});

      
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
    
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}

export async function GET(request) {
  if (request.method === 'GET') {
    try {
  

      const getEmployeeQuery = "SELECT * FROM employee ";
      const [employeeResult] = await db.query(getEmployeeQuery);

      // console.log("Data_employee_name: ",employeeResult)


      return NextResponse.json({ success: true ,dbemployee_name: employeeResult});
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}
