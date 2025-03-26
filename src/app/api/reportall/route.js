import db from '../../../lib/db';
import { NextResponse } from 'next/server';
import { format } from 'date-fns';

export async function POST(request) {
  const fs = require('fs');
  if (request.method === 'POST') {
    
    const res = await request.json();
    try {
     console.log("RESS!1111!!!!!!!!!!!!!!!!!!!!!1: ",res ,res.storedId)


     if (res.fetch_role_2){



      const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; 
        const year = currentDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        // console.log("Date: ",formattedDate)

      const getQuery = "SELECT * FROM checklist_examine_row_2 WHERE date = ? AND r2_id = ?";
      const [Result] = await db.query(getQuery , [formattedDate , res.storedId]);

      //console.log("Data_examineWWWWWW: ",Result)
      const groupedData = {
        key: []
      };
     

      // วนลูป Array เพื่อจัดกลุ่ม
      for (const data of Result) {
        
         //console.log("ITEMMM//////////////////////////",data);
        const { utcToZonedTime } = require('date-fns-tz');
        const timeZone = 'Asia/Bangkok';
  
        const inspector  = data.inspector;
        const inputDate = new Date(data.send_date);
        // const formattedDatenew = format(utcToZonedTime(inputDate, timeZone), 'dd/MM/yyyy HH:mm', { timeZone });
        // console.log("yyyy-MM-dd HH:mm",formattedDatenew);



    // ในที่นี้, คุณไม่ได้ใช้ inspector หรือ inputDate ซ้ำ
    // และไม่จำเป็นต้องใช้ Promise.all
      const formattedDatenew = format(inputDate, 'dd/MM/yyyy HH:mm');
      // data.formattedDate = formattedDateA;
       //console.log("Formatted Date", formattedDatenew);

        // const dateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
        // const dateTime = inputDate.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' , year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });

        // console.log("Formatted Date: ", dateTime);
        // groupedData[inspector].date = dateTime;
        // groupedData[key].items.push(data);


        const nameInspector = "SELECT name,lastname,position,employee,role_2_id FROM users WHERE id = ?";
        const [nameInspectorResult] = await db.query(nameInspector, [data.inspector]);
        
        //console.log("nameResult4444: ", nameInspectorResult);
        const name = nameInspectorResult[0].name + ' ' + nameInspectorResult[0].lastname;
         //console.log("NAMEEENAMEEE",name);
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; 
        const year = currentDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
  
        const getIdQuery = "SELECT select_id FROM `select` WHERE date = ? AND user_id = ?";
        const [idResult] = await db.query(getIdQuery, [formattedDate ,data.inspector]);
        const idResultmap = idResult.map(row => row.select_id)[0]; // Extract the string from the array
        // console.log("4444idResult: ", idResultmap);
  
        let item_id = [];
  
        // Check if idResultmap is defined before parsing
        if (idResultmap) {
          try {
            item_id = JSON.parse(idResultmap);
             //console.log("Parsed item_id: ", item_id);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            // Handle the error appropriately, e.g., log the error or set a default value
          }
        } else {
          console.warn("idResultmap is undefined or null");
          // Handle the case where idResultmap is undefined or null
        }
        
        const nameList = [];
        let flattenedNameList = []
      
        for (const item of item_id) {
           //console.log("4444: ",item)
      
          const getNameExamineListQuery = "SELECT name FROM examinelist WHERE id = ? AND user_id = ?";
          const [nameExamineListResult] = await db.query(getNameExamineListQuery, [item, data.inspector]);
      
          // const nameExamineListResultmap = nameExamineListResult.map(row => row.name);
          nameList.push(nameExamineListResult);
          //console.log("nameList: ", nameList);
          flattenedNameList = nameList.flatMap(zone => zone.map(item => item.name));
           //console.log("Flattened nameList: ", flattenedNameList);
          // const uniqueFlattenedNameList = [...new Set(flattenedNameList)];
          // console.log("Unique flattened nameList: ", uniqueFlattenedNameList);
          
        }

        const dataitem = {
          date: formattedDatenew,
          id: data.inspector,
          name: name,
          zone: flattenedNameList

        };
        console.log("resultGrouppppppppp", dataitem);
        if (!groupedData.key.some(item => item.id === data.inspector)) {
          dataitem[inspector] = [];
          dataitem[inspector].push();
          groupedData.key.push(dataitem);
          
          
        } else {
          const existingItem = groupedData.key.find(item => item.id === data.inspector);
          existingItem[inspector].push(data);
          //existingItem.items.push(data);
        }
      

        // เพิ่มข้อมูลลงในกลุ่มที่เป็น key เดียวกัน
         console.log("resultGroup", groupedData);

        
      };

      // แสดงผลลัพธ์
       console.log("resultGroup",res.storedId);
     

      const calPercent = []
      let reversedCalPercentCopy = []
      const getChecklist_R2Query = "SELECT DISTINCT date FROM checklist_examine_row_2 WHERE r2_id = ?";
        const [getChecklist_R2QueryResult] = await db.query(getChecklist_R2Query, [res.storedId]);
   
        // console.log("Distinct Dates:", getChecklist_R2QueryResult.map(result => result.date));
        // console.log("Number of Dates:", getChecklist_R2QueryResult.length);
        
        // for (const i in getChecklist_R2QueryResult.map(result => result.date)) {
        //   if ( i === formattedDate) {
        //   } 
        // }
        const dateArray = getChecklist_R2QueryResult.map(result => result.date);

        
        // console.log("Reversed Distinct Dates:", dateArray);

        const hasMatchingDate = dateArray.includes(formattedDate);
         if (!hasMatchingDate) {
            dateArray.push(formattedDate);
            // console.log("Reversed Distinct Dates22222:", dateArray);
            dateArray.reverse();

            dateArray.splice(1);
          } else {
            dateArray.splice(1);
          }
          // dateArray.reverse();

        // console.log(`Does the checklist have a date matching ${formattedDate}? ${hasMatchingDate}`);
        // console.log("DATEE-------------------: ",dateArray)
        // let recentDates = getChecklist_R2QueryResult.map(result => result.date);
        // const currentDate = new Date();
        // const formattedCurrentDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
        let formattedDateA; // Declare outside the if-else block
        // const day = currentDate.getDate() ;
        // const month = currentDate.getMonth() + 1; 
        // const year = currentDate.getFullYear();
        // let Date = `${day}/${month}/${year}`;
        // const dateArray = [formattedDate];

        
        // console.log("DATEE1111-------------------: ",getChecklist_R2QueryResult.length , getChecklist_R2QueryResult)
        // If there are more than 5 dates, take the most recent 5
        if (dateArray.length >= 1) {
          // const day = currentDate.getDate() - 5;
          // const month = currentDate.getMonth() + 1; 
          // const year = currentDate.getFullYear();
          // formattedDateA = `${day}/${month}/${year}`;
          if (!dateArray.includes(formattedDate)) {
            dateArray.push(formattedDate);
            dateArray.reverse();
            dateArray.splice(1);
            dateArray.reverse();

           
          } else if (dateArray.includes(formattedDate)) {
            while (dateArray.length < 1) {
              // console.log("CHECKKKKK///////////////////2222: ",dateArray)

              currentDate.setDate(currentDate.getDate() - 1);
            
              const day = currentDate.getDate();
              const month = currentDate.getMonth() + 1; 
              const year = currentDate.getFullYear();
              const formattedDateI = `${day}/${month}/${year}`;
            
              if (!dateArray.includes(formattedDateI)) {
                dateArray.unshift(formattedDateI);
              }            
            }
          } 
          else {
          while (dateArray.length < 1) {
            currentDate.setDate(currentDate.getDate() - 1);
          
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; 
            const year = currentDate.getFullYear();
            const formattedDateI = `${day}/${month}/${year}`;

            if (!dateArray.includes(formattedDateI)) {
              dateArray.unshift(formattedDateI);
            }
          }
            // Add the formatted date to the beginning of the array only if it's not already present
            
          }
          
          
          } else if ( getChecklist_R2QueryResult.length < 1){
            while (dateArray.length <= (getChecklist_R2QueryResult.length - 1)) {

            currentDate.setDate(currentDate.getDate() - 1);
          
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; 
            const year = currentDate.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            
            // Add the formatted date to the beginning of the array only if it's not already present
            if (!dateArray.includes(formattedDate)) {
              dateArray.unshift(formattedDate);
            }
          }
          // If less than 5 days, adjust day calculation
          // const day = currentDate.getDate() - (getChecklist_R2QueryResult.length - 1);
          // const month = currentDate.getMonth() + 1; 
          // const year = currentDate.getFullYear();
          // formattedDateA = `${day}/${month}/${year}`;
        }
        // console.log("Date Array*********************************:", dateArray);

        // console.log("Recent Dates:", formattedDateA );

        // Subtract one day at a time until dateArray has 5 elements
        // const currentDatenew = new Date();
        // const formattedDateNew = currentDatenew.toLocaleDateString('en-GB');
        const currentDatenew = new Date();
        const dayN = currentDatenew.getDate();
        const monthN = currentDatenew.getMonth() + 1; 
        const yearN = currentDatenew.getFullYear();
        const formattedDateNew = `${dayN}/${monthN}/${yearN}`;
        console.log("kkkkkkkkkkk",formattedDateNew);
        
        for (const currentDateA of dateArray) {
          const getId_r1Query = "SELECT id FROM users WHERE role_2_id = ?";
          const [getId_r1QueryResult] = await db.query(getId_r1Query, [res.storedId]);
          const getId_r1QueryResultMap = getId_r1QueryResult.map(item => item.id);
          
          
        
          const dataAll = { currentDateA };
          const dataPercent = {};
        
          const userPromises = getId_r1QueryResultMap.map(async (user_r1) => {
            const getCheckUser_R2Query = `
              SELECT DISTINCT inspector FROM (
                SELECT inspector FROM checklist_examine_row_2 WHERE r2_id = ? AND date = ?
                UNION
                SELECT inspector FROM checklist_employee_row_2 WHERE users_r2_id = ? AND date = ?
              ) AS combinedResult;`;
            const [getCheckUser_R2QueryResult] = await db.query(getCheckUser_R2Query, [res.storedId, formattedDateNew, res.storedId, formattedDateNew]);
            const distinctInspectors = getCheckUser_R2QueryResult.map(result => result.inspector);
            //console.log("kkkkkttttttttkkkkk",getCheckUser_R2QueryResult);
            //console.log("kkkเเเเเเเเเเเเเเ",distinctInspectors);
        
            if (distinctInspectors.includes(user_r1)) {
              const getIdQuery = "SELECT select_id FROM `select` WHERE date = ? AND user_id = ?";
              const [idResult] = await db.query(getIdQuery, [currentDateA, user_r1]);
              const item_id = idResult[0]?.select_id ? JSON.parse(idResult[0].select_id) : [];
              //console.log("kkkเเเเเเเเเเเเเเ",item_id);
        
              const examinePromises = item_id.map(async (item) => {
                const getNameExamineListQuery = "SELECT id, name FROM examinelist WHERE id = ? AND user_id = ?";
                const [nameExamineListResult] = await db.query(getNameExamineListQuery, [item, user_r1]);
                //console.log("kkkเเเเเเเเเเเเเเ",nameExamineListResult);
                return nameExamineListResult;
              });
        
              const flattenedNameList = (await Promise.all(examinePromises)).flat();
        
              dataPercent[user_r1] = flattenedNameList.map(({ id, name }) => ({
                [id]: { examine_id: [], examine_count: flattenedNameList.length },
                name,
              }));
            }
          });
        
          await Promise.all(userPromises);
          
        
          for (const userId in dataPercent) {
            const idArray = dataPercent[userId];
            const examinePromises = idArray.map(async (idObject) => {
              const idValue = Object.keys(idObject)[0];
              const getExamineQuery = "SELECT id, useEmployee FROM examine WHERE examinelist_id = ?";
              const [getExamineQueryResult] = await db.query(getExamineQuery, [idValue]);
              //console.log("kkkเเเเเเเเเเเเเเ",getExamineQueryResult);
              
        
              const examine_idArray = idObject[idValue].examine_id;
              let totalPercentage = 0;

              await Promise.all(getExamineQueryResult.map(async (examineInfo) => {
                const getexaminenameQuery = "SELECT id FROM examinename WHERE examine_id = ?";
                const [getexaminenameQueryResult] = await db.query(getexaminenameQuery, [examineInfo.id]);
                const getexaminenameQueryResultMap = getexaminenameQueryResult.map(item => item.id);
                examineInfo.name_id = getexaminenameQueryResultMap;

                if (examineInfo.useEmployee === 'false') {
                  const getChecklist_R2Query = "SELECT status FROM checklist_examine_row_2 WHERE examine_id = ? AND date = ?";
                  const [checklistResult] = await db.query(getChecklist_R2Query, [examineInfo.id, currentDateA]);
                  const passCount = checklistResult.filter(item => item.status === 'pass').length;
                  const percentage = getexaminenameQueryResultMap.length > 0
                    ? Math.floor((passCount / getexaminenameQueryResultMap.length) * 100)
                    : 0;

                  examineInfo.percentage = percentage;
                  totalPercentage += percentage;

                } else if (examineInfo.useEmployee === 'true') {
                  const getemployeeQuery = "SELECT id FROM employee WHERE examinelist_id = ?";
                  const [getemployeeQueryResult] = await db.query(getemployeeQuery, [idValue]);
                  const getemployeeQueryResultMap = getemployeeQueryResult.map(item => item.id);

                  let totalPassCount = 0;
                  for (const employee of getemployeeQueryResultMap) {
                    const getChecklist_R2Query = "SELECT status FROM checklist_employee_row_2 WHERE examine_id = ? AND employee_name_id = ? AND date = ?";
                    const [checklistResult] = await db.query(getChecklist_R2Query, [examineInfo.id, employee, currentDateA]);
                    const passCount = checklistResult.filter(item => item.status === 'pass').length;
                    totalPassCount += passCount;

                    const employeePercentage = Math.floor((passCount / checklistResult.length) * 100);
                    examineInfo[employee] = { employee, passCount, employeePercentage };
                  }

                  const percentageAll = Math.floor((totalPassCount / (getexaminenameQueryResultMap.length * getemployeeQueryResultMap.length)) * 100);
                  examineInfo.percentageAll = percentageAll;
                  totalPercentage += percentageAll;
                }
                examine_idArray.push({ examineInfo });
              }));
        
              idObject.percentageZone = Math.min(Math.floor((totalPercentage / (idObject[idValue].examine_id.length * 100)) * 100), 100);
            });
        
            await Promise.all(examinePromises);
          }
        
          dataAll.data = dataPercent;
          calPercent.push(dataAll);
        }
        
        //return NextResponse.json({ success: true, percent: calPercent.reverse() });
        return NextResponse.json({ success: true ,dbnotify_name: groupedData ,percent: calPercent.reverse() });
        
    }



    if (res.fetch_role_3){

      const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; 
        const year = currentDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        // console.log("Date: ",formattedDate)

      const getQuery = "SELECT * FROM checklist_examine_row_2 WHERE date = ?  ";
      const [Result] = await db.query(getQuery , [formattedDate ]);

      // console.log("++++++++++++++++++++, ",Result)
      // console.log("Data_examineWWWWWW: ",Result)
      const groupedData = {
        key: []}
        ;
     

      // วนลูป Array เพื่อจัดกลุ่ม
      for (const data of Result) {
        
        // console.log("ITEMMM",item.inspector);

        // console.log("ITEMMM//////////////////////////",data);
        const { utcToZonedTime } = require('date-fns-tz');
        const timeZone = 'Asia/Bangkok';
  
        const inspector  = data.inspector;
        const inputDate = new Date(data.send_date);
        // const formattedDatenew = format(utcToZonedTime(inputDate, timeZone), 'dd/MM/yyyy HH:mm', { timeZone });
        // console.log("yyyy-MM-dd HH:mm",formattedDatenew);

       

    // ในที่นี้, คุณไม่ได้ใช้ inspector หรือ inputDate ซ้ำ
    // และไม่จำเป็นต้องใช้ Promise.all
      const formattedDatenew = format(inputDate, 'dd/MM/yyyy HH:mm');
      // console.log("Formatted Date", formattedDatenew);
        // const dateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
        // const dateTime = inputDate.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' , year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });

        // console.log("Formatted Date: ", dateTime);


        const nameInspector = "SELECT name,lastname FROM users WHERE id = ?";
        const [nameInspectorResult] = await db.query(nameInspector, [data.inspector]);
        
        // console.log("nameResult4444: ", nameInspectorResult);
        const name = nameInspectorResult[0].name + ' ' + nameInspectorResult[0].lastname;
        // console.log("NAMEEENAMEEE",name);
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; 
        const year = currentDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
  
        const getIdQuery = "SELECT select_id FROM `select` WHERE date = ? AND user_id = ?";
        const [idResult] = await db.query(getIdQuery, [formattedDate ,data.inspector]);
        const idResultmap = idResult.map(row => row.select_id)[0]; // Extract the string from the array
        // console.log("4444idResult: ", idResultmap);
  
        let item_id = [];
  
        // Check if idResultmap is defined before parsing
        if (idResultmap) {
          try {
            item_id = JSON.parse(idResultmap);
            // console.log("Parsed item_id: ", item_id);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            // Handle the error appropriately, e.g., log the error or set a default value
          }
        } else {
          console.warn("idResultmap is undefined or null");
          // Handle the case where idResultmap is undefined or null
        }
        
        const nameList = [];
        let flattenedNameList = []
      
        for (const item of item_id) {
          // console.log("4444: ",item)
      
          const getNameExamineListQuery = "SELECT name FROM examinelist WHERE id = ? AND user_id = ?";
          const [nameExamineListResult] = await db.query(getNameExamineListQuery, [item, data.inspector]);
      
          // const nameExamineListResultmap = nameExamineListResult.map(row => row.name);
          nameList.push(nameExamineListResult);
          // console.log("nameList: ", nameList);
          flattenedNameList = nameList.flatMap(zone => zone.map(item => item.name));
          // console.log("Flattened nameList: ", flattenedNameList);
          // const uniqueFlattenedNameList = [...new Set(flattenedNameList)];
          // console.log("Unique flattened nameList: ", uniqueFlattenedNameList);
          
        }

        const dataitem = {
          date: formattedDatenew,
          id: data.inspector,
          name: name,
          zone: flattenedNameList

        };
        console.log("dataitem...",dataitem)
        
        if (!groupedData.key.some(item => item.id === data.inspector)) {
          dataitem[inspector] = [];
          dataitem[inspector].push();
          groupedData.key.push(dataitem);
        } else {
          const existingItem = groupedData.key.find(item => item.id === data.inspector);
          existingItem[inspector].push(data);
        }
      

        // เพิ่มข้อมูลลงในกลุ่มที่เป็น key เดียวกัน
         console.log("resultGroup", groupedData);

        
      };

      // แสดงผลลัพธ์
      // console.log("resultGroup",res.storedId);
      const calPercent = []
      let reversedCalPercentCopy = []
      let item_id = [];

      const getChecklist_R2Query = "SELECT DISTINCT date FROM checklist_examine_row_2 ";
        const [getChecklist_R2QueryResult] = await db.query(getChecklist_R2Query);
   
        // console.log("Distinct Dates:", getChecklist_R2QueryResult.map(result => result.date));
        // console.log("Number of Dates:", getChecklist_R2QueryResult.length);
        
        // for (const i in getChecklist_R2QueryResult.map(result => result.date)) {
        //   if ( i === formattedDate) {
        //   } 
        // }
        const dateArray = getChecklist_R2QueryResult.map(result => result.date);

        
        // console.log("Reversed Distinct Dates:", dateArray);

        const hasMatchingDate = dateArray.includes(formattedDate);
         if (!hasMatchingDate) {
            dateArray.push(formattedDate);
            // console.log("Reversed Distinct Dates22222:", dateArray);
            dateArray.reverse();

            dateArray.splice(1);
          } else {
            dateArray.splice(1);
          }
          // dateArray.reverse();

        // console.log(`Does the checklist have a date matching ${formattedDate}? ${hasMatchingDate}`);
        // console.log("DATEE-------------------: ",dateArray)
        // let recentDates = getChecklist_R2QueryResult.map(result => result.date);
        // const currentDate = new Date();
        // const formattedCurrentDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
        let formattedDateA; // Declare outside the if-else block
        // const day = currentDate.getDate() ;
        // const month = currentDate.getMonth() + 1; 
        // const year = currentDate.getFullYear();
        // let Date = `${day}/${month}/${year}`;
        // const dateArray = [formattedDate];

        
        // console.log("DATEE1111-------------------: ",getChecklist_R2QueryResult.length , getChecklist_R2QueryResult)
        // If there are more than 5 dates, take the most recent 5
        if (dateArray.length >= 1) {
          // const day = currentDate.getDate() - 5;
          // const month = currentDate.getMonth() + 1; 
          // const year = currentDate.getFullYear();
          // formattedDateA = `${day}/${month}/${year}`;
          if (!dateArray.includes(formattedDate)) {
            dateArray.push(formattedDate);
            dateArray.reverse();
            dateArray.splice(1);
            dateArray.reverse();

           
          } else if (dateArray.includes(formattedDate)) {
            while (dateArray.length < 1) {
              // console.log("CHECKKKKK///////////////////2222: ",dateArray)

              currentDate.setDate(currentDate.getDate() - 1);
            
              const day = currentDate.getDate();
              const month = currentDate.getMonth() + 1; 
              const year = currentDate.getFullYear();
              const formattedDateI = `${day}/${month}/${year}`;
            
              if (!dateArray.includes(formattedDateI)) {
                dateArray.unshift(formattedDateI);
              }            
            }
          } 
          else {
          while (dateArray.length < 1) {
            currentDate.setDate(currentDate.getDate() - 1);
          
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; 
            const year = currentDate.getFullYear();
            const formattedDateI = `${day}/${month}/${year}`;

            if (!dateArray.includes(formattedDateI)) {
              dateArray.unshift(formattedDateI);
            }
          }
            // Add the formatted date to the beginning of the array only if it's not already present
            
          }
          
          
          } else if ( getChecklist_R2QueryResult.length < 1){
            while (dateArray.length <= (getChecklist_R2QueryResult.length - 1)) {

            currentDate.setDate(currentDate.getDate() - 1);
          
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; 
            const year = currentDate.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            
            // Add the formatted date to the beginning of the array only if it's not already present
            if (!dateArray.includes(formattedDate)) {
              dateArray.unshift(formattedDate);
            }
          }
          // If less than 5 days, adjust day calculation
          // const day = currentDate.getDate() - (getChecklist_R2QueryResult.length - 1);
          // const month = currentDate.getMonth() + 1; 
          // const year = currentDate.getFullYear();
          // formattedDateA = `${day}/${month}/${year}`;
        }
        // console.log("Date Array:", dateArray);

        // console.log("Recent Dates:", formattedDateA );

        // Subtract one day at a time until dateArray has 5 elements
     
        const currentDatenew = new Date();
        const dayN = currentDatenew.getDate();
        const monthN = currentDatenew.getMonth() + 1; 
        const yearN = currentDatenew.getFullYear();
        const formattedDateNew = `${dayN}/${monthN}/${yearN}`;
     
        for (const currentDateA of dateArray) {
          // console.log("currentDate :", currentDateA );

      const getId_r1Query = "SELECT id FROM users ";
      const [getId_r1QueryResult] = await db.query(getId_r1Query);
      const getId_r1QueryResultMap = getId_r1QueryResult.map(item => item.id);
      const dataAll = {currentDateA}
      const dataPercent = {};
    
        const userPromises = getId_r1QueryResultMap.map(async (user_r1) => {
          const getCheckUser_R2Query = `
            SELECT DISTINCT inspector FROM (
              SELECT inspector FROM checklist_examine_row_2 WHERE  date = ?
              UNION
              SELECT inspector FROM checklist_employee_row_2 WHERE  date = ?
            ) AS combinedResult;`;
          const [getCheckUser_R2QueryResult] = await db.query(getCheckUser_R2Query, [res.storedId, formattedDateNew, res.storedId, formattedDateNew]);
         
          const distinctInspectors = getCheckUser_R2QueryResult.map(result => result.inspector);
          console.log("distinctInspectors :", distinctInspectors );
          //console.log("kkkkkttttttttkkkkk",getCheckUser_R2QueryResult);
          //console.log("kkkเเเเเเเเเเเเเเ",distinctInspectors);
        // console.log("distinctInspectors: ",user_r1,distinctInspectors,res.storedId ,formattedDateNew)

        if (distinctInspectors.includes(user_r1)) {
          const getIdQuery = "SELECT select_id FROM `select` WHERE date = ? AND user_id = ?";
          const [idResult] = await db.query(getIdQuery, [currentDateA, user_r1]);
          const item_id = idResult[0]?.select_id ? JSON.parse(idResult[0].select_id) : [];
          //console.log("kkkเเเเเเเเเเเเเเ",item_id);

          const examinePromises = item_id.map(async (item) => {
            const getNameExamineListQuery = "SELECT id, name FROM examinelist WHERE id = ? AND user_id = ?";
            const [nameExamineListResult] = await db.query(getNameExamineListQuery, [item, user_r1]);
            //console.log("kkkเเเเเเเเเเเเเเ",nameExamineListResult);
            return nameExamineListResult;
          });
    
          const flattenedNameList = (await Promise.all(examinePromises)).flat();
    
          dataPercent[user_r1] = flattenedNameList.map(({ id, name }) => ({
            [id]: { examine_id: [], examine_count: flattenedNameList.length },
            name,
          }));
        }
      });
    
      await Promise.all(userPromises);
      
      let totalPercentageAllZones = 0;
      const zonePercentages = [];

          for (const userId in dataPercent) {
            const idArray = dataPercent[userId];
            const examinePromises = idArray.map(async (idObject) => {
              const idValue = Object.keys(idObject)[0];
              const getExamineQuery = "SELECT id, useEmployee FROM examine WHERE examinelist_id = ?";
              const [getExamineQueryResult] = await db.query(getExamineQuery, [idValue]);

              const examine_idArray = idObject[idValue].examine_id;
              let totalPercentage = 0;

              await Promise.all(getExamineQueryResult.map(async (examineInfo) => {
                const getexaminenameQuery = "SELECT id FROM examinename WHERE examine_id = ?";
                const [getexaminenameQueryResult] = await db.query(getexaminenameQuery, [examineInfo.id]);
                const getexaminenameQueryResultMap = getexaminenameQueryResult.map(item => item.id);
                examineInfo.name_id = getexaminenameQueryResultMap;

                if (examineInfo.useEmployee === 'false') {
                  const getChecklist_R2Query = "SELECT date , examinename_id ,	status FROM checklist_examine_row_2 WHERE  examine_id = ? AND date = ?";
                  const [checklistResult] = await db.query(getChecklist_R2Query, [examineInfo.id, currentDateA]);
                  const passCount = checklistResult.filter(item => item.status === 'pass').length;
                  const percentage = getexaminenameQueryResultMap.length > 0
                    ? Math.floor((passCount / getexaminenameQueryResultMap.length) * 100)
                    : 0;

                  examineInfo.percentage = percentage;
                  totalPercentage += percentage;

                } else if (examineInfo.useEmployee === 'true') {
                  const getemployeeQuery = "SELECT id FROM employee WHERE examinelist_id = ?";
                  const [getemployeeQueryResult] = await db.query(getemployeeQuery, [idValue]);
                  const getemployeeQueryResultMap = getemployeeQueryResult.map(item => item.id);

                  let totalPassCount = 0;
                  for (const employee of getemployeeQueryResultMap) {
                    const getChecklist_R2Query = "SELECT  examinename_id ,	status FROM checklist_employee_row_2 WHERE  examine_id = ? AND employee_name_id = ? AND date = ?";
                    const [checklistResult] = await db.query(getChecklist_R2Query, [examineInfo.id, employee, currentDateA]);
                    const passCount = checklistResult.filter(item => item.status === 'pass').length;
                    totalPassCount += passCount;

                    const employeePercentage = checklistResult.length > 0 
                      ? Math.floor((passCount / checklistResult.length) * 100) 
                      : 0;
                    examineInfo[employee] = { employee, passCount, employeePercentage };
                  }

                  const percentageAll = (getexaminenameQueryResultMap.length * getemployeeQueryResultMap.length) > 0
                    ? Math.floor((totalPassCount / (getexaminenameQueryResultMap.length * getemployeeQueryResultMap.length)) * 100)
                    : 0;
                  examineInfo.percentageAll = percentageAll;
                  totalPercentage += percentageAll;
                }

                examine_idArray.push({ examineInfo });
              }));

              idObject.percentageZone = totalPercentage;
              zonePercentages.push({ idValue, totalPercentage });
              totalPercentageAllZones += totalPercentage;
            });

            await Promise.all(examinePromises);
          }

          // ✅ กระจายเปอร์เซ็นต์ใหม่ให้ทุกโซนรวมกันเป็น 100%
          zonePercentages.forEach((zone) => {
            zone.normalizedPercentage = totalPercentageAllZones > 0 
              ? Math.round((zone.totalPercentage / totalPercentageAllZones) * 100)
              : 0;
          });

          // ✅ อัปเดตค่า percentageZone ใหม่
          for (const userId in dataPercent) {
            const idArray = dataPercent[userId];
            idArray.forEach((idObject) => {
              const idValue = Object.keys(idObject)[0];
              const zone = zonePercentages.find(z => z.idValue === idValue);
              if (zone) {
                idObject.percentageZone = zone.normalizedPercentage;
              }
            });
          }
      dataAll.data = dataPercent
      // console.log(dataAll. currentDateA); // แสดงค่า currentDate ที่อยู่ในอ็อบเจ็กต์ dataAll

      // console.log("Final dataPercent:", dataPercent);
      // console.log("Final dataPercent dataAll ------------------------:",  dataAll);
      calPercent.push(dataAll)
      reversedCalPercentCopy = [...calPercent].reverse();
      // console.log("CalPercentCopy----------------:", calPercent);
      // console.log("reversedCalPercentCopy----------------:", reversedCalPercentCopy);
      groupedData.key.reverse();
    

    }
      return NextResponse.json({ success: true ,dbnotify_name: groupedData ,percent: reversedCalPercentCopy});
    }

    if (res.responseDetail) {
      try {

        // const getfileQuery = 'SELECT file FROM notify WHERE title = ?';
        // const [fileResult] = await db.query(getfileQuery,[res.responseValue]);
      
        // console.log("file: ",fileResult[0].file)



        const getQuery = 'SELECT * FROM notify WHERE id = ?';
        const [responseResult] = await db.query(getQuery ,[res.id]);

        // console.log("rusultRoot: ",responseResult)

        return NextResponse.json({ success: true , message: 'successfully!' , responseResult: responseResult});
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }

    if (res.responseDetail_role_3) {
      try {


        const getQuery = "SELECT * FROM notify WHERE id = ?";
        const [responseResult] = await db.query(getQuery , [res.idValue]);


        // console.log("rusultRoot: ",responseResult)

        return NextResponse.json({ success: true , message: 'successfully!' , responseResult: responseResult});
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }


    
    if (res.response_role_2) {
      try {


        const getQuery = "SELECT * FROM notify WHERE Verification_status = 'Pending approval'";
        const [responseResult] = await db.query(getQuery);


        // console.log("rusultRoot: ",responseResult)

        return NextResponse.json({ success: true , message: 'successfully!' , responseResult: responseResult});
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }

    if (res.response_role_3) {
      try {


        const getQuery = "SELECT * FROM notify WHERE Verification_status = 'Approve'";
        const [responseResult] = await db.query(getQuery);


        // console.log("rusultRoot: ",responseResult)

        return NextResponse.json({ success: true , message: 'successfully!' , responseResult: responseResult});
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }

    } catch (error) {
      console.error('Error notify:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}