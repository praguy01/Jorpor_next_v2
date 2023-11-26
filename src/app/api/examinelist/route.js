import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    try {
      const { examinelist_name , todo } = res;
      console.log("RES_ROUTE_examineRes: ", res);

      if (res.fetch) {

      const getExamineQuery = "SELECT * FROM examinelist WHERE user_id = ? ";
      const [examinelistResult] = await db.query(getExamineQuery , res.storedUser_id);

      console.log("Data_examine: ",examinelistResult[0].name)


      return NextResponse.json({ success: true ,dbexaminelist_name: examinelistResult});
      }
     

      if (res.edit) {
        try {
          const getExamineEditQuery = "SELECT * FROM examinelist WHERE name = ?";
          const [ExamineEditResult] = await db.query(getExamineEditQuery, [res.todo]);
    
          console.log("Data_examinelistEdit: ",ExamineEditResult)

          const deleteExamineQuery = "DELETE FROM examinelist WHERE name = ?";
          await db.query(deleteExamineQuery, [res.todo]);


         

          // const showTablesQuery = "SHOW TABLES;";
          // const [tableList] = await db.query(showTablesQuery);

          // console.log("รายชื่อตารางทั้งหมดในฐานข้อมูล:", tableList);
        
          return NextResponse.json({ success: true , message: 'delete successfully!'});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.submit) {

        return NextResponse.json({ success: true ,redirect: `/reportResults?date=${res.formattedDate}&id=${res.id}`});
        }
      
      if (res.add) {
      const checkExamineExistsQuery = "SELECT * FROM examinelist WHERE name = ?";
      const [examineExistsResult] = await db.query(checkExamineExistsQuery, [res.examinelist_name]);

      if (examineExistsResult.length === 0) {
        const insertSql = "INSERT INTO examinelist (name, user_id) VALUES (?,?)";
        const insertValues = [res.examinelist_name , res.User_id];
        await db.query(insertSql, insertValues);

      }

    }
    return NextResponse.json({ success: true, message: ` ${res.examinelist_name} created successfully` ,dbexaminelist_name: res.examinelist_name});
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}


