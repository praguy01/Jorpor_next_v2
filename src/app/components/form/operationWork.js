//แบบการเฝ้าสังเกตการปฏิบัติงาน

"use client";

import React, { useState, useEffect, useRef } from 'react';
import '../../globals.css';
import '@fontsource/mitr';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, AlignmentType,VerticalAlign,TableLayoutType,ImageRun , TextDirection, TextRun, BorderStyle, WidthType, PageOrientation } from "docx";
import { saveAs } from "file-saver";

const SafetyReportFormOperationWork = () => {
  const textareaRef = useRef(null);
    const [nameWork, setNameWork] = useState("");
    const [department, setDepartment] = useState("");
    const [part, setPart] = useState("");
    const [nameOpration1, setNameOpration1] = useState("");
    const [nameOpration2, setNameOpration2] = useState("");
    const [nameOpration3, setNameOpration3] = useState("");
    const [tableData, setTableData] = useState([
      { step: "", status: "", incorrectDetails: "" },
    ]);
    

  const [currentDate, setCurrentDate] = useState('');
    const [rows, setRows] = useState([
      { step: "", hazard: "", prevention: "" },
    ]);
  
    const handleInputChange = (index, field, value) => {
      const updatedData = [...tableData];
      updatedData[index][field] = value;
      setTableData(updatedData);
    };
    
    const handleKeyDown = (e, index) => {
      if (e.key === "Enter") {
        e.preventDefault(); // ป้องกัน Enter ปกติ
        const newRow = { step: "", status: "", incorrectDetails: "" };
        const updatedData = [
          ...tableData.slice(0, index + 1),
          newRow,
          ...tableData.slice(index + 1),
        ];
    
        // คำนวณจำนวนหน้าใหม่
        const totalPages = Math.ceil(updatedData.length / rowsPerPage);
    
        // ตรวจสอบว่าแถวใหม่อยู่ในหน้าถัดไปหรือไม่
        if (updatedData.length > rowsPerPage * currentPage) {
          setCurrentPage(totalPages); // เปลี่ยนไปยังหน้าสุดท้าย (หน้าใหม่)
        }
    
        setTableData(updatedData); // อัปเดตข้อมูลแถว
      }
    };
    
    
    
      const rowsPerPage = 5; // จำนวนแถวต่อหน้า
      const [currentPage, setCurrentPage] = useState(1); // หน้าแรก
    
      // ฟังก์ชันสำหรับเปลี่ยนหน้า
      const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
      };
    
      // คำนวณตำแหน่งเริ่มต้นและตำแหน่งสุดท้ายของแถวในหน้าปัจจุบัน
      const indexOfFirstRow = (currentPage - 1) * rowsPerPage;
      const indexOfLastRow = currentPage * rowsPerPage;
      const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);
    


      // ฟังก์ชันสำหรับปรับความสูงของ textarea ให้พอดีกับเนื้อหา
      const adjustHeight = (e) => {
        e.target.style.height = 'auto'; // รีเซ็ตความสูง
        e.target.style.height = `${e.target.scrollHeight}px`; // ปรับความสูงตามเนื้อหาที่มี
      };

  // ดึงข้อมูลวันที่และวิเคราะห์ข้อมูลเมื่อโหลดคอมโพเนนต์
  useEffect(() => {

    const today = new Date();
    const formattedDate = today.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  // ฟังก์ชันช่วยในการตัดข้อความสำหรับตาราง
 const wrapText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength
    ? text.match(new RegExp(`.{1,${maxLength}}`, "g")).join("\n")
    : text;
};


  const generateDOCX = async () => {
    try {
      const doc = new Document({
        sections: [],
      });
  
      const content = [];
  
      // หัวข้อเอกสาร
      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "แบบการเฝ้าสังเกตการปฏิบัติงาน",
              font: "TH SarabunPSK",
              bold: true,
              size: 32,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "ชื่องาน ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: `${nameWork || "...................................................................."}`, font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32 }), // เพิ่มแท็บเพื่อเพิ่มระยะห่าง
            new TextRun({ text: "ผู้สังเกตการปฏิบัติงาน ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: `${nameOpration1 || "...................................................."}`, font: "TH SarabunPSK", size: 32 }),
          ],
          tabStops: [
            {
              type: "left", // จัดตำแหน่งแท็บไว้ทางซ้าย
              position: 4400, // ระยะห่างในหน่วย TWIP (1 TWIP = 1/1440 นิ้ว)
            },
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "แผนก  ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: `${department || "...................................................................."}`, font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32 }), // เพิ่มแท็บเพื่อเพิ่มระยะห่าง
            new TextRun({ text: "ผู้สังเกตการปฏิบัติงาน ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: `${nameOpration2 || "...................................................."}`, font: "TH SarabunPSK", size: 32 }),
          ],
          tabStops: [
            {
              type: "left", // จัดตำแหน่งแท็บไว้ทางซ้าย
              position: 4400, // ระยะห่างในหน่วย TWIP (1 TWIP = 1/1440 นิ้ว)
            },
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
            children: [
              new TextRun({ text: "ฝ่าย  ", font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: `${part || "......................................................................."}`, font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32 }), // เพิ่มแท็บเพื่อเพิ่มระยะห่าง
              new TextRun({ text: "ผู้สังเกตการปฏิบัติงาน ", font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: `${nameOpration3 || "...................................................."}`, font: "TH SarabunPSK", size: 32 }),
            ],
            tabStops: [
              {
                type: "left", // จัดตำแหน่งแท็บไว้ทางซ้าย
                position: 4400, // ระยะห่างในหน่วย TWIP (1 TWIP = 1/1440 นิ้ว)
              },
            ],
            spacing: { after: 400 },
          }),
        );


        const table = new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 25, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "ขั้นตอนการปฏิบัติงาน", font: "TH SarabunPSK", size: 32 })],
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                  shading: { fill: "D9D9D9" },
                }),
                new TableCell({
                  width: { size: 12, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "ถูกต้อง", font: "TH SarabunPSK", size: 32 })],
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                  shading: { fill: "D9D9D9" },
                }),
                new TableCell({
                  width: { size: 12, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "ไม่ถูกต้อง", font: "TH SarabunPSK", size: 32 })],
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                  shading: { fill: "D9D9D9" },
                }),
                new TableCell({
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "ไม่ถูกต้องอย่างไร", font: "TH SarabunPSK", size: 32 })],
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                  shading: { fill: "D9D9D9" },
                }),
              ],
            }),
            ...tableData.map((row, index) => {
              return new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: `${index + 1}. ${row.step || ""}`, font: "TH SarabunPSK", size: 32 })],
                        alignment: AlignmentType.LEFT,
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: row.status === "correct" ? "✔" : "", font: "TH SarabunPSK", size: 32 })],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: row.status === "incorrect" ? "✔" : "", font: "TH SarabunPSK", size: 32 })],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: row.status === "correct" ? "-" : row.incorrectDetails || "",
                            font: "TH SarabunPSK",
                            size: 32,
                          }),
                        ],
                        alignment: AlignmentType.CENTER, // จัดตรงกลาง
                      }),
                    ],
                  }),
                ],
              });
            }),
          ],
          layout: TableLayoutType.FIXED, // กำหนดตารางเป็นแบบ FIXED
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 2 },
            bottom: { style: BorderStyle.SINGLE, size: 2 },
            left: { style: BorderStyle.SINGLE, size: 2 },
            right: { style: BorderStyle.SINGLE, size: 2 },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
            insideVertical: { style: BorderStyle.SINGLE, size: 1 },
          },
        });
        
  
  
     // เพิ่มตารางใน content
    content.push(table);

    doc.addSection({
      children: content,
    });
    
  
      // แปลงเอกสารเป็น Blob
      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      await sendBlobAsBase64ToBackend(blob);
  
      // สร้างลิงก์สำหรับดาวน์โหลด
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "แบบการเฝ้าสังเกตการปฏิบัติงาน.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // ลบลิงก์ออกหลังจากคลิก
    } catch (error) {
      console.error("Error during DOCX generation:", error);
    }
  };

  const sendBlobAsBase64ToBackend = async (blob) => {
    try {
      const storedId = localStorage.getItem("id");
      console.log("lllllll",storedId);
  
      // ตรวจสอบว่า blob มีค่า
      if (!blob) {
        console.error("Blob is null or undefined.");
        return;
      }
  
      // แปลง Blob เป็น Base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
  
      // เมื่ออ่านเสร็จแล้ว
      reader.onloadend = async () => {
        if (!reader.result) {
          console.error("Error: No result from FileReader.");
          return;
        }
        
        // แยก Base64 string จาก result
        const base64String = reader.result.split(",")[1];
        console.log("Base64 String: ", base64String);
  
        // สร้าง payload สำหรับการส่งไปยัง backend
        const payloads = {
          action: "aveFileToDatabaseData",
          storedId: storedId,
          file: base64String, // ส่ง Base64 string ไปใน JSON
        };
        //console.log("Payloads to send:", payloads);
  
        // ส่งข้อมูลไปยัง backend
        const response = await fetch("/api/form_operationwork", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // กำหนดเป็น application/json
          },
          body: JSON.stringify(payloads),
        });
  
        const result = await response.json();
  
        if (result.success) {
          console.log("File and data successfully sent to backend.");
        } else {
          console.error("Error from backend:", result.message);
        }
      };
    } catch (error) {
      console.error("Error sending file as Base64 to backend:", error);
    }
  };
  


  return (

    <div className=' bg-[url("/bg1.png")]  overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
  <div className='md:w-[1000px] flex justify-center items-center mx-auto'>
    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0'>
      <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
    </div>
    {/* กระดาษ A4 */}
    <div
        className="relative item-center justify-center bg-white border border-gray-300 shadow-xl rounded-xl"
        style={{
          width: "210mm", // ความกว้างของ A4
          height: "270mm", // ความสูงของ A4
          marginTop: "50px", // ระยะห่างจากขอบบน
          marginBottom: "100px", // ระยะห่างจากขอบล่าง
          backgroundSize: 'contain', // ไม่ให้ขยายภาพพื้นหลังให้เต็มพื้นที่
          backgroundRepeat: 'no-repeat', // ป้องกันไม่ให้ภาพพื้นหลังซ้ำ
        }}
      >
       {/* Form */}
       <div className="p-8">

        {/* Header */}
        <div className="text-end mb-5">
          <h1 className="text-lg text-center text-black font-bold">
          แบบการเฝ้าสังเกตการปฏิบัติงาน
          </h1>
        </div>
      

        {/* Form Content */}
        <div className="space-y-6 text-black">
          {/* ชื่องาน*/}
          <div className="flex items-center justify-start w-full flex-wrap">
              <label className="text-black mr-1 ">ชื่องาน</label>
              <input
            type="text" id="type" name="type" 
            value={nameWork}
            onChange={(e) => setNameWork(e.target.value)}
            style={{
              width: "37%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
              <label className="text-black mr-1 ml-2">ผู้สังเกตการปฏิบัติงาน</label>
              <input
            type="text" id="type" name="type" 
            value={nameOpration1}
            onChange={(e) => setNameOpration1(e.target.value)}
            style={{
              width: "30%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
          </div>
          <div className="flex items-center justify-start w-full flex-wrap">
              <label className="text-black mr-1 ">แผนก</label>
              <input
            type="text" id="type" name="type" 
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            style={{
              width: "38%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
              <label className="text-black mr-1 ml-2">ผู้สังเกตการปฏิบัติงาน</label>
              <input
            type="text" id="type" name="type" 
            value={nameOpration2}
            onChange={(e) => setNameOpration2(e.target.value)}
            style={{
              width: "30%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
          </div>
          <div className="flex items-center justify-start w-full flex-wrap">
              <label className="text-black mr-1 ">ฝ่าย</label>
              <input
            type="text" id="type" name="type" 
            value={part}
            onChange={(e) => setPart(e.target.value)}
            style={{
              width: "40%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
              <label className="text-black mr-1 ml-2">ผู้สังเกตการปฏิบัติงาน</label>
              <input
            type="text" id="type" name="type" 
            value={nameOpration3}
            onChange={(e) => setNameOpration3(e.target.value)}
            style={{
              width: "30%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
          </div>

          {/** ตาราง */}
          <table
  className="w-full border-collapse border border-black mt-15 mr-10"
  style={{ tableLayout: "auto" }} // ปรับขนาดคอลัมน์อัตโนมัติ
>
  <thead>
    <tr>
      <th
        className="border border-black bg-gray-300 p-1"
        style={{ width: "40%" }} 
      >
        ขั้นตอนการปฏิบัติงาน
      </th>
      <th
        className="border border-black bg-gray-300 p-1"
        style={{ width: "12%" }} 
      >
        ถูกต้อง
      </th>
      <th
        className="border border-black bg-gray-300 p-1"
        style={{ width: "12%" }}
      >
        ไม่ถูกต้อง
      </th>
      <th
        className="border border-black bg-gray-300 p-1"
        style={{ width: "40%" }}
      >
        ไม่ถูกต้องอย่างไร
      </th>
    </tr>
  </thead>
  <tbody>
      {currentRows.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {/* คอลัมน์ลำดับ ขั้นตอน*/}
          <td className="border border-black p-1">
            <textarea
              type="text"
              value={wrapText(`${indexOfFirstRow + rowIndex + 1}.${row.step}`)} // แสดงลำดับจริงของแถวในหน้าทั้งหมด
              onChange={(e) => {
                const value = e.target.value.replace(/^\d+\.\s*/, ""); // ลบลำดับออกจากข้อความ
                const updatedData = [...tableData];
                updatedData[indexOfFirstRow + rowIndex].step = value; // อัปเดตข้อมูลแถวที่ตรงกันใน tableData
                setTableData(updatedData);
                adjustHeight(e); // ปรับความสูงให้พอดีกับข้อความที่ป้อน

              }}
              //onKeyDown={(e) => handleKeyDown(e, indexOfFirstRow + rowIndex)} // เพิ่มแถวเมื่อกด Enter
              className="w-full border-none focus:outline-none"
            />
          </td>
          
         {/* คอลัมน์ถูกต้อง */}
         <td className="border border-black p-1 text-center">
        <div
          style={{
           width: "20px",
           height: "20px",
           backgroundColor: row.status === "correct" ? "green" : "white",
      border: "2px solid black",
      borderRadius: "4px",
           position: "relative",
           cursor: "pointer",
           display: "inline-block",
         }}
          onClick={() => {
            const updatedData = [...tableData];
              updatedData[indexOfFirstRow + rowIndex].status = "correct";
              updatedData[indexOfFirstRow + rowIndex].incorrectDetails = ""; // ล้างช่องไม่ถูกต้อง
              setTableData(updatedData);
          }}
        >
        {row.status === "correct" && (
          <span
            style={{
              position: "absolute",
              top: "1px",
              bottom: "2px",
              left: "4px",
              fontSize: "14px",
              color: "white",
              fontWeight: "bold",
            }}
          >✓
          </span>
          )}
        </div>  
      </td>

{/* คอลัมน์ไม่ถูกต้อง */}
<td className="border border-black p-1 text-center">
  <div
    style={{
      width: "20px",
      height: "20px",
      backgroundColor: row.status === "incorrect" ? "gray" : "white",
      border: "2px solid black",
      borderRadius: "4px",
      position: "relative",
      cursor: "pointer",
      display: "inline-block",
    }}
    onClick={() => {
      const updatedData = [...tableData];
      updatedData[indexOfFirstRow + rowIndex].status = "incorrect";

      if (!updatedData[indexOfFirstRow + rowIndex].incorrectDetails) {
        updatedData[indexOfFirstRow + rowIndex].incorrectDetails = "กรุณาระบุรายละเอียด"; // เพิ่มข้อความในช่องไม่ถูกต้องอย่างไร
      }
      setTableData(updatedData);
    }}
  >
    {row.status === "incorrect" && (
      <span
        style={{
          position: "absolute",
          top: "2px",
          left: "4px",
          fontSize: "14px",
          color: "white",
          fontWeight: "bold",
        }}
      >
        ✓
      </span>
    )}
  </div>
</td>
          {/* คอลัมน์ไม่ถูกต้องอย่างไร */}
          <td className="border border-black p-1">
            <textarea
              ref={textareaRef}
              value={wrapText(row.incorrectDetails)}
              onChange={(e) => {
                const updatedData = [...tableData];
                updatedData[indexOfFirstRow + rowIndex].incorrectDetails = e.target.value; // อัปเดตข้อมูลแถวที่ตรงกันใน tableData
                setTableData(updatedData);
                adjustHeight(e); // ปรับความสูงให้พอดีกับข้อความที่ป้อน
              }}
              className="w-full border-none focus:outline-none resize-none"
              rows={1} // กำหนดจำนวนบรรทัดเริ่มต้น
              style={{ overflow: 'hidden' }} // ซ่อน scrollbar
            />
          </td>
        </tr>
      ))}
    </tbody>
</table>

{/* ปุ่มเพิ่มแถว */}
<div className="text-right mt-2">
  <button
    onClick={() => {
      const newRow = {
        step: "",
        status: "",
        incorrectDetails: "",
      };
      setTableData([...tableData, newRow]);
    }}
    className="bg-green-700 text-white px-4 py-2 rounded"
  >
    เพิ่มแถว
  </button>
</div>



 {/* ปุ่มแบ่งหน้าตาราง */}
 <div className="flex justify-center mt-4">
  {Array.from({ length: Math.ceil(tableData.length / rowsPerPage) }, (_, i) => i + 1).map((pageNumber) => (
    <button
      key={pageNumber}
      onClick={() => handlePageChange(pageNumber)}
      className={`px-4 py-2 mx-1 border border-gray-400 text-black rounded ${
        currentPage === pageNumber ? "bg-green-700 text-white" : "bg-green"
      }`}
    >
      {pageNumber}
    </button>
  ))}
</div>
            </div>

           {/* ปุ่มดาวโหลด */}
        <div className="flex justify-center item-center absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <button  onClick={generateDOCX} 
        className="bg-[#5A975E] text-white py-3 px-9 rounded-xl hover:bg-green-700 text-center">
          download
        </button>
      </div>

           
    </div>

    </div>

    </div>

    </div>
);
}


export default SafetyReportFormOperationWork;