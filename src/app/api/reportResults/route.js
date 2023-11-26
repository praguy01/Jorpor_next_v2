import db from '../../../lib/db';
import { NextResponse } from 'next/server';


export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();

    try {
      const { fetchdata} = res;
      console.log("RES_ROUTE_examineRe11: ", res);
  
      if (res.fetch) {

        // const checkExaminelistQuery = "SELECT * FROM checklist_examine WHERE date = ? AND  inspector = ? ";
        // const [examinelistResult] = await db.query(checkExaminelistQuery, [res.dateValue , res.user_IdValue]);
  
        // console.log("list: ",examinelistResult);

        // const dataChecklistQuery = `
        //   SELECT 
        //     checklist_examine.*, 
        //     examinename.name AS examinename, 
        //     examine.name AS examine, 
        //     users.name AS name, 
        //     users.lastname AS lastname
        //   FROM checklist_examine
        //   JOIN examinename ON checklist_examine.examinename_id = examinename.id
        //   JOIN examine ON checklist_examine.examine_id = examine.id
        //   JOIN users ON checklist_examine.inspector = users.id
        //   WHERE checklist_examine.date = ? AND checklist_examine.inspector = ?;
        // `;

        // const [dataChecklistQueryResult] = await db.query(dataChecklistQuery ,[res.dateValue , res.user_IdValue])

        // console.log("listdata: ",dataChecklistQueryResult);

        const getNameExamineListQuery = "SELECT name FROM examinelist WHERE user_id = ?";
        const [nameExamineListResult] = await db.query(getNameExamineListQuery, [res.user_IdValue]);
  
        const nameExamineListResultmap = nameExamineListResult.map(row => row.name);
  
        console.log("employee: ",nameExamineListResultmap);
  
  
        return NextResponse.json({ success: true  , dbnameExamineList: nameExamineListResultmap});
        }


        

    if (res.option) {
      try {

        const getExamineIDQuery = "SELECT id FROM examinelist WHERE name = ?";
        const [examineIDResult] = await db.query(getExamineIDQuery, [res.selectedOption]);

        console.log("111: ",examineIDResult)
    
        const getIDExamineListQuery = "SELECT name FROM examine WHERE examinelist_id = ?";
        const [idExamineListResult] = await db.query(getIDExamineListQuery, [ examineIDResult[0].id ]);

        const idExamineListResultmap = idExamineListResult.map(row => row.name);

        console.log("WWW: ",idExamineListResultmap)

        const getEmployeeQuery = "SELECT * FROM employee WHERE examinelist_id  = ?";
        const [employeeResult] = await db.query(getEmployeeQuery, [ idExamineListResult[0].id ]);

       
      
        return NextResponse.json({ success: true ,dbemployee_name: employeeResult ,dbExamine: idExamineListResultmap });
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }

    }

    if (res.selectExamine) {
      try {
        // หา ID จากตาราง examine โดยใช้ชื่อที่มาจาก selectedOption
        
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากมกราคมเริ่มที่ 0
        const year = currentDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        console.log("Date: ",formattedDate)

        const getExaminelistIDQuery = "SELECT id FROM examinelist WHERE name = ?";
        const [examinelistIDResult] = await db.query(getExaminelistIDQuery, [res.selectedOption]);

        console.log("000000000000000000: ",examinelistIDResult[0].id)
    
        // หาชื่อของ examinelist โดยใช้ ID จาก selectedExamineOption
        const getExamineNameQuery = "SELECT id FROM examine WHERE name = ? AND examinelist_id = ?";
        const [examineNameResult] = await db.query(getExamineNameQuery, [res.selectedExamineOption , examinelistIDResult[0].id]);
        console.log("1111111111111111111: ",examineNameResult[0].id)

        if (examineNameResult.length > 0) {
          const dataChecklistQuery = `
          SELECT 
            checklist_examine.*, 
            examinename.name AS examinename, 
            examine.name AS examine, 
            users.name AS name, 
            users.lastname AS lastname
          FROM checklist_examine
          JOIN examinename ON checklist_examine.examinename_id = examinename.id
          JOIN examine ON checklist_examine.examine_id = examine.id
          JOIN users ON checklist_examine.inspector = users.id
          WHERE checklist_examine.date = ? AND checklist_examine.examine_id = ? AND checklist_examine.examinelist_id = ?;
        `;

        const [dataChecklistQueryResult] = await db.query(dataChecklistQuery ,[formattedDate , examineNameResult[0].id ,examinelistIDResult[0].id])

        console.log("listdata: ",dataChecklistQueryResult);
       
    
          return NextResponse.json({ success: true, dbData: dataChecklistQueryResult});
        } else {
          return NextResponse.json({ success: false, error: "Examine not found" });
        }
       } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }


  } 
  catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}