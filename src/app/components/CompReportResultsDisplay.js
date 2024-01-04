'use client'
// import '@fontsource/ntr'
import '../globals.css'
// import '@fontsource/mitr';
import CompNavbar from './compNavbar/role_1';
import axios from 'axios';
import React, { useState ,useEffect } from 'react';
import { CompLanguageProvider, useLanguage } from './compLanguageProvider';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n'; 
import { initReactI18next } from 'react-i18next';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import {BsFillExclamationTriangleFill} from 'react-icons/bs'
import {BsCheckCircle} from 'react-icons/bs'

// function  {
//   return (
//     <CompLanguageProvider>
//       <App />
//     </CompLanguageProvider>
//   );
// }

// function App() {

export default function CompReportResultsForm({ onSubmit }) {

  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  // const [reloadData, setReloadData] = useState(false); // เพิ่ม state นี้
  const [id, setId] = useState('');
  const [date, setDate] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [checkList, setcheckList] = useState([]);
  const [nameExamineList , setNameExamineList] = useState(''); 
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedExamineOption, setSelectedExamineOption] = useState('');
  const [nameExamine , setNameExamine] = useState([]); 
  const [checklistnameExamine , setChecklistNameExamine] = useState([]); 
  const [showPopup, setShowPopup] = useState(false); // เพิ่ม state เพื่อควบคุมการแสดง/ซ่อน popup
  const [currentDate, setcurrentDate] = useState(false); // เพิ่ม state เพื่อควบคุมการแสดง/ซ่อน popup
  const [sent, setSent] = useState(true); // เพิ่ม state เพื่อควบคุมการแสดง/ซ่อน popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [addmessage, setaddMessage] = useState(false);

  // const element = document.getElementById('your-element-id');



  useEffect(() => {
    
    // ใน useEffect นี้คุณสามารถใช้ Axios เพื่อดึงข้อมูลจากฐานข้อมูล
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const user_IdValue = searchParams.get('id') ; // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า
      const dateValue = searchParams.get('date') ; // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า

     
      console.log("queryDataexamine: ",{user_IdValue , dateValue })
      

    const fetchData = async () => {
      try {
        const AddData = { user_IdValue , dateValue , user_IdValue , fetch: true};
        const fetchdata = JSON.stringify(AddData);

        const response = await axios.post('/api/reportResults', fetchdata, {
          headers: { 'Content-Type': 'application/json' },
        });    
        const data = response.data;

        if (response.status === 200) {
          if (data.success === true) {
            
            console.log("Data1222: ",data.dbnameExamineList)
            setSelectedOption(data.dbnameExamineList[0]);
            setNameExamineList(data.dbnameExamineList);
            console.log("Data88888: ",data.dbsentdate)
            data.dbsentdate.reverse();
            data.dbsentdate.splice(1);
            const datesOnly = data.dbsentdate.map(item => item.date);

            console.log("Data9999: ",datesOnly)
            const storedDate = localStorage.getItem("date");
            // let isCurrentTime = parseFloat(`${new Date().getHours().toString().padStart(2, '0')}.${new Date().getMinutes().toString().padStart(2, '0')} `)
            // let isTime = parseFloat(`${newEndTime.substring(0, 5).replace(':', '.')}`)
            // console.log("DATEEEE: ", formattedDate,selectedDate);
            const date1 = new Date(dateValue.split("/").reverse().join("-"));
            const date2 = new Date(datesOnly[0].split("/").reverse().join("-"));
      
            console.log("DATEEE: ",date1 , date2)

            const dateString1 = date1.toDateString(); 
            const dateString2 = date2.toDateString();

            if (dateString1 === dateString2) {
              setSent(false);
              console.log("วันที่เท่ากัน");
            } else {
              setSent(true);
              console.log("วันที่ไม่เท่ากัน");
            }

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
    setMessage('');
    setId(user_IdValue);
    fetchData();
  }
  }, []); // โหลดข้อมูลเมื่อค่า state reloadData เปลี่ยนแปลง

 
 
  const fetchDataForSelectedOption = async () => {
    try {
      console.log('Selected Option: ', nameExamineList);

      const AddData = { nameExamineList ,id, option: true };
      const data = JSON.stringify(AddData);
      console.log('BB: ', data);

      const response = await axios.post('/api/reportResultsPdf', data, {
        headers: { 'Content-Type': 'application/json' },
      });

      const resdata = response.data;
      console.log('DATA111: ', resdata);

      if (response.status === 200) {
        if (resdata.success === true) {

          const checkList_results = []
          const ResultList = resdata.dbData
          console.log("77777777777777 ",ResultList)

          const Date = ResultList.date;

          localStorage.setItem('date' , ResultList.date)
          setDate(Date)
          
          

          //  ResultList.forEach(item => {
          //       console.log(`Name: ${item.name}, Examine: ${Object.keys(item.examine)[0]}`);
          //       const data = item.examine[Object.keys(item.examine)[0]];
          //       checkList_results.push(item.name)
          //       data.forEach((entry, index) => {
          //         console.log(`  Data ${index + 1}: ${JSON.stringify(entry)}`);
          //       });
          //     });
          // const uniqueNames = new Set(); // เก็บชื่อที่ไม่ซ้ำ


          // ResultList.forEach(item => {
          //   const name = item.name;
          //   const examineKey = Object.keys(item.examine)[0];
          //   const data = item.examine[examineKey];
          
          //   // ตรวจสอบว่าชื่อนี้ยังไม่ถูกเพิ่มใน Set หรือไม่
          //   if (!uniqueNames.has(name)) {
          //     uniqueNames.add(name); // เพิ่มชื่อลงใน Set
          //     console.log(`Name: ${name}, Examine: ${examineKey}`);
          //     const groupedData = data.reduce((acc, entry) => {
          //       const examineName = entry.examinename;
        
          //       // ตรวจสอบว่ามี key สำหรับ examineName อยู่แล้วหรือไม่
          //       if (!acc[examineName]) {
          //           acc[examineName] = [];
          //       }
        
          //       // เพิ่มข้อมูลที่มี Examine เหมือนกันลงในอาร์เรย์เดียวกัน
          //       acc[examineName].push({
          //           examinename: entry.examinename,
          //           status: entry.status,
          //           details: entry.details
          //       });
        
          //       return acc;
          //   }, {});
        
          //   const filteredData = Object.values(groupedData);

          //   checkList_results.push({ name, examine: examineKey, data: filteredData }); // Include examine name
        
          //   filteredData.forEach((group, index) => {
          //       console.log(`  Group ${index + 1}: ${JSON.stringify(group)}`);
          //   });
          //   }
          // });
          
          // ตอนนี้ checkList_results จะมีโครงสร้างเป็น [{ name: 'Name1', data: [...] }, { name: 'Name2', data: [...] }, ...]
          

              
          setNameExamine(ResultList)
          // setChecklistNameExamine(checkList_results)
          // console.log("000: ",resdata.dbExamine[0])
          // setSelectedExamineOption(resdata.dbExamine[0])
          // console.log('selectexamine: ', resdata.dbExamine[0]);
          // fetchDataExamine();
          
        } else {
          setMessage(resdata.error);
        }
      } else {
        setMessage(resdata.error);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('');
    }
    setMessage('');


          
  };

  useEffect(() => {
    if (selectedOption) {
      fetchDataForSelectedOption();
    }
  }, [selectedOption]);

  useEffect(() => {
    if (selectedExamineOption) {
      fetchDataExamine();
    }
  }, [selectedExamineOption]);

  

  const handleDropdownChange = (event) => {
    console.log("event.target.value: ",event.target.value)
    setSelectedOption(event.target.value); // เมื่อเลือกตัวเลือกใน Dropdown ให้อัปเดต state
  };


  const handleDropdownExamineChange = (event) => {
    console.log("event.target.value: ",event.target.value)
    setSelectedExamineOption(event.target.value); // เมื่อเลือกตัวเลือกใน Dropdown ให้อัปเดต state
  };


  const fetchDataExamine = async () => {
    try {

      const AddData = { selectedOption ,selectedExamineOption , selectExamine: true};
      const fetchdata = JSON.stringify(AddData);

      // console.log("444: ",fetchdata)

      const response = await axios.post('/api/reportResults', fetchdata, {
        headers: { 'Content-Type': 'application/json' },
      });    
      const data = response.data;

      if (response.status === 200) {
        if (data.success === true) {
         
          console.log("Datamm: ",data.dbData)
     

          let checklistToAdd = [];
          

          
          const dbData = data.dbData || [];
          dbData.forEach((checkListData) => {
            const Data = {
              examinename: checkListData.examinename,
              details: checkListData.details,
              status: checkListData.status
            };
             checklistToAdd.push(Data);
             const Data_1 = {
              date: checkListData.date,
              name: checkListData.name,
              lastname: checkListData.lastname

            };
            setcheckList(Data_1)
            console.log("data.dbData: ",checkList)

        })

          
          const newTodoList = [...checklistToAdd];
          setTodoList(newTodoList)
          console.log("datachecklist: ",newTodoList)
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
    setMessage('');

  };


  // Call the second useEffect function when the selected option changes


  const [formData, setFormData] = useState({
    title: '',
    employee: '',
    location: '',
    work_owner: '',
    status: '',
    dateTime: '',
    file: null,
    file_name: '',
    detail: '',
  });

  const [uploadedImage, setUploadedImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
  
    if (name === 'file') {
      // หากเป็นฟิลด์ 'file' ให้ดึงข้อมูลของไฟล์และเก็บชื่อไฟล์
      setFormData({
        ...formData,
        [name]: files[0],
        fileName: files[0] ? files[0].name : '', // กำหนดชื่อไฟล์
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };


  // const handleSubmit = async () => {
    // if (
    //   formData.detail === ''
    // ) {
    //   setMessage('Please fill out all required fields.');
    // } else {
    // const isSuccess = await onSubmit(formData ,nameExamine );

    // if (isSuccess) {
    //   setMessage('');
    // } else {
    //   setMessage('An error occurred while submitting the data.');
    // }
  // }
  // };

  const handleSubmit = async () => {
  
    
    try {
     
      // const formData = new FormData();
      // formData.append('title', data.title);
      // formData.append('employee', data.employee);
      // formData.append('location', data.location);
      // formData.append('work_owner', data.work_owner);
      // formData.append('position', data.position);
      // formData.append('dateTime', data.dateTime);
      // formData.append('detail', data.detail);
      // formData.append('file', data.file);
      // formData.append('file_name', data.file_name);

      const sendData = {
        nameExamine,
        send: true
      };

      const dataform = JSON.stringify(sendData);

      const response = await axios.post('/api/reportResultsPdf', dataform, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // const requestData = {
      //   ...data,
      // };
      
      // console.log('Submitted Data:', requestData);
      
      // // const dataform = JSON.stringify(requestData);
      
      // const response = await axios.post('/api/notify', {
      //   requestData
      // }, {
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      
      const resdata = response.data; 

      if (response.status === 200) {
        const resdata = response.data;
    
        if (resdata.success === true) {
          setShowSuccessPopup(true)
          setaddMessage(resdata.message);
          // setnotifyMessage('');
          setSent(true)

          setTimeout(() => {
            setShowSuccessPopup(false);
            window.location.href = resdata.redirect;
          }, 1000); // 1000 milliseconds = 1 second
        } else {
          // setnotifyMessage(resdata.error);
          setMessage('');

        }
      } else {
        // setnotifyMessage(resdata.error);
        setMessage('');

      }
    } catch (error) {
      console.error('Error registering: ', error);
      // setnotifyMessage(error);
      setMessage('');

    } 
  
  }


  // Example: Applying specific styles for PDF
const generatePDF = () => {
  const element = document.getElementById('pdf-content');
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Add title
  pdf.text('Verified information', 20, 10);

  html2canvas(element, { scale: 1.5, logging: true, useCORS: true })
    .then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, imgHeight);
      pdf.save('report.pdf');
    });
};

  
  
  
    
  return (
    <div>
      
      <CompNavbar/>
        
      <div className=' bg-[url("/bg1.png")]  overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
        <div className='md:w-[1000px] mx-auto '>
          <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
             <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
          </div>

          <div className='mx-auto w-[350px] md:w-[800px]  mb-[50px]  py-[30px] text-black flex flex-col  shadow-lg bg-[#FFF] text-center md:rounded-[50px] rounded-[30px] mt-[106px]  '>
          
                    <div  >
                    <div  className=  {` font-bold text-[20px] md:text-[25px] ml-[20px] md:ml-[50px] w-[310px]  md:w-[600px] `}>

                    <h1 className=' text-[#5A985E]  ml-[10px] md:ml-[0] md:w-[300px]  text-left  '>  {`${language === 'EN' ? 'Verified information ' : ' ข้อมูลตรวจสอบวันนี้ '  }`}</h1>
                    <div className="mt-[5px] md:mt-[10px] md:ml-[-30px] border-t md:border w-full md:w-[750px] border-gray-300"></div>


                    <div className='text-black text-left ml-[10px] md:ml-[0]  mt-[15px]  md:mt-[0] flex '>
                  
                    </div>
                    </div>
                    </div>

                    <div className='mx-auto md:w-[705px] text-black   w-[310px] '>

                    <div className='flex items-center  mt-[5px]  text-[13px] md:text-[16px]  md:mt-[20px] text-left ml-[10px] md:ml-[10px] '>
                    <p>{t('Date')}</p>
                    <p className='ml-[10px] '>:</p>
                    {nameExamine ? (
                      <p className='ml-[10px]'>{nameExamine.date} น.</p>
                    ) : null}
                    </div>

                    <div className='flex items-center mt-[8px]  text-[13px] md:text-[16px]  md:mt-[15px] text-left ml-[10px] md:ml-[10px] '>
                    
                    <p>{t('Inspector')}</p>
                    <p className='ml-[10px]'>:</p>
                    <p className='ml-[10px] w-[200px]  md:w-[300px] whitespace-nowrap overflow-hidden overflow-ellipsis'>{nameExamine.inspector}</p>

                    </div>

                    <div  className='mx-auto '>

                      <div  className='h-[300px]  md:w-[690px] px-2   text-black text-center mt-[15px] mx-auto justify-center text-sm md:text-[18px] rounded-[10px] w-[310px] py-2 md:py-4 bg-[#F5F5F5] ml-[5px]  overflow-auto'>
                      <div id="pdf-content"   className="w-full  ">
                      {nameExamine &&
                            nameExamine.items &&
                            nameExamine.items.map((item, index) => (
                              <div key={index}>
                                {/* {console.log("NAME RESULT: ", index,item.examine)} */}

                                <div className="mt-[10px] md:mt-[10px] md:ml-[-30px] border-t md:border w-full md:w-[750px] border-gray-300"></div>
                                <h1 className="text-left text-green-600 mt-[10px]">Examine: {item.name}</h1>
                                <div className="mt-[5px] md:mt-[10px] md:ml-[-30px] border-t md:border w-full md:w-[750px] border-gray-300"></div>

                                {Object.keys(item.examine).map((examKey, examIndex) => (
                                  <div key={examIndex}>
                                    {/* {console.log("888888: ",examKey,item.examine[examKey][0])}
                                    {console.log("8888884444444: ",item.examine[examKey][0].itemA[0])} */}

                                    {item.examine[examKey][0].useEmployee === 'false' ? (
                                      <div key={examIndex}>
                                        {/* {console.log("888888: ", examKey, item.examine[examKey][0])}
                                        {console.log("8888884444444: ", item.examine[examKey][0].itemA[0])} */}

                                        <h2 className="text-left mt-[10px]">{examKey}</h2>

                                        <table className="min-w-full divide-gray-200 mt-[10px]">
                                          <thead className="bg-gray-50 top-0 z-10">
                                            <tr className="text-center">
                                              <th scope="col" style={{ whiteSpace: 'nowrap' }} className="border w-[30px] py-1 text-[12px] text-gray-500 uppercase tracking-wider">
                                                {t('No')}
                                              </th>
                                              <th scope="col" style={{ whiteSpace: 'nowrap' }} className="border w-[100px] py-1 text-[12px] text-gray-500 uppercase tracking-wider">
                                                {t('Name')}
                                              </th>
                                              <th scope="col" style={{ whiteSpace: 'nowrap' }} className="border w-[50px] py-1 text-[12px] text-gray-500 uppercase tracking-wider">
                                                {t('Status')}
                                              </th>
                                              <th scope="col" style={{ whiteSpace: 'nowrap' }} className="border w-[200px] py-1 text-[12px] text-gray-500 uppercase tracking-wider">
                                                {t('Details')}
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody className="bg-white text-[13px] divide-y divide-gray-200">
                                            {item.examine[examKey][0].itemA.map((entry, entryIndex) => (
                                              // console.log("ITEMA: ", entry),
                                              <tr key={entryIndex} className="text-center">
                                                <td className="py-4 border whitespace-nowrap">
                                                  <div>{entryIndex + 1}</div>
                                                </td>
                                                <td className="py-4 border whitespace-nowrap">
                                                  <div className="text-left ml-[10px]">{entry.examine_name}</div>
                                                </td>
                                                <td className={`py-4 border whitespace-nowrap ${entry.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                                                  <div>{entry.status}</div>
                                                </td>
                                                <td className="py-4 border">
                                                  <div className={`break-words ${entry.details === '-' ? 'text-center' : 'text-left ml-[10px]'}`}>
                                                    <span className={`break-words ${entry.details === '-' ? '' : 'ml-[10px]'}`}>{entry.details}</span>
                                                  </div>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    ) : (
                                        <div key={examIndex}>
                                          {/* {console.log("888888แต่งกาย: ", examKey, item.examine[examKey][0].itemA)}
                                          {console.log("8888884444444แต่งกาย: ", item.examine[examKey][0].itemA[0].itemB[0])} */}
  
                                          <h2 className="text-left mt-[10px]">{examKey}</h2>
                                          {item.examine[examKey][0].itemA.map((exameKey, exameIndex) => (
                                        <div key={exameIndex}>
                                            {/* {console.log("YYYY: ",exameKey.itemB)} */}
                                          <div className="mt-[10px] md:mt-[10px] md:ml-[-30px] border-t md:border w-full md:w-[750px] border-gray-300"></div>

                                            <h1 className='text-left mt-[10px]'>{exameIndex + 1}. {exameKey.key} </h1>

                                          <table className="min-w-full divide-gray-200 mt-[10px]">
                                            <thead className="bg-gray-50 top-0 z-10">
                                              <tr className="text-center">
                                                <th scope="col" style={{ whiteSpace: 'nowrap' }} className="border w-[30px] py-1 text-[12px] text-gray-500 uppercase tracking-wider">
                                                  {t('No')}
                                                </th>
                                                <th scope="col" style={{ whiteSpace: 'nowrap' }} className="border w-[100px] py-1 text-[12px] text-gray-500 uppercase tracking-wider">
                                                  {t('Name')}
                                                </th>
                                                <th scope="col" style={{ whiteSpace: 'nowrap' }} className="border w-[50px] py-1 text-[12px] text-gray-500 uppercase tracking-wider">
                                                  {t('Status')}
                                                </th>
                                                <th scope="col" style={{ whiteSpace: 'nowrap' }} className="border w-[200px] py-1 text-[12px] text-gray-500 uppercase tracking-wider">
                                                  {t('Details')}
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody className="bg-white text-[13px] divide-y divide-gray-200">
                                              {exameKey.itemB.map((entry, entryIndex) => (
                                                // console.log("ITEMA: ", entry),
                                                // entry.itemB.map((entry, entryIndex) => (

                                                <tr key={entryIndex} className="text-center">
                                                  <td className="py-4 border whitespace-nowrap">
                                                    <div>{entryIndex + 1}</div>
                                                  </td>
                                                  <td className="py-4 border whitespace-nowrap">
                                                    <div className="text-left ml-[10px]">{entry.examinename_name}</div>
                                                  </td>
                                                  <td className={`py-4 border whitespace-nowrap ${entry.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                                                    <div>{entry.status}</div>
                                                  </td>
                                                  <td className="py-4 border">
                                                    <div className={`break-words ${entry.details === '-' ? 'text-center' : 'text-left ml-[10px]'}`}>
                                                      <span className={`break-words ${entry.details === '-' ? '' : 'ml-[10px]'}`}>{entry.details}</span>
                                                    </div>
                                                  </td>
                                                </tr>
                                              // ))
                                              ))}

                                            </tbody>
                                          </table>
                                        </div>

                                        ))}
                                       </div>

                                    )
                                    
                                    }

                                  </div>

                              ))}
                              </div>
                            ))}
                            
                            </div> 
                          </div>
                        </div>
                            {/* //  Map over itemA

                            //   console.log("555555: ", entryIndex, entry)
                            //   return entry.itemA.map((itemAEntry, itemAIndex) => (
                            //     <tr key={itemAIndex} className='text-center'>
                            //       {console.log("3333333: ", itemAIndex, itemAEntry)}
                            //       <td className="py-4 border whitespace-nowrap">
                            //         <div>{itemAIndex + 1}</div>
                            //       </td>
                            //       <td className="py-4 border whitespace-nowrap">
                            //         <div className="text-left ml-[10px]">{itemAEntry.examine_name}</div>
                            //       </td>
                            //       <td className={`py-4 border whitespace-nowrap ${itemAEntry.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                            //         <div>{itemAEntry.status}</div>
                            //       </td>
                            //       <td className="py-4 border">
                            //         <div className={`break-words ${itemAEntry.details === '-' ? 'text-center' : 'text-left ml-[10px]'}`}>
                            //           <span className={`break-words ${itemAEntry.details === '-' ? '' : 'ml-[10px]'}`}>{itemAEntry.details}</span>
                            //         </div>
                            //       </td>
                            //     </tr> */}

                        


{/*                     
                    {formData.file && ( // เช็คว่ามีรูปภาพใน formData.file หรือไม่
                      <div>
                        <h3>รูปภาพที่อัพโหลด</h3>
                        <img src={URL.createObjectURL(formData.file)} alt="รูปภาพที่อัพโหลด" />
                      </div>
                    )} */}
      

                {/* <div >
                    <p className='font-mitr text-[#808080] text-[13px] md:text-[16px] ml-[-160px] md:ml-[-620px] mt-[20px]  md:mt-[15px]'>{t('details')}</p>
                    <textarea type="text" name="detail" value={formData.detail} onChange={handleInputChange} className='align-text-top rounded-[10px] mt-[5px] pl-[15px] w-[230px]  text-[14px] md:ml-[-25px] h-[100px] md:text-[16px] md:w-[680px] md:h-[80px] bg-[#fff] border border-gray-300  p-4 '/>
                </div> */}
              {showSuccessPopup && (
                <div className="bg-white text-[#5A985E] text-[16px]  w-[300px] p-8  rounded-lg border-black shadow-lg md:w-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <BsCheckCircle className=' text-[50px] mx-auto mb-[10px]'/>
                {addmessage}
                </div>
              )}

                {message && (
                  <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                    {message}
                  </p>
                )}
                {/* {notifyMessage && (
                  <p className=' mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                    {notifyMessage}
                  </p>
                )} */}

                {showPopup && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-[9999]">
                <div className="bg-white p-4 rounded-lg border-black shadow-lg md:w-[400px] w-[300px] ">
                <BsFillExclamationTriangleFill className=' text-[50px] text-[#5A985E] mx-auto mb-[10px]'/>
                <p className='md:text-[18px] text-[#5A985E] text-[16px]  '>{`${language === 'EN' ? 'Can be sent only one time. Are you sure you have checked? ' : 'สามารถส่งได้เพียงครั้้งเดียวเท่านั้น คุณแน่ใจว่าตรวจสอบเรียบร้อยเเล้ว ? '  }`}</p>
                  <div className=  {` text-[16px]  flex justify-center mt-[20px]`}>
                    <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={() => {handleSubmit() ,setShowPopup(false)}}>{t('Yes')}</button> 

                    <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => setShowPopup(false)}>{t('Cancel')}</button>
                  </div>
                </div> 
                </div>
              )}

              {sent ? (
                <div className=  {`  text-[15px] md:text-[17px]  flex items-center  mx-auto md:px-10  md:mt-[20px]`} >
                  {/* <button type= "submit" href="/NotifyTwo" className=' mt-[20px] text-md md:text-[20px] md:ml-[480px] border-[#64CE3F] bg-[#64CE3F] px-10  py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 '>Submit</button> */}
                    <button type='submit' onClick={(e) => setShowPopup(true)} className=' mt-[20px]   border-[#64CE3F] bg-[#64CE3F] px-10  py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200  mx-auto  '>{t('send')}</button>
                    {/* <button onClick={generatePDF}>Generate PDF</button> */}

                </div>
              ) : (
                <p className='md:text-[18px] text-[12px] mt-[10px]'>{`${language === 'EN' ? "Today's information has been sent. " : 'ข้อมูลของวันนี้้ถูกส่งไปแล้ว'  }`}</p>
              )}
        
              </div>

          </div> 
          </div>
        </div>
        </div>
        
    ) 
 }
  