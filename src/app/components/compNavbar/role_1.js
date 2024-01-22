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
import { FaBell } from "react-icons/fa";
import { AiFillAlert } from "react-icons/ai";
import { IoTime } from "react-icons/io5";
import { BsCalendar2DateFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6"; 
import { io as socketIoClient } from 'socket.io-client';

// const socket = socketIoClient('http://localhost:4000', {
//   path: '/socket.io',
//   withCredentials: true,
//   transports: ['websocket'],
// });

// socket.on('connect', () => {
//   console.log('WebSocket connected');
// });

// socket.on('disconnect', (reason) => {
//   console.log('WebSocket disconnected:', reason);
// });

// socket.on('connect_error', (error) => {
//   console.error('Error establishing WebSocket connection:', error);
// });



function CompNavbar() {
  const { t } = useTranslation();
  // const [notification, setNotification] = useState(null);
  const { language, toggleLanguage } = useLanguage();
  const [toggle, setToggle] = useState(false);
  const [message, setMessage] = useState('');
  const [shouldCallEditLanguage, setshouldCallEditLanguage] = useState(false);
  const [showPopup, setShowPopup] = useState(false); 
  const [notify, setNotify] = useState(false); 
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const eventSource = new EventSource('https://platform-jorpor.vercel.app/api/emergency_notify');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotification(data.message);
      setShowPopup(true);
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);
  // useEffect(() => {
  //   console.log("Attempting to connect to Socket.IO...");
  //   const socket = socketIoClient('https://platform-jorpor-chada.koyeb.app', {
  //     path: '/socket.io',
  //     withCredentials: true,
  //     transports: ['websocket'],
  //   });

  //   // const socket = socketIoClient('https://platform-jorpor-chada.koyeb.app', {
  //   //   transports: ['websocket'],
  //   //   extraHeaders: {
  //   //     "my-custom-header": "abcd"
  //   //   }    
  //   // });

  
  //   socket.on('connect', () => {
  //     console.log('WebSocket connected: ');
  //     console.log(socket.connected);

  //   });
  
  //   socket.on('emergencyNotify', (res) => {
  //     setNotification(res);
  //     setShowPopup(true);
  //     console.log("MESSAGE EMERGENCY: ", res);
  
  //     socket.disconnect();
  //     console.log('Socket.IO connection closed');
  //   });
  
  //   socket.on('disconnect', (reason) => {
  //     console.log('WebSocket disconnected:', reason);
  //   });
    
  //   socket.on('error', (error) => {
  //     console.error('WebSocket error:', error);
  //   });
    
        
  
  //   return () => {
  //     socket.disconnect();
  //     console.log('Socket.IO connection closed');
  //   };
  // }, []); // ให้ว่างไว้เพื่อให้ทำงานเมื่อ component ถูก unmounted


  

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
        <div className=' mx-auto flex justify-between  items-center py-2 px-8 md:h-[60px] w-full   '>
            <div className='text-[#fff]  relative md:top-[5px] pb-3 pt-2  font-bold text-[24px] lg:mr-[25px] ' >
                <Link href='/select'>JorPor</Link>
                </div>
             
            <div className={`lg:h-[60px] hidden lg:flex tracking-wider items-center text-white text-[16px]  mx-auto justify-center `}>
            
                
                <Link href="/examineList" 
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/examineList' || currentPath === '/examine' || currentPath === '/checklistExamine' || currentPath === '/checklistEmployee' || currentPath === '/reportResults' || currentPath === '/select'  ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0' : 'text-[#fff]'}`}
                  >{t('Examine')}</Link>
                
                <Link href="/notify"
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/notify'  ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0'  : 'text-[#fff]'}`} 
                  >{t('Notify')}</Link>                
                
                <Link href="/response_role_1" 
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/response_role_1' || currentPath === '/responsedetail_role_1'? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0' : 'text-[#fff]'}`}
                  >{t('Response')}</Link>
                
                <Link href="/plan_role_1" 
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/plan_role_1' ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0' : 'text-[#fff]'}`}
                  >{t('Plan')}</Link>
                
                <Link href="/meeting_role_1" 
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/meeting_role_1' ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0' : 'text-[#fff]'}`}
                  >{t('Meeting')}</Link>
                
                <Link href="/employee_role_1" 
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/employee_role_1' ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0' : 'text-[#fff]'}`}
                  >{t("Employee list")}</Link>
                
                <Link href="/profile_role_1" 
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/profile_role_1' ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0' : 'text-[#fff]'}`}
                  >{t('Profile')}</Link> 
                 
                </div >

                
              <div className='hidden lg:flex text-white  '>
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
                  className='relative cursor-pointer text-white mt-5 transition-transform transform  hover:translate-x-0.5'
                  style={{ zIndex: 1 }}
                />
              </div>
                <button   className="text-white px-5  relative top-[5px] pb-3 pt-[10px]  text-[15px]   hover:font-bold  rounded-md p-2 " onClick={toggleLanguage}>
                  {language}
                </button> 
                <button style={{ whiteSpace: 'nowrap' }} onClick={logout}  className={`pb-4 pt-[10px] text-[15px]     relative top-[5px] py-1  text-[#fff] hover:font-bold `}>{t("log out")}</button>
                </div>

            {toggle ? (
              <AiOutlineClose onClick={()=>setToggle(!toggle)} size={30} className='lg:hidden  block text-white'/> 
            ) : (
              <div className='flex  items-center'>
              <div className='mr-4 lg:hidden '>
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
                  className='relative cursor-pointer text-white transition-transform transform  hover:translate-x-0.5'
                  style={{ zIndex: 1 }}
                />
              </div>
              <FiMenu onClick={()=>setToggle(!toggle)} size={25} className='lg:hidden block lg:mt-[20px] text-white'/>
              </div>

            )}
            </div>

            <div ref={outsideClickRef} className={` text-[18px]  lg:hidden flex flex-col w-[50%] md:w-[30%] h-screen mt-[-12px] md:mt-[-1px] fixed bg-[#80A582] ${toggle ? `left-[0]` : `left-[-100%]`}` }>
                
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

              {/* <p className='flex items-center justify-center '> <IoTime className=' mr-2'/> Time  : 15:25 น.</p>
              <p className='flex items-center justify-center mt-1'> <BsCalendar2DateFill className='text-[14px]  mr-2'/> Date : 10/1/2024</p>
              <p className='flex items-center justify-center mt-1'> <FaLocationDot className=' mr-2'/> Location : Zone A</p> */}
              
             {notification && (
                <div>
                  <p>Location: {notification.location}</p>

                  <p>Date: {notification.date}</p>
                  <p>Time: {notification.time}</p>
                </div>
              )}


              <button className="flex mx-auto  mt-7 items-center text-[15px]  bg-[#93DD79] text-white px-3 py-1  rounded hover:bg-green-600" onClick={() => setShowPopup(false)}>{t('Close')}</button>
              </div>
            )}
        
        </CompLanguageProvider>
    ) 
 }
 export default CompNavbar;

 
  