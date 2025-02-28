import db from '../../../lib/db';
import express from 'express';
import linebot from '@line/bot-sdk';
//import axios from 'axios';
import bcrypt from 'bcrypt';
import { type } from 'os';
import { text } from 'body-parser';
import { layer } from '@fortawesome/fontawesome-svg-core';
import { table } from 'console';


const line = require('@line/bot-sdk');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const util = require('util');
const { pipeline } = require('stream/promises');
const sharp = require('sharp');
const FormData = require('form-data');
const server = express();


const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.SECRETCODE
};

const client = new line.Client({
  channelAccessToken: config.channelAccessToken,
  channelSecret: config.channelSecret
});
// Middleware สำหรับ LINE
export async function POST(req) {
  try {
    // เช็คว่า request มี body หรือไม่
    if (!req.body) {
      return new Response('No body found', { status: 400 });
    }

    // เช็คว่า body เป็น JSON ที่ถูกต้อง
    const body = await req.json();
    console.log('Request body:', body);

    // ตรวจสอบว่ามี events ใน body หรือไม่
    if (!body.events || body.events.length === 0) {
      return new Response('No events found', { status: 400 });
    }

    // ดำเนินการกับ events
    const result = await Promise.all(body.events.map(handleEvents));
    return new Response(JSON.stringify(result), { status: 200 });
    //  // ตอบกลับด้วยข้อความ success
    //  return new Response(JSON.stringify({ status: 'success', data: body }), { 
    //   status: 200,
    //   headers: { 'Content-Type': 'application/json' } 
    // });

  } catch (err) {
    console.error('Error:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
//อันนี้ฟังก์ชั่นเดิม
// export default function handler(req, res) {
//   const { imageId } = req.query;
//   const filePath = path.join(process.cwd(), 'download', `${imageId}.jpg`);

//   if (fs.existsSync(filePath)) {
//     res.setHeader('Content-Type', 'image/jpeg');
//     return res.status(200).send(fs.readFileSync(filePath));
//   } else {
//     return res.status(404).json({ error: 'File not found' });
//   }
// }

//อันนี้ฟังก์ชั่นใหม่เอามาแทนเลย
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const imageId = url.searchParams.get("imageId");

    if (!imageId) {
      return new Response(JSON.stringify({ error: "Missing imageId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const filePath = path.join(process.cwd(), "download", `${imageId}.jpg`);

    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ error: "File not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const fileStream = fs.createReadStream(filePath);
    return new Response(fileStream, {
      status: 200,
      headers: { "Content-Type": "image/jpeg" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ฟังก์ชันสร้าง Flex Message จากข้อมูลพนักงาน
export function createEmployeeFlexMessage(employeeData, role) {
  // ตรวจสอบว่า employeeData มีข้อมูลหรือไม่
  if (!employeeData || employeeData.length === 0) {
    return {
      type: "text",
      text: "ไม่พบข้อมูลพนักงาน"
    };
  }

  const employeeContents = employeeData.map((employee, index) => ({
    type: 'box',
   // backgroundColor: '#A5B59C', // เพิ่มพื้นหลังสีเทาอ่อน
   // cornerRadius: '15px', // ทำให้มุมกล่องมนขึ้นเล็กน้อย
   // paddingAll: '10px', // เพิ่มระยะห่างรอบตัวอักษรภายในกล่อง
    layout: 'vertical',
    contents: [
      {
        type: 'box',
        layout: 'horizontal',
        contents: [
          {
            type: 'text',
            text: `ลำดับ. ${index + 1}`, // ลำดับพนักงาน
            //text: `ลำดับ. ${employee.id}`, // ลำดับพนักงาน
            color: '#363636',
            align: 'start',
            flex: 1
          },
          {
            type: 'text',
            text: `รหัสพนักงาน: ${employee.employee}`, // รหัสพนักงาน
            color: '#363636',
           // weight: 'bold',
            align: 'start',
            flex: 2
          }
        ]
      },
      {
        type: 'text',
        text: `ชื่อ: ${employee.name} ${employee.lastname}`, // ชื่อและนามสกุล
        color: '#363636',
        align: 'start',
        flex: 2,
        margin: 'sm'
      },
      {
        type: 'separator', // เส้นตัวกั้นใต้ข้อความ "รายชื่อพนักงาน"
        margin: 'md',
        color: '#D3D3D3'
      }
    ]
  }));
  
  const quickReplyItems = [];
  
  // เพิ่ม quick reply ตามบทบาท
  if (role === 'manager') {
    quickReplyItems.push({
      type: 'action',
      action: {
        type: 'message',
        label: 'เพิ่มจป.ระดับเทคนิค',
        text: 'เพิ่มจป.ระดับเทคนิค'
      }
    });
  } else if (role === 'technical') {
    quickReplyItems.push({
      type: 'action',
      action: {
        type: 'message',
        label: 'เพิ่มจป.ระดับหัวหน้างาน',
        text: 'เพิ่มจป.ระดับหัวหน้างาน'
      }
    });
  } else if (role === 'super') {
    quickReplyItems.push({
      type: 'action',
      action: {
        type: 'message',
        label: 'เพิ่มพนักงาน',
        text: 'เพิ่มพนักงาน'
      }
    });
    quickReplyItems.push({
      type: 'action',
      action: {
        type: 'message',
        label: 'ลบพนักงาน',
        text: 'ลบพนักงาน'
      }
    });
  }
  return {
    type: 'flex',
    size: 'giga',
    altText: 'Employee List',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        backgroundColor: '#FFFFFF', 
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'รายชื่อพนักงาน',
            weight: 'bold',
            align: 'start',
            size: 'xl',
            color: '#363636'
          },
          {
            type: 'separator', 
            margin: 'md',
            color: '#D3D3D3'
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            spacing: 'md',
            contents: employeeContents
          }
        ]
      }
    },
    quickReply: {
      items: quickReplyItems
    }
  };
}

// ฟังก์ชันสร้าง Flex Message จากแผนงาน
export function createPlanFlexMessage(planData, role) {
  const quickReplyItems = [];
  
  // เพิ่ม quick reply ตามบทบาท
  if (role === 'manager') {
    quickReplyItems.push({
      type: 'action',
      action: {
        type: 'message',
        label: 'add plan SO.Man',
        text: 'add plan SO.Man'
      }
    });
  } else if (role === 'technical') {
    quickReplyItems.push({
      type: 'action',
      action: {
        type: 'message',
        label: 'add plan SO.Tech',
        text: 'add plan SO.Tech'
      }
    });
  } else if(role === 'super'){
    quickReplyItems.push({
      type: 'action',
      action: {
        type: 'message',
        label: 'add plan SO.Sup',
        text: 'add plan SO.Sup'
      }
    });
  }

  const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

  // จัดกลุ่มข้อมูลตามเดือนและปี
  const groupedByMonth = planData.reduce((acc, plan) => {
    if (!plan.date || plan.date.length !== 10) {
      console.error(`Invalid date format for plan: ${plan.date}`);
      return acc;
    }

    const [day, month, year] = plan.date.split('/'); 
    const monthYear = `${month}/${year}`; 
    
    if (!acc[monthYear]) acc[monthYear] = {};
    if (!acc[monthYear][day]) acc[monthYear][day] = [];
    
    acc[monthYear][day].push(plan);
    return acc;
  }, {});

  // เรียงลำดับตามปีและเดือนที่ใกล้ถึงมาก่อน
  const sortedMonthKeys = Object.keys(groupedByMonth)
    .sort((a, b) => {
      const [monthA, yearA] = a.split('/').map(Number);
      const [monthB, yearB] = b.split('/').map(Number);
      return yearA - yearB || monthA - monthB;
    });

  // แปลงข้อมูลที่จัดกลุ่มแล้วเป็นแผนใน Flex Message
  const planContents = sortedMonthKeys.map((monthYear) => {
    const [month, year] = monthYear.split('/');
    const monthName = monthNames[parseInt(month, 10) - 1];

    const days = Object.keys(groupedByMonth[monthYear])
      .sort((a, b) => Number(a) - Number(b)) // เรียงลำดับวันที่ใกล้ถึงมาก่อน
      .map((day) => {
        const plans = groupedByMonth[monthYear][day]
          .sort((a, b) => {
            const [startHourA, startMinuteA] = a.startTime.split(':').map(Number);
            const [startHourB, startMinuteB] = b.startTime.split(':').map(Number);
            return startHourA - startHourB || startMinuteA - startMinuteB;
          })
          .map((plan, index) => {
            const formattedStartTime = plan.startTime.replace(/:00$/, '');
            const formattedEndTime = plan.endTime.replace(/:00$/, '');

            return {
              type: "box",
              layout: "horizontal",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: `${index + 1}) ` + plan.activity,
                  size: "sm",
                  align: "start",
                  color: "#111111"
                },
                {
                  type: "text",
                  text: `${formattedStartTime} - ${formattedEndTime}`,
                  size: "sm",
                  color: "#111111"
                },
              ],
            };
          });

        return {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            {
              type: "box",
              layout: "horizontal",
              backgroundColor: "#5A975E",
              paddingAll: "xs",
              width: "140px",
              cornerRadius: "md",
              contents: [
                {
                  type: "text",
                  text: `วันที่ ${day}/${month}/${year}`, 
                  weight: "bold",
                  size: "md",
                  align: "start",
                  color: "#FFFFFF",
                  margin: "md",
                }
              ]
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: "กิจกรรม",
                  weight: "bold",
                  size: "md",
                  color: "#333333"
                },
                {
                  type: "text",
                  text: "เวลา",
                  weight: "bold",
                  size: "md",
                  color: "#333333",
                  align: "start",
                },
              ],
            },
            ...plans,
            {
              type: "separator",
              margin: "md",
              color: "#FFFFFF",
            },
            {
              type: "separator",
              margin: "md",
              color: "#D3D3D3",
            },
          ],
        };
      });

    return {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: `แผนงานเดือน ${monthName} ${year}`,
            weight: "bold",
            size: "lg",
            color: "#363636",
          },
          {
            type: "separator",
            margin: "md",
            color: "#D3D3D3",
          },
          {
            type: "box",
            layout: "vertical",
            margin: "lg",
            spacing: "sm",
            contents: days,
          },
        ],
      },
      styles: {
        body: {
          backgroundColor: "#FFFFFF",
          separator: true,
          separatorColor: "#E0E0E0",
        },
      },
    };
  });

  return {
    type: "flex",
    size: "giga",
    altText: "ข้อมูลแผนงานประจำเดือน",
    contents: {
      type: "carousel",
      contents: planContents,
    },
    quickReply: {
      items: quickReplyItems,
    },
  }
}


function formatDateForDB(inputDate) {
  const [year, month, day] = inputDate.split('-');
  return `${day}/${month}/${year}`;
}

let userIdsMap = new Map(); // ใช้ Map ในการจัดเก็บ lineUserId และ user_id
// ฟังก์ชันดึงข้อมูลแผนงาน
async function fetchPlansFromDB(lineUserId, nameTable) {
  try {
    if (!nameTable || !['plan_r2', 'plan_r3', 'plan'].includes(nameTable)) {
      throw new Error('Invalid nameTable: ' + nameTable);
    }
    
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

    let getPlanQuery;
    if (nameTable === 'plan_r3') {
      getPlanQuery = `SELECT plan_r3.* FROM plan_r3 JOIN users_r3 ON plan_r3.user_id = users_r3.id WHERE users_r3.lineUserId = ? AND STR_TO_DATE(plan_r3.date, '%d/%m/%Y') >= ?;`;
    } else if (nameTable === 'plan_r2') {
      getPlanQuery = `SELECT plan_r2.* FROM plan_r2 JOIN users_r2 ON plan_r2.user_id = users_r2.id WHERE users_r2.lineUserId = ? AND STR_TO_DATE(plan_r2.date, '%d/%m/%Y') >= ?;`;
    } else if (nameTable === 'plan') {
      getPlanQuery = `SELECT plan.* FROM plan JOIN users ON plan.user_id = users.id WHERE users.lineUserId = ? AND STR_TO_DATE(plan.date, '%d/%m/%Y') >= ?;`;
    }

    const [planResult] = await db.query(getPlanQuery, [lineUserId, formattedDate]);

    // ตรวจสอบว่ามี user_id แล้วหรือยัง
    if (!userIdsMap.has(lineUserId)) {
      const userIdQuery = `SELECT id FROM ${nameTable === 'plan_r3' ? 'users_r3' : nameTable === 'plan_r2' ? 'users_r2' : 'users'} WHERE lineUserId = ?`;
      const [userResult] = await db.query(userIdQuery, [lineUserId]);
      console.log("ผลลัพธ์จากการดึง user_id:", userResult);

      if (userResult.length > 0) {
        const userId = userResult[0].id;
        userIdsMap.set(lineUserId, userId); // เก็บ lineUserId และ user_id ใน Map
        console.log("เก็บ user_id ใน Map:", userId);
      }else {
        console.log("ไม่พบ user_id ที่เกี่ยวข้องกับ LINE User ID นี้");
      }
    }
    
    return planResult;
  } catch (error) {
    console.error('Error fetching plans:', error);
    return [];
  }
}

// ฟังก์ชันดึงข้อมูลพนักงาน
async function fetchEmployeesFromDB(lineUserId, tableName) {
  try {
    if (!tableName || !['users_r2', 'users', 'employee'].includes(tableName)) {
      throw new Error('Invalid tableName: ' + tableName);
    }
    
    console.log('Connecting to database...');
    let getEmployeeQuery;

    if (tableName === 'users_r2'){
      getEmployeeQuery = `SELECT users_r2.* FROM users_r2 JOIN users_r3 ON users_r3.id = users_r2.users_r3_id WHERE users_r3.lineUserId = ?`
    } else if (tableName === 'users') {
      getEmployeeQuery = `SELECT users.* FROM users JOIN users_r2 ON users_r2.id = users.role_2_id WHERE users_r2.lineUserId = ?`
    } else if (tableName === 'employee') {
      getEmployeeQuery = `SELECT employee.* FROM employee JOIN users ON users.id = employee.users_id WHERE users.lineUserId = ?`
    } else {
      console.error(`Invalid table name: ${tableName}`); // Log ชื่อที่ไม่ถูกต้อง
      throw new Error('Invalid table name');    }

      const [employeeResult] = await db.query(getEmployeeQuery,[lineUserId]);
      console.log('Employee data fetched:', employeeResult);

      if (!userIdsMap.has(lineUserId)) {
        const userIdQuery = `SELECT id FROM ${tableName === 'users_r2' ? 'users_r3' : tableName === 'users' ? 'users_r2' : 'users'} WHERE lineUserId = ?`;
        const [userResult] = await db.query(userIdQuery, [lineUserId]);
        console.log("ผลลัพธ์จากการดึง user_id:", userResult);
  
        if (userResult.length > 0) {
          const userId = userResult[0].id;
          userIdsMap.set(lineUserId, userId); // เก็บ lineUserId และ user_id ใน Map
          console.log("เก็บ user_id ใน Map:", userId);
        }else {
          console.log("ไม่พบ user_id ที่เกี่ยวข้องกับ LINE User ID นี้");
        }
      }

    return employeeResult;  // คืนค่าข้อมูลพนักงาน
  } catch (error) {
    console.error('Error fetching employees:', error);
    return []; // คืนค่าตารางว่างหากมีข้อผิดพลาด
  }
}
// ฟังก์ชันส่ง FlexMessage ไป Line
export async function sendFlexMessageToLine(flexMessage, userId) {
  const lineApiUrl = "https://api.line.me/v2/bot/message/push";

  const messagePayload = {
    to: userId,  // LINE User ID ที่จะส่งข้อความถึง
    messages: [flexMessage]
  };

  try {
    await axios.post(lineApiUrl, messagePayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.channelAccessToken}`
      }
    });
    console.log('Flex Message ส่งสำเร็จ!');
  } catch (error) {
    console.error('Error sending message to LINE:', error.message);
  }
}

const saltRounds = 10; // จำนวนรอบในการเข้ารหัส

// ฟังก์ชันสำหรับบันทึกข้อมูล-พนักงาน-ลงฐานข้อมูล 
async function saveEmployeeToDatabase(employee, name, lastname,rawpassword,lineUserId, tableName) {
  try {
    
      const users_r3_id = userIdsMap.get(lineUserId);
      const role_2_id = userIdsMap.get(lineUserId);
      const users_id = userIdsMap.get(lineUserId);
    console.log("Checking user_id:", users_id);

    if (!users_id) {
      console.error("ไม่พบ user_id สำหรับ Line User ID นี้");
      return;
    }
    console.log("Using tableName:", tableName); // ตรวจสอบชื่อ table

    if (!tableName || !['users_r2', 'users', 'employee'].includes(tableName)) {
      console.error("Invalid tableName:", tableName);
      return;
    }
    const password = await bcrypt.hash(rawpassword, saltRounds);

    let insertSql;
    let values;

    if (tableName === 'users_r2') {
      insertSql = `INSERT INTO users_r2 (position, employee, name, lastname, password, users_r3_id, phone, line, picture, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      values = ['Safety Officer Technical level', employee, name, lastname, password, users_r3_id, null, null, null, null];
    } else if (tableName === 'users') {
      insertSql = `INSERT INTO users (position, employee, name, lastname, password, role_2_id, phone, line, picture, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      values = ['Safety Officer Professional level', employee, name, lastname, password, role_2_id, null, null, null, null];
    } else if (tableName === 'employee') {
      insertSql = `INSERT INTO employee (employee, name, lastname, examinelist_id, users_id, lineUserId) VALUES (?, ?, ?, ?, ?, ? )`;
      values = [employee, name, lastname, null, users_id, null ];
    }
    console.log("SQL Query:", insertSql); // ตรวจสอบคำสั่ง SQL

    await db.query(insertSql, values);
    console.log("Employee saved successfully for user_id:", values);
    console.log("table save เหลือ " + tableName);

  } catch (error) {
    console.error('Error saving employee:', error);
  }
}

// ฟังก์ชันสำหรับลบพนักงาน
async function deleteEmployeeFromDB(employeeId, table) {
  if (!employeeId) {
    throw new Error('รหัสพนักงานไม่ถูกต้อง');
  }

  const employee = employeeId;
  let query = '';

  // กำหนดคำสั่ง SQL สำหรับลบพนักงานตามตารางที่เลือก
  if (table === 'employee') {
    query = `DELETE FROM employee WHERE employee = ?`;
  } else {
    throw new Error('ไม่พบตารางที่ต้องการลบ');
  }

  try {
    // ลบข้อมูลจากตารางในฐานข้อมูล
    const [result] = await db.execute(query, [employee]);
    console.log("cccc", result);

    // ตรวจสอบผลลัพธ์จากการลบ
    if (result.affectedRows > 0) {
      console.log(`พนักงานที่รหัส ${employeeId} ถูกลบจากตาราง ${table} สำเร็จ`);
    } else {
      throw new Error(`ไม่พบพนักงานที่มีรหัส ${employeeId} ในตาราง ${table}`);
    }
  } catch (error) {
    // จับข้อผิดพลาด
    console.error('เกิดข้อผิดพลาดในการลบพนักงาน: ', error.message);
    throw error; // ส่งข้อผิดพลาดไปยัง caller
  }
}



async function handleDateTimePostback(postback) {
  try {
    // ดึงค่า datetime จาก postback
    const datetime = postback.params.datetime;
   // แยก date และ time
    const [date, time] = datetime.split('T'); // date = '2024-10-10', time = '15:13'
    // กำหนดค่าที่จะใช้ในการบันทึก
    const startDate = date;       
    const startTime = time;      
    const endTime =  time;   
    //const userIdToSave = storedUserIds; 
    const user_id = decodedToken.user_id;   
    await savePlanToDatabase({
      date: startDate,
      startTime: startTime,
      endTime: endTime,
      activity: activity,
      user_id: user_id
    }, nameTable);
    console.log("บันทึกข้อมูลสำเร็จ");
  } catch (error) {
    console.error("Error handling postback datetime:", error);
  }
}
// ฟังก์ชันสำหรับบันทึกข้อมูล-แผนงาน-ลงฐานข้อมูล 
async function savePlanToDatabase({ date, startTime, endTime, activity, lineUserId, nameTable }) {
  try {
    // ตรวจสอบว่ามี user_id ใน Map
    const user_id = userIdsMap.get(lineUserId);
    console.log("Checking user_id:", user_id);
    if (!user_id) {
      console.error("ไม่พบ user_id สำหรับ Line User ID นี้");
      return;
    }
    console.log("Using nameTable:", nameTable); // ตรวจสอบชื่อ table

    if (!nameTable || !['plan_r2', 'plan_r3', 'plan'].includes(nameTable)) {
      console.error("Invalid nameTable:", nameTable);
      return;
    }

    // ใช้ฟังก์ชัน formatDateForDB เพื่อแปลงวันที่
    const formattedDate = formatDateForDB(date);
    console.log("Formatted Date:", formattedDate);

    let insertSql;
    if (nameTable === 'plan_r3') {
      insertSql = 'INSERT INTO plan_r3 (date, startTime, endTime, activity, user_id, meeting) VALUES (?, ?, ?, ?, ?, ?)';
    } else if (nameTable === 'plan_r2') {
      insertSql = 'INSERT INTO plan_r2 (date, startTime, endTime, activity, user_id, meeting) VALUES (?, ?, ?, ?, ?, ?)';
    } else if (nameTable === 'plan') {
      insertSql = 'INSERT INTO plan (date, startTime, endTime, activity, user_id, meeting) VALUES (?, ?, ?, ?, ?, ?)';
    }

    console.log("SQL Query:", insertSql); // ตรวจสอบคำสั่ง SQL
    console.log("Values to insert:", [formattedDate, startTime, endTime, activity, user_id, null]);

    console.log("Preparing to save with user_id:", user_id);

    // บันทึกข้อมูล
    await db.query(insertSql, [formattedDate, startTime, endTime, activity, user_id, null]);
    console.log("Plan saved successfully for user_id:", user_id);

  } catch (error) {
    console.error("Error saving plan:", error);
  }
}
//**************************************************************************************
// แยกวัน/เดือน/ปี และเวลา
function formatDateTimeForDB(dateTime) {
  const [day, month, yearWithTime] = dateTime.split('/');
  const [year, time] = yearWithTime.split(' '); // แยกปีและเวลาออกจากกัน
  
  // แปลงปี พ.ศ. เป็น ค.ศ.
  const convertedYear = parseInt(year, 10) - 543;

  // จัดรูปแบบ ปี-เดือน-วัน ชั่วโมง:นาที:วินาที
  return `${convertedYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${time}`;
}


async function saveNotifyToDatabase({ title, employee, location, fullname, position,dateTime,fileBuffer,filename,detail,id,role_2_id }) {
  try {

    //const dateTime = new Date().toLocaleString(); // กำหนดวันที่และเวลา

    console.error("สสสสสสสสสสสสสสสส:" ,title, employee, location, fullname, position,dateTime,fileBuffer,filename,detail,id,role_2_id );
    const getRole3Query = "SELECT users_r3_id FROM users_r2 WHERE id = ?";
    const [ResultRole3] = await db.query(getRole3Query, [role_2_id]);
    if (!ResultRole3.length) {
      console.error("ไม่พบ role_3_id สำหรับ role_2_id:", role_2_id);
      return;
    }
    const formattedDateTime = formatDateTimeForDB(dateTime);

    const insertSql = "INSERT INTO notify (title, employee, location, work_owner, status, date, file, file_name, detail, user_id, Verification_status, role_2_id, role_3_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const insertValues = [
      title,
      employee,
      location,
      fullname,
      position,
      formattedDateTime,
      fileBuffer, 
      filename,
      detail,
      id,
      1,
      role_2_id,
      ResultRole3[0].users_r3_id
    ];

    const [insertResult] = await db.execute(insertSql, insertValues);

    console.log("Notify saved successfully for notify_id:", insertResult.insertId);
  } catch (error) {
    console.error("Error saving Notify:", error);
  }
}


const fetchNotifyDetails = async (userId) => {
  try {
    const lineUserId = userId;
    // ใช้ userId เพื่อดึงข้อมูลการแจ้งเตือน
    const fetchNotifyQuery = `SELECT id,employee, CONCAT(name, ' ',lastname) As fullname, position,role_2_id FROM users WHERE lineUserId = ?`;
    const [notifyResult] = await db.query(fetchNotifyQuery, [lineUserId]);  // ใช้ userId ที่กำหนดมา

    console.log("Query executed with userId:", lineUserId);
    console.log("Query result:", notifyResult); // ตรวจสอบว่าได้ข้อมูลหรือไม่

    if (notifyResult.length === 0) {
      console.log("ไม่พบข้อมูลการแจ้งเตือนสำหรับ userId:", lineUserId);
    }

    return notifyResult;
  } catch (error) {
    console.error('Error fetching notify details:', error);
    return []; // คืนค่าตารางว่างหากมีข้อผิดพลาด
  }
};

function createInfoBox(label, value) {
  return {
    type: 'box',
    layout: 'baseline',
    contents: [
      { type: 'text', text: label, weight: 'bold', size: 'sm', color: '#333333', flex: 2 },
      { type: 'text', text: value, size: 'sm', color: '#666666', flex: 3, wrap: true },
    ],
  };
}

async function fetchZonesForUser(lineUserId) {
  try {
    let userId;

    // ตรวจสอบ userId จาก Map หรือดึงจากฐานข้อมูลถ้าไม่มี
    if (userIdsMap.has(lineUserId)) {
      userId = userIdsMap.get(lineUserId);
      console.log("พบ user_id ใน Map:", userId);
    } else {
      const userIdQuery = `SELECT id FROM users WHERE lineUserId = ?`;
      const [userResult] = await db.query(userIdQuery, [lineUserId]);
      console.log("ผลลัพธ์จากการดึง user_id:", userResult);

      if (userResult.length > 0) {
        userId = userResult[0].id;
        userIdsMap.set(lineUserId, userId); // เก็บ lineUserId และ user_id ใน Map
        console.log("เก็บ user_id ใน Map:", userId);
      } else {
        console.log("ไม่พบ user_id ที่เกี่ยวข้องกับ LINE User ID นี้");
        return []; // ออกถ้าไม่พบ user_id
      }
    }

    // ดึงข้อมูลโซนสำหรับ userId จากฐานข้อมูล
    const query = `SELECT examinelist.name FROM examinelist INNER JOIN users ON users.id = examinelist.user_id
                   WHERE examinelist.user_id = ?`;
    const [rows] = await db.query(query, [userId]); // ใช้ userId ที่อัปเดตจาก Map

    console.log('Zone data fetched for user:', rows);
    return rows; // ส่งผลลัพธ์โซนกลับมา

  } catch (error) {
    console.error('Error fetching zones for user from database:', error);
    return []; // คืนค่าตารางว่างหากมีข้อผิดพลาด
  }
}


async function downloadImage(messageId) {
  try {
    const tempDir = path.join(__dirname, 'temp'); // โฟลเดอร์ temp
    const filePath = path.join(tempDir, `${messageId}.jpg`); // ที่อยู่ไฟล์

    // ตรวจสอบว่า temp มีอยู่หรือยัง
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // ดึงข้อมูล Media
    const stream = await client.getMessageContent(messageId);
    if (!stream) {
      console.error("ไม่พบ Media สำหรับ Message ID:", messageId);
      throw new Error("Media not found");
    }

    // บันทึกไฟล์
    return new Promise((resolve, reject) => {
      const writable = fs.createWriteStream(filePath);
      stream.pipe(writable);
      writable.on('finish', () => resolve(filePath));
      writable.on('error', reject);
    });
  } catch (error) {
    console.error("Error downloading image:", error.message);
    throw error; // ส่งต่อข้อผิดพลาดให้ผู้เรียก
  }
}

// ฟังก์ชันอัปโหลดไปยัง Imgur
async function uploadToImgur(imagePath) {
  const imgurClientId = '27d45fbaf03fb9a'; // ใช้ Imgur client ID 
  const formData = new FormData();
  formData.append('image', fs.createReadStream(imagePath));

  try {
    const response = await axios.post('https://api.imgur.com/3/image', formData, {
      headers: {
        'Authorization': `Client-ID ${imgurClientId}`,
        ...formData.getHeaders()
      }
    });
    return response.data.data.link; // จะได้รับ URL ของไฟล์ที่อัปโหลด
  } catch (error) {
    console.error('Error uploading image to Imgur:', error);
    throw error;
  }
}

//**************************************************************************************
// ใช้ตัวแปรชั่วคราวในการเก็บข้อมูลพนักงาน
const addEmployeeData = {};
const confirmSaveEmployee = {};
const addNotifyData ={};
const confirmSaveNotify = {};
const addActivityPlan = {};
const confirmSavePlan = {};
const deleteEmployeeData = {};


async function handleEvents(event) {

  try 
  {
      console.log(event); // เพิ่มการจัดการเหตุการณ์ที่นี่ เช่น การตอบกลับข้อความ

  if (event.type === 'message' && event.message.type === 'text') {
    const userMessage = event.message.text;

    /**************** Employee List *********************/
    // เพิ่มลูกทีมให้จป.ทุกระดับ
    if (userMessage === 'เพิ่มจป.ระดับเทคนิค' || userMessage === 'เพิ่มจป.ระดับหัวหน้างาน' || userMessage === 'เพิ่มพนักงาน') {
      const table = userMessage === 'เพิ่มจป.ระดับเทคนิค' ? 'users_r2' 
                : userMessage === 'เพิ่มจป.ระดับหัวหน้างาน' ? 'users' 
                : userMessage === 'เพิ่มพนักงาน' ? 'employee' 
                : null;

    addEmployeeData[event.source.userId] = { Table: table, data: [] };
    console.log("table in add: " + table);
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'กรุณากรอกรหัสพนักงาน'
      });
    } else if (addEmployeeData[event.source.userId]) {
      // หากมีข้อมูลอยู่ใน addEmployeeData
      addEmployeeData[event.source.userId].data.push(userMessage);

      // ตรวจสอบว่ากรอกข้อมูลครบแล้วหรือไม่ (รหัสพนักงาน, ชื่อ, นามสกุล, รหัสผ่าน)
      if (addEmployeeData[event.source.userId].data.length === 4) {
        const [employee, name, lastname, rawpassword] = addEmployeeData[event.source.userId].data;
        const tableName = addEmployeeData[event.source.userId].Table
        confirmSaveEmployee[event.source.userId] = { employee, name, lastname, rawpassword, tableName };
        console.log("table0000: " + tableName);

        delete addEmployeeData[event.source.userId];
        
        return client.replyMessage(event.replyToken, {
          type: 'flex',
          altText: 'ข้อมูลพนักงานก่อนยืนยันการบันทึก',
          contents: {
            type: 'bubble',
            body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                {
                  type: 'text',
                  text: 'ข้อมูลพนักงานที่ต้องการเพิ่ม',
                  weight: 'bold',
                  size: 'lg',
                  align: 'center'
                },
                {
                  type: 'separator',
                  margin: 'md'
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  margin: 'lg',
                  spacing: 'sm',
                  contents: [
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                    {
                      type: 'text',
                      text: 'รหัสพนักงาน:',
                      color: '#666666',
                      size: 'sm',
                      flex: 2
                    },
                    {
                      type: 'text',
                      text: employee,
                      wrap: true,
                      color: '#666666',
                      size: 'sm',
                      flex: 3
                    }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                    {
                      type: 'text',
                      text: 'ชื่อ:',
                      color: '#666666',
                      size: 'sm',
                      flex: 2
                    },
                    {
                      type: 'text',
                      text: name,
                      wrap: true,
                      color: '#666666',
                      size: 'sm',
                      flex: 3
                    }
                  ]
                  },
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                    {
                      type: 'text',
                      text: 'นามสกุล:',
                      color: '#666666',
                      size: 'sm',
                      flex: 2
                    },
                    {
                      type: 'text',
                      text: lastname,
                      wrap: true,
                      color: '#666666',
                      size: 'sm',
                      flex: 3
                    }
                    ]
                  }
                ]
              },
              {
                type: 'separator',
                margin: 'lg'
              },
              {
                type: 'text',
                text: 'ต้องการยืนยันการบันทึกหรือไม่?',
                wrap: true,
                margin: 'lg',
                align: 'center',
                color: '#666666'
              }
            ]
          }
        },
          quickReply: {
            items: [
                {
                    type: 'action',
                    action: {
                        type: 'message',
                        label: 'ยืนยัน',
                        text: 'ยืนยัน'
                    }
                },
                {
                    type: 'action',
                    action: {
                        type: 'message',
                        label: 'ยกเลิก',
                        text: 'ยกเลิก'
                    }
                }
            ]
        }
      });
      } else {
        const prompts = ['กรุณากรอกชื่อพนักงาน', 'กรุณากรอกนามสกุล', 'กรุณากรอกรหัสผ่าน'];
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: prompts[addEmployeeData[event.source.userId].data.length - 1]
        });
      }
      
    } else if (confirmSaveEmployee[event.source.userId]) {
      if (userMessage === 'ยืนยัน') {
        const lineUserId = event.source.userId;
        const { employee, name, lastname, rawpassword, tableName } = confirmSaveEmployee[event.source.userId];
        console.log("table YES:" + tableName)

        if (tableName) {
        await saveEmployeeToDatabase(employee, name, lastname, rawpassword, lineUserId, tableName);
        //delete confirmSaveEmployee[event.source.userId].employee;
         
        // ลบเฉพาะข้อมูลพนักงานใน confirmSaveEmployee แต่คง tableName ไว้
        confirmSaveEmployee[event.source.userId] = { tableName };
        console.log("ข้อมูลที่เหลือ " + confirmSaveEmployee[event.source.userId].tableName);
        
        return client.replyMessage(event.replyToken, {
              type: 'text',
              text: 'ข้อมูลพนักงานใหม่ถูกบันทึกเรียบร้อยแล้ว! ต้องการเพิ่มพนักงานอีกหรือไม่?',
              quickReply: {
                 items: [
                {
                  type: 'action',
                  action: { 
                      type: 'message', 
                      label: 'ใช่', 
                      text: 'ใช่'
                    }
                },
                {
                  type: 'action',
                  action: { 
                    type: 'message', 
                    label: 'ไม่ใช่', 
                    text: 'ไม่ใช่'
                  }
                }
              ]
            }
          });      
        } else {
            console.error("ไม่สามารถเข้าถึง tableName");
            return client.replyMessage(event.replyToken, { type: 'text', text: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลแผนงาน โปรดลองใหม่อีกครั้ง' });
        } 
        
      } else if (userMessage === 'ยกเลิก') {
        delete confirmSaveEmployee[event.source.userId];
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'ยกเลิกการบันทึกข้อมูลพนักงาน'
        });
      } else if (userMessage === 'ใช่') {
        // ตรวจสอบว่ามีตารางล่าสุดอยู่ใน confirmSaveEmployee หรือไม่
        const lastTable = confirmSaveEmployee[event.source.userId]?.tableName;
        // ถ้ามีการกำหนดตารางล่าสุดไว้ ใช้ตารางนั้นในการเพิ่มพนักงานใหม่
        addEmployeeData[event.source.userId] = { Table: lastTable || null, data: [] };
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'กรุณากรอกรหัสพนักงาน'
        });
      } else if (userMessage === 'ไม่ใช่') {
      delete addEmployeeData[event.source.userId]
      return client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'สิ้นสุดการเพิ่มพนักงานใหม่'
      });
    } 
    } 

    /****************************************************/

      // ลบพนักงาน
      if (userMessage === 'ลบพนักงาน') {
        const table = 'employee';

        deleteEmployeeData[event.source.userId] = { Table: table, data: [] };
        console.log("table in add: " + table);
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'กรุณากรอกรหัสพนักงานที่ต้องการลบ'
        });
      }
      // เมื่อผู้ใช้กรอกรหัสพนักงานที่ต้องการลบ
      else if (deleteEmployeeData[event.source.userId]) {
        const employeeId = userMessage;  
        const tableName = deleteEmployeeData[event.source.userId].Table;  

        console.log("Employee ID to delete:", employeeId);
        console.log("Table to delete from:", tableName);

        await deleteEmployeeFromDB(employeeId, tableName);
        delete deleteEmployeeData[event.source.userId];

        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: `พนักงานรหัส ${employeeId} ถูกลบเรียบร้อยแล้ว`
        });
      }

/****************************************************/

    // ดูข้อมูลพนักงาน
    if (userMessage === 'employee list role3') {
      const userId = event.source.userId;
      const employees = await fetchEmployeesFromDB(userId,'users_r2'); // ดึงข้อมูลจาก users role2
      const flexMessage = createEmployeeFlexMessage(employees, 'manager');
      return client.replyMessage(event.replyToken, flexMessage)
        .then(() => {
          console.log('Flex Message ส่งสำเร็จ');
        })
        .catch((err) => {
          console.error('Error ส่ง Flex Message:', err);
        });
    }
    if (userMessage === 'employee list role2') {
      const userId = event.source.userId;
      const employees = await fetchEmployeesFromDB(userId, 'users'); // ดึงข้อมูลจาก users role1
      const flexMessage = createEmployeeFlexMessage(employees, 'technical');
      return client.replyMessage(event.replyToken, flexMessage)
        .then(() => {
          console.log('Flex Message ส่งสำเร็จ');
        })
        .catch((err) => {
          console.error('Error ส่ง Flex Message:', err);
        });
    }
        
    if (userMessage === 'employee list role1') {
      const userId = event.source.userId;
      const employees = await fetchEmployeesFromDB(userId, 'employee'); // ดึงข้อมูลจาก employee
      const flexMessage = createEmployeeFlexMessage(employees, 'super');
      return client.replyMessage(event.replyToken, flexMessage)
        .then(() => {
          console.log('Flex Message ส่งสำเร็จ');
        })
        .catch((err) => {
          console.error('Error ส่ง Flex Message:', err);
        });
    }
    /****************************************************/


  /************************notify***************************************************/

 //const userId = event.source.userId;
 const messageId = event.message.id;
 const userId = event.source.userId;

if (userMessage === 'notify role1') {
    addNotifyData[userId] = { data: [], type: 'notify' }; // กำหนดให้เป็นประเภท notify
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'ระบุหัวข้อในการแจ้งเตือน (Topic) ที่ต้องการ 💡\nเช่น: ถังดับเพลิงหมดอายุ',
    });
}

if (addNotifyData[userId] && addNotifyData[userId].type === 'notify') {
    // การดำเนินการในส่วนของ notify
    if (event.message.type === 'text') {
        addNotifyData[userId].data.push(userMessage);
    }

    // ตรวจสอบสถานะของข้อมูล
    if (addNotifyData[userId].data.length === 1) {
        const zones = await fetchZonesForUser(userId);
        const quickReplyItems = zones.map(zone => ({
            type: 'action',
            action: { type: 'message', label: zone.name, text: zone.name },
        }));
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'กรุณาระบุโซน 🏢',
          quickReply: { items: quickReplyItems },
        });
    } else if (addNotifyData[userId].data.length === 2) {
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'กรุณาแนบรูปภาพ 📸',
          quickReply: {
            items: [
              { type: 'action', action: { type: 'camera', label: 'ถ่ายรูป' } },
              { type: 'action', action: { type: 'cameraRoll', label: 'เลือกจากแกลเลอรี' } },
            ],
          },
        });
    }
    
  
    if (addNotifyData[userId]) {
      const { status, data, imageUrl } = addNotifyData[userId];
      const notifyDetails = await fetchNotifyDetails(userId);
  
      // กรณีรอรายละเอียด
      if (status === 'awaiting_detail') {
        data.push(userMessage); // เก็บข้อความใน data
        addNotifyData[userId].status = 'ready_to_flex'; // ตั้งสถานะว่า Flex พร้อมแล้ว
  
        // ตรวจสอบว่าข้อมูลพร้อมส่ง Flex หรือยัง
        if (data.length >= 3 && imageUrl) {
          const [title, location, detail] = data;
  
          const replyMessage = {
            type: 'flex',
            altText: 'ข้อมูลการแจ้งเตือนก่อนยืนยันการบันทึก',
            contents: {
              type: 'bubble',
              size: 'mega',
              styles: {
                header: { backgroundColor: '#80B18A' },
                body: { backgroundColor: '#ffffff' },
              },
              header: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: title, 
                    weight: 'bold',
                    size: 'lg',
                    align: 'center',
                    color: '#ffffff',
                  },
                ],
              },
              body: {
                type: 'box',
                layout: 'vertical',
                spacing: 'md',
                contents: [
                  {
                    type: 'box',
                    layout: 'vertical',
                    spacing: 'sm',
                    contents: [
                      createInfoBox('พนักงาน', notifyDetails[0].employee),
                      createInfoBox('เจ้าของงาน', notifyDetails[0].fullname),
                      createInfoBox('ตำแหน่ง', notifyDetails[0].position),
                      createInfoBox('โซน', location),
                      createInfoBox('วันที่', new Date().toLocaleString('th-TH')),
                    ],
                  },
                  { type: 'separator', margin: 'lg' },
                  {
                    type: 'text',
                    text: 'อัปโหลดรูป',
                    weight: 'bold',
                    size: 'sm',
                    color: '#000000',
                    align: 'start',
                    margin: 'sm',
                  },
                  {
                    type: 'image',
                    url: imageUrl,
                    size: 'xl',
                    aspectMode: 'cover',
                    margin: 'md',
                  },
                  {
                    type: 'text',
                    text: 'รายละเอียด',
                    weight: 'bold',
                    size: 'sm',
                    color: '#000000',
                    align: 'start',
                    margin: 'sm',
                  },
                  {
                    type: 'text',
                    text: detail, // รายละเอียดเพิ่มเติม
                    wrap: true,
                    size: 'sm',
                    margin: 'md',
                    color: '#555555',
                  },
                  { type: 'separator', margin: 'lg' },
                  {
                    type: 'text',
                    text: '🔔 ต้องการส่งการแจ้งเตือนหรือไม่?',
                    wrap: true,
                    margin: 'lg',
                    align: 'center',
                    color: '#666666',
                  },
                ],
              },
            },
            quickReply: {
              items: [
                { type: 'action', action: { type: 'message', label: 'send', text: 'send' } },
                { type: 'action', action: { type: 'message', label: 'cancel', text: 'cancel' } },
              ],
            },
          };
  
          await client.replyMessage(event.replyToken, replyMessage);
          console.log('Flex Message sent successfully.');
        } else {
          // ถ้าข้อมูลยังไม่ครบ
          return client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'กรุณาระบุข้อมูลเพิ่มเติม ✏️',
          });
        }
      }
    }
   
    if (addNotifyData[userId] && addNotifyData[userId].status === 'ready_to_flex') {
      const { data, fileBuffer,filename } = addNotifyData[userId]; // ดึงค่าจาก addNotifyData
      const [title, location, detail] = data; // แยกค่าที่ต้องการจาก data
      const notifyDetails = await fetchNotifyDetails(userId)
      // ตรวจสอบว่า notifyDetails มีข้อมูล
      if (notifyDetails && notifyDetails.length > 0) {
        const { employee, fullname, position, id,role_2_id } = notifyDetails[0];
        confirmSaveNotify[userId] = {
          title,
          employee,
          location,
          fullname,
          position,
          dateTime: new Date().toLocaleString('th-TH'),
          fileBuffer,
          filename,
          detail,
          id,
          role_2_id
        };
        console.log('ข้อมูลที่บันทึกใน confirmSaveNotify:', confirmSaveNotify[userId]);
      } else {
        console.log('ไม่พบข้อมูลสำหรับ userId:', userId);
      }
    }
    
    if (confirmSaveNotify[event.source.userId]) {
      console.log('confirmSaveNotify:', confirmSaveNotify[event.source.userId]);
    
      if (userMessage === 'send') {
        console.log('userMessage คือ send');
    
        const { title, employee, location, fullname, position, dateTime,fileBuffer,filename,detail,id,role_2_id} = confirmSaveNotify[event.source.userId];
        console.log('ข้อมูลที่ต้องการบันทึก:', { title, employee, location, fullname, position, dateTime,fileBuffer,filename,detail,id,role_2_id });
    
        // เรียกฟังก์ชันบันทึกข้อมูล
        await saveNotifyToDatabase({ title, employee, location, fullname, position, dateTime,fileBuffer,filename,detail,id,role_2_id});
      // ลบข้อมูลหลังจากบันทึกเสร็จ
    delete confirmSaveNotify[userId];
    await client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'ส่งข้อมูลเรียบร้อยแล้ว 🎉',
    });
  } else if (userMessage === 'cancel') {
    console.log('userMessage คือ cancel');

    // ลบข้อมูลใน confirmSaveNotify
    delete confirmSaveNotify[userId];
    await client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'ยกเลิกการส่งข้อมูลเรียบร้อยแล้ว ❌',
    });
  } else {
    console.log('userMessage ไม่ตรงกับคำสั่งที่กำหนด:', userMessage);
  }
} else {
  console.log('confirmSaveNotify ไม่มีข้อมูลสำหรับ userId:', userId);

  // ตอบกลับว่าข้อมูลไม่พบ
  await client.replyMessage(event.replyToken, {
    type: 'text',
    text: 'ไม่มีข้อมูลที่ต้องการส่งหรือยกเลิก',
  });
}
}
 
    /********************* Plan *************************/
      // ดูข้อมูลแผนงาน
      if(userMessage === 'plan role3'){
        const userId = event.source.userId;
        const planData = await fetchPlansFromDB(userId, 'plan_r3');
        const flexMessage = createPlanFlexMessage(planData, 'manager');
        return client.replyMessage(event.replyToken, flexMessage);
      }
      if(userMessage === 'plan role2'){
        const userId = event.source.userId;
        const planData = await fetchPlansFromDB(userId, 'plan_r2');
        const flexMessage = createPlanFlexMessage(planData, 'technical');
        //createPlanFlexMessage(planData, 'technical');
        return client.replyMessage(event.replyToken, flexMessage);
      }    
      if (userMessage === 'plan role1') {
        const userId = event.source.userId;
        const planData = await fetchPlansFromDB(userId, 'plan');
        const flexMessage = createPlanFlexMessage(planData, 'super');
        return client.replyMessage(event.replyToken, flexMessage);
      }
    
      
      // เพิ่มแผนงาน
      if (userMessage === 'add plan SO.Man' || userMessage === 'add plan SO.Tech' || userMessage === 'add plan SO.Sup') {
          const table = userMessage === 'add plan SO.Man' ? 'plan_r3' 
                      : userMessage === 'add plan SO.Tech' ? 'plan_r2' 
                      : userMessage === 'add plan SO.Sup' ? 'plan' 
                      : null;  
          addActivityPlan[event.source.userId] = { Table: table, data: [] };
          console.log("table in add plan: " + table);
          // ตอบกลับเป็นข้อความที่มีลิงก์ให้เปิด
          return client.replyMessage(event.replyToken, {
                  type: 'text',
                  text: 'ระบุวันที่และเวลาที่เริ่มแผนงาน',
                  quickReply: {
                  items: [
                  {
                    type: 'action',
                    action: { 
                        type: 'datetimepicker', 
                        label: 'เลือกวันที่และเวลา', 
                        data: 'startDatetime', 
                        mode: 'datetime' 
                      }
                    }
                  ]
                }
              });
            }
          // จัดการ postback
          if (event.type === 'postback') {
            const postbackData = event.postback.data;

          if (postbackData === 'startDatetime' && event.postback.params) {
            const selectedDateTime = event.postback.params.datetime;
            addActivityPlan[event.source.userId].data.push(selectedDateTime);
        
            await client.replyMessage(event.replyToken, [
              {
                type: 'text',
                text: `คุณเลือกวันที่: ${selectedDateTime.split('T')[0]} และเวลา: ${selectedDateTime.split('T')[1]}`
              },
              {
                type: 'text',
                text: 'กรุณาระบุเวลาสิ้นสุดของแผนงาน',
                quickReply: {
                    items: [
                        {
                            type: 'action',
                            action: {
                                type: 'datetimepicker',
                                label: 'เลือกเวลา',
                                data: 'endTime',
                                mode: 'time'
                            }
                        }
                    ]
                  }
                }
              ]);
            }
          if (postbackData === 'endTime' && event.postback.params) {
              const selectedEndTime = event.postback.params.time;
              addActivityPlan[event.source.userId].data.push(selectedEndTime);
        
              await client.replyMessage(event.replyToken, [
              {
                type: 'text',
                text: `คุณเลือกเวลา: ${selectedEndTime}`
              },
              {
                type: 'text',
                text: 'กรุณาระบุชื่อของกิจกรรมหรือรายละเอียดของแผนงาน เช่น\n ประชุมประจำเดือน'
              }
            ]);
          }
        }
      // เมื่อผู้ใช้ตอบกลับข้อความกิจกรรม
      if (addActivityPlan[event.source.userId] && addActivityPlan[event.source.userId].data.length === 2) {
          addActivityPlan[event.source.userId].data.push(userMessage);
          const [startDatetime, endTime, activity] = addActivityPlan[event.source.userId].data;

          const createConfirmPlanFlexMessage = (plan) => {
            return {
              type: 'flex',
              altText: 'ข้อมูลแผนงานก่อนยืนยันการบันทึก',
              contents: {
                type: 'bubble',
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                    {
                      type: 'text',
                      text: 'ข้อมูลแผนงานที่ต้องการเพิ่ม',
                      weight: 'bold',
                      size: 'lg',
                      align: 'center'
                    },
                    {
                      type: 'separator',
                      margin: 'md'
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      margin: 'lg',
                      spacing: 'sm',
                      contents: [
                      {
                        type: 'box',
                        layout: 'baseline',
                        spacing: 'sm',
                        contents: [
                        {
                          type: 'text',
                          text: 'กิจกรรม:',
                          color: '#666666',
                          size: 'sm',
                          flex: 2
                        },
                        {
                          type: 'text',
                          text: plan.activity,
                          wrap: true,
                          color: '#666666',
                          size: 'sm',
                          flex: 3
                        }
                        ]
                      },
                      {
                        type: 'box',
                        layout: 'baseline',
                        spacing: 'sm',
                        contents: [
                        {
                          type: 'text',
                          text: 'วันที่:',
                          color: '#666666',
                          size: 'sm',
                          flex: 2
                        },
                        {
                          type: 'text',
                          text: plan.date,
                          wrap: true,
                          color: '#666666',
                          size: 'sm',
                          flex: 3
                        }
                      ]
                      },
                      {
                        type: 'box',
                        layout: 'baseline',
                        spacing: 'sm',
                        contents: [
                        {
                          type: 'text',
                          text: 'เวลาเริ่ม:',
                          color: '#666666',
                          size: 'sm',
                          flex: 2
                        },
                        {
                          type: 'text',
                          text: plan.startTime,
                          wrap: true,
                          color: '#666666',
                          size: 'sm',
                          flex: 3
                        }
                        ]
                      },
                      {
                        type: 'box',
                        layout: 'baseline',
                        spacing: 'sm',
                        contents: [
                        {
                          type: 'text',
                          text: 'เวลาสิ้นสุด:',
                          color: '#666666',
                          size: 'sm',
                          flex: 2
                        },
                        {
                          type: 'text',
                          text: plan.endTime,
                          wrap: true,
                          color: '#666666',
                          size: 'sm',
                          flex: 3
                        }
                      ]
                      }
                    ]
                  },
                  {
                    type: 'separator',
                    margin: 'lg'
                  },
                  {
                    type: 'text',
                    text: 'ต้องการยืนยันการบันทึกหรือไม่?',
                    wrap: true,
                    margin: 'lg',
                    align: 'center',
                    color: '#666666'
                  }
                ]
              }
            },
              quickReply: {
                items: [
                    {
                        type: 'action',
                        action: {
                            type: 'message',
                            label: 'ใช่',
                            text: 'ใช่'
                        }
                    },
                    {
                        type: 'action',
                        action: {
                            type: 'message',
                            label: 'ไม่',
                            text: 'ไม่'
                        }
                    }
                ]
              }
            };
          };

          const flexMessage = (plan) => {
            return {
            type: 'bubble',
            header: {
              type: 'box',
              layout:'vertical',
              contents: [
                {
                  type: 'text',
                  text: 'Test',
                  weight: 'bold',
                  size: 'xl',
                  align: 'center'
                }
              ]
            },
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: 'รหัสพนักงาน : em001',
                      wrap: true
                    },
                    {
                      type: 'text',
                      text: 'ผู้ดูแล : ice tymm',
                      wrap: true
                    },
                    {
                      type: 'text',
                      text: 'วันที่ : 13/11/2024 13:42 น.',
                      wrap: true
                    }
                  ],
                  spacing: 'sm'
                },
                {
                  type: 'separator',
                  margin: 'md'
                },
                {
                  type: 'text',
                  text:'รูปภาพที่อัปโหลด',
                  margin: 'md',
                  weight: 'bold'
                },
                {
                  type: 'image',
                  url: 'https://img.lazcdn.com/g/p/f8d6101323452b9b563e9fb2d38e982a.jpg_360x360q75.jpg_.webp',
                  size: 'sm',
                  aspectRatio: '4:3',
                  margin: 'md'
                },
                {
                  type: 'text',
                  text: 'รายละเอียด',
                  margin: 'md',
                  weight: 'bold'
                },
                {
                  type: 'text',
                  text: '-',
                  wrap: true,
                  margin: 'sm'
                }
              ]
            },
            footer: {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'button',
                  action: {
                    type: 'message',
                    label: 'อนุมัติ',
                    text: 'อนุมัติ'
                  }
                }
              ]
            }
          }
        }

          const planDetails = {
            activity: activity,
            date: startDatetime.split('T')[0],
            startTime: startDatetime.split('T')[1],
            endTime: endTime
        };
        
          confirmSavePlan[event.source.userId] = { startDatetime, endTime, activity, nameTable: addActivityPlan[event.source.userId].Table };
          delete addActivityPlan[event.source.userId];
    
          return client.replyMessage(event.replyToken, createConfirmPlanFlexMessage(planDetails));

          }
      // ตรวจสอบการยืนยันการบันทึก
      if (confirmSavePlan[event.source.userId]) {
        if (userMessage === 'ใช่') {
            const lineUserId = event.source.userId;
            const { startDatetime, endTime, activity, nameTable } = confirmSavePlan[event.source.userId];

        if (nameTable) {
            await savePlanToDatabase({
                date: startDatetime.split('T')[0],
                startTime: startDatetime.split('T')[1],
                endTime: endTime,
                activity: activity,
                lineUserId: lineUserId,
                nameTable: nameTable
            });

            delete confirmSavePlan[event.source.userId];

            // เริ่มต้นขั้นตอนการเพิ่มแผนงานใหม่
            addActivityPlan[event.source.userId] = { Table: nameTable, data: [] };

            return client.replyMessage(event.replyToken, {
              type: 'text',
              text: 'ข้อมูลแผนงานใหม่ถูกบันทึกเรียบร้อยแล้ว! ต้องการเพิ่มแผนงานอีกหรือไม่?',
              quickReply: {
                 items: [
                {
                  type: 'action',
                  action: { 
                      type: 'message', 
                      label: 'ใช่', 
                      text: 'ใช่'
                    }
                },
                {
                  type: 'action',
                  action: { 
                    type: 'message', 
                    label: 'ไม่ใช่', 
                    text: 'ไม่ใช่'
                  }
                }
              ]
            }
          });
        } else {
            console.error("ไม่สามารถเข้าถึง nameTable");
            return client.replyMessage(event.replyToken, { type: 'text', text: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลแผนงาน โปรดลองใหม่อีกครั้ง' });
        }
        } else if (userMessage === 'ไม่') {
            delete confirmSavePlan[event.source.userId];
            return client.replyMessage(event.replyToken, { type: 'text', text: 'ยกเลิกการบันทึกข้อมูลแผนงานใหม่' });
        }
      }

    // หากผู้ใช้กด "ใช่" สำหรับการเพิ่มแผนงานใหม่
if (userMessage === 'ใช่' && !confirmSavePlan[event.source.userId]) {
  return client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'ระบุวันที่และเวลาที่เริ่มแผนงาน',
      quickReply: {
          items: [
              {
                  type: 'action',
                  action: { 
                      type: 'datetimepicker', 
                      label: 'เลือกวันที่และเวลา', 
                      data: 'startDatetime', 
                      mode: 'datetime' 
                  }
              }
          ]
      }
  });
}else if (userMessage === 'ไม่ใช่'){
  return client.replyMessage(event.replyToken, { type: 'text', text: 'สิ้นสุดการบันทึกข้อมูลแผนงาน' });
}
      /***************************************************/
}  
// จัดการ postback
if (event.type === 'postback') {
  const postbackData = event.postback.data;

  // ตัวอย่าง: ตรวจสอบ postback สำหรับการเลือกวันที่เริ่มต้น
  if (postbackData === 'startDatetime' && event.postback.params) {
      const selectedDateTime = event.postback.params.datetime;
      addActivityPlan[event.source.userId].data.push(selectedDateTime);
      
      await client.replyMessage(event.replyToken, [
          {
              type: 'text',
              text: `คุณเลือกวันที่: ${selectedDateTime.split('T')[0]} และเวลา: ${selectedDateTime.split('T')[1]}`
          },
          {
              type: 'text',
              text: 'กรุณาระบุเวลาสิ้นสุดของแผนงาน',
              quickReply: {
                  items: [
                      {
                          type: 'action',
                          action: {
                              type: 'datetimepicker',
                              label: 'เลือกเวลา',
                              data: 'endTime',
                              mode: 'time'
                          }
                      }
                  ]
              }
          }
      ]);
    }
  // ตัวอย่าง: ตรวจสอบ postback สำหรับการเลือกเวลาสิ้นสุด
  if (postbackData === 'endTime' && event.postback.params) {
      const selectedEndTime = event.postback.params.time;
      addActivityPlan[event.source.userId].data.push(selectedEndTime);
      
      await client.replyMessage(event.replyToken, [
          {
              type: 'text',
              text: `คุณเลือกเวลา: ${selectedEndTime}`
          },
          {
              type: 'text',
              text: 'กรุณาระบุชื่อของกิจกรรมหรือรายละเอียดของแผนงาน เช่น\n ประชุมประจำเดือน'
          }
      ]);
    }
  }

  /************************notify***************************************************/

  const userId = event.source.userId;
  const messageId = event.message.id; // ID ของรูปภาพที่ส่งมา

// เช็คว่าเป็นข้อความและเป็นภาพ
if (event.type === 'message' && event.message.type === 'image') {
  if (addNotifyData[userId]) {
    try {
      if (event.message.contentProvider.type === 'line') {
        // ดาวน์โหลดและอัปโหลดรูปภาพ
        const imagePath = await downloadImage(messageId);

        // อัปโหลดรูปภาพไปที่ Imgur
        const imgurUrl = await uploadToImgur(imagePath);
        console.log('Image uploaded to Imgur:', imgurUrl);

        
        console.log('กำลังบันทึกข้อมูลภาพ, messageId:', messageId);
          // อ่านไฟล์เป็น buffer
          const fileBuffer = fs.readFileSync(imagePath);
          console.log('Image uploaded to Imgur:', fileBuffer);

        
        // บันทึก imageUrl และตั้งสถานะว่า "รอรายละเอียด"
        addNotifyData[userId].imageUrl = imgurUrl;
        addNotifyData[userId].fileBuffer = fileBuffer;
        addNotifyData[userId].filename = `${messageId}.jpg`;;
        addNotifyData[userId].status = 'awaiting_detail'; // สถานะใหม่

        // แจ้งให้ผู้ใช้พิมพ์รายละเอียด
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'กรุณาระบุรายละเอียดเพิ่มเติมเกี่ยวกับการแจ้งเตือน ✏️',
        });
      } else {
        console.log('Image is not stored on LINE server.');
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'ไม่สามารถดาวน์โหลดรูปภาพได้จาก LINE server',
        });
      }
    } catch (error) {
      console.error('Error saving image:', error);
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'ไม่สามารถบันทึกรูปภาพได้ กรุณาลองใหม่',
      });
    }
  } else {
    console.log(`No data found for userId: ${userId}`);
  }
}

} catch (err) {
  console.error('Error handling event:', err);
 }
return Promise.resolve(null);
}


