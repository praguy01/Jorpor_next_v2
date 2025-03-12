
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