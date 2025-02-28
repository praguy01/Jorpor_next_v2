'use client'; 

import React, { useState, useEffect } from 'react';
import '../globals.css'
import '@fontsource/mitr';
import { useRouter } from 'next/navigation';
import CompNavbar from '../components/compNavbar/role_admin'
import { CompLanguageProvider, useLanguage } from '../components/compLanguageProvider_role_admin';


function FilterForm() {
  return (
    <CompLanguageProvider>
      <FilterForms />
    </CompLanguageProvider>
  );
}
const FilterForms = () => {
    const[tags, setTags] = useState([]);
    const[selectedTag, setSelectedTag] = useState("");//ค่าที่กรอกใน input Tag
    const[startDate, setStartDate] = useState("");
    const[endDate, setEndDate] = useState("");
    const [results, setResults] = useState([]);// เก็บผลลัพธ์การค้นหา
    const [documentType, setDocumentType] = useState("");
    const router = useRouter();
    const [documents, setDocuments] = useState([]); // เก็บข้อมูลเอกสารทั้งหมด
    const [filteredDocuments, setFilteredDocuments] = useState(documents);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; 
    const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage); 


    
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/form'); // ตรวจสอบเส้นทาง API
          const data = await response.json();
          setDocuments(data); // ตั้งค่าข้อมูลเอกสาร
        } catch (error) {
          console.error('Error fetching documents:', error);
        }
      };
    
      fetchData();
    }, []);

    // ฟังก์ชันสำหรับแปลง ISO String เป็นรูปแบบ YYYY-MM-DD HH:MM:SS
const formatDate = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  //const hours = String(date.getHours()).padStart(2, '0');
  //const minutes = String(date.getMinutes()).padStart(2, '0');
  //const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}/${month}/${day} `;
};



    function base64ToBlob(base64, mimeType) {
      const byteCharacters = atob(base64); // แปลง Base64 เป็น binary string
      const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0)); // แปลงเป็น array ของ byte
      const byteArray = new Uint8Array(byteNumbers); // แปลงเป็น Uint8Array
      return new Blob([byteArray], { type: mimeType }); // สร้าง Blob
    }
    
    // ฟังก์ชันดาวน์โหลด Blob
    function downloadBlob(blob, fileName) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // ลบลิงก์หลังจากคลิก
    }
    
    // ฟังก์ชันแปลง Base64 ซ้อนชั้น
    function handleViewFile(nestedBase64, fileName = 'document.docx') {
      try {
        const mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        
        // แปลง Base64 ครั้งแรก
        const firstDecode = atob(nestedBase64); 
        const secondBase64 = firstDecode.trim(); // ลบช่องว่างหรือ newline หากมี
    
        // แปลง Base64 ครั้งที่สอง
        const blob = base64ToBlob(secondBase64, mimeType);
        
        // ดาวน์โหลดไฟล์
        downloadBlob(blob, fileName);
        console.log("ไฟล์ถูกสร้างและดาวน์โหลดสำเร็จ!");
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการแปลง Base64:', error);
      }
    }

 // ฟังก์ชันกรองข้อมูลตามวันที่, Tag, ชื่อเอกสาร และผู้สร้าง
 const handleSearch = () => {
  let filtered = documents;

  // กรองตามช่วงวันที่
  if (startDate && endDate) {
    filtered = filtered.filter((doc) => {
      const docDate = new Date(doc.created_at).toISOString().split('T')[0];
      return docDate >= startDate && docDate <= endDate;
    });
  }

  // กรองตาม Tag (ค้นหาจากชื่อเอกสาร หรือผู้สร้าง)
  if (selectedTag) {
    filtered = filtered.filter((doc) => {
      const lowerCaseTag = selectedTag.toLowerCase(); // แปลงคำค้นหาเป็นตัวพิมพ์เล็ก
      return (
        doc.document_name.toLowerCase().includes(lowerCaseTag) || // เปรียบเทียบคำค้นหากับชื่อเอกสาร
        doc.creator_name.toLowerCase().includes(lowerCaseTag) // เปรียบเทียบคำค้นหากับผู้สร้าง
      );
    });
  }
  // กรองตามประเภทเอกสาร
  if (documentType) {
    filtered = filtered.filter((doc) => doc.document_name === documentType);
  }

  setFilteredDocuments(filtered);
};

useEffect(() => {
  handleSearch();
}, [startDate, endDate, documentType, documents]); // คำนวณใหม่ทุกครั้งที่เลือกวันที่หรือประเภทเอกสารหรือเอกสารมีการเปลี่ยนแปลง




    
     // เพิ่ม Tag เข้าไปในรายการ
  const handleAddTag = () => {
    if (selectedTag && !tags.includes(selectedTag)) {
      setTags([...tags, selectedTag]);
      setSelectedTag("");
    }
  };
  // ลบ Tag ออกจากรายการ
  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

      const handleSelectChange = (e) => {
        const selectedForm = e.target.value; // ค่าที่ผู้ใช้เลือกจาก Dropdown
    
        // ตรวจสอบค่าและเปลี่ยนเส้นทางไปหน้าที่กำหนด
        switch (selectedForm) {
          case "แบบฟอร์มการวิเคราะห์งานเพื่อความปลอดภัย":
            router.push("/form_analysisforsafety");
            break;
          case "แบบการเฝ้าสังเกตุการปฏิบัติงาน":
            router.push("/form_operationwork");
            break;
          case "แบบตรวจความปลอดภัย":
            router.push("/form_seriousaccident");
            break;
          case "แบบบันทึกการสอบสวนอุบัติเหตุ":
            router.push("/form_accident");
            break;
          case "แบบบันทึกการวิเคราะห์อุบัติเหต":
            router.push("/form_analysisaccident");
            break;
          case "แบบ สปร.5":
            router.push("/form_examine");
            break;
          case "แบบ จป.(ท)":
            router.push("/safetyform");
            break;
            case "การแจ้งการประสบภัย":
            router.push("/form_reportdangerandloss");
            break;
          default:
            break;
        }
      };
    
        // ฟังก์ชันสำหรับแสดงผลข้อมูลในแต่ละหน้า
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);
        // ฟังก์ชันเปลี่ยนหน้า
        const paginate = (pageNumber) => {
          if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
          }
        };
        

  // ในกรณีเริ่มต้น แสดงเอกสารทั้งหมดใน `results`
useEffect(() => {
  setResults(documents); // ตั้งค่าเอกสารทั้งหมดในตอนเริ่มต้น
}, [documents]);

  
  return (
    <div>
    <CompNavbar/>
    <div className='bg-[url("/bg1.png")] bg-cover bg-no-repeat absolute inset-0 z-[-1]'>
      <div className='mx-auto relative py-5'>
        <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
          <div className='bg-[#5A985E] w-full max-w-[950px] py-[100px] rounded-[50px]'></div>
        </div>

        <div className='mx-auto w-full max-w-[900px] py-5 text-black flex flex-col rounded-[30px] top-[50px] bg-[#fff] relative z-10 shadow-md'>
          <h1 className='text-[25px] md:text-[30px] mt-1 mb-2 px-5'>{"รายงานเอกสาร"}</h1>
          <div className="border-t border-gray-300"></div>

          <div className="px-5">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center mt-3">
                <label className="mr-2">{"เอกสาร:"}</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="px-3 py-1 border rounded"
                >
                  <option value="">{"ทั้งหมด"}</option>
                  <option value="แบบฟอร์มการวิเคราะห์งานเพื่อความปลอดภัย">{"แบบฟอร์มการวิเคราะห์งานเพื่อความปลอดภัย"}</option>
                  <option value="แบบการเฝ้าสังเกตุการปฏิบัติงาน">{"แบบการเฝ้าสังเกตุการปฏิบัติงาน"}</option>
                  <option value="แบบตรวจความปลอดภัย">{"แบบตรวจความปลอดภัย"}</option>
                  <option value="แบบบันทึกการสอบสวนอุบัติเหตุ">{"แบบบันทึกการสอบสวนอุบัติเหตุ"}</option>
                  <option value="แบบบันทึกการวิเคราะห์อุบัติเหต">{"แบบบันทึกการวิเคราะห์อุบัติเหต"}</option>
                  <option value="แบบ สปร.5">{"แบบ สปร.5"}</option>
                  <option value="แบบ จป.(ท)">{"แบบ จป.(ท)"}</option>
                </select>
              </div>

              <div className="flex items-center mt-3">
                <label className="mr-2">{"ระหว่าง:"}</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mx-2 px-3 py-1 border rounded"
                />
                ~
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mx-2 px-3 py-1 border rounded"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-5">
              <label className="mr-2">{"Tag(s):"}</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                      handleSearch();
                    }
                  }}
                  placeholder={"กรอก Tag"}
                  className="px-3 py-1 border rounded mr-2"
                />
                <button
                  onClick={handleSearch}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm rounded transition"
                >
                  {"ค้นหา"}
                </button>
              </div>
              <div className="flex items-center ml-auto">
                <select
                  onChange={handleSelectChange}
                  className="bg-green-500 hover:bg-white-600 text-white px-4 py-1 rounded transition cursor-pointer"
                >
                  <option value="">{"สร้างเอกสาร"}</option>
                  <option value="แบบฟอร์มการวิเคราะห์งานเพื่อความปลอดภัย">{"แบบฟอร์มการวิเคราะห์งานเพื่อความปลอดภัย"}</option>
                  <option value="แบบการเฝ้าสังเกตุการปฏิบัติงาน">{"แบบการเฝ้าสังเกตุการปฏิบัติงาน"}</option>
                  <option value="แบบตรวจความปลอดภัย">{"แบบตรวจความปลอดภัย"}</option>
                  <option value="แบบบันทึกการสอบสวนอุบัติเหตุ">{"แบบบันทึกการสอบสวนอุบัติเหตุ"}</option>
                  <option value="แบบบันทึกการวิเคราะห์อุบัติเหต">{"แบบบันทึกการวิเคราะห์อุบัติเหต"}</option>
                  <option value="แบบ สปร.5">{"แบบ สปร.5"}</option>
                  <option value="แบบ จป.(ท)">{"แบบ จป.(ท)"}</option>
                  <option value="การแจ้งการประสบภัย">{"การแจ้งการประสบภัย"}</option>
                  
                </select>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap">
              {tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">{"Tags ที่เลือก:"}</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-gray-200 text-sm rounded-full"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-black hover:text-red-600 text-xs font-bold"
                        >
                          x
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5">
              {filteredDocuments.length > 0 ? (
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2">วันที่สร้าง</th>
                      <th className="border p-2">ชื่อเอกสาร</th>
                      <th className="border p-2">ผู้สร้าง</th>
                      <th className="border p-2">ไฟล์</th>
                    </tr>
                  </thead>
                  <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={index}>
                      <td className="border p-2">{formatDate(item.created_at)}</td>
                      <td className="border p-2">{item.document_name}</td>
                      <td className="border p-2">{item.creator_name}</td>
                      <td className="border p-2">
                        <button
                          onClick={() =>
                            handleViewFile(
                              typeof item.file_url !== "string"
                                ? Buffer.from(item.file_url).toString("base64") // กรณีเป็น Buffer
                                : item.file_url, // กรณีเป็น Base64
                              item.document_name
                            )
                          }
                        >
                          ดูเอกสาร
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-3">ไม่พบข้อมูลที่ตรงกับเงื่อนไข</td>
                  </tr>
                )}
              </tbody>
              </table>
            ) : (
              <div>ไม่มีข้อมูล</div>
            )}
            <div className="flex justify-center items-center mt-4">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 mx-2 border rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 text-white'}`}
              >
                Prev
              </button>

              <span className="mx-4">
                หน้า {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 mx-2 border rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 text-white'}`}
              >
                Next
              </button>
            </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default FilterForm;