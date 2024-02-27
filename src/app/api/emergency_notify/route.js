import db from '../../../lib/db';
import { NextResponse } from 'next/server';
import { createServer } from 'http'
import { Server } from 'socket.io'

let httpServer;


export async function POST(request, response) {
  if (request.method === 'POST') {

      const IPaddress = '192.168.2.37';
      const data = await request.json();
      const { date, time, location } = data;
      console.log("res emer: ",data)

      if (data.get) {
        try {
        const currentDate = new Date();

        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        
        const formattedDate = `${day}/${month}/${year}`;
        
        console.log('Formatted Date:', formattedDate);
        

        const getNumQuery = "SELECT * FROM emergency_notify WHERE date = ? AND location = ?";
        const [numResult] = await db.query(getNumQuery, [formattedDate , data.storedButton]);

        console.log("Data_examine: ",numResult)


        return NextResponse.json({ success: true ,dbNumResult: numResult});
      } catch (error) {
        console.error('Error fetch the request:', error);
        return NextResponse.json({
          success: false,
          error: 'Failed to fetch the request',
        })
      }
    }

      if (data.change) {
        try {

        console.log("res change: ",data,data.notification.date, data.notification.time, data.notification.location)

        const updateStatusQuery = "UPDATE emergency_notify SET status = 1 WHERE date = ? AND time = ? AND location = ? AND status = 0";

        const [updateResult] = await db.query(updateStatusQuery, [data.notification.date, data.notification.time, data.notification.location]);
        
        if (updateResult.affectedRows > 0) {
          // การอัปเดตสำเร็จ
          console.log("Status updated successfully");
          console.log("Data in res.notification matches a record in emergency_notify");
        } else {
          // ไม่พบรายการที่ต้องการอัปเดตหรือมีปัญหาในการอัปเดต
          console.log("Failed to update status or no matching records");
          console.log("Data in res.notification does not match any record in emergency_notify");
        }
        return NextResponse.json({ success: true});
      } catch (error) {
        console.error('Error change the request:', error);
        return NextResponse.json({
          success: false,
          error: 'Failed to change the request',
        })
      }
    }

      if (data.button) {
        try {
        console.log("424242: ",data)
        let count = 0
        let connectedUserIds = []
        const currentDate = new Date();

        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        
        const formattedDate = `${day}/${month}/${year}`;
        data.requestData.date = formattedDate
        // if (!httpServer) {
        console.log("http working")
        httpServer = createServer()
   
        const io = new Server(httpServer, {
          cors: {
            origin: [`http://${IPaddress}:80`, `http://${IPaddress}:3000`],
            // origin: [`http://192.168.2.37:3000`, `http://192.168.2.37:80`],
  
            methods: ['GET', 'POST'],
            credentials: true,
          },
        });
    
        io.on('connection', (socket) => {
          count++;
          console.log("connected: ", count);
          socket.on('setButton', (button) => {
            console.log('Received user_id:', button.button,data.selectedOption.button);
   
            if (button.button.toString() === data.selectedOption.button.toString()) {
              // ส่งข้อมูลไปยังไคลเอ็นต์ทั้งหมด (ยกเว้นตัวเอง)
              console.log("HHHHHHH ",data.requestData)
                
             
                socket.join('emergencyNotify'); 
                io.to('emergencyNotify').emit('emergencyNotify', data.requestData);

            }
         
          socket.on('disconnect', () => {
            count--;
            console.log("disconnected1: ", count);
  
            if (count === 0) {
              httpServer.close(() => {
              console.log('Server stopped');
              });
              httpServer = null;           
            }
          });
        });
          // socket.emit("emergencyNotify", data);
          // socket.broadcast.emit("emergencyNotify", data);
        });
  
      // }
       
        httpServer.listen(3000,'0.0.0.0',() => {
          console.log('Server is running on port 3000');
        });     
  
        const insertSql = "INSERT INTO emergency_notify (date, time, location , status , user_id) VALUES (?, ?, ? , 0 , ?)";
        const insertValues = await db.execute(insertSql , [data.requestData.date, data.requestData.time ,data.requestData.location, data.selectedOption.user_id]);
  
        if (insertValues[0].affectedRows === 1) {
          return NextResponse.json({ success: true, message: 'Notification has been sent successfully.'});
        } else {
          return NextResponse.json({ success: false, error: 'Failed to insert notify data' });
        }
  
      } catch (error) {
        console.error('Error processing the request:', error);
        return NextResponse.json({
          success: false,
          error: 'Failed to process the request',
        });
      }
      }

      try {

      let count = 0

      // if (!httpServer) {
        console.log("http working")
      httpServer = createServer()
 
      const io = new Server(httpServer, {
        cors: {
          origin: [`http://${IPaddress}:80`, `http://${IPaddress}:3000`],
          // origin: [`http://192.168.2.38:80`, `http://192.168.2.38:3000`],

          methods: ['GET', 'POST'],
          credentials: true,
        },
      });
      io.on('connection', (socket) => {
        count++;
        console.log("connected: ", count);
        socket.on('setButton', (button) => {
          console.log('Received user_id:', button.button,data.location);
 
          if (button.button.toString() === data.location.toString()) {
            // ส่งข้อมูลไปยังไคลเอ็นต์ทั้งหมด (ยกเว้นตัวเอง)
            console.log("HHHHHHH ",data)
              
           
              socket.join('emergencyNotify'); 
              io.to('emergencyNotify').emit('emergencyNotify', data);

          }
       
        socket.on('disconnect', () => {
          count--;
          console.log("disconnected1: ", count);

          if (count === 0) {
            httpServer.close(() => {
            console.log('Server stopped');
            });
            httpServer = null;           
          }
        });
      });
        // socket.emit("emergencyNotify", data);
        // socket.broadcast.emit("emergencyNotify", data);
      });
      // io.on('connection', (socket) => {
      //   count++;
      //   console.log("connected: ", count);
      //   io.emit('emergencyNotify', data);
        
      //   socket.on('disconnect', () => {
      //     count--;
      //     console.log("disconnected1: ", count);

      //     if (count === 0) {
      //       httpServer.close(() => {
      //       console.log('Server stopped');
      //       });
      //       httpServer = null;           
      //     }
      //   });
      //   // socket.emit("emergencyNotify", data);
      //   // socket.broadcast.emit("emergencyNotifySW", data);
      // });

    

      httpServer.listen(3000,'0.0.0.0',() => {
        console.log('Server is running on port 3000');
      });   
    

      const insertSql = "INSERT INTO emergency_notify (date, time, location , status ,user_id) VALUES (?, ?, ? , 0,0)";
      const insertValues = await db.execute(insertSql , [data.date, data.time ,data.location]);

      if (insertValues[0].affectedRows === 1) {
        return NextResponse.json({ success: true, message: 'Notification has been sent successfully.'});
      } else {
        return NextResponse.json({ success: false, error: 'Failed to insert notify data' });
      }

    } catch (error) {
      console.error('Error processing the request:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to process the request',
      });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}




export async function GET(request) {
  if (request.method === 'GET') {
    try {
  
      const currentDate = new Date();

      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      // Create the formatted string
      const formattedDate = `${month}/${day}/${year}`;
      
      console.log('Formatted Date:', formattedDate);
      

      const getExamineQuery = "SELECT * FROM emergency_notify WHERE date = ? AND status = 0";
      const [examineResult] = await db.query(getExamineQuery, formattedDate);

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



