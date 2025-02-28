//ฟอร์ม จป.ท
"use client";

import React, { useState, useEffect } from 'react';
import '../../globals.css';
import '@fontsource/mitr';
import axios from 'axios';
import { IoMdDownload } from "react-icons/io";
import { Document, Packer, Header, Paragraph, Table, TableRow, TableCell, AlignmentType, TextRun, BorderStyle, WidthType } from "docx";
import Select from 'react-select';import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { th } from "date-fns/locale"; // นำเข้าภาษาไทย

registerLocale("th", th);


const SafetyReportForm = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [analysis, setAnalysis] = useState("");
  const [id, setId] = useState('');
  const [data, setData] = useState(null);
  const [prefix, setPrefix] = useState("นาย");
  const [provinces, setProvinces] = useState([]);
  const [amphoes, setAmphoes] = useState([]);
  const [tambons, setTambons] = useState([]);
  const [zipcode, setZipcode] = useState("");
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedAmphoe, setSelectedAmphoe] = useState(null);
  const [selectedTambon, setSelectedTambon] = useState(null);
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [villageNumber, setVillageNumber] = useState("");
  const [street, setStreet] = useState("");
  const [safetyOfficerCount, setSafetyOfficerCount] = useState("");
  const [writeNumber, setWriteNumber] = useState("");
  const [nearBy, setNearBy] = useState("");
  const [phone, setPhone] = useState("");
  const [nameEmployer, setNameEmployer] = useState("");
  const [startDate, setStartDate] = useState(null); // เก็บวันที่เริ่มต้น
  const [endDate, setEndDate] = useState(null); // เก็บวันที่สิ้นสุด
  

  //ฟังก์ชันดึงข้อมูลการวิเคราะห์จาก API
  /*const fetchAnalysis = async (startMonth, endMonth) => {
    try {
      const response = await fetch("/api/safetyform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: 'analyzeData' ,
          startMonth: startMonth,
          endMonth: endMonth,
          year: year
        }),
      });

      const data = await response.json();
      console.log("Response from API:", data);

      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        console.error("Error analyzing data:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };*/
  const fetchAnalysis = async () => {
    const startMonth = startDate ? startDate.getMonth() + 1 : null;
    const startYear = startDate ? startDate.getFullYear() : null;
    const endMonth = endDate ? endDate.getMonth() + 1 : null;
    const endYear = endDate ? endDate.getFullYear() : null;
  
    try {
      const response = await fetch("/api/safetyform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyzeData",
          startMonth,
          startYear,
          endMonth,
          endYear,
        }),
      });
  
      const data = await response.json();
      console.log("Response from API:", data);
  
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        console.error("Error analyzing data:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  
  const fetchLocations = async (type, code) => {
    try {
      const response = await axios.post("/api/safetyform", {
        action: "fetchLocations",
        type,
        code,
      });
      if (response.data.success) {
        if (type === "province") setProvinces(response.data.data);
        if (type === "amphoe") setAmphoes(response.data.data);
        if (type === "tambon") setTambons(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };
  // ดึงข้อมูลวันที่และวิเคราะห์ข้อมูลเมื่อโหลดคอมโพเนนต์
  useEffect(() => {
    
    //fetchAnalysis();
    fetchLocations('province');
    
    const fetchData = async () => {
      try {
        const storedId = localStorage.getItem("id");
        if (!storedId) {
          setAnalysis("ไม่พบ ID ผู้ใช้ในระบบ กรุณาเข้าสู่ระบบใหม่");
          return;
        }
  
        setId(storedId);
  
        const response = await axios.post("/api/safetyform", {
          id: storedId,
          action: "fetchEmployeeData",
        });
  
        console.log("Response from API:", response.data);
  
        // ดึงข้อมูล employeeData และ analysis
        const { data: employeeData, analysis } = response.data || {};
  
        // ตรวจสอบข้อมูล employeeData
        if (employeeData) {
          setData(employeeData); // เก็บข้อมูลตรง ๆ
          console.log("Employee Data Updated:", employeeData); // ดูข้อมูลที่ได้
        } else {
          console.error("No data field in API response.");
        }
  
        // ตั้งค่าข้อมูล analysis
        if (analysis) {
          setAnalysis(analysis);
          console.log("Analysis Data:", analysis);
        }
  
        // ตั้งค่าวันที่ปัจจุบัน
        const today = new Date();
        const formattedDate = today.toLocaleDateString("th-TH", {
          day: "2-digit",
          month: "long", // ใช้ "long" เพื่อแสดงชื่อเดือนเต็ม
          year: "numeric",
        });
        setCurrentDate(formattedDate);
      } catch (error) {
        console.error("Error fetching analysis:", error);
        setAnalysis("เกิดข้อผิดพลาดในการดึงผลการวิเคราะห์");
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchAnalysis();
    }
  }, [startDate, endDate]);


  const handleProvinceChange = (selectedOption) => {
    setSelectedProvince(selectedOption);
    setSelectedAmphoe(null);
    setSelectedTambon(null);
    fetchLocations("amphoe", selectedOption.value);
  };

  const handleAmphoeChange = (selectedOption) => {
    setSelectedAmphoe(selectedOption);
    setSelectedTambon(null);
    fetchLocations("tambon", selectedOption.value);
  };

  // ฟังก์ชันจัดการการเปลี่ยนตำบล
const handleTambonChange = (selectedOption) => {
  setSelectedTambon(selectedOption);

  // หารหัสไปรษณีย์จากตำบลที่เลือก
  const tambon = tambons.find(
    (tambon) => tambon.tambon_code === selectedOption.value
  );
  if (tambon) {
    setZipcode(tambon.zipcode); // ตั้งค่า Zipcode
  }
};
  
const generateDOCX = async () => {
    try {

      const startMonth = startDate ? startDate.toLocaleString("th-TH", { month: "long" }) : null;
      const startYear = startDate ? startDate.getFullYear() + 543 : null;
      const endMonth = endDate ? endDate.toLocaleString("th-TH", { month: "long" }) : null;
      const endYear = endDate ? endDate.getFullYear() + 543 : null;


      const doc = new Document({
        sections: [],
      });  
      // Array เพื่อเก็บเนื้อหาเอกสาร
      const content = [];
  
      // หัวข้อเอกสาร
      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "แบบรายงานผลการดำเนินงานของเจ้าหน้าที่ความปลอดภัยในการทำงานระดับเทคนิคขั้นสูง",
              bold: true,
              font: "TH SarabunPSK",
              size: 32,
            }),
          ],
          alignment: "center",
          spacing: { after: 0, line: 240 },  // Set line spacing to 1.0 (240 TWIP)
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `เขียนที่  ${writeNumber}`,
              font: "TH SarabunPSK",
              size: 32,
            }),
          ],
          alignment: "left", // Align text to the left
          spacing: { after: 0, line: 240 }, // Set line spacing to 1.0 (240 TWIP)
          indent: { left: 6020 }, 
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `วันที่    ${currentDate}`,
              font: "TH SarabunPSK",
              size: 32,
            }),
          ],
          alignment: "left", // Align text to the right
          spacing: { after: 0, line: 240 }, // Set line spacing to 1.0 (240 TWIP)
          indent: { left: 6020 }, 
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `๑. ข้าพเจ้า    ${prefix} ${data?.[0]?.name} ${data?.[0]?.lastname}`,
              font: "TH SarabunPSK",
              size: 32,
            }),
            
          ],
          spacing: { after: 0, },  // Set line spacing to 1.0 (240 TWIP)
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `    ตำแหน่ง    ${data?.[0]?.position}`, font: "TH SarabunPSK", size: 32, }),
          ],
          spacing: { after: 0, },  // Set line spacing to 1.0 (240 TWIP)
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "๒. สถานประกอบกิจการชื่อ  ", font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: businessName || "....................................................................................................................................................." , font: "TH SarabunPSK", size: 32, }),
          ],
          spacing: { after: 0, }, 
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "    ประเภทกิจการ  ", font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: businessType || "...................................................................................................................................................................." , font: "TH SarabunPSK", size: 32, }),
          ],
          spacing: { after: 0, },  
        }), 
        new Paragraph({
          children: [
            new TextRun({ text: "    ตั้งอยู่เลขที่   ", font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: addressNumber || "..................", font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: "\t  หมู่ที่   ", font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: villageNumber || ".............", font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: "\t  ถนน   ", font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: street || "..................", font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: "\t\t  ตำบล/แขวง   ", font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: `  ${selectedTambon?.label }`, font: "TH SarabunPSK", size: 32, }),
          ],
          tabStops: [
            {
              type: "left", 
              position: 940, 
            },
          ],
          spacing: { after: 0, },  // Set line spacing to 1.0 (240 TWIP)
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "    อำเภอ/เขต  ", font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: `${selectedAmphoe?.label }`, font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: "\t\t       จังหวัด  ", font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: `${selectedProvince?.label}`, font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: "\t\t     รหัสไปรษณีย์  ", font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: `${zipcode} `, font: "TH SarabunPSK", size: 32, }),
          ],
          tabStops: [
            {
              type: "left", 
              position: 940, 
            },
          ],
          spacing: { after: 0,},  // Set line spacing to 1.0 (240 TWIP)
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "    ใกล้เคียงกับ   ", font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text:                                          nearBy || "                           -                            "  , font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: "\t        โทรศัพท์   ", font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: phone ||"............................................" , font: "TH SarabunPSK", size: 32, }),
          ],
          tabStops: [
            {
              type: "left", 
              position: 6540, 
            },
          ],
          spacing: { after: 0, },  
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "๓. มีเจ้าหน้าที่ความปลอดภัยในการทำงานระดับเทคนิคขั้นสูง จำนวน                          ", font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: safetyOfficerCount || "   -   " ,font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: "                            คน", font: "TH SarabunPSK", size: 32, }),
          ],
          spacing: { after: 0 },  
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "๔. ขอรายงานผลการดำเนินงานของเจ้าหน้าที่ความปลอดภัยในการทำงานระดับเทคนิคขั้นสูงในรอบ       ๓       เดือน", font: "TH SarabunPSK", size: 32, }),
          ],
          spacing: { after: 0,},
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "    ในช่วงตั้งแต่เดือน       " ,font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: startMonth || "..................", font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: "      พ.ศ.      ", font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: `${startYear || ".........."}`, font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: "      ถึงเดือน      " ,font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: endMonth || "..................", font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: "      พ.ศ.      ", font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: `${endYear || ".........."}`, font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: "         ดังต่อไปนี้", font: "TH SarabunPSK", size: 32, }),
          ],
          spacing: { after: 0, },  
        }), 
        new Paragraph({
          children: [
            new TextRun({ text: `       ${analysis}`,font: "TH SarabunPSK", size: 32, }),
            
          ],
          spacing: { after: 0, }, 
        }), 
        new Paragraph({
          children: [
            new TextRun({ text: "ลงชื่อ" ,font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: ".................................................." , font: "TH SarabunPSK", size: 32, }),
          ],
          alignment: "left", // Align text to the right
          spacing: { before: 600,  }, 
          indent: { left: 4320 },  
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `( ${prefix}${data?.[0]?.name} ${data?.[0]?.lastname} ) ` ,font: "TH SarabunPSK", size: 32, }),
          ],
          alignment: "left", // Align text to the right
          spacing: { after: 400, }, // Set line spacing to 1.0 (240 TWIP)
          indent: { left: 5000 },  
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "ลงชื่อ" ,font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text: ".........................................." ,font: "TH SarabunPSK", size: 32, }),
            new TextRun({ text:  " นายจ้าง" ,font: "TH SarabunPSK", size: 32, }),
          ],
          alignment: "left", // Align text to the right
          spacing: { after: 0,}, // Set line spacing to 1.0 (240 TWIP)
          indent: { left: 4320 }, }), //6
        new Paragraph({
          children: [
            new TextRun({ text: `( ${nameEmployer || "......................................."} )`, font: "TH SarabunPSK", size: 32, }),
          ],
          alignment: "left", // Align text to the right
          spacing: { after: 600, }, // Set line spacing to 1.0 (240 TWIP)
          indent: { left: 5000 }, 
        }),   
      );

      // สร้าง Header พร้อมข้อความด้านขวา
      const header = new Header({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "แบบ จป. (ท)",
                font: "TH SarabunPSK",
                size: 28,
              }),
            ],
            alignment: AlignmentType.RIGHT, // จัดข้อความไปทางขวา
          }),
        ],
      });
  
    
     // เพิ่ม content ทั้งหมดลงใน section พร้อม header
     doc.addSection({
      properties: {
        page: {
          size: {
            width: 11906, // ขนาดหน้ากระดาษ A4
            height: 16838,
          },
          margin: {
            top: 720,
            right: 720,
            bottom: 720,
            left: 720,
          },
        },
      },
      headers: { default: header },
      children: content,
    });
  
      // สร้างและดาวน์โหลดไฟล์ DOCX
      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

      await sendBlobAsBase64ToBackend(blob);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "แบบจป (ท).docx";
      link.click();
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
        const response = await fetch("/api/safetyform", {
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
          height: "360mm", // ความสูงของ A4
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
            <h1 className="text-lg leading-tight text-black">แบบ จป. (ท)</h1>
            <p className="text-lg text-center text-black font-bold">
              แบบรายงานผลการดำเนินงานของเจ้าหน้าที่ความปลอดภัยในการทำงานระดับเทคนิคขั้นสูง
            </p>
          </div>
  
          {/* Form Content */}
          
          <div className="space-y-6 text-black ">
            {/* เขียนที่ / วันที่ */}
            <div className="flex justify-end">
              <div>
                <label className="text-black">เขียนที่</label>   
                <input
                  type="text"
                  className="border-b border-black w-[70%] ml-2 focus:outline-none text-black"
                  value={writeNumber}
                  onChange={(e) => setWriteNumber(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <div>
                <label className="text-black">วันที่</label>
                <input
                  type="text"
                  value={currentDate}
                  readOnly
                  className="border-b border-black w-[70%] ml-2 focus:outline-none text-black"
                />
              </div>
            </div>
  
            {/* ข้าพเจ้า / ตำแหน่ง */}
            <div className="flex items-center justify-start w-full flex-wrap">
            <label className="text-black mr-1">๑. ข้าพเจ้า (นาย/นาง/นางสาว) </label>
              <select value={prefix} onChange={(e) => setPrefix(e.target.value)}>
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
              </select>
              <input
                type="text"
                value={`${data?.[0]?.name || "กำลังโหลด..."} ${data?.[0]?.lastname || ""}`}
                readOnly
                className="border-b border-black ml-2 text-black"
                style={{
                  width: "55%",
                  padding: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "15px",
                }}
              />
            </div>
            <div>
              <label className="text-black">⠀ ตำแหน่ง</label>
              <input
                type="text"
                value={data?.[0]?.position || "ไม่พบตำแหน่ง"} // ใช้ data[0] เพื่อเข้าถึงข้อมูลใน Array
                readOnly
                className="border-b border-black ml-2 text-black"
                style={{
                  width: "85%",
                  padding: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "15px",
                }}
              />
            </div>
  
            {/* สถานประกอบกิจการ */}
            <div>
              <label className="text-black">๒. สถานประกอบกิจการชื่อ</label>
              <input
                type="text"
                className="border-b border-black ml-2 text-black"
                style={{
                  width: "71%",
                  padding: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "15px",
                }}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)} // เก็บข้อมูลชื่อสถานประกอบการ
                
              />
            </div>
            <div>
              <label className="text-black">⠀ ประเภทกิจการ</label>
              <input
                type="text"
                className="border-b border-black text-black ml-2"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)} // เก็บข้อมูลประเภทกิจการ
                style={{
                  width: "80%",
                  padding: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "15px",
                }}
              />
            </div>

{/* ตั้งอยู่เลขที่ ถึง แขวง */}
<div className="flex items-center space-x-1">
  <div className="flex items-center">
  <label className="text-black ml-4">ตั้งอยู่เลขที่</label>
  <input
      type="text"
      className="border-b border-black text-center text-black ml-2 focus:outline-none "
      value={addressNumber}
      onChange={(e) => setAddressNumber(e.target.value)} // เก็บข้อมูลเลขที่
      style={{
        width: "50%",
        padding: "6px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "15px",
      }}
    />
  </div>
  <div className="flex items-center">
  <label className="text-black">หมู่ที่</label>
  <input
      type="text"
      className="border-b border-black text-center text-black ml-2 focus:outline-none  "
      value={villageNumber}
      onChange={(e) => setVillageNumber(e.target.value)} // เก็บข้อมูลหมู่ที่
      style={{
        width: "75%",
        padding: "6px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "15px",
      }}
    />
  </div>
  <div className="flex items-center">
    <label className="text-black">ถนน</label>
    <input
      type="text"
      className="border-b border-black text-center text-black ml-2 focus:outline-none "
      value={street}
      onChange={(e) => setStreet(e.target.value)} // เก็บข้อมูลถนน
      style={{
        width: "71%",
        padding: "6px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "15px",
      }}
    />
  </div>
</div>

{/* จังหวัด -> อำเภอ -> ตำบล -> รหัสไปรษณีย์ */}
<div className="flex flex-wrap items-center space-x-0 mb-4">
  <div className="flex items-center">
    <label className="text-black ml-4">จังหวัด</label>
    <Select
      options={provinces.map((province) => ({
        value: province.province_code,
        label: province.province,
      }))}
      onChange={handleProvinceChange}
      value={selectedProvince}
      placeholder="เลือกจังหวัด"
      className="text-black w-[150px] ml-1 mr-2"
    />
  </div>
  <div className="flex items-center">
    <label className="text-black mr-1">อำเภอ/เขต</label>
    <Select
      options={amphoes.map((amphoe) => ({
        value: amphoe.amphoe_code,
        label: amphoe.amphoe,
      }))}
      onChange={handleAmphoeChange}
      value={selectedAmphoe}
      placeholder="เลือกอำเภอ"
      className="text-black w-[150px] ml-1 mr-2"
    />
  </div>
  <div className="flex items-center">
    <label className="text-black">ตำบล/แขวง</label>
    <Select
      options={tambons.map((tambon) => ({
        value: tambon.tambon_code,
        label: tambon.tambon,
      }))}
      onChange={handleTambonChange}
      value={selectedTambon}
      placeholder="เลือกตำบล"
      className="text-black w-[150px] ml-1"
    />
  </div>
{/* รหัสไปรษณีย์ */}
<div className="flex items-center mt-4">
    <label className="text-black ml-4">รหัสไปรษณีย์</label>
    <input
      type="text"
      value={zipcode}
      readOnly
      className="border-b border-black text-black text-center ml-2 focus:outline-none"
      style={{
        width: "65%",
        padding: "6px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "15px",
      }}
       />
  </div>
 
  <div className="flex items-center mt-3">
  <label className="text-black mr-1 ml-9">โทรศัพท์</label>
              <input
                type="text"
                className="border-b border-black ml-2 text-black text-center"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: "70%",
                  padding: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "15px",
                }}
              />
            </div>  

            <div className="flex items-center mt-4 w-full">
  <label className="text-black mr-1 ml-4">ใกล้เคียงกับ</label>
              <input
                type="text"
                className="border-b border-black text-black"
                value={nearBy}
                onChange={(e) => setNearBy(e.target.value)}
                style={{
                  width: "80%",
                  padding: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "15px",
                }}
              />
            </div>         

</div>
  
            {/* จำนวน จป. */}
            <div>
              <label className="text-black">
              ๓. มีเจ้าหน้าที่ความปลอดภัยในการทำงานระดับเทคนิคขั้นสูง จำนวน 
              </label>
              <input
                type="text"
                className="border-b border-black ml-2 text-black text-center"
                value={safetyOfficerCount}
                onChange={(e) => setSafetyOfficerCount(e.target.value)}
                style={{
                  width: "15%",
                  padding: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "15px",
                }}
              />
              <label className="ml-2 text-black">คน</label>
            </div>
  {/* ขอรายงานผล */}
<div>
  <label className="text-black">
    ๔. ขอรายงานผลการดำเนินงานของเจ้าหน้าที่ความปลอดภัยในการทำงานระดับเทคนิคขั้นสูงในรอบ 3 เดือน
  </label>

  {/* 4 */} 
  <div className="mt-2 flex flex-wrap items-center space-y-2">
  <div className="flex items-center space-x-2">
    <label className="text-black">ในช่วงตั้งแต่เดือน</label>
    <DatePicker
      selected={startDate}
      onChange={(date) => {
        setStartDate(date)
      }}
      dateFormat="MMMM" // แสดงชื่อเดือนแบบเต็ม
      showMonthYearPicker
      locale="th" // ใช้ภาษาไทย
      className="border-b border-black w-[120px] text-black text-center"
      placeholderText="เลือกเดือน"
      
    />
    <label className="text-black ml-2">พ.ศ.</label>
    <input
      type="text"
      className="border-b border-black w-[80px] text-black text-center"
      value={startDate ? startDate.getFullYear() + 543 : ""}
      readOnly
    />
  </div>

  <div className="flex items-center space-x-2 mt-2">
    <label className="text-black mr-2 ml-2">ถึงเดือน</label>
    <DatePicker
      selected={endDate}
      onChange={(date) => {
        setEndDate(date)
      }}
      dateFormat="MMMM" // แสดงชื่อเดือนแบบเต็ม
      showMonthYearPicker
      locale="th" // ใช้ภาษาไทย
      className="border-b border-black w-[120px] text-black text-center"
      placeholderText="เลือกเดือน"
    />
    <label className="text-black ml-2">พ.ศ.</label>
    <input
      type="text"
      className="border-b border-black w-[80px] text-black text-center"
      value={endDate ? endDate.getFullYear() + 543 : ""}
      readOnly
    />
  </div>
</div>

</div>

            {/* ผลการวิเคราะห์ */}
            <div>
              <label className="text-black">ผลการวิเคราะห์โดย AI</label>
              <textarea
                value={analysis || "กำลังโหลดผลการวิเคราะห์..."}
                readOnly
                className="border border-black w-full h-32 p-2 focus:outline-none text-black"
              />
            </div>
  
            {/* ลายเซ็น */}
            <div className="mt-8 text-right mr-12">
            <p>ลงชื่อ 
            <input
              type="text"
              className="border-b border-black flex-1 focus:outline-none text-center text-black"
            />
            </p>
            <p className="mt-2 mr-3">
            <label className="text-black focus:outline-none ">(</label>
            <input
              type="text"
              className="border-b border-black flex-1 w-[30%] text-center focus:outline-none text-black"
              value={`${prefix}${data?.[0]?.name || "กำลังโหลด..."} ${data?.[0]?.lastname || ""}`}
              readOnly

            />    
            <label className="text-black whitespace-nowrap  ">) </label>
            </p>
        </div>
        <div className="mt-10 text-right">
            <p>ลงชื่อ 
            <input
              type="text"
              className="border-b border-black flex-1 focus:outline-none text-center text-black"
            />นายจ้าง
            </p>
            <p className="mt-2 mr-12">
            <label className="text-black whitespace-nowrap ">(</label>
              <input
      type="text"
      className="border-b border-black w-[30%] ml-1 focus:outline-none text-black text-center"
      value={nameEmployer}
      onChange={(e) => setNameEmployer(e.target.value)} // เก็บข้อมูลเดือน
    />   
            <label className="text-black whitespace-nowrap ">) </label>
            </p>
        </div>
  
            {/* ตราประทับ */}
            <div className="text-left ml-24">
  <div 
    className="w-32 h-32 border border-dashed border-black rounded-full flex items-center justify-center" 
    style={{ marginLeft: '2rem', marginTop: '1rem' }}
  >
    <p className="text-sm text-black text-center">ประทับตราสำคัญนิติบุคคล (ถ้ามี)</p>
  </div>
</div>
             
{/* ปุ่มดาวโหลด */}
<div className="flex justify-center item-center absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <button  onClick={generateDOCX} 
        className="bg-[#5A975E] text-white py-3 px-9 rounded-xl hover:bg-green-700 text-center">
          download
        </button>
      </div>

          </div>
        </div>
      </div>     
       </div>
       </div>
  );
  
};

export default SafetyReportForm;