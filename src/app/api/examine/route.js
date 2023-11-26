import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    try {
      const { examine_name , todo } = res;
      console.log("RES_ROUTE_examineRes: ", res);

      if (res.fetch) {

        const checkExaminelistQuery = "SELECT id FROM examinelist WHERE name = ?";
        const [examinelistResult] = await db.query(checkExaminelistQuery, [res.examinelist_nameValue]);
  
        console.log("list ID: ",examinelistResult[0].id);

        const getExamineQuery = "SELECT * FROM examine WHERE examinelist_id = ? ";
        const [examineResult] = await db.query(getExamineQuery , examinelistResult[0].id);
  
        console.log("Data_examine: ",examineResult)
        console.log("Data_examine_id: ",examineResult.id)

  
        return NextResponse.json({ success: true ,dbexamine_name: examineResult ,examinelistId: examinelistResult[0].id });
        }


      if (res.edit) {
        try {
          const getExamineEditQuery = "SELECT * FROM examine WHERE name = ?";
          const [ExamineEditResult] = await db.query(getExamineEditQuery, [res.todo]);
    
          console.log("Data_examineEdit: ",ExamineEditResult)

          const deleteExamineQuery = "DELETE FROM examine WHERE name = ?";
          await db.query(deleteExamineQuery, [res.todo]);

        
          return NextResponse.json({ success: true , message: 'delete successfully!'});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.submit) {

        // const checkExaminelistQuery = "SELECT id FROM examinelist WHERE name = ?";
        // const [examinelistResult] = await db.query(checkExaminelistQuery, [res.examinelist_nameValue]);
  
        // console.log("list ID: ",examinelistResult[0].id);

        // const getExamineQuery = "SELECT * FROM examine WHERE examinelist_id = ? ";
        // const [examineResult] = await db.query(getExamineQuery , examinelistResult[0].id);
  
        // console.log("Data_examine: ",examineResult)
        // console.log("Data_examine_id: ",examineResult.id)

  
        return NextResponse.json({ success: true ,redirect: `/examineList?date=${res.formattedDate}&id=${res.id}`});
        }
      
      if (res.add) {
      const checkExaminelistQuery = "SELECT id FROM examinelist WHERE name = ?";
      const [examinelistResult] = await db.query(checkExaminelistQuery, [res.examinelist_name]);

      console.log("list ID: ",examinelistResult[0].id);

        // ถ้า examine_name ยังไม่มีในตาราง examine ให้ทำการเพิ่มข้อมูล
        const insertSql = "INSERT INTO examine (name, examinelist_id,  useEmployee) VALUES (?,?,?)";
        const insertValues = [res.examine_name ,examinelistResult[0].id, res.useEmployeeAsString];
        await db.query(insertSql, insertValues);

      

     
      // ดึงค่า id ของ examine_name ที่เพิ่มหรือมีอยู่ในตาราง examine
      // const getIdQuery = "SELECT id FROM examine WHERE examine_name = ?";
      // const [examineIdResult] = await db.query(getIdQuery, [res.examine_name]);
      // const examine_id = examineIdResult[0].id;

      // console.log("ID: ",examine_id)

     

      // // สร้างคำสั่ง SQL สำหรับสร้างตารางใหม่ โดยใช้ค่าจาก examine_name
      // const createTableQuery = `
      //   CREATE TABLE IF NOT EXISTS ${res.examine_name} (
      //     id INT AUTO_INCREMENT PRIMARY KEY,
      //     ${res.examine_name}_name VARCHAR(255) NOT NULL,
      //     examine_id INT,
      //     FOREIGN KEY (examine_id) REFERENCES examine(id)
      //   )
      // `;

      // // // สร้างตารางใหม่ในฐานข้อมูล
      // await db.query(createTableQuery);

      // const useEmployee = JSON.parse(res.useEmployeeAsString);

      // if (useEmployee === true) {

      //   const createTableChecklistEmployeeQuery = `
      //   CREATE TABLE IF NOT EXISTS checklist_${res.examine_name} (
      //     id INT AUTO_INCREMENT PRIMARY KEY,
      //     date VARCHAR(255) NOT NULL,
      //     ${res.examine_name}_id VARCHAR(255) NOT NULL,
      //     details VARCHAR(255) NOT NULL,
      //     inspector VARCHAR(255) NOT NULL,
      //     employee_id INT,
      //     examine_id INT,
      //     FOREIGN KEY (examine_id) REFERENCES examine(id)
      //   )
      // `;
      // await db.query(createTableChecklistEmployeeQuery);

      // } else {

      // const createTableChecklistQuery = `
      //   CREATE TABLE IF NOT EXISTS checklist_${res.examine_name} (
      //     id INT AUTO_INCREMENT PRIMARY KEY,
      //     date VARCHAR(255) NOT NULL,
      //     ${res.examine_name}_name VARCHAR(255) NOT NULL,
      //     details VARCHAR(255) NOT NULL,
      //     inspector VARCHAR(255) NOT NULL,
      //     examine_id INT,
      //     FOREIGN KEY (examine_id) REFERENCES examine(id)
      //   )
      // `;
      // await db.query(createTableChecklistQuery);

      // }
    }
      // // สร้างตารางใหม่ในฐานข้อมูล

      // ปิดการเชื่อมต่อกับฐานข้อมูล
      const showTablesQuery = "SHOW TABLES;";
      const [tableList] = await db.query(showTablesQuery);

      console.log("รายชื่อตารางทั้งหมดในฐานข้อมูล:", tableList);
        

      return NextResponse.json({ success: true, message: ` ${res.examine_name} created successfully` ,dbexamine_name: res.examine_name});
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
