import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    try {
      const { examine_name , todo } = res;
      console.log("RES_ROUTE_examine: ", res);
      console.log("RES_ROUTE_todo: ", res.todo);


      if (res.edit) {
        try {
          const getExamineEditQuery = "SELECT * FROM examine WHERE examine_name = ?";
          const [ExamineEditResult] = await db.query(getExamineEditQuery, [res.todo]);
    
          console.log("Data_examineEdit: ",ExamineEditResult)

          const deleteExamineQuery = "DELETE FROM examine WHERE examine_name = ?";
          await db.query(deleteExamineQuery, [res.todo]);

          const dropTableQuery = `DROP TABLE ${res.todo}`;
          await db.query(dropTableQuery);

          const showTablesQuery = "SHOW TABLES;";
          const [tableList] = await db.query(showTablesQuery);

          console.log("รายชื่อตารางทั้งหมดในฐานข้อมูล:", tableList);
        
          return NextResponse.json({ success: true , message: 'delete successfully!'});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }
      

      const checkExamineExistsQuery = "SELECT * FROM examine WHERE examine_name = ?";
      const [examineExistsResult] = await db.query(checkExamineExistsQuery, [res]);

      if (examineExistsResult.length === 0) {
        // ถ้า examine_name ยังไม่มีในตาราง examine ให้ทำการเพิ่มข้อมูล
        const insertSql = "INSERT INTO examine (examine_name) VALUES (?)";
        const insertValues = [res];
        await db.query(insertSql, insertValues);

      }

     
      // ดึงค่า id ของ examine_name ที่เพิ่มหรือมีอยู่ในตาราง examine
      const getIdQuery = "SELECT id FROM examine WHERE examine_name = ?";
      const [examineIdResult] = await db.query(getIdQuery, [res]);
      const examine_id = examineIdResult[0].id;

      

      // สร้างคำสั่ง SQL สำหรับสร้างตารางใหม่ โดยใช้ค่าจาก examine_name
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${res} (
          id INT AUTO_INCREMENT PRIMARY KEY,
          ${res}_name VARCHAR(255) NOT NULL,
          examine_id INT,
          FOREIGN KEY (examine_id) REFERENCES examine(id)
        )
      `;

      // // สร้างตารางใหม่ในฐานข้อมูล
      await db.query(createTableQuery);

      // ปิดการเชื่อมต่อกับฐานข้อมูล
      const showTablesQuery = "SHOW TABLES;";
      const [tableList] = await db.query(showTablesQuery);

      console.log("รายชื่อตารางทั้งหมดในฐานข้อมูล:", tableList);
        

      return NextResponse.json({ success: true, message: ` ${res} created successfully` ,dbexamine_name: res});
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
  

      const getExamineQuery = "SELECT * FROM examine ";
      const [examineResult] = await db.query(getExamineQuery);

      console.log("Data_examine: ",examineResult)


      return NextResponse.json({ success: true ,dbexamine_name: examineResult});
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}
