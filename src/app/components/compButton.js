'use client';
import React from 'react';
import '@fontsource/mitr';
import { PiHandTapBold } from "react-icons/pi";
import axios from 'axios';

export default function NotifyButton() {
  const handleButtonClick = async () => {
    console.log('Button clicked!');

    // Get the current date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();

    // Prepare data to be sent in the POST request
    const requestData = {
      date: formattedDate,
      time: formattedTime,
      location: 'zone A' // You can replace this with the actual location value
    };

    try {
      // Make a POST request to the API endpoint
    //   const response = await fetch('https://platform-jorpor.vercel.app/api/emergency_notify', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Origin': 'https://button-emergency-jorpot.vercel.app',
    //         // 'mode': 'cors', // ไม่จำเป็นต้องใส่
    //     },
    //     body: JSON.stringify(requestData),
    //     });

    const data =  JSON.stringify(requestData);
    console.log('requestData:',data);

    const response = await fetch('https://platform-jorpor.vercel.app/api/emergency_notify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // ไม่ต้องระบุ 'Origin' ใน headers
        },
        body: JSON.stringify(data),
    });



      

      // Log the response
      console.log('Response:', response);

      if (response.ok) {
        console.log('Emergency notification sent successfully!');
      } else {
        console.error('Failed to send emergency notification');
      }
    } catch (error) {
      console.error('Error sending emergency notification:', error);
    }
  };

  return (
    <div className='bg-gray-200 overflow-auto bg-cover bg-no-repeat z-[-1] top-0 left-0 w-full h-full bg-center fixed'>
      <div className='absolute top-10 left-1/2 transform -translate-x-1/2 text-center mt-[50px] md:mt-[20px]'>
        <div className="text-[#000] md:text-5xl text-[30px]  w-[500px] md:w-[800px] ">Having an Emergency?</div>
        <div className="text-[#A6A6A6] md:text-3xl text-[20px] ">Press the button below.</div>
      </div>

      <div className="flex items-center justify-center md:mt-[50px] h-full">
        <div className="w-[250px] h-[250px]  md:w-[450px] md:h-[450px]  rounded-full bg-[#FFD9D9] absolute z-[-2]"></div>
        <div className="w-[220px] h-[220px]  md:w-[370px] md:h-[370px]  rounded-full bg-[#FDB1B1] absolute z-[-1]"></div>
        <div className="w-[190px] h-[190px]  md:w-[290px] md:h-[290px]  rounded-full bg-[#F44040] relative">
          <button onClick={handleButtonClick} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <PiHandTapBold style={{ fontSize: '100px', color: '#fff' }} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
