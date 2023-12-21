import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    try {
      const {data } = res;
      console.log("RES_ROUTE_checklistexamine: ", res);



      if (res.add) {
        try {

          const checkExamineExistsQuery =  'SELECT id FROM examine WHERE name = ? AND examinelist_id =? ';
          const [examinenameResult] = await db.query(checkExamineExistsQuery, [res.checklistname , res.examinelist_Id]);
          console.log("ID examine: ",examinenameResult[0].id)


          const insertSql = `INSERT INTO examinename (name ,examine_id) VALUES (?,?)`;
          const insertValues = [res.input , examinenameResult[0].id];
          await db.query(insertSql, insertValues);
        
          return NextResponse.json({ success: true, message: ` ${res.input} created successfully` ,dbchecklist: res.input});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

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
            console.log("11111111111: ", nameData.name);

            const getname_idQuery = "SELECT id FROM examinename WHERE name = ? AND examine_id = ? ";
            const [name_idResult] = await db.query(getname_idQuery, [nameData.name , res.examine_Id]);
            console.log("name_idResult: ", name_idResult[0].id);

            IdChecklistname.push(name_idResult[0].id);

          }

          console.log("IDcheck: ", IdChecklistname);

          const getuser_idQuery = "SELECT id FROM users WHERE id = ?";
          const [user_idResult] = await db.query(getuser_idQuery, [res.id]);
          console.log("inspector: ", user_idResult);


          for (const examinename_id of IdChecklistname) {
            const name = names[IdChecklistname.indexOf(examinename_id)]; // ดึงชื่อจากอาเรย์ names
            const nameData = res.todoStatus[name];

            const existingRecordQuery = "SELECT id FROM checklist_examine WHERE examinename_id = ?  AND date = ?";
            const [existingRecordResult] = await db.query(existingRecordQuery, [ examinename_id,  formattedDate]);

            if (existingRecordResult.length > 0) {
              // Loop through all matching records and delete them
              for (const record of existingRecordResult) {
                const deleteSql = 'DELETE FROM checklist_examine WHERE id = ?';
                await db.query(deleteSql, [record.id]);
              }
            }

            const insertSql = 'INSERT INTO checklist_examine ( date, examinename_id, status, details, inspector, examine_id, examinelist_id ) VALUES (?,?,?,?,?,?,?)';
            const insertValues = [formattedDate, examinename_id, nameData.status, nameData.details, user_idResult[0].id, res.examine_Id, res.examinelist_Id];
            await db.query(insertSql, insertValues);
          }
          
          const getexaminelist_IdQuery = "SELECT name FROM examinelist WHERE id = ?";
          const [examinelist_IdResult] = await db.query(getexaminelist_IdQuery, [res.examinelist_Id]);
          console.log("inspector: ", examinelist_IdResult[0]);

          return NextResponse.json({ success: true , message: "successfully!" ,redirect: `/examine?examinelist_name=${examinelist_IdResult[0].name}`});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.edit_role_1) {
        try {
          console.log("55555: ",res.todo , res.examine_Id)
          const deleteExamineQuery = `DELETE FROM examinename WHERE name = ? AND examine_id = ?`;
          await db.query(deleteExamineQuery, [res.todo , res.examine_Id]);

          const checkExamineQuery =  `SELECT * FROM examinename WHERE examine_id  = ?  `;
          const [examineResult] = await db.query(checkExamineQuery ,[res.examine_Id]);
    
          const examineResultmap = examineResult.map(row => row.name);
    
    
          console.log("result_tableExamine: ",examineResultmap)
            

        
          return NextResponse.json({ success: true , message: 'delete successfully!',dbchecklist: examineResultmap});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.selectchecklist) {
        try {
          console.log("res.selectchecklist === checklist")
          const checkExamineQuery =  `SELECT name FROM examinename WHERE  examine_id  = ?  `;
          const [examineResult] = await db.query(checkExamineQuery ,[res.examine_Id]);

          console.log("listChecklist: ",examineResult)
          console.log("listexID: ",[res.examine_Id])


          const examineResultmap = examineResult.map(row => row.name);

          console.log("result_tableExamine: ",examineResultmap)
        
          return NextResponse.json({ success: true, message: "successfully" ,dbchecklist: examineResultmap});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.check) {
        try {

          const getUserQuery = "SELECT useEmployee FROM examine WHERE name = ?";
          const [userResult] = await db.query(getUserQuery, [res.checklistnameValue]);
          console.log("use111: ",userResult);

        
          return NextResponse.json({ success: true , message: 'successfully!' , ResultUseEmployee: userResult});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.checkid) {
        try {

          const currentDate = new Date();
          const day = currentDate.getDate();
          const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากมกราคมเริ่มที่ 0
          const year = currentDate.getFullYear();
          const formattedDate = `${day}/${month}/${year}`;
          console.log("date: ", formattedDate);


          const getidEmployeeQuery = `SELECT DISTINCT employee_name_id FROM checklist_employee WHERE date = ?`;
          const [idEmployeeResult] = await db.query(getidEmployeeQuery , [formattedDate]);

          const idEmployeeResultmap = idEmployeeResult.map(row => row.employee_name_id);
          console.log("IDEmployee: ",idEmployeeResultmap);

          return NextResponse.json({ success: true , message: 'successfully!' , ResultidEmployee: idEmployeeResultmap});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      
      if (res.User) {
        try {
          const checkExamineQuery =  `SELECT * FROM employee WHERE  examinelist_id  = ?  `;
          const [examineResult] = await db.query(checkExamineQuery ,[res.examinelist_Id]);
    
    
          return NextResponse.json({ success: true, message: "successfully" ,dbemployee_name: examineResult});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }
      
      // if (res.selectchecklist) {
      //   try {
      //     const checkExamineQuery =  `SELECT ${res}_name FROM ${res}  `;
      //     const [examineResult] = await db.query(checkExamineQuery);


      //     const examineResultmap = examineResult.map(row => row[`${res}_name`]);

      //     // console.log("result_tableExamine: ",examineResultmap)
            

      //     return NextResponse.json({ success: true, message: "successfully" ,dbchecklist: examineResultmap});
      //   } catch (error) {
      //     console.error('ErrorEditEx:', error);
      //     return NextResponse.json({ success: false, error: error.message });
      //   }
      // }

      const checkExamineQuery =  `SELECT * FROM examinename WHERE  examine_id  = ?  `;
      const [examineResult] = await db.query(checkExamineQuery ,[res.examine_IdValue]);

      const examineResultmap = examineResult.map(row => row.name);


      console.log("result_tableExamine: ",examineResultmap)
        

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
