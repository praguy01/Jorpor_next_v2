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
  
        // console.log("employee: ",nameExamineListResultmap);
  
  
        return NextResponse.json({ success: true  , dbnameExamineList: nameExamineListResultmap});
        }


        

        if (res.option) {
          try {
            const idList = [];
            const resultDict = {};
            const fullName = [];
           
            const getUserIDQuery = "SELECT * FROM users WHERE id = ?";
            const [UserIDResult] = await db.query(getUserIDQuery, [res.id]);

            if (UserIDResult.length > 0 && UserIDResult[0].name && UserIDResult[0].lastname) {
              fullName.push(`${UserIDResult[0].name} ${UserIDResult[0].lastname}`) ;
              console.log("USER: ", fullName);
            } else {
              console.error("User not found or missing name/lastname information.");
            }    
                  
            for (const name of res.nameExamineList) {
              console.log("NAME: ", name);
              const getExamineIDQuery = "SELECT id FROM examinelist WHERE name = ?";
              const [examineIDResult] = await db.query(getExamineIDQuery, [name]);
        
              if (examineIDResult.length > 0) {
                const getIDExamineListQuery = "SELECT name FROM examine WHERE examinelist_id = ?";
                const [idExamineListResult] = await db.query(getIDExamineListQuery, [examineIDResult[0].id]);
        
                const idExamineListResultmap = idExamineListResult.map((row) => row.name);
        
                const getEmployeeQuery = "SELECT * FROM employee WHERE examinelist_id  = ?";
                const [employeeResult] = await db.query(getEmployeeQuery, [examineIDResult[0].id]);
        
                idList.push({ name, employee: employeeResult,  examine: idExamineListResultmap });
              } else {
                console.error(`No id found for ${name}`);
              }
            }
        
            console.log("Send: ", idList);
        
            const currentDate = new Date();
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; // Adding 1 because January starts at 0
            const year = currentDate.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
        
            console.log("Date: ", formattedDate);
            const resultList = {
              date: formattedDate, // Add the date property
              inspector: fullName[0], // Add the inspector property
              items: []
            };
            // Loop through each item in idList
            for (const data of idList) {
              console.log("Examinename: ", data.name);
              const currentItem = {
              
                name: data.name,
                examine: {}
              };
        
              // Loop through each examine in the examine property of the current item
              for (const examine of data.examine) {
                console.log("Examine: ", examine);
        
                try {
                  const getExaminelistIDQuery = "SELECT id FROM examinelist WHERE name = ?";
                  const [examinelistIDResult] = await db.query(getExaminelistIDQuery, [data.name]);
                  console.log("Examinelist ID: ", examinelistIDResult[0].id);
        
                  const getExamineNameQuery = "SELECT id FROM examine WHERE name = ? AND examinelist_id = ?";
                  const [examineNameResult] = await db.query(getExamineNameQuery, [examine, examinelistIDResult[0].id]);
                  console.log("Examine ID: ", examineNameResult[0].id);
        
                  const dataChecklistQuery = `
                    SELECT 
                    checklist_examine.*, 
                    examinelist.name AS examinelist, 
                    examinename.name AS examinename, 
                    examine.name AS examine, 
                    users.name AS name, 
                    users.lastname AS lastname
                    FROM checklist_examine
                    JOIN examinelist ON checklist_examine.examinelist_id = examinelist.id
                    JOIN examinename ON checklist_examine.examinename_id = examinename.id
                    JOIN examine ON checklist_examine.examine_id = examine.id
                    JOIN users ON checklist_examine.inspector = users.id
                    WHERE checklist_examine.date = ? 
                    AND checklist_examine.examine_id = ?  
                    AND checklist_examine.examinelist_id = ?                  
                    `;
        
                  const [dataChecklistQueryResult] = await db.query(dataChecklistQuery, [formattedDate, examineNameResult[0].id, examinelistIDResult[0].id]);
        
                  console.log("dataChecklistQueryResult: ", dataChecklistQueryResult);

                  // Use the name property as a key in the dictionary
                  // Use the name property as a key in the dictionary
                  if (!currentItem.examine[examine]) {
                    currentItem.examine[examine] = [];
                  }
            
                  // Push the results into the nested dictionary under the examine key
                  currentItem.examine[examine].push(...dataChecklistQueryResult);
                  
                } catch (error) {
                  console.error('Error executing query:', error);
                }
              }
              resultList.items.push(currentItem);

            }
        
            // Convert the dictionary values into an array
            // const resultList = Object.values(resultDict);
        
            console.log("ResultList: ", resultList);
        
            return NextResponse.json({ success: true, dbData: resultList });
          } catch (error) {
            console.error('ErrorEditEx:', error);
            return NextResponse.json({ success: false, error: error.message });
          }
        }
        
        

        
    // if (res.selectExamine) {
    //   try {
    //     // หา ID จากตาราง examine โดยใช้ชื่อที่มาจาก selectedOption
        
    //     const currentDate = new Date();
    //     const day = currentDate.getDate();
    //     const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากมกราคมเริ่มที่ 0
    //     const year = currentDate.getFullYear();
    //     const formattedDate = `${day}/${month}/${year}`;

    //     console.log("Date: ",formattedDate)

    //     const getExaminelistIDQuery = "SELECT id FROM examinelist WHERE name = ?";
    //     const [examinelistIDResult] = await db.query(getExaminelistIDQuery, [res.selectedOption]);

    //     console.log("000000000000000000: ",examinelistIDResult[0].id)
    
    //     // หาชื่อของ examinelist โดยใช้ ID จาก selectedExamineOption
    //     const getExamineNameQuery = "SELECT id FROM examine WHERE name = ? AND examinelist_id = ?";
    //     const [examineNameResult] = await db.query(getExamineNameQuery, [res.selectedExamineOption , examinelistIDResult[0].id]);
    //     console.log("1111111111111111111: ",examineNameResult[0].id)

    //     if (examineNameResult.length > 0) {
    //       const dataChecklistQuery = `
    //       SELECT 
    //         checklist_examine.*, 
    //         examinename.name AS examinename, 
    //         examine.name AS examine, 
    //         users.name AS name, 
    //         users.lastname AS lastname
    //       FROM checklist_examine
    //       JOIN examinename ON checklist_examine.examinename_id = examinename.id
    //       JOIN examine ON checklist_examine.examine_id = examine.id
    //       JOIN users ON checklist_examine.inspector = users.id
    //       WHERE checklist_examine.date = ? AND checklist_examine.examine_id = ? AND checklist_examine.examinelist_id = ?;
    //     `;

    //     const [dataChecklistQueryResult] = await db.query(dataChecklistQuery ,[formattedDate , examineNameResult[0].id ,examinelistIDResult[0].id])

    //     console.log("listdata: ",dataChecklistQueryResult);
       
    
    //       return NextResponse.json({ success: true, dbData: dataChecklistQueryResult});
    //     } else {
    //       return NextResponse.json({ success: false, error: "Examine not found" });
    //     }
    //    } catch (error) {
    //     console.error('ErrorEditEx:', error);
    //     return NextResponse.json({ success: false, error: error.message });
    //   }
    // }


  } 
  catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}