'use client'
import '@fontsource/ntr'
import '../globals.css'
import '@fontsource/mitr';
import '@fontsource/athiti';
import '@fontsource/prompt';
import '@fontsource/noto-sans-thai';

import CompNavbar from './compNavbar';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { CompLanguageProvider, useLanguage } from './compLanguageProvider';


// function CompNotifyForm() {
//   return (
//     <CompLanguageProvider>
//       <CompNotifyForm />
//     </CompLanguageProvider>
//   );
// }

function CompNotifyForm({ onSubmit }) {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    title: '',
    employee: '',
    location: '',
    work_owner: '',
    status: '',
    dateTime: '',
    file: null,
    detail: '',
  });

  const [uploadedImage, setUploadedImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'file' ? files[0] : value, // แก้ชื่อฟิลด์เป็น 'file'
    });
  };



  const handleSubmit = async () => {
    if (
      formData.title === '' ||
      formData.employee === '' ||
      formData.location === '' ||
      formData.work_owner === '' ||
      formData.status === '' ||
      formData.dateTime === '' ||
      formData.file === null ||
      formData.detail === ''
    ) {
      setMessage('Please fill out all required fields.');
    } else {
    const isSuccess = await onSubmit(formData);
      console.log("formData: ",formData)
    if (isSuccess) {
      setMessage('');
    } else {
      setMessage('An error occurred while submitting the data.');
    }
  }
  };

    
  return (
    <div>
      
      <CompNavbar/>
        
      <div className=' bg-[url("/bg1.png")]  overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
        <div className='md:w-[1000px] mx-auto '>
          <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
             <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
          </div>

          <div className='mx-auto w-[300px] md:w-[800px] font-ntr mb-[50px]  py-[30px] text-black flex flex-col  bg-[#FFF] text-center md:rounded-[50px] rounded-[30px] mt-[106px]  '>
          
          

                <div className='md:mt-[30px]'>
                  <div className= {`items-center md:px-10    ${language === 'EN' ? ' font-ntr ' : ' font-mitr  ' } `  }    >
                  <input type="text" placeholder={t('Topic')} name="title" value={formData.title} onChange={handleInputChange} className= {` ${language === 'EN' ? ' font-ntr md:text-[18px] text-[15px] ' : ' font-mitr md:text-[17px] text-[14px] ' } rounded-[10px] p-4 mt-[5px] ml-[-70px]  w-[180px] h-[29px] md:ml-[-160px]    items-center md:w-[560px] md:h-[40px] bg-[#F5F5F5]   `  }/>
                </div>
                

                <div className="mt-[10px] border-t border-gray-300"></div> 
              </div>

              <div className='font-ntr px-2 flex items-center mx-auto w-[250px]  md:ml-[40px] md:w-[720px]  py-[20px] text-black bg-[#F5F5F5] text-center mt-[15px] rounded-[20px]'>
                <div   className={`${language === 'EN' ? ' font-ntr text-sm  md:text-[18px]' : ' font-mitr  text-[14px] '  }    rounded-[10px] w-[235px] md:w-[600px] py-2 md:py-4 bg-[#F5F5F5] ml-[5px] md:ml-[40px] `} >
                  
                    <div className='flex px-3 items-center '>
                        <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]' >{t('Employee')}</p>
                        <p className='pl-2'>:</p>
                        <input type="text" name="employee" value={formData.employee} onChange={handleInputChange} className=  {`${language === 'EN' ? ' font-ntr text-[14px]' : ' font-mitr text-[12px] '  } rounded-[2px]  items-center p-2 mt-[-2px] md:ml-[15px] ml-[10px] w-[100px] h-[20px] md:text-[17px]  md:w-[200px] md:h-[20px] bg-[#D9D9D9] `}/>
                    </div>
                        
                    <div className='flex px-3  mt-[5px]  items-center'>
                        <p className='text-[#000] text-left    w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px] '>{t('Location')}</p>
                        <p className='pl-2'>:</p>
                        <input type="text" name="location" value={formData.location} onChange={handleInputChange} className= {`${language === 'EN' ? ' font-ntr text-[14px]' : ' font-mitr text-[12px] '  } rounded-[2px]  items-center p-2 mt-[-2px] md:ml-[15px] ml-[10px] w-[100px] h-[20px] md:text-[17px]  md:w-[200px] md:h-[20px] bg-[#D9D9D9]  `}/>
                    </div>
                   
                    <div className='flex px-3  mt-[5px]  items-center'>
                        <p className='text-[#000] text-left  w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>{language === 'EN' ? ' Work Owner' : 'ผู้ดูเเล'  } </p>
                        <p className='pl-2'>:</p>
                        <input type="text" name="work_owner" value={formData.work_owner} onChange={handleInputChange} className={`${language === 'EN' ? ' font-ntr text-[14px]' : ' font-mitr text-[12px] '  } rounded-[2px]  items-center p-2 mt-[-2px] ml-[10px] md:ml-[15px] w-[100px] h-[20px] md:text-[17px] md:w-[200px] md:h-[20px] bg-[#D9D9D9]  `}/>
                    </div>
                   
                    <div className='flex px-3 mt-[5px]  items-center'>
                        <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>{t('Status')}</p>
                        <p className='pl-2'>:</p>
                        <select id="dropdown" name="status"  value={formData.status} onChange={handleInputChange}  className={`${language === 'EN' ? ' font-ntr md:text-[17px]' : ' font-mitr text-[13px]'  } items-center  rounded-[2px]  md:ml-[15px] pl-1 mt-[-2px] ml-[10px] w-[100px] h-[20px]  md:w-[200px] md:h-[20px] bg-[#D9D9D9]  `} >
                              <option  >{`${language === 'EN' ? ' Select an option' : ' เลือกตัวเลือก'  }`}</option>
                              {/* <option  value={`${language === 'EN' ? ' Safety Officer Supervisory level' : 'ระดับหัวหน้า'  }`}>{language === 'EN' ? 'Supervisory level' : 'ระดับหัวหน้า'  }</option>
                              <option value={language === 'EN' ? "Safety Officer Technical level" : 'ระดับเทคนิค'  }>{language === 'EN' ? 'Technical level' : 'ระดับเทคนิค'  }</option>
                              <option value={language === 'EN' ? '"Safety Officer Supervisory level"' : 'ระดับบริหาร'  }>{language === 'EN' ? 'Supervisory level' : 'ระดับบริหาร'  }</option> */}
                              <option  value=' Professional level'> Professional level</option>
                              <option value='Technical level'>Technical level</option>
                              <option value='Supervisory level'>Supervisory level</option>
                        </select>
                    </div>
                    
                    <div className='flex px-3  mt-[5px] items-center'>
                        <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>{t('Date')}</p>
                        <p className='pl-2'>:</p>
                        <input
                            type="datetime-local"
                            name="dateTime"
                            value={formData.dateTime}
                            onChange={handleInputChange}
                            className={`${language === 'EN' ? ' font-ntr md:text-[17px]' : ' font-mitr text-[11px]'  } rounded-[2px]  items-center md:ml-[15px] pl-1 mt-[-2px] ml-[10px] w-[100px] h-[20px]  md:w-[200px] md:h-[20px] bg-[#D9D9D9] `}
                          />                    
                        </div>
                   
                    </div>
                    </div>

                    <div className=' mx-auto w-[250px]  md:w-[705px] justify-center'>
                      <p className=  {`${language === 'EN' ? 'ml-[5px] font-ntr text-[14px] md:text-[17px]  ' : ' font-mitr text-[13px] md:text-[16px]  '  } text-[#808080]  md:mt-[20px] mt-[10px]   text-left  `}>  {`${language === 'EN' ? ' add a photo' : ' เพิ่มรูปภาพ'  }`}</p>
                      <input type="file" name="file" onChange={handleInputChange} className="w-[248px]  md:w-[710px] py-1 px-2 border  mt-[5px] md:mt-[5px]  border-gray-300  p-4 rounded-lg "></input>
                    </div>

      

                <div className=' mx-auto w-[250px]  md:w-[705px] justify-center'>
                    <p className=  {`${language === 'EN' ? ' ml-[5px] font-ntr text-[14px] md:text-[17px]  ' : ' font-mitr text-[13px] md:text-[17px]  '  } text-left text-[#808080]   md:mt-[20px] mt-[10px]    `}>{`${language === 'EN' ? 'details' : 'รายละเอียด'  }`}</p>
                    <textarea type="text" name="detail" value={formData.detail} onChange={handleInputChange} className='rounded-[10px] mt-[5px] pl-[15px] w-[250px]  text-[14px]  h-[100px] md:text-[16px] md:w-[705px] md:h-[80px] bg-[#fff] border border-gray-300  p-4 '/>
                </div>
              

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

                <div className='flex items-center md:px-10  md:mt-[20px]' >
                  {/* <button type= "submit" href="/NotifyTwo" className=' mt-[20px] text-md md:text-[20px] md:ml-[480px] border-[#64CE3F] bg-[#64CE3F] px-10  py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 '>Submit</button> */}
                    <button type='submit' onClick={handleSubmit} className=  {`${language === 'EN' ? ' font-ntr text-md' : ' font-mitr text-[15px] '  }  mt-[20px]  md:text-[20px] md:ml-[280px] ml-[85px] border-[#64CE3F] bg-[#64CE3F] px-10  py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 `}>{t('confirm')}</button>
                   
                   
                </div>
              {/* </form> */}
              
        

          </div> 
          </div>
        </div>
        </div>
    ) 
 }

 export default  CompNotifyForm;