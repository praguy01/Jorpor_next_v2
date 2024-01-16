'use client'
// import '@fontsource/ntr'
import '../globals.css'
// import '@fontsource/mitr';
import CompNavbar from './compNavbar/role_1';
import axios from 'axios';
import React, { useState ,useEffect ,useCallback } from 'react';
import {useLanguage } from './compLanguageProvider_role_1';
import { useTranslation } from 'react-i18next';
// import i18n from '../i18n'; 
// import { initReactI18next } from 'react-i18next';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../Sarabun-Regular-normal';  
// import html2pdf from 'html2pdf.js';
import {BsFillExclamationTriangleFill} from 'react-icons/bs'
import {BsCheckCircle} from 'react-icons/bs'
import { useRouter } from 'next/navigation';
import { IoMdDownload } from "react-icons/io";

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
  const router = useRouter();

  // const element = document.getElementById('your-element-id');


  useEffect(() => {
    // ใน useEffect นี้คุณสามารถใช้ Axios เพื่อดึงข้อมูลจากฐานข้อมูล
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const user_IdValue = searchParams.get('id');
      const dateValue = searchParams.get('date');
  
      console.log("queryDataexamine: ", { user_IdValue, dateValue })
  
      const fetchData = async () => {
        try {
          const AddData = { user_IdValue, dateValue, user_IdValue, fetch: true };
          const fetchdata = JSON.stringify(AddData);
  
          const response = await axios.post('/api/reportResults', fetchdata, {
            headers: { 'Content-Type': 'application/json' },
          });
  
          const data = response.data;
  
          if (response.status === 200) {
            if (data.success === true) {
              console.log("Data1222: ", data.dbnameExamineList)
              setSelectedOption(data.dbnameExamineList[0]);
              setNameExamineList(data.dbnameExamineList);
              console.log("Data88888: ", data.dbsentdate)
              data.dbsentdate.reverse();
              data.dbsentdate.splice(1);
              const datesOnly = data.dbsentdate.map(item => item.date);
              console.log("Data9999: ", datesOnly)
  
              const storedDate = localStorage.getItem("date");
              const date1 = new Date(dateValue.split("/").reverse().join("-"));
              const date2 = new Date(datesOnly[0].split("/").reverse().join("-"));
  
              console.log("DATEEE: ", date1, date2)
  
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
    } else {
      console.log("ERRORRR")
    }
    }, []); // โหลดข้อมูลเมื่อค่า state reloadData เปลี่ยนแปลง
  
  // เลื่อน fetchDataForSelectedOption ไปใน useEffect callback
  useEffect(() => {
    const fetchDataForSelectedOption = async () => {
      try {
        console.log('Selected Option: ', nameExamineList);
  
        const AddData = { nameExamineList, id, option: true };
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
            console.log("77777777777777 ", ResultList)
  
            const Date = ResultList.date;
  
            localStorage.setItem('date', ResultList.date)
            setDate(Date)
  
            setNameExamine(ResultList)
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
  
    if (selectedOption) {
      fetchDataForSelectedOption();
    }
  }, [selectedOption, nameExamineList, id]);
  
  const fetchDataExamine = useCallback(async () => {
    try {
      const AddData = { selectedOption, selectedExamineOption, selectExamine: true };
      const fetchdata = JSON.stringify(AddData);
  
      const response = await axios.post('/api/reportResults', fetchdata, {
        headers: { 'Content-Type': 'application/json' },
      });
      const data = response.data;
  
      if (response.status === 200) {
        if (data.success === true) {
          console.log("Datamm: ", data.dbData)
  
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
            console.log("data.dbData: ", checkList)
  
          })
  
          const newTodoList = [...checklistToAdd];
          setTodoList(newTodoList)
          console.log("datachecklist: ", newTodoList)
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
  }, [selectedOption, selectedExamineOption,checkList]);
  
  useEffect(() => {
    if (selectedExamineOption) {
      fetchDataExamine();
    }
  }, [selectedExamineOption, fetchDataExamine]);


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
            router.push(resdata.redirect)
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


  const generatePDF = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    const doc = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    });
  
    // Add Sarabun font
    let verticalSpacing = 5; // Set the desired vertical spacing
    let tableHeight = 0;
    let currentY = 10;
    let currentHeight = 0;
    let checkcurrentHeight = 0;
    const maxPageHeight = 650;
    let newPage = false;
    let startY = true;
  
    const createNewPage = () => {
      doc.addPage();
      newPage = true;
    };
  
    doc.addFont('Sarabun-Regular', 'normal');
    doc.setFont('Sarabun-Regular', 'normal');
  
   
  
    doc.setFontSize(10);
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getStringUnitWidth('แบบรายงานผลการตรวจสอบความปลอดภัย') * doc.internal.getFontSize() / doc.internal.scaleFactor;
  
    const xCoordinate = (pageWidth - textWidth) / 2;
  
    doc.text('แบบรายงานผลการตรวจสอบความปลอดภัย', xCoordinate, 20);
  
    doc.text(`ผู้ตรวจสอบ : ${nameExamine.inspector}`, 20, 30);
    doc.text(`วัน เดือน ปี เวลา ที่ตรวจ : ${nameExamine.date} น.`, 20, 38);
  
    if (nameExamine && nameExamine.items) {
      console.log("nameExamine.items: ", nameExamine.items);
      try {
        for (const item of nameExamine.items) {
          console.log("HEIGHT item.name: ", item.name, currentY, currentHeight, checkcurrentHeight);
          if (checkcurrentHeight > maxPageHeight) {
            createNewPage();
            currentY = 20; 
            checkcurrentHeight = 0;
          }
          if (startY) {
            console.log("NEWW 3333");
            startY = false;
            currentY = 46;
          }else if (newPage) {
            console.log("NEWW PAGEEEE");
            currentY = 20;
            tableHeight = 0;
            currentHeight  = 0;
            newPage = false;
  
          } else if (!newPage) {
            console.log("NEWW 2222" , currentHeight);
  
            currentY = currentHeight + 8;
          }
  
         
          doc.text(20, currentY, `การตรวจสอบ :  ${item.name}`);
          console.log("HEIGHT item.name 1: ", item.name, currentY, currentHeight, checkcurrentHeight ,tableHeight);
  
          currentY += 8;
  
          if (item.examine) {
            for (const [examKey, examValue] of Object.entries(item.examine)) {
              doc.setFont('Sarabun-Regular', 'normal');
              doc.text(25, currentY, examKey);
              currentY += 8;
  
              if (examValue[0].useEmployee === 'false') {
                if (examValue[0].itemA) {
                  const columns = ["ลำดับ", "รายการตรวจสอบ", "สถานะ", "รายละเอียด"];
                  const data = examValue[0].itemA.map((entry, entryIndex) => {
                    return [entryIndex + 1, entry.examine_name, entry.status, entry.details];
                  });
  
                  doc.setFont('Sarabun-Regular', 'normal');
                  const tableWidth = columns.reduce((acc, column) => acc + (column.cellWidth || 40), 0);
  
                  const options = {
                    startY: currentY,
                    margin: { left: ((doc.internal.pageSize.getWidth() - tableWidth) / 2) + 5 }, // Center the table
                    columnStyles: {
                      0: { cellWidth: 20 },
                      1: { cellWidth: 50 },
                      2: { cellWidth: 30 },
                      3: { cellWidth: 50 },
                    },
                    headerStyles: {
                      fillColor: [211, 211, 211],
                      textColor: [0, 0, 0],
                      fontSize: 9,
                      fontStyle: 'bold',
                      font: 'Sarabun-Regular',
                      halign: 'center',
                    },
                    bodyStyles: {
                      textColor: [0, 0, 0],
                      fontSize: 10,
                      font: 'Sarabun-Regular',
                      halign: 'center',
                    },
  
                    
  
                    didDrawCell: function (data) {
                      const cellHeight = data.row.height;
                      const cellWidth = data.cell.width;
                      const cellX = data.cell.x;
                      const cellY = data.cell.y;
  
                      doc.setLineWidth(0.1);
                      doc.setDrawColor(0, 0, 0);
  
                      doc.line(cellX, cellY, cellX + cellWidth, cellY);
                      doc.line(cellX + cellWidth, cellY, cellX + cellWidth, cellY + cellHeight);
                      doc.line(cellX, cellY + cellHeight, cellX + cellWidth, cellY + cellHeight);
                      doc.line(cellX, cellY, cellX, cellY + cellHeight);
                    },
                  };
  
                  doc.autoTable({ columns, body: data, ...options });
  
                  tableHeight = doc.previousAutoTable.finalY;
                  currentHeight = tableHeight;
                  currentY = doc.autoTable.previous.finalY + 10; // Set currentY to the bottom of the previous table plus some spacing
                  checkcurrentHeight += tableHeight;
                  if ( checkcurrentHeight > maxPageHeight){
                    checkcurrentHeight = checkcurrentHeight - maxPageHeight
                    currentHeight = 12;
                    currentY = 20
                    doc.addPage();
  
                  }
                  
                  console.log("HEIGHT: ", examKey, 'checkcurrentHeight: ', checkcurrentHeight, 'tableHeight: ', tableHeight, 'currentY: ', currentY, 'currentHeight: ', currentHeight);
                  
                  
                }
              } else {
                if (examValue[0].itemA) {
                  let entryIndex = 0;
                  for (const entry of examValue[0].itemA) {
                    console.log("examValue[0].itemA: ", entry, entry.key, currentY,checkcurrentHeight);
                    console.log("HEIGHT entry.key: ", entry.key, currentY, currentHeight,checkcurrentHeight);
  
                    entryIndex++;
                    // if (checkcurrentHeight > maxPageHeight ) {
                    //   console.log("------------------------------------------------",tableHeight)
                    //   createNewPage()
                    //   currentY = tableHeight ;
                    //   currentHeight = 0;
                    //   checkcurrentHeight = 0;
                    //   newPage = true;
                    // }
  
                    doc.text(25, currentY, `${entryIndex}. ${entry.key}`);
  
                    const columns = ["ลำดับ", "รายการตรวจสอบ", "สถานะ", "รายละเอียด"];
                    const data = entry.itemB.map((entryBB, entryIndex) => {
                      return [entryIndex + 1, entryBB.examinename_name, entryBB.status, entryBB.details];
                    });
  
                    doc.setFont('Sarabun-Regular', 'normal');
                    const tableWidth = columns.reduce((acc, column) => acc + (column.cellWidth || 40), 0);
  
                    const options = {
                      startY: currentY + verticalSpacing,
                      margin: { left: ((doc.internal.pageSize.getWidth() - tableWidth) / 2) + 5 },
                      columnStyles: {
                        0: { cellWidth: 20 },
                        1: { cellWidth: 50 },
                        2: { cellWidth: 30 },
                        3: { cellWidth: 50 },
                      },
                      headerStyles: {
                        fillColor: [211, 211, 211],
                        textColor: [0, 0, 0],
                        fontSize: 9,
                        fontStyle: 'bold',
                        font: 'Sarabun-Regular',
                        halign: 'center',
                      },
                      bodyStyles: {
                        textColor: [0, 0, 0],
                        fontSize: 10,
                        font: 'Sarabun-Regular',
                        halign: 'center',
                      },
  
                      didDrawCell: function (data) {
                        const cellHeight = data.row.height;
                        const cellWidth = data.cell.width;
                        const cellX = data.cell.x;
                        const cellY = data.cell.y;
  
                        doc.setLineWidth(0.1);
                        doc.setDrawColor(0, 0, 0);
  
                        doc.line(cellX, cellY, cellX + cellWidth, cellY);
                        doc.line(cellX + cellWidth, cellY, cellX + cellWidth, cellY + cellHeight);
                        doc.line(cellX, cellY + cellHeight, cellX + cellWidth, cellY + cellHeight);
                        doc.line(cellX, cellY, cellX, cellY + cellHeight);
                      },
                    };
  
                    doc.autoTable({ columns, body: data, ...options });
                    tableHeight = doc.previousAutoTable.finalY;
                    currentHeight = tableHeight;
                    currentY = doc.autoTable.previous.finalY + 10; 
                    checkcurrentHeight += tableHeight;
                    if ( checkcurrentHeight > maxPageHeight){
                      checkcurrentHeight = checkcurrentHeight - maxPageHeight
                      currentY = 20
                      currentHeight = 12;
                      doc.addPage();
  
                    }
                    console.log("HEIGHT: ", entry.key, 'checkcurrentHeight: ', checkcurrentHeight, 'tableHeight: ', tableHeight, 'currentY: ', currentY, 'currentHeight: ', currentHeight);
                    
                   
                  }
                }
              }
            }
          }
        }
  
        // Save the PDF
        doc.save('แบบรายงานผลการตรวจสอบความปลอดภัย.pdf');
      } catch (error) {
        console.error('Error during PDF generation:', error);
      }
    }
  };

  
  
  
    
  return (
    <div>
      
      <CompNavbar/>
        
      <div className=' bg-[url("/bg1.png")]  overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
      <div className='md:w-[800px] lg:w-[1000px] mx-auto '>
          <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
             <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
          </div>

          <div className='mx-auto w-[350px] md:w-[700px] lg:w-[800px]  mb-[50px]  py-[30px] text-black flex flex-col  shadow-lg bg-[#FFF] text-center md:rounded-[50px] rounded-[30px] mt-[106px]  '>
          
                    <div  >
                    <div  className=  {` font-bold text-[20px] md:text-[25px] ml-[20px] md:ml-[50px] w-[310px]  md:w-[600px] `}>

                    <h1 className=' text-[#5A985E]  ml-[10px] md:ml-[0] md:w-[300px]  text-left  '>{t("Verified information")}</h1>
                    <div className="mt-[5px] md:mt-[10px] md:ml-[-30px] border-t md:border w-full md:w-[650px] lg:w-[750px] border-gray-300"></div>


                    <div className='text-black text-left ml-[10px] md:ml-[0]  mt-[15px]  md:mt-[0] flex '>
                  
                    </div>
                    </div>
                    </div>

                    <div className='mx-auto md:w-[620px] lg:w-[705px] text-black   w-[310px] '>

                    <div className='flex items-center  mt-[5px]  text-[13px] md:text-[16px]  md:mt-[20px] text-left ml-[10px] md:ml-[10px] '>
                    <p>{t('Date')}</p>
                    <p className='ml-[10px] '>:</p>
                    {nameExamine ? (
                      <p className='ml-[10px]'>{nameExamine.date} {t("N")}</p>
                    ) : null}
                    </div>

                    <div className='flex items-center mt-[8px]  text-[13px] md:text-[16px]  md:mt-[15px] text-left ml-[10px] md:ml-[10px] '>
                    
                    <p>{t('Inspector')}</p>
                    <p className='ml-[10px]'>:</p>
                    <p className='ml-[10px] w-[200px]  md:w-[300px] whitespace-nowrap overflow-hidden overflow-ellipsis'>{nameExamine.inspector}</p>

                    </div>

                    <div  className='mx-auto '>

                      <div  className='h-[300px]  md:w-[610px] lg:w-[690px] px-2   text-black text-center mt-[15px] mx-auto justify-center text-sm md:text-[18px] rounded-[10px] w-[310px] py-2 md:py-4 bg-[#F5F5F5] ml-[5px]  overflow-auto'>
                      <div id="pdf-content"   className="w-full  ">
                      {nameExamine &&
                            nameExamine.items &&
                            nameExamine.items.map((item, index) => (
                              <div key={index}>
                                {/* {console.log("NAME RESULT: ", index,item.examine)} */}

                                <div className="mt-[10px] md:mt-[10px] md:ml-[-30px] border-t md:border w-full md:w-[750px] border-gray-300"></div>
                                <h1 className="text-left text-green-600 mt-[10px]">{t('Examine')} : {item.name}</h1>
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
                                                <td className="py-4 border  flex flex-wrap">
                                                  <div className="text-left ml-[10px]">{entry.examine_name}</div>
                                                </td>
                                                <td className={`py-4 border whitespace-nowrap ${entry.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                                                  <div>{entry.status}</div>
                                                </td>
                                                <td className="py-4   border">
                                                  <div className={`break-words ${entry.details === '-' ? 'text-center' : 'text-left ml-[10px] flex flex-wrap '}`}>
                                                    <span className={`break-words  ${entry.details === '-' ? '' : 'ml-[10px] flex flex-wrap '}`}>{entry.details}</span>
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
                                                  <td className="py-4  border  flex flex-wrap">
                                                    <div className="text-left ml-[10px]">{entry.examinename_name}</div>
                                                  </td>
                                                  <td className={`py-4 border whitespace-nowrap ${entry.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                                                    <div>{entry.status}</div>
                                                  </td>
                                                  <td className="py-4   border">
                                                  <div className={`break-words ${entry.details === '-' ? 'text-center' : 'text-left ml-[10px] flex flex-wrap '}`}>
                                                    <span className={`break-words  ${entry.details === '-' ? '' : 'ml-[10px] flex flex-wrap '}`}>{entry.details}</span>
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
                <p className='md:text-[18px] text-[#5A985E] text-[16px]  '>{t("Can be sent only one time. Are you sure you have checked?")}</p>
                  <div className=  {` text-[16px]  flex justify-center mt-[20px]`}>
                    <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={() => {handleSubmit() ,setShowPopup(false)}}>{t('Yes')}</button> 

                    <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => setShowPopup(false)}>{t('Cancel')}</button>
                  </div>
                </div> 
                </div>
              )}

              {sent ? (
                <div className=  {` w-[300px] md:w-[650px] lg:w-[750px]  text-[15px] md:text-[17px] md:ml-[-25px]  flex items-center mx-auto md:px-10  md:mt-[20px]`} >
                  {/* <button type= "submit" href="/NotifyTwo" className=' mt-[20px] text-md md:text-[20px] md:ml-[480px] border-[#64CE3F] bg-[#64CE3F] px-10  py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 '>Submit</button> */}
                  <button onClick={generatePDF} className=' mt-[20px]  md:mr-[370px] lg:mr-[450px] mr-[80px] bg-[#808080]  text-[12px] px-5  py-1  text-[#fff] hover:-translate-y-0.5 duration-200  flex items-center '><IoMdDownload /><span className='ml-[5px]'>Dowload</span></button>

                  <button type='submit' onClick={(e) => setShowPopup(true)} className=' mt-[20px]  border-[#64CE3F] bg-[#64CE3F] px-10  py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200    '>{t('send')}</button>
                    {/* <button onClick={generatePDF}>Generate PDF</button> */}
                    {/* <div className=  {`${language === 'EN' ? ' font-ntr text-md md:text-[20px]' : ' font-mitr text-[15px] md:text-[17px] '  } left-0 flex items-center   md:px-10  md:mt-[20px]`} > */}
                  {/* <button type= "submit" href="/NotifyTwo" className=' mt-[20px] text-md md:text-[20px] md:ml-[480px] border-[#64CE3F] bg-[#64CE3F] px-10  py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 '>Submit</button> */}
                    
                </div>
               ) : (
                <div >
                <p className='md:text-[14px] text-[12px] mt-[20px]'>{`${language === 'EN' ? "Today's information has been sent. " : 'ข้อมูลของวันนี้้ถูกส่งไปแล้ว'  }`}</p>
                <button onClick={generatePDF} className=' mt-[20px] text-[15px]  border-[#64CE3F] bg-[#64CE3F] px-5  py-1  text-[#fff] hover:-translate-y-0.5 duration-200  mx-auto flex items-center '><IoMdDownload /><span className='ml-[5px]'>Dowload</span></button>
                </div>

              )} 
        
              </div>

          </div> 
          </div>
        </div>
        </div>
        
    ) 
 }
  