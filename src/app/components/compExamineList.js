'use client'
import React, { useState ,useEffect , useContext } from 'react';
import axios from 'axios';
import '../globals.css'
import '@fontsource/ntr';
import { BsPlusCircleFill } from 'react-icons/bs';
import {PiPencilSimpleFill} from 'react-icons/pi'
import {RxCross2} from 'react-icons/rx'
import {BsCheckCircle} from 'react-icons/bs'
import {BsFillExclamationTriangleFill} from 'react-icons/bs'
import { useRouter } from 'next/navigation';
import '@fontsource/mitr';
import CompNavbar from './compNavbar/row_1';
import { CompLanguageProvider, useLanguage } from './compLanguageProvider';
import { useTranslation } from 'react-i18next';

import {i18n } from '../i18n'; // import i18n instance
import { initReactI18next } from 'react-i18next';

function CompExamineList() {
  return (
    <CompLanguageProvider>
      <App />
    </CompLanguageProvider>
  );
}


function App() {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  const [message, setMessage] = useState('');
  const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);
  const [showAddSuccessPopup, setShowAddSuccessPopup] = useState(false);
  const [deletemessage, setdeleteMessage] = useState(false);
  const [addmessage, setaddMessage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false); 
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [reloadData, setReloadData] = useState(false); 
  // const [showPopupUseEmployee, setShowPopupUseEmployee] = useState(false);
  const [useEmployee, setUseEmployee] = useState(false);
  const [User_id, setUser_id] = useState('');
  const [id, setId] = useState('');

  const router = useRouter();


  

  
  useEffect(() => {
    const storedUser_id = localStorage.getItem('id');
    console.log("user_id11: ",storedUser_id);

    const fetchData = async () => {
      try {

        const AddData = { storedUser_id, fetch: true};
        const fetchdata = JSON.stringify(AddData);

        const response = await axios.post('/api/examinelist', fetchdata, {
          headers: { 'Content-Type': 'application/json' },
        });        
        
        const data = response.data;

        if (response.status === 200) {
          if (data.success === true) {
            const examinelistNames = data.dbexaminelist_name.map(item => item.name);
            
            setTodoList(examinelistNames);
            setUser_id(storedUser_id);

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
    setId(storedUser_id)
    fetchData();
  }, [reloadData]); 


  const openPopup = () => {
    setMessage('');
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const openEditPopup = async (index, todo) => {
    setMessage('');
    setShowEditPopup({ isOpen: true, index, todo }); 
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
  };
  
  const [examinelist_name, setExaminelist_name] = useState("");
  const [todoList, setTodoList] = useState([]);


  const addTodo = async () => {
    if (examinelist_name.trim() === "") {
      setMessage("Please fill in  fields");
      return;
    }
    
    try {

      console.log("useEmployee name: " ,examinelist_name, id  )


      const AddData = { examinelist_name , id , add: true};
      const data = JSON.stringify(AddData);
      console.log("data222: ",data)

      const response = await axios.post('/api/examinelist', data, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      const resdata = response.data;
  
      if (response.status === 200) {
        if (resdata.success === true) {
          console.log("Message: ", resdata);

          const updatedTodoList = [...todoList, resdata.dbexaminelist_name];
          setTodoList(updatedTodoList);
          
console.log("ADD: ",resdata.message)
          setShowAddSuccessPopup(true);
          setaddMessage(resdata.message);


          setTimeout(() => {
            setShowAddSuccessPopup(false);
          }, 1000);
        } else {
          setMessage(resdata.error);
        }
      } else {
        setMessage(resdata.error);
      }
    
    } catch (error) {
      console.error('Error Examine:', error);
      setMessage('');
    }

    setExaminelist_name("");
    closePopup();
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };


  const handleCheckboxEmployee = () => {
    setUseEmployee(true); 
  }

  const deleteTodo = async (index, todo) => {
    try {
      const editedData = { todo,index, todoList, edit: true };
      const data = JSON.stringify(editedData)
      console.log("datadelete: ",data)

      const response = await axios.post('/api/examinelist', data,  {
        headers: { 'Content-Type': 'application/json' },
      });

      closeEditPopup();

       const resdata = response.data;
  
      if (response.status === 200) {
        if (resdata.success === true) {
          setReloadData(prev => !prev);

          console.log("Message: ", resdata);
          setShowDeleteSuccessPopup(true);
          setdeleteMessage(resdata.message);


          setTimeout(() => {
            setShowDeleteSuccessPopup(false);
          }, 1000); 
        } else {
          setMessage(resdata.error);
        }
      } else {
        setMessage(resdata.error);
      }
    } catch (error) {
      console.error('Error Examine:', error);
      setMessage('');
    }
  }

  const handleSubmit = async () => {
    try {

      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      
      
      const editedData = { formattedDate, id , submit: true};
      console.log("checkbox: ",editedData)
      const data = JSON.stringify(editedData)
      console.log("checkboxData: ",data)


      const response = await axios.post('/api/examinelist', data, {
        headers: { 'Content-Type': 'application/json' },
      });    
      
      const resdata = response.data;
  
      if (response.status === 200) {
        if (resdata.success === true) {

          console.log("Message: ", resdata);

          setTimeout(() => {
            router.push(resdata.redirect); 
          }, 1000); 
        } else {
          setMessage(resdata.error);
        }
      } else {
        setMessage(resdata.error);
      }


    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div>

    <CompNavbar />

    <div className='bg-[url("/bg1.png")] overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
      <div className='relative'>
        <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
          <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
        </div>
      </div>
      <div className='mx-auto border w-[300px] md:w-[950px] font-ntr py-[20px] md:h-[600px] h-[550px] text-black flex flex-col   md:rounded-[30px] rounded-[30px] mt-[106px]  bg-[#fff]'>
                
        <h1 className={`  ${language === 'EN' ? 'md:text-[35px]  ml-[30px] text-[25px] font-ntr  font-bold' : 'ml-[30px] font-mitr text-[25px] mt-[3px] mb-[5px] md:text-[30px] md:ml-[50px] font-small' }`}>
          {language === 'EN' ? 'Examine List' : 'รายการตรวจสอบ' }
        </h1>

        <div className="mt-[5px] border-t border-gray-300"></div>
        {!isEditing && (
        <PiPencilSimpleFill onClick={handleEditClick} className='absolute text-black md:text-[20px] text-[13px]  md:ml-[910px] md:mt-[15px] ml-[270px]  mt-[12px] cursor-pointer ' />
        )}
        
        <div className='font-mitr   items-center mx-auto w-[250px] md:w-[850px] h-[380px] text-black bg-[#F5F5F5] text-center mt-[20px] rounded-[20px] overflow-auto'>
          <div className='mx-auto mt-[15px]  flex flex-row justify-center md:justify-normal md:ml-[20px] flex-wrap'>


              {todoList.map((todo, index) => (

                <div
                  key={index}
                  className={`cursor-pointer border-[#F5F5F5] border-[5px] w-[90px] md:w-[150px] py-[30px] px-2 text-black flex-col bg-[#BEE3BA] text-center rounded-[15px] ${index % 2 === 0 ? 'clear-left' : ''}`}
                  onClick={() => {
                    if (!isEditing) {
                      router.push(`/examine?examinelist_name=${todo}&index=${index}`);
                    }
                  }}
                >
                  {isEditing ? (
                    <div>
                      <RxCross2
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditPopup(index, todo);
                        }}
                        className="text-[#5A985E] inline-block ml-[55px] md:ml-[115px] mt-[-65px] text-[12px] hover:-translate-y-0.5 duration-200"
                      />
                      <div className='flex justify-center'>
                        <p className='text-[#000] text-[14px] md:text-[18px] mt-[-20px] w-[60px] md:w-[100px] break-words whitespace-pre-wrap'>{todo}</p>
                      </div>
                    </div>
                  ) : (
                    <div className='flex justify-center'>
                      <p className='text-[#000]  text-[14px] md:text-[18px] md:w-[100px] w-[60px] break-words whitespace-pre-wrap'>{todo}</p>
                    </div>
                  )}
                </div>
              ))}

              {showDeleteSuccessPopup && (
                <div className="bg-white text-[#5A985E] p-8  rounded-lg border-black shadow-lg md:w-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <BsCheckCircle className=' text-[50px] mx-auto mb-[10px]'/>
                {deletemessage}
                </div>
              )}
              {showAddSuccessPopup && (
                <div className="bg-white text-[#5A985E] p-8  rounded-lg border-black shadow-lg md:w-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <BsCheckCircle className=' text-[50px] mx-auto mb-[10px]'/>
                {addmessage}
                </div>
              )}
            
          </div>
        </div>

        <div className={` ${language === 'EN' ? ' font-ntr text-[17px] md:text-[20px]' : ' font-mitr text-[15px] md:text-[17px] '  } flex justify-end w-[250px] md:mt-[15px] mx-auto md:w-[940px]  md:px-10 `}>
        {isEditing ? (
          <button onClick={() => setIsEditing(false)}  className={`flex mx-auto mt-[20px]   md:mt-[20px] border-[#64CE3F] bg-[#64CE3F] px-10 py-1  rounded-[20px]    text-[#fff] hover:-translate-y-0.5 duration-200 `}>{t('confirm')}</button>
        ) : (
          <button onClick={handleSubmit} className={`mt-[20px]   md:mt-[20px]  border-[#64CE3F] bg-[#64CE3F] px-10 py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 `}>{t('submit')}</button>
        )}
          <div>
            <div className="flex items-center  ">
            {!isEditing && (
              <button
                onClick={openPopup}
                className="item-center text-[#5A985E] ml-[10px] text-4xl mt-[20px] hover:-translate-y-0.5 duration-200"
              >
                <BsPlusCircleFill />
              </button>
            )}
            </div>
           
            {showPopup && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center ">
                <div className="bg-white p-4 rounded-lg border-black shadow-lg md:w-[300px] ">
                  <h2 className={` ${language === 'EN' ? 'text-[20px] font-ntr font-bold' : 'font-mitr text-[18px]' } text-[#5A985E]  `}>{language === 'EN' ? 'Add List Examine' : 'เพิ่มรายการตรวจสอบ' }</h2>
                  <div className="mt-4 ">
                    <input className={` ${language === 'EN' ? ' font-ntr ' : 'font-mitr text-[14px]' }  w-[268px] mt-1 p-2  border border-gray-300 rounded-md`}
                      value={examinelist_name}
                      onChange={(e) => setExaminelist_name(e.target.value)}
                      placeholder={language === 'EN' ? "add list examine" : 'เพิ่มรายการตรวจสอบ' }
                    />
                  </div>
                 
                  {message && (
                    <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                      {message}
                    </p>
                  )}
                  <div className="flex justify-center mt-[20px]">
                    <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={addTodo}>{language === 'EN' ? 'Add' : 'ยืนยัน' }</button>

                    <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => closePopup(false)}>{language === 'EN' ? 'Cancel' : 'ยกเลิก' }</button>
                  </div>

                </div>
              </div>
            )}

            {showEditPopup.isOpen && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center ">
                <div className="bg-white p-4 rounded-lg border-black shadow-lg md:w-[380px] md:h-[150px] ">
                  <h2 className= {`${language === 'EN' ? ' font-ntr font-bold' : ' font-mitr '  } text-[18px] md:text-[20px] text-[#5A985E] mt-[10px] `}>{`${language === 'EN' ? ' Do you want to delete ' : 'คุณต้องการที่จะลบ '  }`} <span style={{ color: '#FF6B6B' }}>{showEditPopup.todo}</span> ?</h2>
                  
                  {message && (
                    <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                      {message}
                    </p>
                  )}
                  <div className=   {`${language === 'EN' ? ' font-ntr text-[19px]' : ' font-mitr text-[16px]'  } flex justify-center mt-[10px]  md:mt-[30px]`}>
                    <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={() => deleteTodo(showEditPopup.index, showEditPopup.todo)}>{t('Yes')}</button>

                    <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => closeEditPopup(false)}>{t('Cancel')}</button>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
    )
}  export default CompExamineList;

