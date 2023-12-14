import axios from 'axios';
import db from '../../../lib/db';
import { NextResponse } from 'next/server';

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

      // console.log("Data_examineWWWWWW: ",Result)
      const groupedData = {
        date: '',
        key: []}
        ;
     

      // วนลูป Array เพื่อจัดกลุ่ม
      for (const data of Result) {
        
        // console.log("ITEMMM",item.inspector);

        const inspector  = data.inspector;

        const inputDate = new Date(data.send_date);

        // const dateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
        const dateTime = inputDate.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' , year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });

        // console.log("Formatted Date: ", dateTime);
        groupedData.date = dateTime;


        const nameInspector = "SELECT * FROM users WHERE id = ?";
        const [nameInspectorResult] = await db.query(nameInspector, [data.inspector]);
        
        // console.log("nameResult4444: ", nameInspectorResult);
        const name = nameInspectorResult[0].name + ' ' + nameInspectorResult[0].lastname;
        // console.log("NAMEEENAMEEE",name);
        const getexamineListQuery = "SELECT * FROM examinelist WHERE user_id = ?";
        const [getexamineListQueryResult] = await db.query(getexamineListQuery, [data.inspector]);
        
        const nameExamineList = getexamineListQueryResult.map(item => item.name);
        

        const dataitem = {
          id: data.inspector,
          name: name,
          zone: nameExamineList

        };
        
        if (!groupedData.key.some(item => item.id === data.inspector)) {
          dataitem[inspector] = [];
          dataitem[inspector].push();
          groupedData.key.push(dataitem);
        } else {
          const existingItem = groupedData.key.find(item => item.id === data.inspector);
          existingItem[inspector].push(data);
        }
      

        // เพิ่มข้อมูลลงในกลุ่มที่เป็น key เดียวกัน
        // console.log("resultGroup", groupedData);

        
      };

      // แสดงผลลัพธ์
      console.log("resultGroup",res.storedId);
      const calPercent = []
      const getChecklist_R2Query = "SELECT DISTINCT date FROM checklist_examine_row_2 WHERE r2_id = ?";
        const [getChecklist_R2QueryResult] = await db.query(getChecklist_R2Query, [res.storedId]);
   
        console.log("Distinct Dates:", getChecklist_R2QueryResult.map(result => result.date));
        console.log("Number of Dates:", getChecklist_R2QueryResult.length);
        
        // for (const i in getChecklist_R2QueryResult.map(result => result.date)) {
        //   if ( i === formattedDate) {
        //   } 
        // }
        const dateArray = getChecklist_R2QueryResult.map(result => result.date);

        const hasMatchingDate = dateArray.includes(formattedDate);
        console.log(`Does the checklist have a date matching ${formattedDate}? ${hasMatchingDate}`);
        console.log("DATEE-------------------: ",dateArray)
        // let recentDates = getChecklist_R2QueryResult.map(result => result.date);
        // const currentDate = new Date();
        // const formattedCurrentDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
        let formattedDateA; // Declare outside the if-else block
        // const day = currentDate.getDate() ;
        // const month = currentDate.getMonth() + 1; 
        // const year = currentDate.getFullYear();
        // let Date = `${day}/${month}/${year}`;
        // const dateArray = [formattedDate];

        if (!hasMatchingDate) {
          dateArray.push(formattedDate);
        }
        console.log("DATEE1111-------------------: ",dateArray)

        // If there are more than 5 dates, take the most recent 5
        if (getChecklist_R2QueryResult.length >= 5) {
          // const day = currentDate.getDate() - 5;
          // const month = currentDate.getMonth() + 1; 
          // const year = currentDate.getFullYear();
          // formattedDateA = `${day}/${month}/${year}`;

          while (dateArray.length < 5) {
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
          
          
          } else if ( getChecklist_R2QueryResult.length < 5){
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
        console.log("Date Array:", dateArray);

        console.log("Recent Dates:", formattedDateA );

        // Subtract one day at a time until dateArray has 5 elements
     
        for (const currentDateA of dateArray) {
          console.log("currentDate :", currentDateA );

      const getId_r1Query = "SELECT id FROM users WHERE role_2_id = ?";
      const [getId_r1QueryResult] = await db.query(getId_r1Query, [res.storedId]);
      const getId_r1QueryResultMap = getId_r1QueryResult.map(item => item.id);
      

      const dataAll = { currentDateA}
      const dataPercent = {};
      for (const user_r1 of getId_r1QueryResultMap) {
        
        
        const getexamineList_r1Query = "SELECT id , name FROM examinelist WHERE user_id = ?";
        const [getexamineList_r1QueryResult] = await db.query(getexamineList_r1Query, [user_r1]);
      console.log("getexamineList_r1QueryResult88888888: ",getexamineList_r1QueryResult)
        if (!dataPercent[user_r1]) {
          dataPercent[user_r1] = [];
        }

        
      
        for (const idResult of getexamineList_r1QueryResult ) {
          const examineObject = {
            [idResult.id]: {
              examine_id: [],
              examine_count: getexamineList_r1QueryResult.length
            }
            ,name: idResult.name,

          };
          console.log("id:: ",idResult.id , examineObject)

          dataPercent[user_r1].push(examineObject);
        }

      }
      
      for (const userId in dataPercent) {
        const idArray = dataPercent[userId];
      
        for (const idObject of idArray) {
          const idValue = Object.keys(idObject)[0];
          const getExamineQuery = "SELECT id, useEmployee FROM examine WHERE examinelist_id = ?";
          const [getExamineQueryResult] = await db.query(getExamineQuery, [idValue]);
      
          const examine_idArray = idObject[idValue].examine_id;
          let totalPercentage = 0;

          for (const examineInfo of getExamineQueryResult) {
            const currentDate = new Date();
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; 
            const year = currentDate.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            


              if ( examineInfo.useEmployee === 'false' ){
                
                const getexaminenameQuery = "SELECT 	id FROM examinename WHERE  examine_id = ? ";
                const [getexaminenameQueryResult] = await db.query(getexaminenameQuery, [examineInfo.id]);
                // console.log("getChecklist_R2QueryResult: ", examineInfo.id,getexaminenameQueryResult);

                const getexaminenameQueryResultMap = getexaminenameQueryResult.map(item => item.id);
                // console.log("getChecklist_R2QueryResultMap: ", getexaminenameQueryResultMap);
                examine_idArray.push({ examineInfo });

                examineInfo.name_id = getexaminenameQueryResultMap
                const getChecklist_R2Query = "SELECT date , examinename_id ,	status FROM checklist_examine_row_2 WHERE  examine_id = ? AND date = ? ";
                const [getChecklist_R2QueryResult] = await db.query(getChecklist_R2Query, [examineInfo.id ,  currentDateA]);
                console.log("11111111111111111111111111111: ", getChecklist_R2QueryResult ,  currentDateA);
                
                const passCount = getChecklist_R2QueryResult.filter(item => item.status === 'pass').length;

                const percentage = (passCount / getexaminenameQueryResultMap.length) * 100;

                console.log("getexaminenameQueryResultMap.length:", examineInfo.id);
                console.log("Percentage:", Math.floor(percentage), examineInfo.id);
                examineInfo.percentage = Math.floor(percentage);
                totalPercentage += percentage;
            } else if ( examineInfo.useEmployee === 'true' ){
              let totalPassCount = 0;


                examine_idArray.push({ examineInfo });

                const getexaminenameQuery = "SELECT 	id FROM examinename WHERE  examine_id = ? ";
                const [getexaminenameQueryResult] = await db.query(getexaminenameQuery, [examineInfo.id]);
                // console.log("getChecklist_R2QueryResult: ", examineInfo.id, getexaminenameQueryResult);

                const getexaminenameQueryResultMap = getexaminenameQueryResult.map(item => item.id);
                // console.log("getChecklist_R2QueryResultMap: ", examineInfo, getexaminenameQueryResultMap);
                // examine_idArray.push({ examineInfo, id: getexaminenameQueryResultMap });
                examineInfo.examinename = getexaminenameQueryResultMap
                const getemployeeQuery = "SELECT 	id FROM employee WHERE examinelist_id = ? ";
                const [getemployeeQueryResult] = await db.query(getemployeeQuery, [idValue]);
                const getemployeeQueryResultMap = getemployeeQueryResult.map(item => item.id);
                // console.log("8888888888: ", getemployeeQueryResultMap, idValue );

                for (const employee of getemployeeQueryResultMap){
                  console.log("99999: ",employee,examineInfo.id)
                const getChecklist_R2Query = "SELECT  examinename_id ,	status FROM checklist_employee_row_2 WHERE  examine_id = ? AND employee_name_id = ? AND date = ?";
                const [getChecklist_R2QueryResult] = await db.query(getChecklist_R2Query, [examineInfo.id , employee ,  currentDateA]);
                console.log("getChecklist_R2QueryResult: ", getChecklist_R2QueryResult);

                const passCount = getChecklist_R2QueryResult.filter(item => item.status === 'pass').length;
                console.log("Pass count:", passCount, examineInfo.id);
                totalPassCount += passCount;

                const percentage = Math.floor((passCount / getexaminenameQueryResultMap.length) * 100);
                examineInfo[employee] = {employee , passCount , percentage }

                console.log("totalPassCount:",totalPassCount, examineInfo.id);

                // console.log("getexaminenameQueryResultMap.length:", getexaminenameQueryResultMap.length);
                // console.log("Percentage:", Math.floor(percentage), examineInfo.id);
                // examineInfo.percentage = Math.floor(percentage);
          }
          examineInfo.totalPassCount = totalPassCount;

          const percentageAll = Math.floor((totalPassCount / (getexaminenameQueryResultMap.length * getemployeeQueryResultMap.length)) * 100);
          console.log("percentageAll:", totalPassCount,percentageAll );
          examineInfo.percentageAll = percentageAll;
          totalPercentage += percentageAll;

        }

        }
        const percentageZone = Math.floor((totalPercentage / (idObject[idValue].examine_id.length * 100)) * 100);
        console.log("percentageZone:", percentageZone , idValue);
        idObject.percentageZone = percentageZone;
        
        // console.log("8888888888888888888:", totalPercentage, idValue);
        

      }
      
      }
      dataAll.data = dataPercent
      console.log(dataAll. currentDateA); // แสดงค่า currentDate ที่อยู่ในอ็อบเจ็กต์ dataAll

      console.log("Final dataPercent:", dataPercent);
      console.log("Final dataPercent dataAll ------------------------:",  dataAll);
      calPercent.push(dataAll)

    }
      return NextResponse.json({ success: true ,dbnotify_name: groupedData ,percent: calPercent});
    }



    if (res.fetch_role_3){

      const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; 
        const year = currentDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        // console.log("Date: ",formattedDate)

      const getQuery = "SELECT * FROM checklist_examine_row_2 WHERE date = ? ";
      const [Result] = await db.query(getQuery , [formattedDate ]);

      console.log("++++++++++++++++++++, ",Result)
      // console.log("Data_examineWWWWWW: ",Result)
      const groupedData = {
        date: '',
        key: []}
        ;
     

      // วนลูป Array เพื่อจัดกลุ่ม
      for (const data of Result) {
        
        // console.log("ITEMMM",item.inspector);

        const inspector  = data.inspector;

        const inputDate = new Date(data.send_date);

        // const dateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
        const dateTime = inputDate.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' , year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });

        // console.log("Formatted Date: ", dateTime);
        groupedData.date = dateTime;


        const nameInspector = "SELECT * FROM users WHERE id = ?";
        const [nameInspectorResult] = await db.query(nameInspector, [data.inspector]);
        
        // console.log("nameResult4444: ", nameInspectorResult);
        const name = nameInspectorResult[0].name + ' ' + nameInspectorResult[0].lastname;
        // console.log("NAMEEENAMEEE",name);
        const getexamineListQuery = "SELECT * FROM examinelist WHERE user_id = ?";
        const [getexamineListQueryResult] = await db.query(getexamineListQuery, [data.inspector]);
        
        const nameExamineList = getexamineListQueryResult.map(item => item.name);
        

        const dataitem = {
          id: data.inspector,
          name: name,
          zone: nameExamineList

        };
        
        if (!groupedData.key.some(item => item.id === data.inspector)) {
          dataitem[inspector] = [];
          dataitem[inspector].push();
          groupedData.key.push(dataitem);
        } else {
          const existingItem = groupedData.key.find(item => item.id === data.inspector);
          existingItem[inspector].push(data);
        }
      

        // เพิ่มข้อมูลลงในกลุ่มที่เป็น key เดียวกัน
        // console.log("resultGroup", groupedData);

        
      };

      // แสดงผลลัพธ์
      console.log("resultGroup",res.storedId);
      const calPercent = []
      const getChecklist_R2Query = "SELECT DISTINCT date FROM checklist_examine_row_2 ";
        const [getChecklist_R2QueryResult] = await db.query(getChecklist_R2Query);
   
        console.log("Distinct Dates:", getChecklist_R2QueryResult.map(result => result.date));
        console.log("Number of Dates:", getChecklist_R2QueryResult.length);
        
        // for (const i in getChecklist_R2QueryResult.map(result => result.date)) {
        //   if ( i === formattedDate) {
        //   } 
        // }
        const dateArray = getChecklist_R2QueryResult.map(result => result.date);

        const hasMatchingDate = dateArray.includes(formattedDate);
        console.log(`Does the checklist have a date matching ${formattedDate}? ${hasMatchingDate}`);
        console.log("DATEE-------------------: ",dateArray)
        // let recentDates = getChecklist_R2QueryResult.map(result => result.date);
        // const currentDate = new Date();
        // const formattedCurrentDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
        let formattedDateA; // Declare outside the if-else block
        // const day = currentDate.getDate() ;
        // const month = currentDate.getMonth() + 1; 
        // const year = currentDate.getFullYear();
        // let Date = `${day}/${month}/${year}`;
        // const dateArray = [formattedDate];

        if (!hasMatchingDate) {
          dateArray.push(formattedDate);
        }
        console.log("DATEE1111-------------------: ",dateArray)

        // If there are more than 5 dates, take the most recent 5
        if (getChecklist_R2QueryResult.length >= 5) {
          // const day = currentDate.getDate() - 5;
          // const month = currentDate.getMonth() + 1; 
          // const year = currentDate.getFullYear();
          // formattedDateA = `${day}/${month}/${year}`;

          while (dateArray.length < 5) {
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
          
          
          } else if ( getChecklist_R2QueryResult.length < 5){
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
        console.log("Date Array:", dateArray);

        console.log("Recent Dates:", formattedDateA );

        // Subtract one day at a time until dateArray has 5 elements
     
        for (const currentDateA of dateArray) {
          console.log("currentDate :", currentDateA );

      const getId_r1Query = "SELECT id FROM users ";
      const [getId_r1QueryResult] = await db.query(getId_r1Query);
      const getId_r1QueryResultMap = getId_r1QueryResult.map(item => item.id);
      

      const dataAll = { currentDateA}
      const dataPercent = {};
      for (const user_r1 of getId_r1QueryResultMap) {
        
        
        const getexamineList_r1Query = "SELECT id , name FROM examinelist WHERE user_id = ?";
        const [getexamineList_r1QueryResult] = await db.query(getexamineList_r1Query, [user_r1]);
      console.log("getexamineList_r1QueryResult88888888: ",getexamineList_r1QueryResult)
        if (!dataPercent[user_r1]) {
          dataPercent[user_r1] = [];
        }

        
      
        for (const idResult of getexamineList_r1QueryResult ) {
          const examineObject = {
            [idResult.id]: {
              examine_id: [],
              examine_count: getexamineList_r1QueryResult.length
            }
            ,name: idResult.name,

          };
          console.log("id:: ",idResult.id , examineObject)

          dataPercent[user_r1].push(examineObject);
        }

      }
      
      for (const userId in dataPercent) {
        const idArray = dataPercent[userId];
      
        for (const idObject of idArray) {
          const idValue = Object.keys(idObject)[0];
          const getExamineQuery = "SELECT id, useEmployee FROM examine WHERE examinelist_id = ?";
          const [getExamineQueryResult] = await db.query(getExamineQuery, [idValue]);
      
          const examine_idArray = idObject[idValue].examine_id;
          let totalPercentage = 0;

          for (const examineInfo of getExamineQueryResult) {
            const currentDate = new Date();
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; 
            const year = currentDate.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            


              if ( examineInfo.useEmployee === 'false' ){
                
                const getexaminenameQuery = "SELECT 	id FROM examinename WHERE  examine_id = ? ";
                const [getexaminenameQueryResult] = await db.query(getexaminenameQuery, [examineInfo.id]);
                // console.log("getChecklist_R2QueryResult: ", examineInfo.id,getexaminenameQueryResult);

                const getexaminenameQueryResultMap = getexaminenameQueryResult.map(item => item.id);
                // console.log("getChecklist_R2QueryResultMap: ", getexaminenameQueryResultMap);
                examine_idArray.push({ examineInfo });

                examineInfo.name_id = getexaminenameQueryResultMap
                const getChecklist_R2Query = "SELECT date , examinename_id ,	status FROM checklist_examine_row_2 WHERE  examine_id = ? AND date = ? ";
                const [getChecklist_R2QueryResult] = await db.query(getChecklist_R2Query, [examineInfo.id ,  currentDateA]);
                console.log("11111111111111111111111111111: ", getChecklist_R2QueryResult ,  currentDateA);
                
                const passCount = getChecklist_R2QueryResult.filter(item => item.status === 'pass').length;

                const percentage = (passCount / getexaminenameQueryResultMap.length) * 100;

                console.log("getexaminenameQueryResultMap.length:", examineInfo.id);
                console.log("Percentage:", Math.floor(percentage), examineInfo.id);
                examineInfo.percentage = Math.floor(percentage);
                totalPercentage += percentage;
            } else if ( examineInfo.useEmployee === 'true' ){
              let totalPassCount = 0;


                examine_idArray.push({ examineInfo });

                const getexaminenameQuery = "SELECT 	id FROM examinename WHERE  examine_id = ? ";
                const [getexaminenameQueryResult] = await db.query(getexaminenameQuery, [examineInfo.id]);
                // console.log("getChecklist_R2QueryResult: ", examineInfo.id, getexaminenameQueryResult);

                const getexaminenameQueryResultMap = getexaminenameQueryResult.map(item => item.id);
                // console.log("getChecklist_R2QueryResultMap: ", examineInfo, getexaminenameQueryResultMap);
                // examine_idArray.push({ examineInfo, id: getexaminenameQueryResultMap });
                examineInfo.examinename = getexaminenameQueryResultMap
                const getemployeeQuery = "SELECT 	id FROM employee WHERE examinelist_id = ? ";
                const [getemployeeQueryResult] = await db.query(getemployeeQuery, [idValue]);
                const getemployeeQueryResultMap = getemployeeQueryResult.map(item => item.id);
                // console.log("8888888888: ", getemployeeQueryResultMap, idValue );

                for (const employee of getemployeeQueryResultMap){
                  console.log("99999: ",employee,examineInfo.id)
                const getChecklist_R2Query = "SELECT  examinename_id ,	status FROM checklist_employee_row_2 WHERE  examine_id = ? AND employee_name_id = ? AND date = ?";
                const [getChecklist_R2QueryResult] = await db.query(getChecklist_R2Query, [examineInfo.id , employee ,  currentDateA]);
                console.log("getChecklist_R2QueryResult: ", getChecklist_R2QueryResult);

                const passCount = getChecklist_R2QueryResult.filter(item => item.status === 'pass').length;
                console.log("Pass count:", passCount, examineInfo.id);
                totalPassCount += passCount;

                const percentage = Math.floor((passCount / getexaminenameQueryResultMap.length) * 100);
                examineInfo[employee] = {employee , passCount , percentage }

                console.log("totalPassCount:",totalPassCount, examineInfo.id);

                // console.log("getexaminenameQueryResultMap.length:", getexaminenameQueryResultMap.length);
                // console.log("Percentage:", Math.floor(percentage), examineInfo.id);
                // examineInfo.percentage = Math.floor(percentage);
          }
          examineInfo.totalPassCount = totalPassCount;

          const percentageAll = Math.floor((totalPassCount / (getexaminenameQueryResultMap.length * getemployeeQueryResultMap.length)) * 100);
          console.log("percentageAll:", totalPassCount,percentageAll );
          examineInfo.percentageAll = percentageAll;
          totalPercentage += percentageAll;

        }

        }
        const percentageZone = Math.floor((totalPercentage / (idObject[idValue].examine_id.length * 100)) * 100);
        console.log("percentageZone:", percentageZone , idValue);
        idObject.percentageZone = percentageZone;
        
        // console.log("8888888888888888888:", totalPercentage, idValue);
        

      }
      
      }
      dataAll.data = dataPercent
      console.log(dataAll. currentDateA); // แสดงค่า currentDate ที่อยู่ในอ็อบเจ็กต์ dataAll

      console.log("Final dataPercent:", dataPercent);
      console.log("Final dataPercent dataAll ------------------------:",  dataAll);
      calPercent.push(dataAll)

    }
      return NextResponse.json({ success: true ,dbnotify_name: groupedData ,percent: calPercent});
    }

    if (res.responseDetail) {
      try {

        // const getfileQuery = 'SELECT file FROM notify WHERE title = ?';
        // const [fileResult] = await db.query(getfileQuery,[res.responseValue]);
      
        // console.log("file: ",fileResult[0].file)



        const getQuery = 'SELECT * FROM notify WHERE id = ?';
        const [responseResult] = await db.query(getQuery ,[res.id]);

        console.log("rusultRoot: ",responseResult)

        return NextResponse.json({ success: true , message: 'successfully!' , responseResult: responseResult});
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }

    if (res.responseDetail_row_3) {
      try {


        const getQuery = "SELECT * FROM notify WHERE id = ?";
        const [responseResult] = await db.query(getQuery , [res.idValue]);


        console.log("rusultRoot: ",responseResult)

        return NextResponse.json({ success: true , message: 'successfully!' , responseResult: responseResult});
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }


    
    if (res.response_row_2) {
      try {


        const getQuery = "SELECT * FROM notify WHERE Verification_status = 'Pending approval'";
        const [responseResult] = await db.query(getQuery);


        console.log("rusultRoot: ",responseResult)

        return NextResponse.json({ success: true , message: 'successfully!' , responseResult: responseResult});
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }

    if (res.response_row_3) {
      try {


        const getQuery = "SELECT * FROM notify WHERE Verification_status = 'Approve'";
        const [responseResult] = await db.query(getQuery);


        console.log("rusultRoot: ",responseResult)

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


export async function GET(request) {
  if (request.method === 'GET') {
    try {
      const getQuery = "SELECT file FROM notify";
      const [Result] = await db.query(getQuery);

      if (Result.length > 0) {
        const pdfData = Result[0].file;

        if (pdfData) {
          const pdfBuffer = Buffer.from(pdfData, 'binary');
          // ส่งไฟล์ PDF กลับไปยังผู้ใช้
          return NextResponse.json({
            status: 200,
            success: true,
            body: pdfBuffer,
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': 'attachment; filename="your_pdf_file.pdf"',
            },
          });
          
        } else {
          console.error('PDF data is undefined.');
          return {
            status: 500,
            body: 'PDF data is undefined.',
          };
        }
      } else {
        console.error('No data found in the database.');
        return {
          status: 500,
          body: 'No data found in the database.',
        };
      }
    } catch (error) {
      console.error('Error:', error);
      return {
        status: 500,
        body: 'Internal Server Error',
      };
    }
  } else {
    return {
      status: 405,
      body: 'Method Not Allowed',
    };
  }
}

