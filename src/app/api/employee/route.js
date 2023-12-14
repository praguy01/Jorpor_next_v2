import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    try {
      const {data } = res;
      console.log("RES_ROUTE_employee: ", res);
      console.log("RES_ROUTE_employeeinput: ", res.input);



      if (res.add) {
        try {

          const getIDExamineListQuery = "SELECT id FROM examinelist WHERE name = ?";
          const [idExamineListResult] = await db.query(getIDExamineListQuery, [ res.selectedOption ]);

          const insertSql = `INSERT INTO employee ( employee, name, lastname ,examinelist_id ,users_id ) VALUES (?,?,?,?,?)`;
          const insertValues = [res.employee ,res.name , res.lastname ,idExamineListResult[0].id, res.id];
          await db.query(insertSql, insertValues);
        
          return NextResponse.json({ success: true, message: ` employee ${res.employee} created successfully` ,dbemployee: res});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }
      if (res.fetch_role_3) {
        try {

         

          const getEmployeeQuery = "SELECT * FROM users_r2 WHERE users_r3_id  = ?";
          const [employeeResult] = await db.query(getEmployeeQuery, [ res.storedId ]);

          console.log("employeeResult: ",employeeResult);

        
          return NextResponse.json({ success: true ,dbemployee_name: employeeResult});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.fetch_role_2) {
        try {

         

          const getEmployeeQuery = "SELECT * FROM users WHERE role_2_id  = ?";
          const [employeeResult] = await db.query(getEmployeeQuery, [ res.storedId ]);

          console.log("employeeResult: ",employeeResult);

        
          return NextResponse.json({ success: true ,dbemployee_name: employeeResult});
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

      if (res.add_role_2) {
        try {
          console.log("22222555555")

          const insertSql = `INSERT INTO users ( employee, name ,	lastname ,password, role_2_id ) VALUES (?,?,?,?,?)`;
          const insertValues = await db.query(insertSql,[res.employee ,res.name , res.lastname , res.password , res.id]);
        
          console.log("22222: ",insertValues)

          return NextResponse.json({ success: true, message: ` employee ${res.employee} created successfully` ,dbemployee: res});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.add_role_3) {
        try {
          console.log("22222555555")

          const insertSql = `INSERT INTO users_r2 ( employee, name ,	lastname ,password, users_r3_id ) VALUES (?,?,?,?,?)`;
          const insertValues = await db.query(insertSql,[res.employee ,res.name , res.lastname , res.password , res.id]);
        
          console.log("22222: ",insertValues)

          return NextResponse.json({ success: true, message: ` employee ${res.employee} created successfully` ,dbemployee: res});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }


      const getNameExamineListQuery = "SELECT name FROM examinelist WHERE user_id = ?";
      const [nameExamineListResult] = await db.query(getNameExamineListQuery, [res.storedId]);

      const nameExamineListResultmap = nameExamineListResult.map(row => row.name);

      console.log("list: ",nameExamineListResultmap);

      return NextResponse.json({ success: true, dbnameExamineList: nameExamineListResultmap});

      // if (res.checkbox) {
      //   try {
      //     const getUserQuery = "SELECT employee FROM users WHERE id = ?";
      //     const [userResult] = await db.query(getUserQuery, [res.id]);
      //     console.log("inspector: ",userResult);

      //     const IdChecklistname = []

      //     for (const selectedItem of res.selectedItemsArray) {
      //       const getChecklistnameQuery = `SELECT id FROM ${res.checklistname} WHERE ${res.checklistname}_name = ?`;
      //       const [ChecklistnameResult] = await db.query(getChecklistnameQuery, selectedItem);
      //       console.log("inspector: ",ChecklistnameResult);

      //       IdChecklistname.push(ChecklistnameResult);

      //     }
      //     const formattedIdChecklistname = IdChecklistname.map(item => item[0].id);
      //     console.log("IdChecklistname: ", formattedIdChecklistname);

      //     const insertSql = `INSERT INTO checklist_${res.checklistname} ( date , ${res.checklistname}_name , details ,inspector) VALUES (?,JSON_ARRAY(${formattedIdChecklistname}),?,?)`;
      //     const insertValues = [res.currentDate  ,res.details , userResult[0].employee];
      //     await db.query(insertSql, insertValues);
        
        
      //     return NextResponse.json({ success: true , message: "successfully!" ,redirect: "examine"});
      //   } catch (error) {
      //     console.error('ErrorEditEx:', error);
      //     return NextResponse.json({ success: false, error: error.message });
      //   }
      // }

      // if (res.edit) {
      //   try {

      //     const deleteExamineQuery = `DELETE FROM ${res.checklistname} WHERE ${res.checklistname}_name = ?`;
      //     await db.query(deleteExamineQuery, [res.todo]);

        
      //     return NextResponse.json({ success: true , message: 'delete successfully!'});
      //   } catch (error) {
      //     console.error('ErrorEditEx:', error);
      //     return NextResponse.json({ success: false, error: error.message });
      //   }
      // }
      
      // const checkExamineQuery =  `SELECT ${res}_name FROM ${res}  `;
      // const [examineResult] = await db.query(checkExamineQuery);


      // const examineResultmap = examineResult.map(row => row[`${res}_name`]);

      // console.log("result_tableExamine: ",examineResultmap)
        

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
