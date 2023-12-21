import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    try {
      const { examinelist_name , todo } = res;
      console.log("RES_ROUTE_examineRes: ", res);

      if (res.add) {
        // const checkExamineExistsQuery = "SELECT * FROM examinelist WHERE name = ?";
        // const [examineExistsResult] = await db.query(checkExamineExistsQuery, [res.examinelist_name]);
        //   console.log("rusult55555: ",examineExistsResult)
  
        // if (examineExistsResult.length === 0) {
          const insertSql = "INSERT INTO examinelist (name, user_id) VALUES (?,?)";
          const insertValues = await db.query(insertSql,[res.examinelist_name , res.id]);
          console.log("rusult55555: ",insertValues[0])

                
  
          if (insertValues[0].affectedRows > 0){
            const getExamineQuery = "SELECT * FROM examinelist WHERE user_id = ? ";
            const [examinelistResult] = await db.query(getExamineQuery , res.id);
      
            console.log("Data_examine: ",examinelistResult[0])
             return NextResponse.json({ success: true, message: ` ${res.examinelist_name} created successfully` ,dbexaminelist_name: examinelistResult});
          }
        }

      if (res.notifyfetch) {

        const getExamineQuery = `
        SELECT 
            examinelist.*,
            examinelist.name AS examinelist_name,
            users.id,
            users.employee,
            users.name,
            users.lastname,
            users.position
        FROM examinelist 
        JOIN users ON examinelist.user_id = users.id
        WHERE user_id = ?`;
    
    const [examinelistResult] = await db.query(getExamineQuery, [res.storedUser_id]);
    // const key = examinelistResult.name + ' ' + examinelistResult.lastname;

    const uniqueDataArray = [];

// Iterate through the examinelistResult array
examinelistResult.forEach(result => {
  console.log("Data_examineUsersSSSSS: ", result);

  // Check if the ID is not in the array, add it to the array
  const existingData = uniqueDataArray.find(item => item.id === result.id);
  if (!existingData) {
    uniqueDataArray.push({
      id: result.id,
      name: result.name + ' ' + result.lastname,
      employee: result.employee,
      position:  result.position.replace('Safety Officer', ''),
      examinelist: [result.examinelist_name]  // Start with an array containing the current value
    });
  } else {
    // If the ID already exists, add the current result.examinelist_name to the existing array
    existingData.examinelist.push(result.examinelist_name );
  }
});

// Convert the set back to an array if needed
console.log("Data_examineUsers: ", uniqueDataArray);
      
  
  
        return NextResponse.json({ success: true ,dbexaminelist_name: uniqueDataArray});
        }

      if (res.fetch) {

      const getExamineQuery = "SELECT * FROM examinelist WHERE user_id = ? ";
      const [examinelistResult] = await db.query(getExamineQuery , res.storedUser_id);

      console.log("Data_examine: ",examinelistResult[0])


      return NextResponse.json({ success: true ,dbexaminelist_name: examinelistResult});
      }
     

      if (res.edit) {
        try {
          console.log("Data_examinelistEdit888: ",res.id)

          const getExamineEditQuery = "SELECT * FROM examinelist WHERE name = ? AND id = ?";
          const [ExamineEditResult] = await db.query(getExamineEditQuery, [res.todo.name , res.todo.id]);
    

          const deleteExamineQuery = "DELETE FROM examinelist WHERE name = ? AND id = ?";
          await db.query(deleteExamineQuery, [res.todo.name , res.todo.id]);

      
    
         

          // const showTablesQuery = "SHOW TABLES;";
          // const [tableList] = await db.query(showTablesQuery);

          // console.log("รายชื่อตารางทั้งหมดในฐานข้อมูล:", tableList);
        
          return NextResponse.json({ success: true , message: 'delete successfully!' });
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.submit) {

        return NextResponse.json({ success: true ,redirect: `/reportResults?date=${res.formattedDate}&id=${res.id}`});
        }
      
     
      return NextResponse.json({ success: true});

    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}
