'use client'

import React, { useState } from 'react';
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
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    position: '',
    employee: '',
    password: '',
  });

  const [registrationMessage, setRegistrationMessage] = useState('');
  const [registrationMessagePass, setRegistrationMessagePass] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // เพิ่มตัวแปรสถานะ isLoading


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
          setRegistrationMessage('');
          setRegistrationMessagePass("Already registered.");
          setTimeout(() => {
            setIsLoading(true); // เริ่มแสดง Loading
            window.location.href = resdata.redirect;
          }, 1000); // รอ 1 วินาทีก่อนเปลี่ยนหน้า
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

  return (
    <div >
      <div className='w-full bg-[#5A985E] fixed top-0 left-0 '>
        <div className='container mx-auto flex justify-between items-center py-2 px-4 w-screen font-ntr '>
          <div className='text-[#fff] font-bold text-[24px]'>
            <span>JorPor</span>
          </div>
          <div className='text-white font-ntr '>
            <Link href="/" className='text-[20px] px-4 py-1 rounded-md text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>log out</Link>
          </div>
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
                  <div className='absolute inset-[0] container mx-auto px-4 z-10 items-center font-ntr'>
                    <div className='mx-auto w-[300px] md:w-[490px] py-[30px] text-black flex flex-col bg-[#D1E6D3] text-center rounded-[50px] mt-[106px] '>
                      <div className='mt-[15px] md:mt-[30px] '>
                        <h1 className='text-[22px] md:text-[40px] font-bold'>Create New Account</h1>
                        <div className='flex justify-center items-center text-sm md:text-[20px] mt-2'>
                          <div className='mr-2'>Already Registered?</div>
                          <Link href="/login" className='text-[#5A985E]'>Log in</Link>
                        </div>
                        <form onSubmit={handleSubmit}>
                        <div className='flex justify-center items-center text-sm md:text-lg mt-2'>
                          <div className='mr-2 '>
                            <p className='mt-4 text-left text-xs md:text-lg ml-[10px]'>Name</p>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className='rounded-[50px] pl-2  text-sm md:text-lg w-[100px]  h-[25px]  md:w-[211px] md:h-[41px]' />
                          </div>
                          <div>
                            <p className='mt-4 text-left text-xs md:text-lg ml-[10px]'>Last Name</p>
                            <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className='rounded-[50px]  pl-2  text-sm md:text-lg w-[100px]  h-[25px]  md:w-[211px] md:h-[41px]' />
                          </div>
                        </div>
                        <p className='text-left text-xs ml-[55px] md:ml-[40px] mt-[15px] md:text-lg'>Email</p>
                        <input type="text" name="email" value={formData.email} onChange={handleInputChange} className='rounded-[20px]  pl-[15px] w-[210px]  h-[25px] text-sm md:text-lg md:w-[430px] md:h-[41px]' />
                        <div className='flex justify-center items-center  text-xs md:text-[20px]   mt-[5px]' >
                          <div className='mr-[10px]'>
                            <p className='text-left text-xs ml-[10px] md:ml-[10px] mt-[15px]  md:text-lg'>Position</p>
                            <select id="dropdown" name="position" value={formData.position} onChange={handleInputChange} className='rounded-[20px]  pl-[15px] w-[100px]  h-[25px] text-xs md:text-lg md:w-[211px] md:h-[41px] ' >
                              <option value="">Select an option</option>
                              <option value="Safety Officer Professional level">Professional level</option>
                              <option value="Safety Officer Technical level">Technical level</option>
                              <option value="Safety Officer Supervisory level">Supervisory level</option>
                            </select>
                          </div>
                          <div>
                            <p className='text-left text-xs ml-[10px] md:ml-[10px] mt-[15px]  md:text-lg'>Employee</p>
                            <input type="text" name="employee" value={formData.employee} onChange={handleInputChange} className='rounded-[20px]  pl-[15px] w-[100px]  h-[25px] text-sm md:text-lg md:w-[211px] md:h-[41px]' />
                          </div>
                        </div>
                        <p className="text-left text-xs ml-[55px] md:ml-[40px] mt-[15px] md:text-lg">Password</p>
                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="rounded-[20px]  pl-[15px] w-[210px] h-[25px] text-sm md:text-lg md:w-[430px] md:h-[41px]" />
                        <div className='flex flex-col'>
                          {message && (
                            <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                              {message}
                            </p>
                          )}
                          {registrationMessage && (
                            <p className=' mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                              {registrationMessage}
                            </p>
                          )}
                          {registrationMessagePass && (
                            <div className=' mt-3 text-green-600 text-xs py-2 bg-[#ACE9A7] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                              {registrationMessagePass}
                            </div>
                            
                          )}
                          
                          <button type="submit" className="mx-auto w-[100px] mt-5 text-sm md:text-lg md:mt-8 border-[#5A985E] bg-[#5A985E] px-4 py-1 md:py-2 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200">
                            Sign in
                          </button>
                        </div>
                        {isLoading && (
                          <div className='flex mx-auto  mt-[15px] ' >
                            <div class="mx-auto mt-[15px]  mr-[3px] inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                            </div>
                            <p class="mx-auto mt-[14px] md:mt-[10px] ml-[3px] md:ml-[5px] font-ntr text-sm md:text-lg">Loading...</p>
                          </div>
                        )}
                        </form>
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


