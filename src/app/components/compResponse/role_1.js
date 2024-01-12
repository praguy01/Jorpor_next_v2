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
import { format } from 'date-fns';


function  CompResponse() {
  return (
    <CompLanguageProvider>
      <App />
    </CompLanguageProvider>
  );
}

function App() {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
    const [toggle, setToggle] = useState(false);
    const [reloadData, setReloadData] = useState(false); // เพิ่ม state นี้
    const [message, setMessage] = useState('');
    const [todoList, setTodoList] = useState([]);
    const [id, setId] = useState('');


    useEffect(() => {
      // ใน useEffect นี้คุณสามารถใช้ Axios เพื่อดึงข้อมูลจากฐานข้อมูล
      const storedId = localStorage.getItem('id');
      if (storedId) {
        setId(storedId);
        console.log("Stored: ",storedId)
      }

      const fetchData = async () => {
        try {
          
        const AddData = { storedId , fetch : true};
        const dataDetail = JSON.stringify(AddData);
        console.log("send: ",dataDetail)

        const response = await axios.post('/api/response', dataDetail, {
          headers: { 'Content-Type': 'application/json' },
        });



          // const response = await axios.get('/api/notify'); // แทน '/api/examine' ด้วยเส้นทางที่ถูกต้องไปยัง API ของคุณ
          const data = response.data;
  
          if (response.status === 200) {
            if (data.success === true) {
              console.log("DATA: ",data)

              const notifyData = data.dbnotify_name.map(item => ({
                id: item.id,
                title: item.title,
                date: item.date,
                Verification_status: item.Verification_status
              }));
              setTodoList(notifyData.reverse());
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
    }, [reloadData]); // โหลดข้อมูลเมื่อค่า state reloadData เปลี่ยนแปลง



    const formatDateTime = (isoDateTime) => {
      const inputDate = new Date(isoDateTime);
      const formattedDate = format(inputDate, 'dd/MM/yyyy HH:mm');
      console.log("yyyy-MM-dd HH:mm",formattedDate);
    // const formattedDate = moment(isoDateTime).tz('Asia/Bangkok').format('DD/MM/YYYY HH:mm');
    // // const formattedDate = inputDate.format('DD/MM/YYYY HH:mm');
    // console.log("Formatted Date:", formattedDate);
  
    return formattedDate;
  };
    
    
  return (
    <div>
      
      <CompNavbar/>
        
    <div className=' bg-[url("/bg1.png")] overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center   '>
            <div className='md:w-[1000px] mx-auto '>
                <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
                    <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
                </div>

                
                <div className='mx-auto border w-[320px] md:w-[800px]  py-[20px] md:h-[600px] h-[550px] text-black flex flex-col   md:rounded-[30px] rounded-[30px] mt-[106px]  bg-[#fff]'>
                
                <h1 className='text-[22px] md:text-[25px]  ml-[30px]'>{t('Response')}</h1>
                                    
                <div className="mt-[5px] md:mt-[10px]  border w-full md:w-[750px] border-gray-300"></div>

                <div className='mx-auto w-[280px] md:w-[750px]  py-[20px] md:h-[600px] h-[500px] text-black flex flex-col  bg-[#D9D9D9] md:rounded-[30px] rounded-[30px] mt-[20px] overflow-auto '>
                
                {todoList.map((todo, index) => (
                  <Link href={`/responsedetail_role_1?response=${todo.title}&id=${todo.id}`} key={index}>
                  <div key={index} className={'mx-auto mt-[8px] w-[250px] p-2 h-[100px] md:h-[95px] md:w-[700px] px-2 text-black flex-col bg-[#FFF] text-center rounded-[15px] '}>
                    <div className='flex justify-center  h-[40px]  md:ml-[20px] mt-[5px]'>
                      <p className='text-[#000] ml-[5px] md:ml-[0px] text-[15px] text-left md:text-[18px] w-[250px] md:w-[700px] break-words whitespace-pre-wrap'>
                      {todo.title}  <span className='text-gray-500 text-[12px] md:text-[15px]'>{todo.formattedDate } {t('N')}</span>
                      </p>
                    </div>
                    <div className=" border-t mt-[5px] md:mt-0 border-gray-300"></div>
                    <div className='flex  items-center justify-between'>
                    <div className=' bg-[#F5F5F5] mt-[5px] md:w-[450px] w-[90px] md:ml-[15px] ml-[5px] h-[25px] md:h-[30px] rounded-[10px]'></div>
                    <div className='items-center mt-[5px] text-[11px] md:text-[14px] md:h-[30px] h-[25px] border-[#64CE3F] bg-[#64CE3F] px-5 md:px-10 rounded-[20px] text-[#fff] flex'>
                      {todo.Verification_status === 'Approve' && t("Approve")}
                      {todo.Verification_status === 'Pending approval' && t("Pending approval")}
                      {todo.Verification_status === 'Evalution' && t("Evalution")}
                    </div>
                 
                  </div>
                  </div>
                  </Link>
                ))}
                </div>
                </div>
        </div> 
      </div> 
    </div> 
    ) 
 }
 export default CompResponse;

  