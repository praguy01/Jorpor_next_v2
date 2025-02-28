'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import '../globals.css';
//import 'bootstrap/dist/css/bootstrap.min.css';
import liff from '@line/liff';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import '@fontsource/mitr'
import Link from 'next/link';
import { MdToken } from 'react-icons/md';

export default function LoginLine() {
  const router = useRouter();

  // สถานะสำหรับเก็บข้อมูลจากฟอร์ม
  const [formData, setFormData] = useState({
    employee: '', 
    password: '', 
    profileImage: '/img/profile.jpg',
    displayName: '',
    userId: ''
  });

  const [loginMessage, setLoginMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    liff.init({ liffId: '2005924494-qpprzL9W' }).then(() => {
      if (liff.isLoggedIn()) {
        liff.getProfile().then(profileData => {
          setProfile({
            profileImage: profileData.pictureUrl,
            displayName: profileData.displayName,
            userId: profileData.userId
          });
        });
      } else {
        //liff.login();
      }
    }).catch(err => {
      console.error('LIFF init error', err);
    });

    const TOKEN = localStorage.user_login;
    if (TOKEN) {
      try {
        const base64Url = TOKEN.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const Token = JSON.parse(atob(base64));

        const expDate = new Date(Token.exp * 1000);
        const iatDate = new Date(Token.iat * 1000);

        if (expDate.getTime() >= new Date().getTime()) {
          const employee = Token.employee;
          const password = Token.password;
          const oldTokemExp = Token.exp;
          const editedData = { employee, password, oldTokemExp, remember: true };
          const data = JSON.stringify(editedData);

          axios.post('/api/login', data, {
            headers: { 'Content-Type': 'application/json' }
          })
          .then(response => {
            const resdata = response.data;
            if (response.status === 200 && resdata.success) {
              const token = response.data.token;
              localStorage.setItem('user_login', token);
              setTimeout(() => {
                setIsLoading(true);
                router.push(resdata.redirect);
              }, 1000);
            }
          })
          .catch(error => {
            console.error('Error when using the token:', error);
          });
        } else {
          localStorage.clear();
          const rememberedData = localStorage.getItem('rememberedData');
          if (rememberedData) {
            localStorage.setItem('rememberedData', rememberedData);
          }
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    const rememberedData = localStorage.getItem('rememberedData');
    if (rememberedData) {
      const rememberedDataArray = JSON.parse(rememberedData);
      if (rememberedDataArray.length > 0) {
        const lastItem = rememberedDataArray[rememberedDataArray.length - 1];
        setFormData((prevFormData) => ({ ...prevFormData, employee: lastItem.employee, password: lastItem.password }));
      }
    }
  }, [setFormData,router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginMessage('')
  
    if (name === 'employee') {
      
        const rememberedData = localStorage.getItem('rememberedData');
        if (rememberedData) {
          const rememberedDataArray = JSON.parse(rememberedData);
          for (const item of rememberedDataArray) {
            if (item.hasOwnProperty('employee')) {
              if (value === item.employee) {
                setFormData({ employee: value, password: item.password });
                return; 
              }
            }
          }
        setFormData({ employee: value, password: '' });
      } else {
        setFormData({ ...formData, employee: value, password: formData.password  });
      }

    } else if (name === 'password') {
      setFormData({ ...formData, [name]: value, employee: formData.employee });
    }
  };


  const handleSubmit = async(e)=>{
    e.preventDefault();
    setLoginMessage('');
    setIsLoading(true);

    console.log('Form Data:', formData);
    

    if(!formData.employee || !formData.password){
      setLoginMessage('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    try{
    
      //const employee =  Token.employee;
      //const password =  Token.password;

      const loginData = {
        employee: formData.employee,
        password: formData.password,
        profileImage: profile.profileImage,
        displayName: profile.displayName,
        userId: profile.userId
      };
      
      console.log('Sending data:', loginData); // Debugging line

      const response = await fetch('/api/login',{
        method: 'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify(loginData),
    });

    const resdata = await response.json();
    //const token = localStorage.getItem('user_login')

    console.log('Received data:', resdata); // Debugging line

    if(response.status === 200 && resdata.success){
      const token = resdata.data.token;
      localStorage.setItem('user_login', token);
      router.push(resdata.redirect);
    }else{
      setLoginMessage(resdata.error);
    }

  }catch(error){
    console.error('Error login: ', error);
    setLoginMessage('Login error, please try again later');
  }
  };

return(
  <div className='fixed bg-[#F5F5F5] top-0 h-screen w-screen z-20 border'>
    <Head>
        <title>Jorpor</title>
      </Head>
      <div className='w-full bg-[#5A985E] fixed top-0 left-0 ' >
          <div className='container mx-auto flex justify-between  items-center py-2 px-4   w-screen  '>
            <div className='text-[#fff] font-bold text-[24px]' >
              <span>JorPor</span>
            </div>           
          </div>         
        </div>
        <div className=' bg-[url("/bg1.png")] bg-cover bg-no-repeat  z-[-1] top-0 left-0 w-full h-full bg-center fixed  overflow-auto'>
       <div>
            <div className='mx-auto w-[360px] py-[140px] md:w-[570px]  md:py-[220px] text-black flex flex-col  bg-[#D1E6D3]/50 text-center rounded-[50px] mt-[180px] '>    
        </div>
        <div className='absolute inset-[0]'>
          <div>
              <div className='  mx-auto  w-[330px] py-[180px] md:w-[530px]  md:py-[260px] text-black flex flex-col  bg-[#D1E6D3]/50 text-center rounded-[50px] mt-[140px]  '>
            </div>
            <div>
              <div className='absolute inset-[0] container mx-auto px-4 z-10 items-center  '>
              <div className='mx-auto w-[300px]  md:w-[490px]  py-[50px] text-black flex flex-col  bg-[#D1E6D3] text-center rounded-[50px] mt-[106px]  '>
                <div className='mt-[15px] md:mt-[30px]'>
                  <h1 className='text-[20px] md:text-[25px] font-bold'>Login</h1>
                  <p className='text-[12px] md:text-[16px]'>Sign in to continue</p>
                  <img src={profile.profileImage} alt='Profile Image' className='mx-auto mb-4 w-[100px] h-[100px] rounded-full' />
                 <p className='text-[12px] md:text-[16px]'>{profile.displayName}</p>
                 <form onSubmit={handleSubmit}>
                      <div className='mt-[30px] text-left text-[12px] ml-[55px] md:ml-[87px]  md:mt-[40px] md:text-[16px] '>
                      <input 
                    type='text'  
                    name='employee'
                    placeholder='Employee ID' 
                    value={formData.employee}
                    onChange={handleInputChange}
                    className='rounded-[20px] pl-[15px] w-[190px] h-[25px] text-[12px] md:text-[16px] md:w-[323px] md:h-[41px]'/>
                      </div>
                      <div className='mt-[20px] mb-3 text-left text-[10px] ml-[55px] md:ml-[87px] md:mt-[30px] md:text-[16px]'>
                      <input 
                    type='password' 
                    name='password'
                    placeholder='Enter Password' 
                    value={formData.password}
                    onChange={handleInputChange}
                    className='rounded-[20px] pl-[15px] w-[190px] h-[25px] text-[12px] md:text-[16px] md:w-[323px] md:h-[41px]'/>
                      </div>
                      <button className='btn btn-success bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded'>Login</button>
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
//qexport default loginLine