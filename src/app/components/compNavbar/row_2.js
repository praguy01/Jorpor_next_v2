'use client'
import React, { useState , useEffect ,  useRef } from 'react';
import Link from 'next/link'
import '../../globals.css'
import '@fontsource/mitr';
import {FiMenu} from 'react-icons/fi';
import {AiOutlineClose} from 'react-icons/ai';
import {usePathname } from 'next/navigation';
import { CompLanguageProvider, useLanguage } from '../compLanguageProvider';
import { useTranslation } from 'react-i18next';


function CompNavbar() {
  const { t } = useTranslation();

  const { language, toggleLanguage } = useLanguage();
  const [toggle, setToggle] = useState(false);
  useEffect (() => {
    console.log("ภาษา ",language)
    localStorage.setItem('language', language);
  })
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
          <div className='container mx-auto flex justify-between  items-center py-2 px-4 md:h-[60px] w-screen '>
            <div className='text-[#fff]  relative md:top-[2px] pb-3 pt-2  font-bold text-[24px] md:mr-[25px]' >
                <Link href='/report_row_2'>JorPor</Link>
                </div>
             
            <div className={`md:h-[60px] hidden md:flex tracking-wider items-center text-white   text-[16px]  mx-auto justify-center `}>
           
            
                
                <Link href="/report_row_2" 
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/report_row_2' || currentPath === '/examine' || currentPath === '/checklistExamine' || currentPath === '/checklistEmployee' || currentPath === '/reportResults'  ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0' : 'text-[#fff]'}`}
                  >{language === 'EN' ? 'Report results' : 'ผลการรายงาน' }</Link>
                
                <Link href="/response_row_2"
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/response_row_2'  ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0'  : 'text-[#fff]'}`} 
                  >{language === 'EN' ? 'Approve' : 'การอนุมัติ' }</Link>                
                
                <Link href="/plan_row_2" 
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/plan_row_2' || currentPath === '/responsedetail'? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0' : 'text-[#fff]'}`}
                  >{language === 'EN' ? 'Plan' : 'แผนงาน' }</Link>
                  
                <Link href="/meeting_row_2" 
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/meeting_row_2' ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0' : 'text-[#fff]'}`}
                  >{language === 'EN' ? 'Meeting' : 'ประชุม' }</Link>

                <Link href="/employee_row_2" 
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/employee_row_2' ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0' : 'text-[#fff]'}`}
                  >{language === 'EN' ? 'Employee list' : 'รายชื่อพนักงาน' }</Link>
                
               
                <Link href="/profile_row_2" 
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/profile_row_2' ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0' : 'text-[#fff]'}`}
                  >{language === 'EN' ? 'Profile' : 'โปรไฟล์' }</Link> 
                 
                </div >
                
              <div className='hidden md:flex text-white '>
                <button   className="text-white px-5 ml-[20px] relative top-[5px] pb-3 pt-[10px]  text-[15px]   hover:font-bold  rounded-md p-2 " onClick={toggleLanguage}>
                  {language}
                </button> 
                <button style={{ whiteSpace: 'nowrap' }} onClick={logout}  className={`text-[16px]  mr-[-35px]    relative top-[4px] pb-3 pt-2  py-1  text-[#fff] hover:font-bold `}> {language === 'EN' ? 'log out' : 'ออกจากระบบ' }</button>
                </div>

            {toggle ? (
              <AiOutlineClose onClick={()=>setToggle(!toggle)} size={30} className='md:hidden  block text-white'/> 
            ) : (
              <FiMenu onClick={()=>setToggle(!toggle)} size={25} className='md:hidden block md:mt-[20px] text-white'/>
            )}
            </div>

            <div ref={outsideClickRef} className={` text-[18px]  md:hidden flex flex-col w-[50%] h-screen mt-[-12px] fixed bg-[#80A582] ${toggle ? `left-[0]` : `left-[-100%]`}`}>
                
                <Link onClick={()=>setToggle(!toggle)} href="/report_row_2" style={{ whiteSpace: 'nowrap' }} className='whiteSpace-nowrap mt-[15px]  px-4 py-2  text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>{t('Report results')}</Link>
                <Link onClick={()=>setToggle(!toggle)} href="/response_row_2" style={{ whiteSpace: 'nowrap' }} className='  px-4 py-2  text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>{t('Approve')}</Link>
                <Link onClick={()=>setToggle(!toggle)} href="/plan_row_2" style={{ whiteSpace: 'nowrap' }} className='  px-4 py-2  text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>{t('Plan')}</Link>
                <Link onClick={()=>setToggle(!toggle)} href="/meeting_row_2" style={{ whiteSpace: 'nowrap' }} className='  px-4 py-2  text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>{t('Meeting')}</Link>
                <Link onClick={()=>setToggle(!toggle)} href="/employee_row_2" style={{ whiteSpace: 'nowrap' }} className='  px-4 py-2  text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>{`${language === 'EN' ? 'Employee list' : 'รายชื่อพนักงาน'  }`}</Link>
                <Link onClick={()=>setToggle(!toggle)} href="/profile_row_2" style={{ whiteSpace: 'nowrap' }} className='  px-4 py-2  text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>{t('Profile')}</Link>
                
                <button onClick={logout}  className='   text-left px-4 py-2  text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>  {`${language === 'EN' ? 'log out' : 'ออกจากระบบ'  }`}</button>
                <button  className={` text-[16px]  text-white hover:text-[#5A985E] hover:bg-[#F5F5F5] px-4 py-2`} onClick={() => { toggleLanguage(); setToggle(!toggle); }}>
                  {language}
                </button> 
            </div>
        </div>
        </CompLanguageProvider>
    ) 
 }
 export default CompNavbar;

 
  