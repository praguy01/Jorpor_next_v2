'use client'

import React, { useState , useEffect} from 'react';
import Link from 'next/link';
import bcrypt from 'bcryptjs'; 
import axios from 'axios';

const hashPassword = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export default function CompRegister() {
  const [PINconfirm, setPINconfirm] = useState(''); // Initialize the email state


 

  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    position: '',
    employee: '',
    password: '',
  });

  const [formDataConfirm, setFormDataConfirm] = useState({
    PIN1: '',
    PIN2: '',
    PIN3: '',
    PIN4: '',
    PIN5: '',
    PIN6: '',
  });

  const [registrationMessage, setRegistrationMessage] = useState('');
  const [registrationMessagePass, setRegistrationMessagePass] = useState('');
  const [message, setMessage] = useState('');  
  const [messagepop, setMessagepop] = useState('');
  const [isLoading, setIsLoading] = useState(false); // เพิ่มตัวแปรสถานะ isLoading
  const [isLoadingSingin, setIsLoadingSingin] = useState(false); // เพิ่มตัวแปรสถานะ isLoading
  const [showPopup, setShowPopup] = useState(false);
  const [messagePass, setMessagePass] = useState('');
  const [PIN, setPIN] = useState(''); // Initialize the email state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$<[^>]*>/;
  
    if (emailRegex.test(formData.email)) {
      setMessage('Please enter a valid email address');
      setRegistrationMessage('');
      setRegistrationMessagePass('');

      return;
    }
  
    if (!formData.name || !formData.last_name || !formData.email || !formData.position || !formData.employee || !formData.password) {
      setMessage('Please fill in all fields');
      setRegistrationMessage('');
      setRegistrationMessagePass('');

      return;
    }
  
    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters');
      setRegistrationMessage('');
      setRegistrationMessagePass('');

      return;
    }
  
    try {
      const hashedPassword = await hashPassword(formData.password);
      const requestData = {
        ...formData,
        password: hashedPassword,
      };
  
      console.log('Submitted Data:', requestData);
      
      const data = JSON.stringify(requestData);
      
      const response = await axios.post('/api/register', {
        data
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      const resdata = response.data; 

      console.log("RESDATA: ",resdata)
      console.log("response.status: ",response.status);
      console.log("response.error: ",resdata.error);

      if (response.status === 200) {
        const resdata = response.data;
    
        if (resdata.success === true) {
          localStorage.setItem('PINconfirm', resdata.PINconfirm);
            setTimeout(() => {
              setIsLoadingSingin(true); // เริ่มแสดง Loading
              setShowPopup(true);
            }, 500); // รอ 1 วินาทีก่อนเปลี่ยนหน้า
              
            

          // setRegistrationMessage('');
          // setRegistrationMessagePass("Already registered.");
          // setTimeout(() => {
          //   setIsLoading(true); // เริ่มแสดง Loading
          //   window.location.href = resdata.redirect;
          // }, 1000); // รอ 1 วินาทีก่อนเปลี่ยนหน้า
        } else {
          setRegistrationMessage(resdata.error);
          setMessage('');
          setRegistrationMessagePass('');

        }
      } else {
        setRegistrationMessage(resdata.error);
        setMessage('');
        setRegistrationMessagePass('');

      }
    } catch (error) {
      console.error('Error registering: ', error);
      setRegistrationMessage(error);
      setMessage('');
      setRegistrationMessagePass('');

    } finally {
      setIsLoading(false); // สิ้นสุดแสดง Loading
    }
  
  }

  const handleConfirmChange = (e) => {
      const storedPIN = localStorage.getItem('PINconfirm');
      if (storedPIN) {
        setPINconfirm(storedPIN); 
      }    
      console.log("LOCAL: ", localStorage);
    
    const { name, value } = e.target;
    console.log("PIDindex: ",{ name, value })
    setFormDataConfirm({ ...formDataConfirm, [name]: value });
    console.log("setPIN: ",{ ...formDataConfirm, [name]: value })
  
    // ตรวจสอบถ้าความยาวของ value ถึง maxLength
    if (value.length === e.target.maxLength) {
      // หาชื่อ input ถัดไป
      const currentInputNumber = parseInt(name.substring(3));
      const nextInputNumber = currentInputNumber + 1;
  
      // สร้างชื่อของ input ถัดไป
      const nextInputName = `PIN${nextInputNumber}`;
  
      // หา DOM element ของ input ถัดไป
      const nextInput = document.querySelector(`[name="${nextInputName}"]`);
  
      // ถ้ามี input ถัดไปให้ focus ลงไป
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    console.log("formdataconfirm: ",formDataConfirm)

   
    try {
      const hashedPassword = await hashPassword(formData.password);
      const combinedCode = `${formDataConfirm.PIN1}${formDataConfirm.PIN2}${formDataConfirm.PIN3}${formDataConfirm.PIN4}${formDataConfirm.PIN5}${formDataConfirm.PIN6}`;
      const requestData = {
        PIN_confirm: combinedCode,
        PIN: PINconfirm,
      };
      const requestDataUser = {
        ...formData,
        password: hashedPassword,
      };

      const listData = {requestData ,requestDataUser, confirm: true}
      const data = JSON.stringify(listData);
      console.log("FROM_DATA: ",data)


      const response = await axios.post('/api/register', 
      data, {
        headers: { 'Content-Type': 'application/json' 
      }
        
      });
     
      const resdata = response.data;
      console.log("RESDATA: ",resdata)
      if (response.status === 200) {
        if (resdata.success === true) {
          setMessagePass(resdata.message);
          setMessagepop('');

          setTimeout(() => {
            setIsLoading(true); 
            window.location.href = resdata.redirect;
          }, 1000); 
        } else {
          console.log("RESDATA error: ", resdata.error);
          setMessagepop(resdata.error);
        }
      } else {
        setMessagepop('เกิดข้อผิดพลาด1: ' + resdata.error);
      }
    } catch (error) {
      console.errorpop('เกิดข้อผิดพลาด2:', error);
      setMessage('เกิดข้อผิดพลาด2');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div >
      <div className='w-full bg-[#5A985E] fixed top-0 left-0 '>
        <div className='container mx-auto flex justify-between items-center py-2 px-4 w-screen  '>
          <div className='text-[#fff] font-bold text-[24px]'>
            <Link href="login">JorPor</Link>
          </div>
          {/* <div className='text-white font-ntr '>
            <Link href="/" className='text-[20px] px-4 py-1 rounded-md text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>log out</Link>
          </div> */}
        </div>
      </div>
      <div>

        <div className='bg-[url("/bg1.png")] bg-cover bg-no-repeat z-[-1] top-0 left-0 w-full h-full bg-center fixed overflow-auto'>

            <div className='mx-auto w-[360px] py-[145px] md:w-[570px] md:py-[220px] text-black flex flex-col bg-[#D1E6D3]/50 text-center rounded-[50px] mt-[180px]'>

            </div>
            <div className='absolute inset-[0]'>
              <div>
                <div className='mx-auto w-[330px] py-[185px] md:w-[530px] md:py-[260px] text-black flex flex-col bg-[#D1E6D3]/50 text-center rounded-[50px] mt-[140px] '>

                </div>
                <div>
                  <div className='absolute inset-[0]  container mx-auto px-4 z-10 items-center'>
                    <div className='mx-auto w-[300px] md:w-[490px] py-[30px] text-black flex flex-col bg-[#D1E6D3] text-center rounded-[50px] mt-[106px] '>
                      <div className='mt-[15px] md:mt-[30px] '>
                        <h1 className='text-[20px]  md:text-[25px] font-bold'>Create New Account</h1>
                        <div className='flex justify-center items-center text-[12px] md:text-[16px] mt-2'>
                          <div className='mr-2'>Already Registered?</div>
                          <Link href="/login" className='text-[#5A985E]'>Log in</Link>
                        </div>
                        <form onSubmit={handleSubmit}>
                        <div className='flex justify-center items-center text-[12px] md:text-[16px] mt-2'>
                          <div className='mr-2 '>
                            <p className='mt-4 text-left text-[11px] md:text-[16px] ml-[10px]'>Name</p>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className='rounded-[50px] pl-2  text-sm md:text-lg w-[100px]  h-[25px]  md:w-[211px] md:h-[41px]' />
                          </div>
                          <div>
                            <p className='mt-4 text-left text-[11px] md:text-[16px] ml-[10px]'>Last Name</p>
                            <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className='rounded-[50px]  pl-2  text-sm md:text-lg w-[100px]  h-[25px]  md:w-[211px] md:h-[41px]' />
                          </div>
                        </div>
                        <p className='text-left text-[11px] ml-[55px] md:ml-[40px] mt-[15px] md:text-[16px]'>Email</p>
                        <input type="text" name="email" value={formData.email} onChange={handleInputChange} className='rounded-[20px]  pl-[15px] w-[210px]  h-[25px] text-sm md:text-lg md:w-[430px] md:h-[41px]' />
                        <div className='flex justify-center items-center  text-[11px] md:text-[20px]   mt-[5px]' >
                          <div className='mr-[10px]'>
                            <p className='text-left text-[11px] ml-[10px] md:ml-[10px] mt-[15px]  md:text-[16px]'>Position</p>
                            <select id="dropdown" name="position" value={formData.position} onChange={handleInputChange} className='rounded-[20px]  pl-[15px] w-[100px]  h-[25px] text-[11px] md:text-[16px] md:w-[211px] md:h-[41px] ' >
                              <option value="">Select an option</option>
                              {/* <option value="Safety Officer Professional level">Professional level</option>
                              <option value="Safety Officer Technical level">Technical level</option> */}
                              <option value="Safety Officer Supervisory level">Supervisory level</option>
                            </select>
                          </div>
                          <div>
                            <p className='text-left text-[11px] ml-[10px] md:ml-[10px] mt-[15px]  md:text-[16px]'>Employee</p>
                            <input type="text" name="employee" value={formData.employee} onChange={handleInputChange} className='rounded-[20px]  pl-[15px] w-[100px]  h-[25px] text-sm md:text-lg md:w-[211px] md:h-[41px]' />
                          </div>
                        </div>
                        <p className="text-left text-[11px] ml-[55px] md:ml-[40px] mt-[15px] md:text-[16px]">Password</p>
                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="rounded-[20px]  pl-[15px] w-[210px] h-[25px] text-[12px] md:text-[16px] md:w-[430px] md:h-[41px]" />
                        <div className='flex flex-col'>
                        


                          {message && (
                            <p className='mt-3 text-red-500 text-[11px] py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-[16px] md:mt-[30px]'>
                              {message}
                            </p>
                          )}
                          {registrationMessage && (
                            <p className=' mt-3 text-red-500 text-[11px] py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-[16px] md:mt-[30px]'>
                              {registrationMessage}
                            </p>
                          )}
                          {registrationMessagePass && (
                            <div className=' mt-3 text-green-600 text-[11px] py-2 bg-[#ACE9A7] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-[16px] md:mt-[30px]'>
                              {registrationMessagePass}
                            </div>
                            
                          )}
                          
                          <button type="submit" className="mx-auto w-[100px] mt-5 text-[12px] md:text-lg md:mt-8 border-[#5A985E] bg-[#5A985E] px-4 py-1 md:py-2 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200">
                            Sign in
                          </button>
                        </div>
                        {isLoadingSingin && (
                          <div className='flex mx-auto  mt-[15px] ' >
                            <div className="mx-auto mt-[15px]  mr-[3px] inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                            </div>
                            <p className="mx-auto mt-[14px] md:mt-[10px] ml-[3px] md:ml-[5px] font-ntr text-sm md:text-lg">Loading...</p>
                          </div>
                        )}
                        </form>
                        {showPopup && (
                          <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="bg-[#91C194] rounded-[30px] p-4 border-[#5A985E] shadow-lg">
                              <form onSubmit={handleConfirmSubmit}>
                                <div className='mt-10 md:mt-20 '>
                                  <p className='text-[13px]'>Please enter the verification code sent to your email.</p>
                          
                                  <div className="flex ml-[10px] ">
                                  {[1, 2, 3, 4, 5, 6].map((index) => (
                                    <input
                                      key={index}
                                      type="number"                                
                                      name={`PIN${index}`}
                                      value={formDataConfirm[`PIN${index}`]}
                                      onChange={handleConfirmChange}
                                      className="mt-[20px] text-center w-[30px] h-[30px] text-lg md:text-lg md:w-[50px] md:h-[50px] md:ml-[18px] mx-2"
                                      maxLength={1}
                                    />
                                  ))}
                    
                                  </div>   
                                  <div className='flex flex-col  mt-[40px]'>
                                  <div>
                                  {messagepop && (
                                    <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[340px] mx-auto md:text-lg md:mt-[30px]'>
                                      {messagepop}
                                    </p>
                                  )}
                                  {messagePass && (
                                    <p className=' mt-3 text-green-600 text-xs py-2 bg-[#ACE9A7] rounded-[10px] inline-block px-4 w-[210px] md:w-[340px] mx-auto md:text-lg md:mt-[30px]'>
                                      {messagePass}
                                    </p>
                                  )}     
                                  </div>
                                 <div>
                                    <button onClick={handleConfirmSubmit} className=" mx-auto mb-[10px] w-[100px] mt-[10px] md:mt-[240px] text-[12px] md:text-[16px]  border-[#5A985E] bg-[#5A985E] px-4 py-1 md:py-2 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200">Comfirm</button>
                                  </div>
                                  </div>
                                  </div>
                                {isLoading && (
                              <div className='flex mx-auto  mt-[15px] ' >
                                <div className="mx-auto mt-[15px]  mr-[3px] inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                                </div>
                                <p className="mx-auto mt-[14px] md:mt-[10px] ml-[3px] md:ml-[5px] font-ntr text-sm md:text-lg">Loading...</p>
                              </div>
                            )}
                            </form>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

      </div>

    </div>
  );
}


