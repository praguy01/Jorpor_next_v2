'use client'
import React, { useState ,useEffect } from 'react';
// import '@fontsource/ntr'
import '../globals.css'
// import '@fontsource/mitr';
import CompNavbar from './compNavbar/role_1';
import axios from 'axios';
import {BiSolidDownload} from 'react-icons/bi'
import {BsCheckCircle} from 'react-icons/bs'
import { CompLanguageProvider, useLanguage } from './compLanguageProvider_role_1';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n'; 
import { initReactI18next } from 'react-i18next';






export default function CompNotifyDisplay({ data , onSubmit}) {

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
  const [formattedDate, setFormattedDate] = useState('');

  const [openedFile, setOpenedFile] = useState(null);
  const [id, setId] = useState('');


  const fileName = data.file.name; // ชื่อไฟล์ที่อัปโหลด
  // const fileExtension = fileName.split('.').pop(); // ดึงนามสกุลไฟล์

  // useEffect(() => {
  //   // ใช้ useEffect เพื่อตรวจสอบและอัปเดต state เมื่อ fileExtension เปลี่ยนแปลง
  //   if (fileExtension === 'docx') {
  //     setdocx(true);
  //   } else if (fileExtension === 'jpg') {
  //     setjpg(true);
  //   } else if (fileExtension === 'pdf') {
  //     setpdf(true);
  //   } else if (fileExtension === 'xlsx') {
  //     setxlsx(true);
  //   } else {
  //     setelse(true);
  //   }
  // }, [fileExtension]);

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    setId(storedId)

    console.log('Submitted Data:',data.file);

    const date = new Date(data.dateTime);
    const formattedDate = new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).format(date);

    setFormattedDate(formattedDate);
  }, [data.dateTime ,data.file ]);
  
  const openFileInNewTab = () => {
    window.open(URL.createObjectURL(data.file), '_blank');
  };


  const handleSubmit = async () => {
  
    
    try {
     
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('employee', data.employee);
      formData.append('location', data.location);
      formData.append('work_owner', data.work_owner);
      formData.append('position', data.position);
      formData.append('dateTime', data.dateTime);
      formData.append('detail', data.detail);
      formData.append('file', data.file);
      formData.append('file_name', data.file_name);
      formData.append('id', id);



      
      const response = await axios.post('/api/notify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      
      
      
      const resdata = response.data; 

      if (response.status === 200) {
        const resdata = response.data;
    
        if (resdata.success === true) {
          setShowSuccessPopup(true)
          setAddMessage(resdata.message);
          setnotifyMessage('');

          setTimeout(() => {
            setShowSuccessPopup(false);
            window.location.href = resdata.redirect;
          }, 1000); 
        } else {
          setnotifyMessage(resdata.error);
          setMessage('');

        }
      } else {
        setnotifyMessage(resdata.error);
        setMessage('');

      }
    } catch (error) {
      console.error('Error registering: ', error);
      setnotifyMessage(error);
      setMessage('');

    } 
  
  }

  
  return (
    <div>
      
      <CompNavbar/>
        
      <div className=' bg-[url("/bg1.png")]  overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
        <div className='md:w-[1000px] mx-auto '>
          <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
             <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
          </div>

          <div className='mx-auto w-[300px] md:w-[800px]  mb-[50px]  py-[30px] text-black flex flex-col  bg-[#FFF] text-center md:rounded-[50px] rounded-[30px] mt-[106px]  '>
          
            
          {/* <form onSubmit={!recheck ? handleConfirm : handleSubmit}> */}

                <div className='md:mt-[30px]'>
              
                <div className=' md:text-[20px] ml-[30px] text-[15px] md:w-[500px] md:ml-[40px] text-left '>
                    <p>{data.title}</p>
                </div>
                 

                <div className="mt-[10px] border-t border-gray-300"></div> 
              </div>

              <div className=' px-2 flex items-center mx-auto w-[250px]  md:ml-[40px] md:w-[720px]  py-[20px] text-black bg-[#F5F5F5] text-center mt-[15px] rounded-[20px]'>
                <div className='  text-sm md:text-[14px]  rounded-[10px] w-[235px] md:w-[600px] py-2 md:py-4 bg-[#F5F5F5] ml-[5px] md:ml-[40px]'>
                
                    <div className='flex px-3 '>
                        <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>{t('Employee')}</p>
                        <p>:</p>
                        <p className='md:ml-[15px]  ml-[10px]  overflow-hidden md:w-[200px] w-[120px] whitespace-nowrap overflow-ellipsis text-left'>{data.employee}</p>
                    </div>
                   
                    <div className='flex px-3  mt-[5px]'>
                        <p className='text-[#000] text-left  w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>{t("Work Owner")}</p>
                        <p>:</p>
                        <p className='md:ml-[15px] ml-[10px]  overflow-hidden md:w-[200px] w-[120px] whitespace-nowrap overflow-ellipsis text-left'>{data.work_owner}</p>
                    </div>
                    
                    <div className='flex px-3  mt-[5px]'>
                      <p className='text-[#000] text-left    ml-[-1px]  w-[75px]  md:w-[100px] md:ml-[-11px]  '>{t('Location')}</p>
                      <p>:</p>    
                      <p className='md:ml-[15px] ml-[10px]  overflow-hidden md:w-[200px] w-[120px] whitespace-nowrap overflow-ellipsis text-left'>{data.location}</p>
                    </div>
                 
                      
                 
                      
                      <div className='flex px-3 mt-[5px]'>
                        <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>{t('Position')}</p>
                        <p>:</p>
                        <p className='md:ml-[15px] text-left  ml-[10px]  overflow-hidden md:w-[200px] w-[120px] whitespace-nowrap overflow-ellipsis '>{data.position}</p>
                    </div>
                 
                     
                      <div className='flex px-3  mt-[5px]'>
                        <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>{t('Date')}</p>
                        <p>:</p>
                        <p className='md:ml-[15px] ml-[10px]  overflow-hidden md:w-[200px] w-[120px] text-left whitespace-nowrap overflow-ellipsis '>{formattedDate} น.</p>
                    </div>
                      
                    </div>
                </div>
                
                <div className=' mx-auto w-[250px]  md:w-[705px] justify-center'>
                  <p className="text-[#808080] text-[13px] text-left ml-[5px] md:text-[16px] r md:mt-[20px]  mt-[10px]">{t('attachments')}</p>

                  <h1 className=" whitespace-nowrap overflow-hidden overflow-ellipsis  text-left w-[245px] md:w-[705px] py-1 px-2 border mt-[5px] md:mt-[10px]  border-gray-300 p-4 rounded-lg cursor-pointer "
                    onClick={() => openFileInNewTab()}>{data.file.name}</h1>
                </div>

              {/* <div className='flex items-center mx-auto'>
                <div>
                <h1 className=" whitespace-nowrap overflow-hidden overflow-ellipsis mr-[10px] w-[225px] md:w-[710px] py-1 px-2 border mt-[5px] md:mt-[10px] md:ml-[-25px] border-gray-300 p-4 rounded-lg"
                  onClick={() => openFileInNewTab()}>{data.file.name}</h1>
                </div>  
                <div>
                <a href={URL.createObjectURL(data.file)} download>
                  <BiSolidDownload />
                </a>                
                </div>
              </div> */}

                {/* {jpg && (
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

                
                <div className=' mx-auto w-[250px]  md:w-[705px] justify-center'>
                    <p className=' text-[#808080] text-[13px] md:text-[14px] ml-[5px] text-left  mt-[20px]  md:mt-[16px]'>{t('details')}</p>
                    <textarea  type="text" name="detail" placeholder={data.detail} className='rounded-[10px] mt-[5px] pl-[15px] w-[250px] md:ml-[-25px] h-[100px] md:text-[20px] md:w-[705px] md:h-[80px] bg-[#fff] border border-gray-300  p-4 '/>
                    {/* <textarea value={formData.detail} onChange={handleInputChange} className='border border-gray-300 rounded-md bg-[#F5F5F5] w-[250px] h-[100px] text-black text-sm pl-2 pt-2' /> */}
                </div>
                

                {message && (
                  <p className='mt-3 text-red-500 text-[13px] md:text-[14px] py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                    {message}
                  </p>
                )}
                {/* {notifyMessage && (
                  <p className=' mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                    {notifyMessage}
                  </p>
                )} */}

                <div className='flex items-center md:px-10  md:mt-[20px]' >
                  {/* <button type= "submit" href="/NotifyTwo" className=' mt-[20px] text-md md:text-[20px] md:ml-[480px] border-[#64CE3F] bg-[#64CE3F] px-10  py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 '>Submit</button> */}
                  
                    {/* // <button type= "submit" onClick={handleSubmit} className=' mt-[20px] text-md md:text-[20px] md:ml-[300px] ml-[85px] border-[#64CE3F] bg-[#64CE3F] px-10  py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 '>submit</button> */}
                    <button type= "submit" onClick={handleSubmit} className=' mt-[20px] text-md md:text-[20px] md:ml-[300px] ml-[85px] border-[#64CE3F] bg-[#64CE3F] px-10  py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 '>{t('submit')}</button>

                    
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
          </div>
        </div>
        </div>
    ) 
 }
  