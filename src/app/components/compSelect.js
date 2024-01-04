'use client'
import React, { useState, useEffect } from 'react';
// import '@fontsource/ntr';
import '../globals.css';
// import '@fontsource/mitr';
import CompNavbar from './compNavbar/role_1';
import axios from 'axios';
import CompExamineList from './compExamineList';
import CompSelectExamineList from './compSelectExamineList'
import { CompLanguageProvider, useLanguage } from './compLanguageProvider';


function CompSelect() {
  return (
    <CompLanguageProvider>
      <App />
    </CompLanguageProvider>
  );
}

function App() {
  const { language, toggleLanguage } = useLanguage();
  const [confirmedData, setConfirmedData] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({});
  const [checkedItems, setCheckedItems] = useState([]);
  const [message, setMessage] = useState('');


  useEffect(() => {
    const storedUser_id = localStorage.getItem('id');
    console.log("user_id11: ",storedUser_id);
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากมกราคมเริ่มที่ 0
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const fetchData = async () => {
      try {

        const AddData = { storedUser_id, formattedDate, fetch: true};
        const fetchdata = JSON.stringify(AddData);

        const response = await axios.post('/api/select', fetchdata, {
          headers: { 'Content-Type': 'application/json' },
        });        
        
        const data = response.data;

        if (response.status === 200) {
          if (data.success === true) {
              console.log("checkValues5555 ",data)

              if (data.idResultmap){
                setIsSubmitted(true);
              } else {
                setIsSubmitted(false);
              }
                

          //     const isSameDay = (date1, date2) => {
          //     return (
          //       date1.getFullYear() === date2.getFullYear() &&
          //       date1.getMonth() === date2.getMonth() &&
          //       date1.getDate() === date2.getDate()
          //     );
          //   };
          //   const lastSubmittedDate = new Date(localStorage.getItem('lastSubmittedDate'));
          //   // const currentDate = new Date();
          //   console.log("5555: ",lastSubmittedDate, '+++++', currentDate)
          // if (isSameDay(lastSubmittedDate, currentDate)) {
          //     setIsSubmitted(true);
          //     localStorage.setItem('isSubmitted', JSON.stringify(true));
          //     console.log('You can submit the form once per day111.');
          //   } else if (!isSameDay(lastSubmittedDate, currentDate)) {
          //     localStorage.removeItem('isSubmitted');
          //     localStorage.removeItem('lastSubmittedDate');
          //     localStorage.removeItem('checkedItems');
          //     console.log('888888วันที่ไม่เท่ากัน');
          //   } else {
          //     console.log('lastSubmittedDate is later than currentDate.');
          //   }
            // console.log("checkValues5555 ",data.idResultmap,data.idResultmap.length)
            // if (JSON.parse(data.idResultmap).length > 0 ){
            //   setIsSubmitted(true);
            //   localStorage.setItem('isSubmitted', JSON.stringify(true));
            //   localStorage.setItem('checkedItems', data.idResultmap);
            // } else if (JSON.parse(data.idResultmap).length === 0 )              {
            //   setIsSubmitted(false);
            // }

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
    console.log("localStorage: ",localStorage)
  
    // อ่านค่า isSubmitted จาก Local Storage หรือ Session Storage
    const storedIsSubmitted = localStorage.getItem('isSubmitted');
    if (storedIsSubmitted) {
      setIsSubmitted(JSON.parse(storedIsSubmitted));
    } else {
      // ถ้าไม่มีค่า isSubmitted ใน Storage ให้เซ็ตเป็น false
      setIsSubmitted(false);
    }
  }, []);

  const handleFormSubmit = (checkedItems) => {
    localStorage.setItem('checkedItems', JSON.stringify(checkedItems));

    const lastSubmittedDate = new Date(localStorage.getItem('lastSubmittedDate'));
    const currentDate = new Date();
    // if (!lastSubmittedDate || (currentDate - lastSubmittedDate) >= (24 * 60 * 60 * 1000)) {
    //   // If it's the first submission or a day has passed, set isSubmitted to true
    //   localStorage.setItem('isSubmitted', JSON.stringify(true));
    //   localStorage.setItem('lastSubmittedDate', currentDate.toISOString());
    //   setIsSubmitted(true);
    // } else {
    //   // If it's the same day, do not set isSubmitted to true
    //   console.log('You can submit the form once per day.');
    // }

    setCheckedItems(checkedItems)
    // Your logic for form submission
    console.log('Form submitted with checked items888:', checkedItems);
    console.log("CHECKK: ",checkedItems.length)
    localStorage.setItem('isSubmitted', JSON.stringify(true));
    setIsSubmitted(true);
  };



   return (
    <div className=' bg-[url("/bg1.png")]  overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
      <div className='md:w-[1000px] mx-auto '>
        <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
          <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
        </div>
        <CompSelectExamineList onSubmit={handleFormSubmit} />

        {console.log("888888888")}
        
        {isSubmitted && (
          <div>
            {console.log("666666: ", checkedItems)}
            <CompExamineList checkedItems={checkedItems} />
          </div>
        )}
      </div>
    </div>
  );
}
export default CompSelect;