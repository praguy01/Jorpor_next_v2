'use client'

import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import '../globals.css'
import '@fontsource/ntr'
import axios from 'axios';
import { useRouter } from 'next/navigation';


export default  function CompLogin() {

  const router = useRouter();

  useEffect(() => {
    const storedEmployee = localStorage.getItem('rememberedEmployee');
    const storedPassword = localStorage.getItem('rememberedPassword');

    if (storedEmployee && storedPassword) {
      setFormData({ ...formData, employee: storedEmployee, password: storedPassword });
    }
  }, []);

  const [formData, setFormData] = useState({
    employee: '', 
    password: '', 
  });

  const [loginMessage, setLoginMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // เพิ่มตัวแปรสถานะ isLoading
  const [message, setMessage] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'employee') {
      localStorage.setItem('rememberedEmployee', value);
    }

    if (name === 'employee' && !value) {
      localStorage.removeItem('rememberedPassword');
    }

      setFormData({ ...formData, [name]: value });
    
  };

  const handleRememberPasswordChange = (e) => {
    setRememberPassword(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.employee || !formData.password) {
      setMessage('Please fill in all fields');
      setLoginMessage('');
      return;
    }

    try {


      const response = await axios.post('/api/login', 
      formData, {
        headers: { 'Content-Type': 'application/json' 
      }
        
      });

      const resdata = response.data;

      if (response.status === 200) {
        if (resdata.success === true) {
          console.log("DATA: ",resdata.profile[0]);
          localStorage.setItem('id', resdata.profile[0].id);
          console.log("LocalLogin: ",localStorage)
          setMessage('');
          setLoginMessage('');
          if (rememberPassword) {
            localStorage.setItem('rememberedPassword', formData.password);
          }



          setTimeout(() => {
            setIsLoading(true); 
              router.push(resdata.redirect); 
          }, 1000); 
        } else {
          setLoginMessage(resdata.error);
          setMessage('');
        }
      } else {
        setLoginMessage(resdata.error);
        setMessage('');
      }
    } catch (error) {
      console.error('Error login: ', error);
      setLoginMessage(error.message || 'An error occurred');
      setMessage('');
    } finally {
      setIsLoading(false); 
    }
  };

  
  

  return (
    
    <div className='fixed bg-[#F5F5F5] top-0 h-screen w-screen z-20 border '>
      <Head>
        <title>Jorpor</title>
      </Head>
        <div className='w-full bg-[#5A985E] fixed top-0 left-0 ' >
          <div className='container mx-auto flex justify-between  items-center py-2 px-4   w-screen font-ntr '>
            <div className='text-[#fff] font-bold text-[24px]' >
              <span>JorPor</span>

            </div>
            <div className='text-white font-ntr '>
                <Link href="/" className=' text-[20px] px-4 py-1 rounded-md text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>log out</Link>
          
            </div>
          </div>
          
        </div>
        <div className=' bg-[url("/bg1.png")] bg-cover bg-no-repeat  z-[-1] top-0 left-0 w-full h-full bg-center fixed  overflow-auto'>
          <div>
            <div className='mx-auto w-[360px] py-[140px] md:w-[570px]  md:py-[220px] text-black flex flex-col  bg-[#D1E6D3]/50 text-center rounded-[50px] mt-[180px] xs:w-[350px]'>
          </div>

          <div className='absolute inset-[0]'>
            <div>
              <div className='  mx-auto  w-[330px] py-[180px] md:w-[530px]  md:py-[260px] text-black flex flex-col  bg-[#D1E6D3]/50 text-center rounded-[50px] mt-[140px] xs:w-[350px]'>
            </div>
            <div>
              <div className='absolute inset-[0] container mx-auto px-4 z-10 items-center  font-ntr  '>
                <div className='mx-auto w-[300px]  md:w-[490px]  py-[30px] text-black flex flex-col  bg-[#D1E6D3] text-center rounded-[50px] mt-[106px] xs:w-[350px] '>
                  <div className='mt-[15px] md:mt-[30px]'>
                    <h1 className='  text-[22px] md:text-[40px] font-bold'>Login</h1>
                    <p className='  text-sm md:text-lg '>Sign in to continue</p>
                    <form onSubmit={handleSubmit}>
                      <p className='mt-[30px] text-left text-sm ml-[55px] md:ml-[87px]  md:mt-[40px] md:text-lg  '>Employee</p>
                      <input type="text" name="employee" value={formData.employee} onChange={handleInputChange} className='rounded-[20px]  pl-[15px]   w-[190px]  h-[25px] text-sm md:text-lg md:w-[323px] md:h-[41px]  '/>
                      <p className='text-left text-sm ml-[55px] md:ml-[87px] mt-[15px]  md:text-lg'>Password</p>
                      <input type="password"  name="password" value={formData.password} onChange={handleInputChange} className='rounded-[20px]  pl-[15px] w-[190px]  h-[25px] text-sm md:text-lg md:w-[323px] md:h-[41px] '/>



                      <div className='flex justify-center items-center text-sm text-center md:text-lg  mt-[15px]'>
                        <input type="checkbox" className='mr-[5px]' name="rememberPassword"  checked={rememberPassword} onChange={handleRememberPasswordChange} />
                        <p className='mr-[10px]'>Remember Password</p>
                        <Link href="/sendemail" className=' text-[#5A985E] '>Forgot Password?</Link>
                      </div >

                      {message && (
                        <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                          {message}
                        </p>
                      )}
                      {loginMessage && (
                        <p className=' mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                          {loginMessage}
                        </p>
                      )}

                      <button  className='  mt-[60px] text-sm md:text-[20px] md:mt-[100px]  border-[#5A985E] bg-[#5A985E] px-10  py-1 md:py-2 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 '>Login</button>
                      

                      <div className='flex justify-center items-center text-center text-sm md:text-lg   mt-[15px]' >
                        
                        <p className='mr-[10px] '>Don't Have an Account? </p>
                        <Link href="/register" className=' text-[#5A985E] '>sign in</Link>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  )
}


