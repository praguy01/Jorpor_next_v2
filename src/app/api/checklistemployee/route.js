import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    try {
      const {datasend } = res;
      console.log("RES_ROUTE_checklistexamineEmployee: ", res);
      console.log("RES_ROUTE_checklistexamineinput: ", res.input);



      

      // if (res.checkbox) {
      //   try {
      //     const getUserQuery = "SELECT employee FROM users WHERE id = ?";
      //     const [userResult] = await db.query(getUserQuery, [res.id]);
      //     console.log("inspector: ", userResult);
      
      //     const getEmployeeQuery = "SELECT id FROM employee WHERE employee = ?";
      //     const [employeeResult] = await db.query(getEmployeeQuery, [res.employeename]);
      //     console.log("idEmployee: ", employeeResult);

      //     const insertSql = 'INSERT INTO checklist_examine ( date, examinename_id, status, details, inspector, examine_id, examinelist_id ) VALUES (?,?,?,?,?,?,?)';
      //     const insertValues = [res.currentDate, examinename_id, nameData.status, nameData.details, user_idResult[0].id, res.examine_Id, res.examinelist_Id];
      //     await db.query(insertSql, insertValues);
      
      //     // const IdChecklistname = []
      
      //     // for (const selectedItem of res.selectedItemsArray) {
      //     //   const getChecklistnameQuery = `SELECT id FROM ${res.examinename} WHERE ${res.examinename}_name = ?`;
      //     //   const [ChecklistnameResult] = await db.query(getChecklistnameQuery, selectedItem);
      //     //   console.log("ChecklistnameResult: ", ChecklistnameResult);
      
      //     //   IdChecklistname.push(ChecklistnameResult);
      //     // }
      
      //     // const formattedIdChecklistname = IdChecklistname.map(item => item[0].id);
      //     // console.log("IdChecklistname: ", formattedIdChecklistname);
      
      //     // ตรวจสอบว่ามี id ในตาราง employee หรือไม่
      //     // const employeeId = employeeResult[0].id;
      //     // const checkEmployeeQuery = `SELECT * FROM checklist_${res.examinename} WHERE employee_id = ?`;
      //     // const [checkEmployeeResult] = await db.query(checkEmployeeQuery, [employeeId]);
      
      //     // if (checkEmployeeResult.length > 0) {
      //     //   // มี employee_id ที่ตรงกับ employee ในตาราง checklist_${res.examinename}
      //     //   // อัปเดตข้อมูลที่มีอยู่แล้ว
      //     //   const existingData = checkEmployeeResult[0]; // เรียกข้อมูลที่มีอยู่แล้ว
      //     //   const existingIdChecklistname = JSON.parse(existingData[`${res.examinename}_id`]);
      
      //     //   // ควรเพิ่มค่าที่ไม่มีอยู่และคงค่าที่มีอยู่แล้ว
      //     //   const mergedIdChecklistname = Array.from(
      //     //     new Set([...existingIdChecklistname, ...formattedIdChecklistname])
      //     //   );

      //     //   console.log("DATAAddto****: ",mergedIdChecklistname)
      
      //     //   // ทำการอัปเดตข้อมูล
      //     //   const updateSql = `
      //     //     UPDATE checklist_${res.examinename}
      //     //     SET date = ?,
      //     //         ${res.examinename}_id = JSON_ARRAY(?),
      //     //         details = ?,
      //     //         inspector = ?
      //     //     WHERE employee_id = ?;
      //     //   `;
      //     //   const updateValues = [
      //     //     res.currentDate,
      //     //     mergedIdChecklistname,
      //     //     res.details,
      //     //     userResult[0].employee,
      //     //     employeeId
      //     //   ];
      //     //   await db.query(updateSql, updateValues);
      //     // } else {
      //     //   // ไม่มี employee_id ที่ตรงกับ employee ในตาราง checklist_${res.examinename}
      //     //   // เพิ่มแถวใหม่
      //     //   const insertSql = `
      //     //     INSERT INTO checklist_${res.examinename} (date, ${res.examinename}_id, details, inspector, employee_id)
      //     //     VALUES (?, JSON_ARRAY(?), ?, ?, ?);
      //     //   `;
      //     //   const insertValues = [
      //     //     res.currentDate,
      //     //     formattedIdChecklistname,
      //     //     res.details,
      //     //     userResult[0].employee,
      //     //     employeeId
      //     //   ];

      //     //   await db.query(insertSql, insertValues);
      //     // }
      
      //     return NextResponse.json({
      //       success: true,
      //       message: "successfully!",
      //       redirect: `checklistExamine?checklistname=${res.examinename}&Checked=true&idemployee=${res.idemployee}`
      //     });
      //   } catch (error) {
      //     console.error('ErrorEditEx:', error);
      //     return NextResponse.json({ success: false, error: error.message });
      //   }
      // }

      if (res.checkbox) {
        try {
          const getnameQuery = "SELECT * FROM examinename WHERE examine_id = ?";
          const [nameResult] = await db.query(getnameQuery, [res.examine_Id]);
          const names = nameResult.map(item => item.name);

          console.log("Name: ",names);
          
          const currentDate = new Date();
          const day = currentDate.getDate();
          const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากมกราคมเริ่มที่ 0
          const year = currentDate.getFullYear();
          const formattedDate = `${day}/${month}/${year}`;

          const IdChecklistname = [];

          for (const name of names) {
            const nameData = res.todoStatus[name];

            const getname_idQuery = "SELECT id FROM examinename WHERE name = ?";
            const [name_idResult] = await db.query(getname_idQuery, [nameData.name]);

            IdChecklistname.push(name_idResult[0].id);
          }


          const getuser_idQuery = "SELECT id FROM users WHERE id = ?";
          const [user_idResult] = await db.query(getuser_idQuery, [res.id]);

          const getemployeeQuery = "SELECT id FROM employee WHERE employee = ?";
          const [employeeResult] = await db.query(getemployeeQuery, [res.employee_Id]);



          for (const examinename_id of IdChecklistname) {
            const name = names[IdChecklistname.indexOf(examinename_id)]; // ดึงชื่อจากอาเรย์ names
            const nameData = res.todoStatus[name];
           
            const existingRecordQuery = "SELECT id FROM checklist_employee WHERE employee_name_id = ? AND examinename_id = ? AND date = ?";
            const [existingRecordResult] = await db.query(existingRecordQuery, [employeeResult[0].id, examinename_id, formattedDate]);

            if (existingRecordResult.length > 0) {
              // Loop through all matching records and delete them
              for (const record of existingRecordResult) {
                const deleteSql = 'DELETE FROM checklist_employee WHERE id = ?';
                await db.query(deleteSql, [record.id]);
              }
            }




            const insertSql = 'INSERT INTO checklist_employee ( date, employee_name_id, examinename_id, status, details, inspector, examine_id, examinelist_id ) VALUES (?,?,?,?,?,?,?,?)';
            const insertValues = [formattedDate,employeeResult[0].id, examinename_id, nameData.status, nameData.details, user_idResult[0].id, res.examine_Id, res.examinelist_Id];
            await db.query(insertSql, insertValues);
          }
          
          const getexamine_IdQuery = "SELECT name FROM examine WHERE id = ?";
          const [examine_IdResult] = await db.query(getexamine_IdQuery, [res.examine_Id]);

          return NextResponse.json({ success: true , message: "successfully!" ,redirect: `/checklistExamine?checklistname=${examine_IdResult[0].name}&examinelistId=${res.examinelist_Id}&examineId=${res.examine_Id}&examinelist_name=${res.examinelist_name}`});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }
      
      const checkExamineQuery =  `SELECT name FROM examinename WHERE  examine_id  = ?  `;
      const [examineResult] = await db.query(checkExamineQuery ,[res.examine_IdValue]);


      const examineResultmap = examineResult.map(row => row.name);

        

      return NextResponse.json({ success: true, message: "successfully" ,dbchecklist: examineResultmap});
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
