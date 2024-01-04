import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    try {
      const { examine_name , todo } = res;
      console.log("RES_ROUTE_examineRes: ", res);

      if (res.fetch) {

        const checkExaminelistQuery = "SELECT id FROM examinelist WHERE name = ? AND user_id = ?";
        const [examinelistResult] = await db.query(checkExaminelistQuery, [res.examinelist_nameValue , res.storedId]);
  
        console.log("list ID222: ",examinelistResult[0].id);

        const getExamineQuery = "SELECT id,name FROM examine WHERE examinelist_id = ? ";
        const [examineResult] = await db.query(getExamineQuery , examinelistResult[0].id);
  
        console.log("Data_examine11: ",examineResult)
        console.log("Data_examine_id: ",examineResult.id)

  
        return NextResponse.json({ success: true ,dbexamine_name: examineResult ,examinelistId: examinelistResult[0].id });
        }


      if (res.edit) {
        try {
          const getExamineQuery = "SELECT * FROM examinelist  WHERE name = ? AND user_id = ? ";
          const [ExamineResult] = await db.query(getExamineQuery, [res.examinelist_name ,res.id]);
    
          console.log("Data_examineEdit: ",ExamineResult)

          const getExamineEditQuery = "SELECT * FROM examine  WHERE name = ? AND examinelist_id = ? ";
          const [ExamineEditResult] = await db.query(getExamineEditQuery, [res.todo , ExamineResult[0].id ,res.id]);
    
          console.log("Data_examineEdit: ",ExamineEditResult)

          const deleteExamineQuery = "DELETE FROM examine  WHERE name = ? AND examinelist_id = ?";
          await db.query(deleteExamineQuery, [res.todo , ExamineResult[0].id ,res.id]);

        
          return NextResponse.json({ success: true , message: 'delete successfully!'});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.submit) {

      
  
        return NextResponse.json({ success: true ,redirect: `/examineList?date=${res.formattedDate}&id=${res.id}`});
        }
      
        if (res.add) {
          try {
            const checkExaminelistQuery = "SELECT id FROM examinelist WHERE name = ? AND user_id = ?";
            const [examinelistResult] = await db.query(checkExaminelistQuery, [res.examinelist_name, res.id]);
        
            console.log("list ID: ", examinelistResult[0].id);
        
            // ถ้า examine_name ยังไม่มีในตาราง examine ให้ทำการเพิ่มข้อมูล
            const insertSql = "INSERT INTO examine (name, examinelist_id, useEmployee) VALUES (?,?,?)";
            const insertValues = [res.examine_name, examinelistResult[0].id, res.useEmployeeAsString];
            await db.query(insertSql, insertValues);
        
            const getIdQuery = "SELECT id , name FROM examine WHERE examinelist_id = ?";
            const [examineIdResult] = await db.query(getIdQuery, [examinelistResult[0].id]);
            const examine_id = examineIdResult[0].id;
            // const examineResultmap = examineIdResult.map(row => row.name);

            console.log("ID: ", examineIdResult);
        
            return NextResponse.json({
              success: true,
              message: `${res.examine_name} created successfully`,
              dbexamine_name: examineIdResult,
            });
          } catch (error) {
            console.error('Error:', error);
            return NextResponse.json({ success: false, error: error.message });
          }
        }
        
     

      return NextResponse.json({ success: true});
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}



// export async function GET(request) {
//   if (request.method === 'GET') {
//     try {
  

//       const getExamineQuery = "SELECT * FROM examine ";
//       const [examineResult] = await db.query(getExamineQuery);

//       console.log("Data_examine: ",examineResult)


//       return NextResponse.json({ success: true ,dbexamine_name: examineResult});
//     } catch (error) {
//       console.error('Error:', error);
//       return NextResponse.json({ success: false, error: error.message });
//     }
//   } else {
//     return NextResponse.error('Method Not Allowed');
//   }
// }
