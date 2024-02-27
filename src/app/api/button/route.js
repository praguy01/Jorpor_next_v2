import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  if (request.method === 'GET') {
    try {

      const getExaminelistQuery = "SELECT * FROM examinelist ";
      const [examinelistResult] = await db.query(getExaminelistQuery);

      console.log("Data_examine: ", examinelistResult)

      return NextResponse.json({ success: true, dbexaminelist_name: examinelistResult });
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    try {
      // const { examinelist_name, todo } = res;
      console.log("RES_ROUTE_SELECTTTTT: ", res);

      if (res.button) {
        const getNumAllQuery = "SELECT number FROM button_box";
        const [NumAllResult] = await db.query(getNumAllQuery);

        const getNumQuery = "SELECT number FROM button_box WHERE user_id = ?";
        const [NumResult] = await db.query(getNumQuery, [res.storedId]);
        let NumResultmap = [];
        let ListNumAll = [];

        if (NumResult.length > 0) {
          NumResultmap = NumResult.map(row => row.number)[0]; // Extract the string from the array
          console.log("12212: ", NumResultmap);
        } else {
          console.log("12212: Null");
        }

        let NumAllResultmap = [];
        let uniqueValues = [];
        if (NumAllResult.length > 0) {
          for (let i = 1; i <= 5; i++) {
            ListNumAll.push(i);
          }
          console.log("ListNumAll: ", ListNumAll);

          NumAllResultmap = NumAllResult.map(row => row.number);

          uniqueValues = ListNumAll.filter(value => !NumAllResultmap.includes(value));

          console.log("ค่าที่ไม่ซ้ำ:", uniqueValues);
        } else {
          console.log("NumAllResult is empty");
        }



        return NextResponse.json({ success: true, NumAllResult: uniqueValues, NumResult: NumResultmap });
      }

      if (res.button_change) {
        try {
          const checkQuery = "SELECT * FROM button_box WHERE user_id = ?";
          const [checkResult] = await db.query(checkQuery, [res.storedId]);
          let [updateResult] = ''
          if (checkResult.length === 0) {
            // ถ้าไม่มี user_id ในฐานข้อมูล ให้ทำการ Insert
            const insertQuery = "INSERT INTO button_box (user_id, number) VALUES (?, ?)";
            [updateResult] = await db.query(insertQuery, [res.storedId, res.Num]);
          } else {
            // ถ้ามี user_id ในฐานข้อมูล ให้ทำการ Update
            const updateQuery = "UPDATE button_box SET number = ? WHERE user_id = ?";
            [updateResult] = await db.query(updateQuery, [res.Num, res.storedId]);
          }

          // const updateQuery = "UPDATE button_box SET number = ? WHERE user_id = ?";
          // const [updateResult] = await db.query(updateQuery, [res.Num, res.storedId]);

          console.log("2222: ", updateResult)
          // Check if the update was successful
          if (updateResult.affectedRows > 0) {
            const getNumAllQuery = "SELECT number FROM button_box";
            const [NumAllResult] = await db.query(getNumAllQuery);

            const getNumQuery = "SELECT number FROM button_box WHERE user_id = ?";
            const [NumResult] = await db.query(getNumQuery, [res.storedId]);
            let NumResultmap = [];
            let ListNumAll = [];

            if (NumResult.length > 0) {
              NumResultmap = NumResult.map(row => row.number)[0]; // Extract the string from the array
              console.log("12212: ", NumResultmap);
            } else {
              console.log("12212: Null");
            }

            let NumAllResultmap = [];
            let uniqueValues = [];
            if (NumAllResult.length > 0) {
              for (let i = 1; i <= 5; i++) {
                ListNumAll.push(i);
              }
              console.log("ListNumAll: ", ListNumAll);

              NumAllResultmap = NumAllResult.map(row => row.number);

              uniqueValues = ListNumAll.filter(value => !NumAllResultmap.includes(value));

              console.log("ค่าที่ไม่ซ้ำ:", uniqueValues);
            } else {
              console.log("NumAllResult is empty");
            }



            return NextResponse.json({ success: true, NumAllResult: uniqueValues, NumResult: NumResultmap });
          } else {
            return NextResponse.json({ success: false, error: 'No rows were affected during the update.' });
          }
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      return NextResponse.json({ success: true });

    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}