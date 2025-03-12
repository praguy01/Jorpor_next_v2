import axios from 'axios';
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
      layout: 'vertical',
      contents: [
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: `ลำดับ.${index + 1}`, // ลำดับพนักงาน
                color: '#363636',
                align: 'start',
                flex: 1
              },
              {
                type: 'text',
                text: `รหัสพนักงาน: `, // รหัสพนักงาน
                color: '#363636',
                align: 'end',
                flex: 2, // ปรับ flex ให้ใกล้เคียงกัน
                gravity: 'center' // จัดตำแหน่งให้กลาง
              },
              {
                type: 'box',
                layout: 'vertical',
                backgroundColor: '#5A975E', // เพิ่มพื้นหลังสีเขียว
                cornerRadius: '9px', // มุมกล่องมน
                paddingAll: '5px', // ระยะห่างรอบตัวอักษรภายในกล่อง
                contents: [
                  {
                    type: 'text',
                    text: `${employee.employee}`, // รหัสพนักงาน
                    color: '#ffffff',
                    align: 'center',
                   // weight: 'bold',
                    flex: 3
                  }
                ]
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
        },
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/4315/4315451.png'
      });
    } else if (role === 'technical') {
      quickReplyItems.push({
        type: 'action',
        action: {
          type: 'message',
          label: 'เพิ่มจป.ระดับหัวหน้างาน',
          text: 'เพิ่มจป.ระดับหัวหน้างาน'
        },
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/4315/4315451.png'
      });
    } 
    else if (role === 'super') {
      quickReplyItems.push({
        type: 'action',
        action: {
          type: 'message',
          label: 'เพิ่มพนักงาน',
          text: 'เพิ่มพนักงาน'
        },
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/4315/4315451.png'
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
              color: '#5A975E'
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
      },
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/5246/5246210.png'
    });
  } else if (role === 'technical') {
    quickReplyItems.push({
      type: 'action',
      action: {
        type: 'message',
        label: 'add plan SO.Tech',
        text: 'add plan SO.Tech'
      },
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/5246/5246210.png'
    });
  } else if(role === 'super'){
    quickReplyItems.push({
      type: 'action',
      action: {
        type: 'message',
        label: 'add plan SO.Sup',
        text: 'add plan SO.Sup'
      },
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/5246/5246210.png'
    });
  }

   // ถ้า planData ไม่มีข้อมูล ให้แสดงข้อความว่าไม่มีข้อมูลแผนงาน
   if (!planData || planData.length === 0) {
    return {
      type: "flex",
      size: "giga",
      altText: "ไม่มีข้อมูลแผนงาน",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "ไม่มีข้อมูลแผนงาน!",
              weight: "bold",
              size: "lg",
              color: "#5A975E",
              align: "center"
            },
            {
              type: "text",
              text: "กรุณาเพิ่มข้อมูลแผนงานหรือสอบถามผู้ดูแลระบบ",
              size: "sm",
              color: "#666666",
              align: "center",
              margin: "md"
            }
          ]
        },
        styles: {
          body: {
            backgroundColor: "#FFFFFF"
          }
        }
      },
      quickReply: {
        items: quickReplyItems,
      }
    };
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
    }
  }
}

// ฟังก์ชันสร้าง Flex Message : zone
export function createZoneListFlexMessage(examineData) {
  if (!examineData || examineData.length === 0) {
    return {
      type: "text",
      text: "ไม่พบข้อมูลการตรวจสอบ"
    };
  }
  
  const zoneContents = examineData.map((zone, index) => ({
    type: "button",
    action: {
      type: "postback",
      label: zone.name, // ชื่อโซน
      data: `action=selectZone&zoneId=${zone.id}&zoneName=${zone.name}`, // ระบุ zoneId สำหรับดึงข้อมูล
      displayText: `ต้องการตรวจสอบ ${zone.name}` // แสดงข้อความนี้ในแชท
    },
    style: "primary"
  }));

  return {
    type: 'flex',
    altText: 'เลือกโซน',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'โซน',
            weight: 'bold',
            size: 'xl'
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
            spacing: 'sm',
            contents: zoneContents
          }
        ]
      }
    }
  };
}

// ฟังก์ชันสร้าง Flex Message : examine
export function createExamineFlexMessage(examineData) {
  if (!examineData || examineData.length === 0) {
    return {
      type: "text",
      text: "ไม่พบข้อมูลการตรวจสอบ"
    };
  }

  const examineContents = examineData.map((examine) => ({
    type: "button",
    action: {
      type: "postback",
      label: examine.name,
      data: `action=selectExamine&examineId=${examine.id}&examineName=${examine.name}`,
      displayText: `เลือกตรวจสอบ ${examine.name}`
    },
    style: "primary"
  }));

  return {
    type: 'flex',
    altText: 'รายการตรวจสอบ',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'ตรวจสอบ',
            weight: 'bold',
            size: 'xl'
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
            spacing: 'sm',
            contents: examineContents
          }
        ]
      }
    }
  };
}
// ฟังก์ชันสร้าง Flex Message : examinename ไม่ใช้พนักงาน
export function createExamineNameFlexMessage(examineNameData, zoneId, examineId) {
  if (!examineNameData || examineNameData.length === 0) {
    return {
      type: "text",
      text: "ไม่พบข้อมูลพื้นที่ตรวจสอบ"
    };
  }

  const examineNameContents = examineNameData.map((item, index) => ({
    type: "box",
    backgroundColor: '#f5f5f5',
    cornerRadius: "15px",
    paddingStart: "2%",
    paddingEnd: "2%",
    layout: "vertical",
    margin: "md",
    spacing: "sm",
    contents: [
      {
        type: "text",
        text: `${index + 1}. ${item.name}`,
        size: "md",
        weight: "bold",
        align: "start",
        margin: "lg"
      },
      {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: "button",
            action: {
              type: "postback",
              label: "ผ่าน",
              data: `action=pass&zoneId=${zoneId}&examineId=${examineId}&examinenameId=${item.id}&name=${item.name}&status=pass`,
              displayText: `${item.name} 'ผ่าน'`
            },
            style: "primary",
            color: "#1DB954"
          },
          {
            type: 'separator',
            margin: 'md',
            color: '#f5f5f5'
          },
          {
            type: "button",
            action: {
              type: "postback",
              label: "ไม่ผ่าน",
              data: `action=fail&zoneId=${zoneId}&examineId=${examineId}&examinenameId=${item.id}&name=${item.name}&status=fail`,
              displayText: `${item.name} 'ไม่ผ่าน'`
            },
            style: "primary",
            color: "#808080"
          }
        ]
      },
      {
        type: 'separator',
        margin: 'lg',
        color: '#f5f5f5'
      }
    ]
  }));

  return {
    type: 'flex',
    altText: 'รายละเอียดการตรวจสอบ',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: "text",
            text: "ตรวจสอบ",
            weight: "bold",
            size: "xl",
            align: "start",
            margin: "md"
          },
          {
            type: 'separator',
            margin: 'md',
            color: '#D3D3D3'
          },
          ...examineNameContents
        ]
      }
    }
  };
}

// ฟังก์ชันสร้าง Flex Message : examinename ใช้พนักงาน
export function createExamineUseEmployeeFlexMessage(examineUseEmp) {
  // จัดกลุ่มข้อมูลตาม employeeId
  const groupedExamine = examineUseEmp.reduce((acc, examine) => {
    const key = examine.employeeId;
    if (!acc[key]) {
      acc[key] = {
        employeeId: examine.employeeId,
        employee: examine.employee,
        employeeName: examine.employeeName,
        employeeLastname: examine.employeeLastname,
        exams: [],
      };
    }
    acc[key].exams.push({
      examinenameName: examine.examinenameName,
      examinenameId: examine.examinenameId,
    });
    return acc;
  }, {});

  // แปลงข้อมูลที่จัดกลุ่มเป็น Bubble
  const bubbles = Object.values(groupedExamine).map((employee) => ({
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: 'ตรวจสอบ (พนักงาน)',
          weight: 'bold',
          size: 'lg',
          wrap: true,
          color: '#111111',
        },
        {
          type: 'separator',
          margin: 'md',
        },
        {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'text',
              text: employee.employee, // รหัสพนักงาน
              weight: 'bold',
              size: 'md',
              color: '#5A975E',
              flex: 2,
              align: 'start',
            },
            {
              type: 'text',
              text: `${employee.employeeName} ${employee.employeeLastname}`, // ชื่อ-นามสกุล
              size: 'sm',
              color: '#111111',
              flex: 2,
              align: 'end',
            },
          ],
          margin: 'md',
        },
        {
          type: 'separator',
          margin: 'lg',
        },
        ...employee.exams.map((exam) => ({
          type: 'box',
          backgroundColor: '#f5f5f5',
          cornerRadius: "15px",
          paddingStart: "2%",
          paddingEnd: "2%",
          paddingBottom: "4%",
          margin: "md",
          spacing: "sm",
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: exam.examinenameName, // ข้อมูลการตรวจสอบ เช่น "safety hat"
              align: 'center',
              size: 'md',
              color: '#111111',
              wrap: true,
              margin: 'lg',
            },
            {
              type: 'box',
              
              layout: 'horizontal',
              contents: [
                {
                  type: 'button',
                  action: {
                    type: 'postback',
                    label: 'ผ่าน',
                    data: `action=pass&id=${employee.employeeId}&examinenameId=${exam.examinenameId}&name=${exam.examinenameName}&nameEmp=${employee.employeeName}&lastnameEmp=${employee.employeeLastname}`,
                    displayText: `${exam.examinenameName} "ผ่าน" สำหรับ ${employee.employeeName} ${employee.employeeLastname}`,
                  },
                  style: 'primary',
                  color: '#00c300',
                  flex: 1,
                },
                {
                  type: 'button',
                  action: {
                    type: 'postback',
                    label: 'ไม่ผ่าน',
                    data: `action=fail&id=${employee.employeeId}&examinenameId=${exam.examinenameId}&name=${exam.examinenameName}&nameEmp=${employee.employeeName}&lastnameEmp=${employee.employeeLastname}`,
                    displayText: `${exam.examinenameName} "ไม่ผ่าน" สำหรับ ${employee.employeeName} ${employee.employeeLastname}`,
                  },
                  style: 'primary',
                  color: '#808080',
                  flex: 1,
                },
              ],
              margin: 'lg',
              spacing: 'sm',
            },
          ],
          margin: 'lg',
        })),
      ],
    },
    styles: {
      body: {
        backgroundColor: '#ffffff',
      },
      footer: {
        separator: true,
      },
    },
  }));

  // สร้าง Carousel Message
  return {
    type: 'flex',
    altText: 'ข้อมูลการตรวจสอบพนักงาน',
    contents: {
      type: 'carousel',
      contents: bubbles,
    },
  };
}
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.SECRETCODE
};
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
