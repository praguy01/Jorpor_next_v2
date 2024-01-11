'use client'
import React, { useState , useEffect} from 'react';
import Link from 'next/link'
import '../globals.css'
// import '@fontsource/ntr'
import '@fontsource/mitr';
import { BsPlusCircleFill } from 'react-icons/bs';
import CompNavbar from './compNavbar/role_1';
import {BsCalendar2Minus} from 'react-icons/bs';
import { BsTrash } from 'react-icons/bs'; // Add this import for the trash can icon
import { BsPencilSquare } from 'react-icons/bs'; // Add this import for the edit button
import { PiPencilSimpleFill } from 'react-icons/pi';
import {BsCheckCircle} from 'react-icons/bs';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {RxCross2} from 'react-icons/rx'
import {BsFillCheckCircleFill} from 'react-icons/bs'
import { CompLanguageProvider, useLanguage } from './compLanguageProvider_role_1';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n'; 
import { initReactI18next } from 'react-i18next';


function CompChecklistExamine()  {
  return (
    <CompLanguageProvider>
      <App />
    </CompLanguageProvider>
  );
}

function App() {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();


    const router = useRouter();


    const [id, setId] = useState('');
    const [message, setMessage] = useState('');
    const currentDate = new Date().toLocaleDateString();
    const [showPopup, setShowPopup] = useState(false); // if using React state
    const [isEditing, setIsEditing] = useState(false);
    const [ShowPopupDelete, setShowPopupDelete] = useState(false);
    const [checklistname, setChecklistname] = useState(''); // เพิ่ม state สำหรับ todo
    const [index, setIndex] = useState(''); // เพิ่ม state สำหรับ index
    const [input, setInput] = useState("");
    const [details, setDetails] = useState("");
    const [lastname, setlastname] = useState("");
    const [todoList, setTodoList] = useState([]);
    const [reloadData, setReloadData] = useState(false); // เพิ่ม state นี้
    const [deletemessage, setdeleteMessage] = useState(false);
    const [addmessage, setaddMessage] = useState(false);
    const [showAddSuccessPopup, setShowAddSuccessPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false); // เพิ่ม state เพื่อควบคุมการแสดง/ซ่อน popup
    const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);
    const [selectedItems, setSelectedItems] = useState({});
    const [IsLoading, setIsLoading] = useState(false);
    const [useEmployee, setUseEmployee] = useState(false);
    const [selectedOption, setSelectedOption] = useState('User'); // สร้าง state เพื่อเก็บค่าที่เลือก
    const [employee, setEmployee] = useState(''); // สร้าง state เพื่อเก็บค่าที่เลือก
    const [checked, setchecked] = useState(false);
    // const [resindex, setresIndex] = useState(''); // เพิ่ม state สำหรับ index
    const [idemployee , setidEmployee] = useState(''); // สร้าง state เพื่อเก็บค่าที่เลือก
    const [dbidemployee , setdbidEmployee] = useState(''); // สร้าง state เพื่อเก็บค่าที่เลือก
    const [examinelist_Id, setexaminelist_Id] = useState('');
    const [examine_Id, setexamine_Id] = useState('');
    const [todoStatus, setTodoStatus] = useState({});
    const [examinelist_name, setexaminelist_name] = useState('');

   
    
    useEffect(() => {
      const storedId = localStorage.getItem('id');
      if (storedId) {
        setId(storedId);
        console.log("Stored: ",storedId)
      }
    }, []);

    useEffect(() => {
      console.log("STARTChecklist: ",useEmployee);
      console.log("selectedOption: ",selectedOption)

      if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(window.location.search);
        const checklistnameValue = searchParams.get('checklistname') ; // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า
        const indexValue = searchParams.get('index') ; // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า
        const checkedValue = searchParams.get('Checked') ; // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า
        const idemployeeValue = searchParams.get('idemployee') ; // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า
        const examinelist_IdValue = searchParams.get('examinelistId') ; // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า
        const examine_IdValue = searchParams.get('examineId') ; // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า
        const examinelist_nameValue = searchParams.get('examinelist_name') ; // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า

        console.log("queryDataexamine1: ",{checklistnameValue,indexValue ,checkedValue ,idemployeeValue,examinelist_IdValue,examine_IdValue ,examinelist_nameValue})

       
      
        // ใน useEffect นี้คุณสามารถใช้ Axios เพื่อดึงข้อมูลจากฐานข้อมูล
        const fetchData = async () => {
          try {
            // if (useEmployee && selectedOption === 'user') {
            //   await fetchEmployeeData();
            // }

            fetchEmployeeData();


            if (useEmployee === false) {
            console.log("TODO88888888888888888888: ",checklistnameValue)
            const AddData = { examine_IdValue};
            const datacheck = JSON.stringify(AddData);

            const response = await axios.post('/api/checklistexamine', datacheck, {


              headers: { 'Content-Type': 'application/json' },
            });          
            
            const data = response.data;
    
            if (response.status === 200) {
              if (data.success === true) {
                console.log("AllDataChecklist: ",data)
                console.log("Datachecklist1: ",data.dbchecklist[name])
                setTodoList(data.dbchecklist);
              } else {
                setMessage(data.error);
              }
            } else {
              setMessage(data.error);
            }
          }
          } catch (error) {
            console.error('Error fetching data:', error);
            setMessage('');
          }
        
        };
        setexamine_Id(examine_IdValue)
        setexaminelist_Id(examinelist_IdValue);
        setChecklistname(checklistnameValue);
        const checkedValueBool = JSON.parse(checkedValue);
        setchecked(checkedValueBool);
        setexaminelist_name(examinelist_nameValue)
        

        const fetchEmployeeData = async () => {
          try {
            console.log("CheckUseEmployee")
          const AddData = { checklistnameValue , check : true};
          const datacheck = JSON.stringify(AddData);

          const checkUseEmployee = await axios.post('/api/checklistexamine', datacheck, {
            headers: { 'Content-Type': 'application/json' },
          }); 

          const data = checkUseEmployee.data;
      
            if (checkUseEmployee.status === 200) {
              if (data.success === true) {
                console.log("Datachecklist: ",data.ResultUseEmployee[0].useEmployee)

                // const stateUseEmployee = (data.ResultUseEmployee[0].useEmployee);
                // console.log("stateUseEmployee: ",stateUseEmployee)
                // const state = JSON.stringify(stateUseEmployee);
                // console.log("state: ",state)
                // setUseEmployee(state);

                // const stateUseEmployee = data.ResultUseEmployee[0].useEmployee;
                setUseEmployee(data.ResultUseEmployee[0].useEmployee);

                console.log("ค่า useEmployee:", data.ResultUseEmployee[0].useEmployee);

                if (data.ResultUseEmployee[0].useEmployee === "true") {
                  console.log("ค่าเป็น true");
                  console.log("ค่า Selectoption: ",selectedOption);

                    if (selectedOption === "User") {

                    try {

                          const AddData = { examinelist_Id  , User: true};
                          const datacheck = JSON.stringify(AddData);

                          const response = await axios.post('/api/checklistexamine', datacheck, {
                            headers: { 'Content-Type': 'application/json' },
                          });                           
                          
                          const data = response.data;
                          console.log("DATA: ",data)
                  
                          if (response.status === 200) {
                            if (data.success === true) {
                              console.log("employeeDB: ",data.dbemployee_name)
                              let employeesToAdd = [];
                              let employeeToSend = [];
                              let idemployeeToSend = [];

                
                              
                              const dbEmployees = data.dbemployee_name || [];
                              dbEmployees.forEach((employeeData) => {
                                const combinedData = `${employeeData.employee} ${employeeData.name} ${employeeData.lastname}`;
                                employeesToAdd.push(combinedData);
                                const Employeetest = (`${employeeData.employee}`);
                                employeeToSend.push(Employeetest);
                                const idEmployeetest = (`${employeeData.id}`);
                                idemployeeToSend.push(idEmployeetest);



                              });
                
                              // console.log("empToadd: ", employeesToAdd);
                              fetchidEmployeeData();

                              setchecked(true);
                              setTodoList(employeesToAdd);
                              setEmployee(employeeToSend);
                              setidEmployee(idemployeeToSend);

                        } else {
                          setMessage(data.error);
                        }
                      } else {
                        setMessage(data.error);
                      }
                    } catch (error) {
                      console.error('Error fetching employee data:', error);
                      setMessage('');
                    }

                  } else if (selectedOption === "Checklist") {

                    try {

                      const editedData = { checklistnameValue, examine_Id ,selectchecklist: true };
                      const dataAdd = JSON.stringify(editedData)
                      
                      const response = await axios.post('/api/checklistexamine', dataAdd, {
                        headers: { 'Content-Type': 'application/json' },
                      });          
                      
                      const data = response.data;
              
                      if (response.status === 200) {
                        if (data.success === true) {
                          console.log("AllDataChecklist: ",data)
                          // console.log("Datachecklist1: ",data.dbchecklist[0])
                          setTodoList(data.dbchecklist);
                        } else {
                          setMessage(data.error);
                        }
                      } else {
                        setMessage(data.error);
                      }
                  } catch (error) {
                    console.error('Error fetching data:', error);
                    setMessage('');
                  }}
                  } else {
                    console.log("ค่าเป็น false");
                  }
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
        }

        fetchData();
      }
    // โหลดข้อมูลเมื่อค่า state reloadData เปลี่ยนแปลง
    const fetchidEmployeeData = async () => {
      try {
        const Checkid = {checklistname ,checkid : true};
        const datacheckid = JSON.stringify(Checkid);
        console.log("Id_resultEmployee: ",datacheckid)

        const response = await axios.post('/api/checklistexamine', datacheckid, {
          headers: { 'Content-Type': 'application/json' },
        });          
        
        const data = response.data;

        if (response.status === 200) {
          if (data.success === true) {
            console.log("AllDataChecklistIDemployee: ",data)
            const resultString = data.ResultidEmployee.toString();

            setdbidEmployee(resultString);

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
} 
  }, [reloadData,checklistname,examine_Id,examinelist_Id,selectedOption,useEmployee]);  

   



  const handleEditClick = () => {
    setIsEditing(true);
  };  

  const openPopup = () => {
    setShowPopup(true);
    setMessage('')
  };

  const closePopup = () => {
    setShowPopup(false);
  };
  
  const handleCheckboxChange = (todo, passChecked, failChecked, details) => {
  // สร้างค่าเริ่มต้นของสถานะสำหรับเครื่องจักร A และ B
  const updatedTodoStatus = { ...todoStatus };
  
  // กำหนดค่า "pass" หรือ "fail" ตามเครื่องจักรที่เลือก
  if (passChecked) {
    updatedTodoStatus[todo] = { name: todo, pass: true,status: "pass", details: details || "-" };
  } else if (failChecked) {
    updatedTodoStatus[todo] = { name: todo, fail: true,status: "fail", details: details || "-" };
  } else {
    updatedTodoStatus[todo] = {}; // ล้างสถานะถ้าไม่เลือกใดๆ และตั้ง details เป็น ' ' หรือค่าที่ถูกส่งมา
  }
  
  setTodoStatus(updatedTodoStatus);
  console.log("State: ", updatedTodoStatus);
};

  
  
  

 
  

  const addTodo = async () => {
    if (input.trim() === "") {
      setMessage("Please fill in the checklist field");
      return;
    }
  
    try {
      const AddData = { input, checklistname, examinelist_Id, add: true };
      const data = JSON.stringify(AddData);
  
      const response = await axios.post('/api/checklistexamine', data, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      const resdata = response.data;
  
      if (response.status === 200) {
        if (resdata.success === true) {
          console.log("Message: ", resdata);
          setMessage('');
          // Add the new item to the todoList
          setTodoList((prevTodoList) => [...prevTodoList, resdata.dbchecklist]);
  
          setShowAddSuccessPopup(true);
          setaddMessage(resdata.message);
  
          setTimeout(() => {
            setShowAddSuccessPopup(false);
          }, 1000); // 1000 milliseconds = 1 second
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
  
    setInput("");
    closePopup();
  };

    // setTodoList([...todoList, input + '  ' + lastname]);
    // setInput('');
    // setlastname('');
    // closePopup(); 
  

    const openEditPopup = async (todo, checklistname) => {
      setMessage('');
      console.log("Editdata: ", checklistname)
      setShowEditPopup({ isOpen: true, todo, checklistname }); // ส่งค่า isOpen, index, และ todo ไปยัง setShowEditPopup
    };

    const closeEditPopup = () => {
      setShowEditPopup(false);
    };


    const deleteChecklist = async (todo , checklistname ) => {
      try {
        const editedData = { todo , checklistname , examine_Id , id, edit_role_1: true };
        console.log("delete: ",editedData)
        const data = JSON.stringify(editedData)
        console.log("deleteData: ",data)

        const response = await axios.post('/api/checklistexamine', data, {
          headers: { 'Content-Type': 'application/json' },
        });

        closeEditPopup();

        const resdata = response.data;
    
        if (response.status === 200) {
          if (resdata.success === true) {
            setTodoList(resdata.dbchecklist);


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

    const handleSubmit = async () => {
      try {
        // const selectedItemsArray = Object.entries(selectedItems)
        //   .filter(([_, isSelected]) => isSelected)
        //   .map(([todo]) => todo);
    
        if (useEmployee === "false") {

        console.log("checklist: ",todoStatus)
        const editedData = {todoStatus,examine_Id,examinelist_Id,id, checkbox: true };
        // const data = JSON.stringify(editedData)
        // console.log("checkboxData: ",data)
    
        // ส่งข้อมูลไปยัง API โดยใช้ axios หรือวิธีอื่น ๆ ตามที่คุณใช้
        const response = await axios.post('/api/checklistexamine', editedData, {
          headers: { 'Content-Type': 'application/json' },
        });    
        
        const resdata = response.data;
    
        if (response.status === 200) {
          if (resdata.success === true) {

            console.log("Message: ", resdata);
            setShowDeleteSuccessPopup(true);
            setdeleteMessage(resdata.message);

            setTimeout(() => {
              setIsLoading(true); 
                router.push(resdata.redirect); 
            }, 1000); 
          } else {
            setMessage(resdata.error);
          }
        } else {
          setMessage(resdata.error);
        }
        setSelectedItems({});


        } else {
          console.log("TEEEEEE: ",examinelist_name)
          router.push(`/examine?examinelist_name=${examinelist_name}&id=${examinelist_Id}`)
        }

        
      } catch (error) {
        console.error('Error:', error);
        // ดำเนินการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูลไปยัง API
      }
    };
    
    const handleDropdownChange = (event) => {
      setSelectedOption(event.target.value); // เมื่อเลือกตัวเลือกใน Dropdown ให้อัปเดต state
    };

     
    

  return (
    <div>
      
      <CompNavbar/>

        <div className=' bg-[url("/bg1.png")] overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center   '>
          <div className='md:w-[1000px] mx-auto '>
            <div className=' w-[280px] mx-auto md:w-[963px]'>
              <div className=  {` text-[21px] md:text-[35px] left-0 md:ml-[90px] w-[300px] flex items-center md:mt-[100px] mt-[90px] `}>
                  <h1 className=' text-[#5A985E]   mr-[10px] '>{t('Examine')}</h1>
                  <p className='text-black text-sm md:text-[20px]  '>({checklistname})</p>
              </div>
              <div className='flex items-center text-center  w-[110px] h-[24px] md:w-[140px] md:h-[30px] rounded-[5px] text-[#fff] border-[#000] bg-[#000] md:ml-[90px] '>
                    <div className=' md:ml-[10px] ml-[10px] '><BsCalendar2Minus/></div>
                    <p className="  mt-[2px] ml-[8px]  md:text-[17px] text-[12px] md:ml-[8px] ">{currentDate}</p>
              </div>             
              {useEmployee === "false" && !isEditing &&   (
               <PiPencilSimpleFill onClick={handleEditClick} className='absolute text-black md:text-[18px] text-[13px] md:ml-[840px] md:mt-[28px] ml-[265px] mt-[25px] cursor-pointer ' />
              )}
              {selectedOption === 'Checklist' && !isEditing && (
               <PiPencilSimpleFill onClick={handleEditClick} className='absolute text-black md:text-[20px] text-[13px] md:ml-[840px] md:mt-[95px] ml-[265px] mt-[90px] cursor-pointer ' />
              )}
              {useEmployee === "true" && (
                 <div className='md:ml-[90px]'>
                 <label className="block mt-[10px] text-gray-700 text-[15px] font-bold mb-2">Select an option:</label>
                 <select
                   className="w-[120px] text-[13px] text-black border rounded-md px-4 py-1 outline-none"
                   value={selectedOption}
                   onChange={handleDropdownChange}
                 >
                   <option value="User">{t('User')}</option>
                   <option value="Checklist">{t('Checklist')}</option>
                 </select>
               </div>
              )}
            </div>

            <div className={`mx-auto w-[300px]  font-blod md:w-[800px] h-[480px] mb-[50px] text-black flex flex-col md:rounded-[50px] bg-[#FFF] ${isEditing ? 'rounded-[30px]' : 'rounded-[30px] md:rounded-[50px]'} mt-[10px]`}>
            <div className='mx-auto w-[280px]  md:ml-[10px] md:w-[400px] h-[900px] text-black flex flex-col bg-[#FFF] rounded-[30px] md:rounded-[50px] mt-[30px] overflow-auto'>
            
            {todoList.map((todo, index) => (
              <div key={index}>
                {useEmployee === "false" ? (
                  <div className='  text-sm md:ml-[25px] md:text-[18px] mt-[10px] w-[250px] rounded-[10px] md:w-[340px] py-2 md:py-4 bg-[#F5F5F5] mx-auto'>
                    <div className='flex px-3'>
                      <div >
                      <p className='text-[#000] md:ml-[15px] w-[210px]  '>{todo} </p>
                      <div className="mt-[8px] md:w-[310px]  border-t border-gray-300"></div> 
                      <div className='flex items-center mt-[8px] '> 
                      <div className=  {` flex items-center `}>
                        <input
                          type="checkbox"
                          className='mr-[8px] md:ml-[15px] items-center'
                          checked={todoStatus[todo]?.pass || false}
                          onChange={(e) => handleCheckboxChange(todo, e.target.checked, !e.target.checked ? todoStatus[todo]?.fail : false)}
                          /><span className='text-[13px] md:text-[15px] '>{t('pass')}</span>
                      </div>
                      <div className='flex items-center'>
                        <input
                          type="checkbox"
                          className='mr-[8px] ml-[10px] md:ml-[20px] items-center'
                          checked={todoStatus[todo]?.fail || false}
                          onChange={(e) => handleCheckboxChange(todo, !e.target.checked ? todoStatus[todo]?.pass : false, e.target.checked)}
                          /><span className='text-[13px] md:text-[15px] '>{t('fail')}</span>
                        </div>
                        </div>
                        <input
                            type='text'
                            className='md:ml-[13px] rounded-md mt-[8px] p-2 border text-[13px] w-[225px] md:w-[285px] h-[30px]'
                            placeholder={t('details')}
                            onChange={(e) => {
                              handleCheckboxChange(todo, todoStatus[todo]?.pass, todoStatus[todo]?.fail, e.target.value);
                            }}
                          />                      
                          </div>
                      

                      {isEditing && (
                        <div className='flex   items-center text-[13px] md:text-[18px] justify-end space-x-2 w-[50px] md:w-[50px] ml-[-15px]  md:ml-[-20px] h-[15px]  '>
                          <RxCross2
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditPopup(todo, checklistname);
                            }}
                            className='text-[#5A985E] hover:text-[#64CE3F]'
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  selectedOption === 'Checklist' ? (
                  <div className=' justify-center mx-auto items-center   flex'> 
                  {/* <Link href={`/checklistEmployee?checklistname=${todo}&examine_Id=${examine_Id}&examinelist_Id=${examinelist_Id}&examinename=${checklistname}&employeeName=${employee[index]}&idemployee=${idemployee[index]}`} key={idemployee[index]}> */}
                    <div className=' text-sm md:text-[20px] mt-[10px] w-[250px] rounded-[10px] md:w-[340px] py-2 md:py-4 bg-[#F5F5F5] mx-auto'>
                      <div className='flex items-center px-3 '>
                        {/* <input type="checkbox" className='mr-[10px]' /> */}
                        

                        <p className =' text-[#000] ml-[10px] text-[14px] w-[200px]  whitespace-nowrap overflow-hidden overflow-ellipsis'>{todo} </p>
                        {/* <Link href='' className='text-[#000]'>{todo}  {index}</Link> */}
                      </div>
                    </div>
                  {/* </Link> */}

                  {isEditing && (
                        <div className='flex absolute items-center text-[13px] md:text-[18px] justify-end  space-x-2 w-[20px] md:w-[50px]  ml-[215px] mt-[8px]  md:ml-[270px] h-[15px]  '>
                        <RxCross2
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditPopup(todo, checklistname);
                        }}
                        className='text-[#5A985E] hover:text-[#64CE3F]'
                      />
                    </div>
                  )}
                  </div>
                  ) : (
                    <div className=' justify-center items-center   flex'> 
                    <Link href={`/checklistEmployee?checklistname=${todo}&examine_Id=${examine_Id}&examinelist_Id=${examinelist_Id}&examinelist_name=${examinelist_name}&examinename=${checklistname}&employee_Id=${employee[index]}&idemployee=${idemployee[index]}`} key={idemployee[index]}>
                      <div className=' text-sm md:text-[20px] mt-[10px] w-[250px] rounded-[10px] md:w-[340px] py-2 md:py-4 bg-[#F5F5F5] mx-auto'>
                        <div className='flex items-center px-3'>
                          {/* <input type="checkbox" className='mr-[10px]' /> */}
                          {checked && (
                          <>
                            {/* {console.log("Checked and index: ", index, idemployee[index], "dbidemployee: ", dbidemployee ,"state: ", idemployee.includes(dbidemployee))} */}
                            
                            {dbidemployee.includes(idemployee[index])  && (
                              <>
                                <BsFillCheckCircleFill className='text-[#5A985E] w-[13px]  ' />
                              </>
                            )}
                          </>
                        )}
  
                          <p className={`text-[#000] ${dbidemployee.includes(idemployee[index]) ? 'ml-[13px]' : 'ml-[26px]' } text-[14px] w-[200px]  whitespace-nowrap overflow-hidden overflow-ellipsis`}>{todo}</p>
                          {/* <Link href='' className='text-[#000]'>{todo}  {index}</Link> */}
                        </div>
                      </div>
                    </Link>
  
                    {isEditing && (
                          <div className='flex  items-center text-[13px] md:text-[18px] justify-end space-x-2 w-[50px] md:w-[50px] ml-[-60px]  md:ml-[-85px] mt-[10px] '>
                          <RxCross2
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditPopup(todo, checklistname);
                          }}
                          className='text-[#5A985E] hover:text-[#64CE3F]'
                        />
                      </div>
                    )}
                    </div>
                    )
                )}
                
              </div>
              
            ))}

              

                    {showDeleteSuccessPopup && (
                      <div className="bg-white w-[250px] text-[#5A985E] p-8 text-center rounded-lg border-black shadow-lg  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <BsCheckCircle className=' text-[50px] mx-auto mb-[10px]'/>
                      {deletemessage}
                      </div>
                    )}

                    {showAddSuccessPopup && (
                      <div className="bg-white text-center text-[#5A985E] p-8  rounded-lg border-black shadow-lg  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <BsCheckCircle className=' text-[50px] mx-auto mb-[10px]'/>
                      {addmessage}
                      </div>
                    )}

                    {showEditPopup.isOpen && (
                      <div className="text-center fixed top-0 left-0 w-full h-full flex items-center justify-center ">
                        <div className="bg-white p-4 rounded-lg border-black shadow-lg md:w-[380px] md:h-[150px]  ">
                          {/* เนื้อหาของ popup */}
                          <div className='md:text-[30px]  text-[22px] flex justify-center items-center'>
                          <h2 className= {`font-mitr  text-[18px] md:text-[20px] text-[#5A985E] mt-[10px] `}>{t("Do you want to delete")} <span style={{ color: '#FF6B6B' }} className='mr-2'>{showEditPopup.todo}</span> {t("?")}</h2>
                          </div>
                          <div className="flex justify-center mt-[10px] md:mt-[30px]">
                            <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={() => deleteChecklist(showEditPopup.todo, showEditPopup.checklistname)} >{t('Yes')}</button>
                            <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => closeEditPopup(false)}>{t('Cancel')}</button>
                          </div>
                        </div>
                      </div>
                    )}  
                      
                    </div>
                   
                    
                    {showPopup && (
                      <div className="text-center fixed top-0 left-0 w-full h-full flex items-center justify-center ">
                        <div className="bg-white p-4 rounded-lg py-[30px] shadow-lg border border-gray-200 md:w-[400px] ">
                          {/* เนื้อหาของ popup */}
                          <h2 className='text-[25px] text-[#5A985E]  font-bold'>{t('Add checklist')}</h2>
                            <div className="mt-1">
                              {/* <label htmlFor="name" className="md:text-[18px] font-mitr block text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label> */}
                              <input className='mt-1 p-2 w-full border border-gray-300 rounded-md'value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("add checklist")}/>
                            </div>
                            {/* <div>
                            <input className='mt-1 p-2 w-full border border-gray-300 rounded-md'value={lastname} onChange={(e) => setlastname(e.target.value)}placeholder="Lastname"/>
                            </div> */}
                          <div className="flex justify-center mt-[20px]">
                            <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={addTodo}>{t('Add')}</button>
                            <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => closePopup(false)}>{t('Cancel')}</button>
                          </div>
                          {message && (
                            <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                              {message}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className='h-[300px] '>
                      {/* {!isEditing && (
                        <div className=' md:absolute w-[250px] h-[100px] mt-[20px] md:mt-[-450px] md:ml-[450px] mx-auto'>
                          <p className='font-mitr md:text-[18px] text-sm mb-2'>รายละเอียด</p>
                          <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            className='border border-gray-300 rounded-md md:w-[300px] md:h-[150px] bg-[#F5F5F5] w-[250px] h-[100px] text-sm pl-2 pt-2'
                          />
                        </div>
                      )} */}
                      <div className= {` items-center text-[15px] md:text-[17px] flex justify-end  w-[250px] md:mt-[40px] mt-[60px]  mx-auto md:w-[800px]  md:px-10 `} >
                      {isEditing ? (
                        <button onClick={() => setIsEditing(false)} className={`flex mx-auto   border-[#64CE3F] bg-[#64CE3F] px-10 py-1  rounded-[20px]   text-[#fff] hover:-translate-y-0.5 duration-200  `}>{t('confirm')}</button>
                      ) : (
                        <button
                          onClick={handleSubmit}
                          className={`
                            ${useEmployee === "true" && selectedOption !== "User" ? 'ml-[-12px]' : ''}
                            ${useEmployee === "true" && selectedOption === "User" ? 'mx-auto' : ''}
                            border-[#64CE3F] bg-[#64CE3F] px-10 py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200
                          `}
                        >
                          {t('submit')}
                        </button>
                      )}                      
                      <div>
                      <div className="flex items-center ml-[0px] ">
                      {useEmployee === "false"  && isEditing === false && (
                        <button
                          onClick={openPopup}
                          className=" text-[#5A985E] ml-[10px] text-4xl  hover:-translate-y-0.5 duration-200"
                        >
                          <BsPlusCircleFill />
                        </button>
                      )}

                      {useEmployee === "true" && selectedOption === "Checklist" &&  isEditing === false && (
                        <button
                          onClick={openPopup}
                          className="item-center text-[#5A985E] md:mt-[-3px] ml-[10px] text-4xl hover:-translate-y-0.5 duration-200"
                        >
                          <BsPlusCircleFill />
                        </button>
                      )}
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
export default CompChecklistExamine;
