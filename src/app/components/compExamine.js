'use client'
import React, { useState ,useEffect } from 'react';
import axios from 'axios';
import '../globals.css'
import '@fontsource/ntr';
import Link from 'next/link';
import {FiMenu} from 'react-icons/fi';
import {AiOutlineClose} from 'react-icons/ai';
import { BsPlusCircleFill } from 'react-icons/bs';
import {MdSystemSecurityUpdateGood} from 'react-icons/md'
import {GiClothes} from 'react-icons/gi'
import {BsTextarea} from 'react-icons/bs'
import {PiPencilSimpleFill} from 'react-icons/pi'
import {RxCross2} from 'react-icons/rx'
import {BsCheckCircle} from 'react-icons/bs'
import '@fontsource/mitr';
import CompNavbar from './compNavbar';

export default function CompExamine() {
  const [message, setMessage] = useState('');
  const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);
  const [showAddSuccessPopup, setShowAddSuccessPopup] = useState(false);
  const [deletemessage, setdeleteMessage] = useState(false);
  const [addmessage, setaddMessage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // เพิ่ม state เพื่อควบคุมการแสดง/ซ่อน popup
  const [showEditPopup, setShowEditPopup] = useState(false); // เพิ่ม state เพื่อควบคุมการแสดง/ซ่อน popup
  const [reloadData, setReloadData] = useState(false); // เพิ่ม state นี้

  useEffect(() => {
    // ใน useEffect นี้คุณสามารถใช้ Axios เพื่อดึงข้อมูลจากฐานข้อมูล
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/examine'); // แทน '/api/examine' ด้วยเส้นทางที่ถูกต้องไปยัง API ของคุณ
        const data = response.data;

        if (response.status === 200) {
          if (data.success === true) {
            const examineNames = data.dbexamine_name.map(item => item.examine_name);
            setTodoList(examineNames);
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
  }, [reloadData]); // โหลดข้อมูลเมื่อค่า state reloadData เปลี่ยนแปลง


  const openPopup = () => {
    setMessage('');
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const openEditPopup = async (index, todo) => {
    setMessage('');
    setShowEditPopup({ isOpen: true, index, todo }); // ส่งค่า isOpen, index, และ todo ไปยัง setShowEditPopup
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
  };
  
  const [examine_name, setExamine_name] = useState("");
  const [todoList, setTodoList] = useState([]);

  const addTodo = async () => {
    if (examine_name.trim() === "") {
      setMessage("Please fill in  fields");
      return;
    }

    
    try {
      const requestData = {
        examine_name,
      };

      console.log("requestData: ",requestData)
      console.log("examine_name: ",examine_name)


      const response = await axios.post('/api/examine', examine_name, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      const resdata = response.data;
  
      if (response.status === 200) {
        if (resdata.success === true) {
          console.log("Message: ", resdata);

          const updatedTodoList = [...todoList, resdata.dbexamine_name];
          setTodoList(updatedTodoList);
          
          setShowAddSuccessPopup(true);
          setaddMessage(resdata.message);


          setTimeout(() => {
            setShowAddSuccessPopup(false);
          }, 1000); // 1000 มิลลิวินาที = 1 วินาที
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


    setExamine_name("");
    closePopup();
  }

  const handleEditClick = (index) => {
    setIsEditing(true);
    // setTodoList(updatedTodoList);
  };




  const deleteTodo = async (index, todo) => {
    try {
      const editedData = { todo, edit: true };
      const data = JSON.stringify(editedData)

      const response = await axios.post('/api/examine', data, {
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
          }, 1000); // 1000 มิลลิวินาที = 1 วินาที
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

  return (
    <div>

    <CompNavbar />

    <div className='bg-[url("/bg1.png")] overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
      <div className='relative'>
        <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
          <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
        </div>
      </div>
      <div className='mx-auto w-[300px] md:w-[963px] font-ntr py-6 text-black flex flex-col bg-[#FFF] text-center md:rounded-[50px] rounded-[30px] mt-[106px] xs:w-[350px] '>
        <div className='md:mt-[30px]'>
          <div className='flex items-center md:px-10 '>
            <h1 className='text-[25px] md:text-[40px] font-ntr font-bold ml-[30px]'>Examine</h1>
          </div>
        </div>

        <div className="mt-[5px] border-t border-gray-300"></div>
        {!isEditing && (
        <PiPencilSimpleFill onClick={handleEditClick} className='absolute text-black md:text-[20px] text-[13px] md:ml-[910px] md:mt-[50px] ml-[270px]  mt-[10px] cursor-pointer ' />
        )}
        <div className='font-mitr   items-center mx-auto w-[250px] md:w-[850px] h-[350px] text-black bg-[#F5F5F5] text-center mt-[20px] rounded-[20px] overflow-auto'>
          <div className='mx-auto mt-[15px]  flex flex-row justify-center  flex-wrap'>
           
          {/* <div className='flex flex-row justify-center space-x-4 flex-wrap'> 
              <Link href="/ExamineEquiment" className='flex w-[100px] md:w-[250px] py-[30px] px-2 text-black flex-col bg-[#9FD4A3] text-center mt-[15px] rounded-[15px]'>
                <MdSystemSecurityUpdateGood className='mx-auto text-[#5A985E] md:mx-auto text-5xl md:text-6xl' />เครื่องจักร
              </Link>
              <Link href="/ExamineName" className='flex w-[100px] md:w-[250px] py-[30px] px-2 text-black flex-col bg-[#BEE3BA] text-center mt-[15px] rounded-[15px]'>
                <GiClothes className='text-[#5A985E] mx-auto md:mx-auto text-5xl md:text-6xl'/>การแต่งกาย
              </Link>
              <Link href="/ExamineArea" className='flex w-[100px] md:w-[250px] py-[30px] px-2 text-black flex-col bg-[#fff] text-center mt-[15px] rounded-[15px]'>
                <BsTextarea className='text-[#5A985E] mx-auto md:mx-auto text-5xl md:text-6xl'/>พื้นที่เสี่ยง
              </Link>
            </div> */}

              {todoList.map((todo, index) => (
                <div key={index} className={` border-[#F5F5F5] border-[5px] w-[90px] md:w-[150px] py-[30px] px-2 text-black flex-col bg-[#BEE3BA] text-center  rounded-[15px] ${index % 2 === 0 ? 'clear-left' : ''} `}>
                   {isEditing && (
                    // <RxCross2 onClick={() => openEditPopup(index, todo)} className="text-[#5A985E] inline-block  absolute  ml-[22px] md:ml-[50px] mt-[-24px] text-[12px]  hover:-translate-y-0.5 duration-200 " /> 
                    <RxCross2
                      onClick={(e) => {
                        e.stopPropagation(); // ป้องกันการกระจัดการคลิกไปยังคำสั่ง openEditPopup ด้วย
                        openEditPopup(index, todo);
                      }}
                      className="text-[#5A985E] inline-block absolute ml-[22px] md:ml-[50px] mt-[-24px] text-[12px] hover:-translate-y-0.5 duration-200"
                    />

                   )}
                  <div className='flex justify-center'>
                    <p className='text-[#000] text-[14px] w-[60px]  break-words whitespace-pre-wrap'>{todo} </p>
                  </div>
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
            {/* <div className='flex w-[100px] md:w-[250px] py-[30px] px-2 text-black flex-col bg-[#BEE3BA] text-center mt-[15px] rounded-[15px]'>
              <div className='flex px-3'>
                <input
                  className='mt-1 p-2 w-full border border-gray-300 rounded-md'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="add examine"
                />
              </div>
            </div> */}
          </div>
        </div>

        <div className='flex items-center md:px-10 ml-[100px]'>
        {isEditing ? (
          <button onClick={() => setIsEditing(false)} className='mx-auto mt-[60px] text-md md:text-[20px] md:ml-[600px] md:mt-[60px] border-[#64CE3F] bg-[#64CE3F] px-10 py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 '>Comfirm</button>
        ) : (
          <button href="/" className=' mt-[60px] text-md md:text-[20px] md:ml-[600px] md:mt-[60px] border-[#64CE3F] bg-[#64CE3F] px-10 py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 '>Submit</button>
        )}
          <div>
            {/* <CompNavbar /> */}
            <div className="flex items-center ml-[0px] ">
            {!isEditing && (
              <button
                onClick={openPopup}
                className="item-center text-[#5A985E] ml-[10px] text-4xl mt-[60px] hover:-translate-y-0.5 duration-200"
              >
                <BsPlusCircleFill />
              </button>
            )}
            </div>

            {showPopup && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center ">
                <div className="bg-white p-4 rounded-lg border-black shadow-lg md:w-[400px] ">
                  <h2 className='text-[30px] text-[#5A985E] font-ntr font-bold'>Add Examine</h2>
                  <div className="mt-4">
                    <input className='mt-1 p-2 w-full border border-gray-300 rounded-md'
                      value={examine_name}
                      onChange={(e) => setExamine_name(e.target.value)}
                      placeholder="add examine"
                    />
                  </div>
                  {message && (
                    <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                      {message}
                    </p>
                  )}
                  <div className="flex justify-center mt-[10px]">
                    <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={addTodo}>Add</button>

                    <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => closePopup(false)}>Cancel</button>
                  </div>

                </div>
              </div>
            )}

            {showEditPopup.isOpen && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center ">
                <div className="bg-white p-4 rounded-lg border-black shadow-lg md:w-[400px] ">
                  <h2 className='text-[20px] text-[#5A985E] font-ntr font-bold'>Do you want to delete <span style={{ color: '#FF6B6B' }}>{showEditPopup.todo}</span> ?</h2>
                  
                  {message && (
                    <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                      {message}
                    </p>
                  )}
                  <div className="flex justify-center mt-[10px]">
                    <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={() => deleteTodo(showEditPopup.index, showEditPopup.todo)}>Yes</button>

                    <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => closeEditPopup(false)}>Cancel</button>
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
}
