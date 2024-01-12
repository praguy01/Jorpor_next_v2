'use client'
import React, { useState , useEffect ,  useRef } from 'react';
import Link from 'next/link'
// import '@fontsource/ntr'
import '../../globals.css'
import '@fontsource/mitr';
import {FiMenu} from 'react-icons/fi';
import {AiOutlineClose} from 'react-icons/ai';
import {usePathname } from 'next/navigation';
import { CompLanguageProvider, useLanguage } from '../compLanguageProvider_role_1';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import io from 'socket.io-client';
import { FaBell } from "react-icons/fa";
import { AiFillAlert } from "react-icons/ai";
import { IoTime } from "react-icons/io5";
import { BsCalendar2DateFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6"; 

// const socket = io('https://platform-jorpor.vercel.app', { transports: ['websocket'] });


function CompNavbar() {
  const { t } = useTranslation();
  const [notification, setNotification] = useState(null);
  const { language, toggleLanguage } = useLanguage();
  const [toggle, setToggle] = useState(false);
  const [message, setMessage] = useState('');
  const [shouldCallEditLanguage, setshouldCallEditLanguage] = useState(false);
  const [showPopup, setShowPopup] = useState(false); 
  const [notify, setNotify] = useState(false); 
  useEffect(() => {
    // เชื่อมต่อกับ WebSocket server ที่ทำงานบน localhost:3000
    const socket = io('https://platform-jorpor.vercel.app/');

    // ตัวอย่าง: รับข้อความที่ถูกส่งมาจาก server
    socket.on('message', (data) => {
      console.log('Received message from server:', data);
      setMessageFromServer(data); // นำข้อมูลมาอัปเดตใน state
    });

    // ทำความสะอาดเมื่อ Component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  // แสดง Popup เมื่อมีข้อมูลใหม่
  // useEffect(() => {
  //   if (notification) {
  //     setToggle(true);
  //   }
  // }, [notification]);

  const currentPath = usePathname();
  const outsideClickRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (outsideClickRef.current && !outsideClickRef.current.contains(e.target)) {
        setToggle(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const logout = () => {
    const profileImageUrl = localStorage.getItem('profileImageUrl');
    const rememberedData = localStorage.getItem('rememberedData');

    localStorage.clear(); 
    
    if (profileImageUrl) {
      localStorage.setItem('profileImageUrl', profileImageUrl); 
    }
    
    if (rememberedData) {
      localStorage.setItem('rememberedData', rememberedData);
      // localStorage.removeItem('rememberedData', rememberedData);
    }

    
  
    window.location.href = '/login';
  };
  


    

  return (
    < CompLanguageProvider>
        <div className='w-full h-[60px] items-center  bg-[#5A985E] fixed top-0 left-0 ' >
          <div className='container mx-auto flex justify-between  items-center py-2 px-4 md:h-[60px] w-screen  '>
            <div className='text-[#fff]  relative md:top-[5px] pb-3 pt-2  font-bold text-[24px] md:mr-[25px]' >
                <Link href='/select'>JorPor</Link>
                </div>
             
            <div className={`md:h-[60px] hidden md:flex tracking-wider items-center text-white text-[16px]  mx-auto justify-center `}>
            
                
                <Link href="/examineList" 
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/examineList' || currentPath === '/examine' || currentPath === '/checklistExamine' || currentPath === '/checklistEmployee' || currentPath === '/reportResults'  ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0' : 'text-[#fff]'}`}
                  >{language === 'EN' ? 'Examine' : 'ตรวจสอบ' }</Link>
                
                <Link href="/notify"
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/notify'  ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0'  : 'text-[#fff]'}`} 
                  >{language === 'EN' ? 'Notify' : 'แจ้งเตือน' }</Link>                
                
                <Link href="/response_role_1" 
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/response_role_1' || currentPath === '/responsedetail'? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0' : 'text-[#fff]'}`}
                  >{language === 'EN' ? 'Response' : 'ผลแจ้งเตือน' }</Link>
                
                <Link href="/plan_role_1" 
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/plan_role_1' ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0' : 'text-[#fff]'}`}
                  >{language === 'EN' ? 'Plan' : 'แผนงาน' }</Link>
                
                <Link href="/meeting_role_1" 
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/meeting_role_1' ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0' : 'text-[#fff]'}`}
                  >{language === 'EN' ? 'Meeting' : 'ประชุม' }</Link>
                
                <Link href="/employee_role_1" 
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/employee_role_1' ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0' : 'text-[#fff]'}`}
                  >{language === 'EN' ? 'Employee list' : 'รายชื่อพนักงาน' }</Link>
                
                <Link href="/profile_role_1" 
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/profile_role_1' ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0' : 'text-[#fff]'}`}
                  >{language === 'EN' ? 'Profile' : 'โปรไฟล์' }</Link> 
                 
                </div >

                
              <div className='hidden md:flex text-white  '>
                <div className=''>
                  {notify && (
                  <span 
                    className='absolute bg-red-500  rounded-full w-3 h-3 text-white flex items-center justify-center mt-4 ml-2 '
                    style={{ zIndex: 2 }}
                  >
                    <span className='text-[8px]'>1</span>
                  </span>
                  )}
                 <FaBell 
                  onClick={() => {setShowPopup(true); setTimeout(() => {setNotify(false);}, 100);}} 
                  className='relative cursor-pointer mt-5 transition-transform transform  hover:translate-x-0.5'
                  style={{ zIndex: 1 }}
                />
              </div>
                <button   className="text-white px-5  relative top-[5px] pb-3 pt-[10px]  text-[15px]   hover:font-bold  rounded-md p-2 " onClick={toggleLanguage}>
                  {language}
                </button> 
                <button style={{ whiteSpace: 'nowrap' }} onClick={logout}  className={`pb-4 pt-[10px] text-[15px]  mr-[-35px]   relative top-[5px] py-1  text-[#fff] hover:font-bold `}> {language === 'EN' ? 'log out' : 'ออกจากระบบ' }</button>
                </div>

            {toggle ? (
              <AiOutlineClose onClick={()=>setToggle(!toggle)} size={30} className='md:hidden  block text-white'/> 
            ) : (
              <div className='flex  items-center'>
              <div className='mr-4 md:hidden '>
                  {notify && (
                  <span 
                    className='absolute bg-red-500  rounded-full w-3 h-3 text-white flex items-center justify-center mt-[-5px] ml-2 '
                    style={{ zIndex: 2 }}
                  >
                    <span className='text-[8px]'>1</span>
                  </span>
                  )}
                 <FaBell 
                  onClick={() => {setShowPopup(true); setTimeout(() => {setNotify(false);}, 100);}} 
                  className='relative cursor-pointer  transition-transform transform  hover:translate-x-0.5'
                  style={{ zIndex: 1 }}
                />
              </div>
              <FiMenu onClick={()=>setToggle(!toggle)} size={25} className='md:hidden block md:mt-[20px] text-white'/>
              </div>

            )}
            </div>

            <div ref={outsideClickRef} className={` text-[18px]  md:hidden flex flex-col w-[50%] h-screen mt-[-12px] fixed bg-[#80A582] ${toggle ? `left-[0]` : `left-[-100%]`}` }>
                
                <Link onClick={()=>setToggle(!toggle)} href="/examineList" style={{ whiteSpace: 'nowrap' }} className=' mt-[15px]  px-4 py-2  text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>{t('Examine')}</Link>
                <Link onClick={()=>setToggle(!toggle)} href="/notify" style={{ whiteSpace: 'nowrap' }} className='  px-4 py-2  text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>{t('Notify')}</Link>
                <Link onClick={()=>setToggle(!toggle)} href="/response_role_1" style={{ whiteSpace: 'nowrap' }} className='  px-4 py-2  text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>{t('Response')}</Link>
                <Link onClick={()=>setToggle(!toggle)} href="/plan_role_1" style={{ whiteSpace: 'nowrap' }} className='  px-4 py-2  text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>{t('Plan')}</Link>
                <Link onClick={()=>setToggle(!toggle)} href="/meeting_role_1" style={{ whiteSpace: 'nowrap' }} className='  px-4 py-2  text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>{t('Meeting')}</Link>
                <Link onClick={()=>setToggle(!toggle)} href="/employee_role_1" style={{ whiteSpace: 'nowrap' }} className='  px-4 py-2  text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>{t("Employee list")}</Link>
                <Link onClick={()=>setToggle(!toggle)} href="/profile_role_1" style={{ whiteSpace: 'nowrap' }} className='  px-4 py-2  text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>{t('Profile')}</Link>
                
                <button onClick={logout}  className='   text-left px-4 py-2  text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>{t("log out")}</button>

                <button className={`text-[16px] text-white hover:text-[#5A985E] hover:bg-[#F5F5F5] px-4 py-2`} onClick={() => { toggleLanguage(); setToggle(!toggle);  }}>
                  {language}
                </button>

            </div>
        
          
        </div>
        {showPopup && (
              <div className="bg-white text-center text-black p-8 border border-grey-400 absolute rounded-lg shadow-lg  w-[300px]  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <AiFillAlert className=' text-[50px] mx-auto mb-[10px] text-red-500  '/>
              <p className='text-[18px] mb-5'>Emergency notification!!</p>

              <p className='flex items-center justify-center '> <IoTime className=' mr-2'/> Time  : 15:25 น.</p>
              <p className='flex items-center justify-center mt-1'> <BsCalendar2DateFill className='text-[14px]  mr-2'/> Date : 10/1/2024</p>
              <p className='flex items-center justify-center mt-1'> <FaLocationDot className=' mr-2'/> Location : Zone A</p>



              <button className="flex mx-auto  mt-7 items-center text-[15px]  bg-[#93DD79] text-white px-3 py-1  rounded hover:bg-green-600" onClick={() => setShowPopup(false)}>{t('Close')}</button>
              </div>
            )}
        
        </CompLanguageProvider>
    ) 
 }
 export default CompNavbar;

 
  