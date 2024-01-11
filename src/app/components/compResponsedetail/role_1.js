'use client'
import React, { useState ,useEffect } from 'react';
import Link from 'next/link'
import '../../globals.css'
// import '@fontsource/ntr'
import '@fontsource/mitr';
import axios from 'axios';
import CompNavbar from '../compNavbar/role_1';
import { CompLanguageProvider, useLanguage } from '../compLanguageProvider_role_1';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n'; 
import { initReactI18next } from 'react-i18next';
import Image from 'next/image';
import { BsCheckCircle } from "react-icons/bs";
import { format } from 'date-fns';


function CompResponsedetail() {
  return (
    <CompLanguageProvider>
      <App />
    </CompLanguageProvider>
  );
}

function App() {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  
    
  const [notifyMessage, setnotifyMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [docx, setdocx] = useState(false);
  const [jpg, setjpg] = useState(false);
  const [pdf, setpdf] = useState(false);
  const [xlsx, setxlsx] = useState(false);
  const [fileelse, setelse] = useState(false);
  const [openpopup, setopenpopup] = useState(false);
  const [message, setMessage] = useState('');
  const [addmessage, setAddMessage] = useState('');
  const [reloadData, setReloadData] = useState(false); // เพิ่ม state นี้
  const [todoList, setTodoList] = useState([]);
  const [fileData, setFileData] = useState();


  // useEffect(() => {
  //   // ใน useEffect นี้คุณสามารถใช้ Axios เพื่อดึงข้อมูลจากฐานข้อมูล
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get('/api/response'); // แทน '/api/examine' ด้วยเส้นทางที่ถูกต้องไปยัง API ของคุณ
  //       const data = response.data;
        
  //       console.log("response: ",response.status)

  //       if (response.status === 200) {
  //         if (data.success === true) {
  //           console.log("DATA: ",data)
  //           // const url = window.URL.createObjectURL(new Blob([data]));
  //           // const a = document.createElement('a');
  //           // a.href = url;
  //           // a.download = 'your_pdf_file.pdf'; // ชื่อไฟล์ที่ผู้ใช้จะดาวน์โหลด
  //           // a.click();
  //           // window.URL.revokeObjectURL(url);
          
  //           // setFileData(data);
  //         } else {
  //           setMessage(data.error);
  //         }
  //       } else {
  //         setMessage(data.error);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       setMessage('');
  //     }
  //   };

  //   fetchData();
  // }, []); // โหลดข้อมูลเมื่อค่า state reloadData เปลี่ยนแปลง


  // const handleDownload = () => {
  //   if (fileData) {
  //     const url = window.URL.createObjectURL(new Blob([fileData]));
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = 'file-name.ext'; // Specify the desired file name
  //     document.body.appendChild(a);
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //   }
  // };

  useEffect(() => {

    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const responseValue = searchParams.get('response') ; // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า
      const idValue = searchParams.get('id') ; // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า

     

      console.log("queryData: ",{responseValue})
      
    // ใน useEffect นี้คุณสามารถใช้ Axios เพื่อดึงข้อมูลจากฐานข้อมูล
    const fetchData = async () => {
      try {

        const AddData = { responseValue ,idValue , responseDetail : true};
        const dataDetail = JSON.stringify(AddData);
        console.log("send: ",dataDetail)

        const response = await axios.post('/api/response', dataDetail, {
          headers: { 'Content-Type': 'application/json' },
        });



        const data = response.data;

        if (response.status === 200) {
          if (data.success === true) {
            console.log("DATA: ",data)
            const notifyData = data.responseResult.map(item => ({
              title: item.title,
              employee: item.employee,
              location: item.location,
              work_owner: item.work_owner,
              position: item.status,
              date: item.date,
              file: item.file,
              detail: item.detail,
              Verification_status: item.Verification_status
            }));

            console.log("fileData: ", data.responseResult[0].file.data);
            
            // const buffer = data.responseResult[0].file.data; // ข้อมูล Buffer
            // const fileType = 'image/jpeg'; // ประเภทของไฟล์ข้อมูล สามารถเปลี่ยนเป็นประเภทที่ถูกต้อง
            // const blob = new Blob([buffer], { type: fileType });
            // console.log("blob: ",blob)

            // const url = URL.createObjectURL(blob);
            // const image = new Image();
            // image.src = url;
            // document.body.appendChild(image);
            // console.log(buffer)

            const byteArray = data.responseResult[0].file.data; // Replace ... with the full array

            // Create a Uint8Array from the byte array
            const uint8Array = new Uint8Array(byteArray);

            // Convert the Uint8Array to a Blob
            const blob = new Blob([uint8Array], { type: 'image/jpeg' }); // Change 'image/jpeg' to the appropriate image type

            // Create a data URL from the Blob
            const url = URL.createObjectURL(blob);

            // Create an image element and set its source to the data URL
            // const image = new Image();
            // image.src = url;

            // Append the image element to the document body or any other HTML element
            // document.body.appendChild(image);


            setFileData(url);


            console.log("notify: ",notifyData)
            setTodoList(notifyData);
            // console.log("Test: ",notifyData[indexValue])
          } else {
            setMessage(data.error);
          }
        } else {
          setMessage(data.error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('');
      }
    };
  

    fetchData();
  }
  }, [reloadData]); // โหลดข้อมูลเมื่อค่า state reloadData เปลี่ยนแปลง


  // const fileName = data.file.name; // ชื่อไฟล์ที่อัปโหลด
  // const fileExtension = fileName.split('.').pop(); // ดึงนามสกุลไฟล์

  // const detectAndDisplayFileType = (todo) => {
  //   const buffer = todo.file;
  //   const fileType = detectFileType(buffer);
  //   const blob = new Blob([buffer], { type: fileType });
  
  //   if (fileType === 'text/plain') {
  //     const text = new TextDecoder().decode(buffer);
  //     console.log('ไฟล์ข้อความ:', text);
  //   } else if (fileType.startsWith('image/')) {
  //     const img = document.createElement('img');
  //     img.src = URL.createObjectURL(blob);
  //     document.body.appendChild(img);
  //   } else if (fileType.startsWith('application/')) {
  //     window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(URL.createObjectURL(blob))}&embedded=true`);
  //   } else {
  //     console.log('ไม่รู้ประเภทของไฟล์:', fileType);
  //   }
  // }
  
  // const detectFileType = (buffer) => {
  //   // ตรวจสอบประเภทของไฟล์จากเฮ็ดเดอร์ (หากเป็นไฟล์ข้อความ) หรือช่วยจากลายเซอร์
  //   if (isTextFile(buffer)) {
  //     return 'text/plain';
  //   } else if (isImageFile(buffer)) {
  //     return 'image/jpeg'; // หรือประเภทอื่น ๆ ของรูปภาพ
  //   } else if (isDocumentFile(buffer)) {
  //     return 'application/msword'; // หรือประเภทอื่น ๆ ของเอกสาร
  //   } else {
  //     return 'application/octet-stream'; // ถ้าไม่รู้จริง ๆ ในที่นี้ให้ใช้ตามประเภททั่วไปของไฟล์
  //   }
  // }

  // const isTextFile = (buffer,todo) => {
  //   // ทำการตรวจสอบประเภทของไฟล์ข้อความ โดยตรวจสอบนามสกุลไฟล์หรือเนื้อหาของไฟล์
  //   // อย่างไรก็ตาม นี่เป็นตัวอย่างง่าย โปรดปรับปรุงตามความต้องการ
  //   const textFileExtensions = ['txt', 'csv', 'log', 'md']; // รายการนามสกุลไฟล์ข้อความที่คุณต้องการตรวจสอบ
  
  //   // ดึงนามสกุลไฟล์จากชื่อไฟล์ (สมมุติว่าชื่อไฟล์มีนามสกุลแนบอยู่)
  //   const fileExtension = todo.file.name.split('.').pop().toLowerCase();
  
  //   // ตรวจสอบว่านามสกุลไฟล์อยู่ในรายการของไฟล์ข้อความหรือไม่
  //   return textFileExtensions.includes(fileExtension);
  // };
  
  
  // const openFileInNewTab = () => {
  //   if (todo.file) {
  //     const blobURL = URL.createObjectURL(todo.file);
  //     window.open(blobURL, '_blank');
  //   }
  // };


  const formatDateTime = (isoDateTime) => {

    const inputDate = new Date(isoDateTime);
    const formattedDatenew = format(inputDate, 'dd/MM/yyyy HH:mm');
    console.log("yyyy-MM-dd HH:mm",formattedDatenew);

   
  
    return formattedDatenew;
  };
  
  
  
  return (
    <div>
      
      <CompNavbar/>
        
      <div className=' bg-[url("/bg1.png")]  overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
        <div className='md:w-[1000px] mx-auto '>
          <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
             <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
          </div>
          {todoList.map((todo, index) => (

          <div  key={index} className='mx-auto w-[300px] md:w-[800px]  mb-[50px]  py-[30px] text-black flex flex-col  bg-[#FFF] text-center md:rounded-[50px] rounded-[30px] mt-[106px]  '>
          {console.log("TODOOO: ",todoList)}
            
                <div className='md:mt-[30px]'>
              
                <div className=' md:text-[20px] ml-[32px] text-[15px] md:w-[500px] md:ml-[45px] text-left '>
                    <p>{todo.title}</p>
                </div>
                 

                <div className="mt-[10px] border-t border-gray-300"></div> 
              </div>

              <div className='px-2 flex items-center mx-auto w-[250px]  md:ml-[40px] md:w-[720px]  py-[20px] text-black bg-[#F5F5F5] text-center mt-[15px] rounded-[20px]'>
                <div className=' text-[12px] md:text-[18px]  rounded-[10px] w-[235px] md:w-[600px] py-2 md:py-4 bg-[#F5F5F5] ml-[5px] md:ml-[40px]'>
                
                    <div className='flex px-3 '>
                        <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[130px] md:ml-[-11px]'>Employee</p>
                        <p>:</p>
                        <p className='md:ml-[15px] ml-[10px] whitespace-nowrap overflow-ellipsis overflow-hidden md:w-[200px] text-left w-[110px]'>{todo.employee}</p>
                    </div>
                   
                      
                    <div className='flex px-3  mt-[5px]'>
                      <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[130px] md:ml-[-11px]'>Location</p>
                      <p>:</p>    
                      <p className='md:ml-[15px] ml-[10px] whitespace-nowrap overflow-ellipsis overflow-hidden md:w-[200px] text-left w-[110px]'>{todo.location}</p>
                    </div>
                 
                      <div className='flex px-3  mt-[5px]'>
                        <p className='text-[#000] text-left  w-[75px]  ml-[-1px] md:w-[130px] md:ml-[-11px]'>Work Owner </p>
                        <p>:</p>
                        <p className='md:ml-[15px] ml-[10px] w-[120px] whitespace-nowrap overflow-ellipsis overflow-hidden md:w-[200px] text-left'>{todo.work_owner}</p>
                    </div>
                 
                      
                      <div className='flex px-3 mt-[5px]'>
                        <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[130px] md:ml-[-11px]'>Position</p>
                        <p>:</p>
                        <p className='md:ml-[15px] text-left  w-[120px] ml-[10px] whitespace-nowrap overflow-ellipsis overflow-hidden md:w-[200px] '>{todo.position}</p>
                    </div>
                 
                     
                      <div className='flex px-3  mt-[5px]'>
                        <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[130px] md:ml-[-11px]'>Date</p>
                        <p>:</p>
                        <p className='md:ml-[15px] ml-[10px] whitespace-nowrap overflow-ellipsis overflow-hidden md:w-[200px] text-left w-[120px]'>{formatDateTime(todo.date)} น.</p>
                    </div>
                      
                    </div>
                </div>

                <div className='mx-auto'>
                <p className="text-[#808080] text-[13px] md:text-[16px] md:mt-[20px] md:ml-[-600px] ml-[-150px] mt-[10px]">รูปภาพที่อัพโหลด</p>

                {/* <h1 className=" whitespace-nowrap overflow-hidden overflow-ellipsis ml-[25px] text-left w-[245px] md:w-[705px] py-1 px-2 border mt-[5px] md:mt-[10px] md:ml-[35px] border-gray-300 p-4 rounded-lg cursor-pointer "
                  onClick={() => openFileInNewTab()}>{detectAndDisplayFileType(todo.file)}</h1> */}
             {/* ตัวอย่าง: แสดงรูปภาพ */}
             {fileData && (
                <div className="border mt-[20px] border-grey-800 p-2 w-[235px] ">
                  <Image width={150} height={150} src={fileData} alt="รูปภาพ" className="w-full h-full" />
                </div>
              )}
              </div>

              {/* {fileData && (
                  <button onClick={handleDownload}>
                    Download File
                  </button>
                )}

                {jpg && (
                  <div className="bg-white border border-gray-300 rounded-[10px] w-[300px] text-[#5A985E] p-8 shadow-lg md:w-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <h1>รูปภาพที่อัพโหลด</h1>
                    <img className="mt-[10px] rounded-[10px]" src={URL.createObjectURL(data.file)} alt="รูปภาพที่อัพโหลด" />
                    <button className="mt-[20px] justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={() => setjpg(false)}>
                      OK
                    </button>
                  </div>
                )}

                {docx && (
                  <div className="bg-white border border-gray-300 rounded-[10px] w-[400px] text-[#5A985E] p-8 shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <h1>ไฟล์ที่อัพโหลด</h1>
                    <a href={`https://docs.google.com/viewer?url=${encodeURIComponent(URL.createObjectURL(data.file))}&embedded=true`} target="_blank" rel="noopener noreferrer">เปิดไฟล์ .docx</a>
                    <button className="mt-[20px] justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover-bg-green-600" onClick={() => setdocx(false)}>
                      OK
                    </button>
                  </div>
                )}

                {pdf && (
                  <div className="bg-white border border-gray-300 rounded-[10px] w-[400px] text-[#5A985E] p-8 shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <h1>ไฟล์ที่อัพโหลด</h1>
                    <iframe src={URL.createObjectURL(data.file)} frameBorder="0" width="100%" height="500px"></iframe>
                    <button className="mt-[20px] justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover-bg-green-600" onClick={() => setpdf(false)}>
                      OK
                    </button>
                  </div>
                )}
                {xlsx && (
                  <div className="bg-white border border-gray-300 rounded-[10px] w-[400px] text-[#5A985E] p-8 shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <h1>ไฟล์ที่อัพโหลด</h1>
                    <iframe src={`https://docs.google.com/viewer?url=${encodeURIComponent(URL.createObjectURL(data.file))}&embedded=true`} frameBorder="0" width="100%" height="500px"></iframe>
                    <button className="mt-[20px] justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover-bg-green-600" onClick={() => setxlsx(false)}>
                      OK
                    </button>
                  </div>
                )}

                {fileelse && (
                  <div className="bg-white border border-gray-300 rounded-[10px] w-[400px] text-[#5A985E] p-8 shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <h1>เปิดไฟล์ที่อัพโหลดไม่สำเร็จ</h1>
                    <button className="mt-[20px] justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover-bg-green-600" onClick={() => setelse(false)}>
                      OK
                    </button>
                  </div>
                )} */}

                
                  <div>
                    <p className=' text-[#808080] text-[13px] md:text-[16px] ml-[-170px] md:ml-[-640px] mt-[20px]  md:mt-[16px]'>รายละเอียด</p>
                    <textarea type="text" name="detail" placeholder={todo.detail} className=' rounded-[10px] text-[13px] mt-[5px] pl-[15px] w-[250px] md:ml-[-25px] h-[100px] md:text-[16px] md:w-[705px] md:h-[80px] bg-[#fff] border border-gray-300  p-4 ' readOnly/>
                    {/* <textarea value={formData.detail} onChange={handleInputChange} className='border border-gray-300 rounded-md bg-[#F5F5F5] w-[250px] h-[100px] text-black text-sm pl-2 pt-2' /> */}
                </div>
                

                {message && (
                  <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                    {message}
                  </p>
                )}
                

                <div className='flex items-center md:px-10  md:mt-[20px]' >
                
                    
                </div>

                {showSuccessPopup && (
                  <div className="bg-white text-[#5A985E] p-8  rounded-lg border-black shadow-lg md:w-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <BsCheckCircle className=' text-[50px] mx-auto mb-[10px]'/>
                  {addmessage}
                </div>
              )}
              {notifyMessage && (
                  <p className=' mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                    {notifyMessage}
                  </p>
                )}
          
          </div> 
          ))}
          </div>
        </div>
        </div>
    ) 
 }
 export default CompResponsedetail;

  