'use client'
import '../globals.css'
import '@fontsource/mitr';
import CompNavbar from './compNavbar/role_1';
import axios from 'axios';
import React, { useState ,useEffect } from 'react';
import {useLanguage } from './compLanguageProvider_role_1';
import { useTranslation } from 'react-i18next';



// function  {
//   return (
//     <CompLanguageProvider>
//       <App />
//     </CompLanguageProvider>
//   );
// }

// function App() {

export default function CompReportResultsForm({ onSubmit }) {

  const { language} = useLanguage();
  const { t } = useTranslation();
  // const [reloadData, setReloadData] = useState(false); // เพิ่ม state นี้
  const [id, setId] = useState('');
  const [date, setDate] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [checkList, setcheckList] = useState([]);
  const [nameExamineList , setNameExamineList] = useState(''); 
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedExamineOption, setSelectedExamineOption] = useState('');
  const [nameExamine , setNameExamine] = useState(''); 
  const [useEmployee , setUseEmployee] = useState(''); 
  const [selected, setSelected] = useState(false);
  const [selectednameOption, setSelectednameOption] = useState(false);

  // const [fetchDataExamineMemoized, setFetchDataExamineMemoized] = useState(false);


  useEffect(() => {
    
    // ใน useEffect นี้คุณสามารถใช้ Axios เพื่อดึงข้อมูลจากฐานข้อมูล
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const user_IdValue = searchParams.get('id') ; // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า
      const dateValue = searchParams.get('date') ; // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า

     
      console.log("queryDataexamine: ",{user_IdValue , dateValue })

    const fetchData = async () => {
      try {
        const AddData = { user_IdValue , dateValue , user_IdValue , fetch: true};
        const fetchdata = JSON.stringify(AddData);

        const response = await axios.post('/api/reportResults', fetchdata, {
          headers: { 'Content-Type': 'application/json' },
        });    
        const data = response.data;

        if (response.status === 200) {
          if (data.success === true) {
           
            console.log("Data1222: ",data.dbnameExamineList)
            setSelectedOption(data.dbnameExamineList[0]);
            setNameExamineList(data.dbnameExamineList);
            setSelectednameOption(true)


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
    setMessage('');
    setId(user_IdValue);
    setDate(dateValue);
    fetchData();
  } else {
    console.log("ERRORRR")
  }

  }, []); // โหลดข้อมูลเมื่อค่า state reloadData เปลี่ยนแปลง

 
 
  // useEffect(() => {
    const fetchDataForSelectedOption = async () => {
      try {
        console.log('Selected Option: ', selectedOption);
  
        const AddData = { selectedOption, id, option: true };
        const data = JSON.stringify(AddData);
        console.log('BB: ', data);
  
        const response = await axios.post('/api/reportResults', data, {
          headers: { 'Content-Type': 'application/json' },
        });
  
        const resdata = response.data;
        console.log('DATA111: ', resdata);
  
        if (response.status === 200) {
          if (resdata.success === true) {
            setNameExamine(resdata.dbExamine)
            console.log("000: ", resdata.dbExamine[0])
            setSelectedExamineOption(resdata.dbExamine[0])
            console.log('selectexamine: ', resdata.dbExamine[0]);
            setSelected(true)
            // setFetchDataExamineMemoized(true)
          } else {
            setMessage(resdata.error);
          }
        } else {
          setMessage(resdata.error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('');
      }
      setMessage('');
      setSelected(true)

    };
  
    // if (selectedOption) {
    //   fetchDataForSelectedOption();
    // }
  // }, [selectedOption,id]);
  


  // useEffect(() => {
  //   if (selectedOption) {
  //     fetchDataForSelectedOption();
  //   }
  // }, [selectedOption]);

  // useEffect(() => {
  //   if (selectedExamineOption) {
  //     fetchDataExamine();
  //   }
  // }, [selectedExamineOption]);

  

  const handleDropdownChange = (event) => {
    console.log("event.target.value1: ",event.target.value)
    setSelectedOption(event.target.value); // เมื่อเลือกตัวเลือกใน Dropdown ให้อัปเดต state
    setSelectednameOption(true)

  };


  const handleDropdownExamineChange = (event) => {
    console.log("event.target.value2: ",event.target.value)
    setSelectedExamineOption(event.target.value); // เมื่อเลือกตัวเลือกใน Dropdown ให้อัปเดต state
    setSelected(true)


  };

  const fetchDataExamine = async () => {
    try {
      console.log("SelectedExamineOption2: ",selectedExamineOption)

      const AddData = { selectedOption ,selectedExamineOption ,id, selectExamine: true};
      const fetchdata = JSON.stringify(AddData);

      // console.log("444: ",fetchdata)

      const response = await axios.post('/api/reportResults', fetchdata, {
        headers: { 'Content-Type': 'application/json' },
      });    
      const data = response.data;

      if (response.status === 200) {
        if (data.success === true) {
         
          console.log("Datamm: ",data.dbData,data.useEmployee)
     
          if (data.useEmployee === false){
          let checklistToAdd = [];
          

          
          const dbData = data.dbData || [];
          dbData.forEach((checkListData) => {
            const Data = {
              examinename: checkListData.examinename,
              details: checkListData.details,
              status: checkListData.status
            };
             checklistToAdd.push(Data);
             const Data_1 = {
              date: checkListData.date,
              name: checkListData.name,
              lastname: checkListData.lastname

            };
            setcheckList(Data_1)
            console.log("data.dbData: ",checkList)

        })

          
          const newTodoList = [...checklistToAdd];
          setTodoList(newTodoList)
          setUseEmployee(false)
          console.log("datachecklist: ",newTodoList)

        } else if (data.useEmployee === true){
          console.log("TRUEEEEEEEEEE:  ",data.dbData)
          setUseEmployee(true)
          let checklistToAdd = [];
          

          
          const dbData = data.dbData || [];
          dbData.forEach((checkListData) => {
            console.log("checkListData: ",checkListData)

            checkListData.items.forEach((item) => {
              item.forEach((items) => {
                console.log("items: ",items)

            const Data = {
              name: checkListData.name,
              examinename: item.examinename_name,
              details: item.details,
              status: item.status
            };
            
            })
             const Data_1 = {
              name: checkListData.name,

            };
            setcheckList(Data_1)
            console.log("data.dbData: ",checkList)
          })
        })

        checklistToAdd.push(data.dbData);

          const newTodoList = [...data.dbData];
          setTodoList(newTodoList)
          console.log("datachecklist: ",newTodoList)
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
    setMessage('');

  }

  useEffect(() => {

    if (selected) {
      fetchDataExamine();
      setSelected(false)

    }
  }, [fetchDataExamine, selected]);

  useEffect(() => {

    if (selectednameOption) {
      fetchDataForSelectedOption();
      setSelectednameOption(false)

    }
  }, [fetchDataForSelectedOption, selectednameOption]);

  // useEffect(() => {
  //   // โค้ดที่ใช้งาน fetchDataExamine จะเป็นที่นี่
  //   if (selectedExamineOption) {
  //     fetchDataExamineMemoized();
  //   }
  // }, [selectedExamineOption, selectedOption, id, fetchDataExamineMemoized]);
  
  
  


  const [formData, setFormData] = useState({
    title: '',
    employee: '',
    location: '',
    work_owner: '',
    status: '',
    dateTime: '',
    file: null,
    file_name: '',
    detail: '',
  });

  const [uploadedImage, setUploadedImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
  
    if (name === 'file') {
      // หากเป็นฟิลด์ 'file' ให้ดึงข้อมูลของไฟล์และเก็บชื่อไฟล์
      setFormData({
        ...formData,
        [name]: files[0],
        fileName: files[0] ? files[0].name : '', // กำหนดชื่อไฟล์
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };


  const handleSubmit = async () => {
    // if (
    //   formData.detail === ''
    // ) {
    //   setMessage('Please fill out all required fields.');
    // } else {
    const isSuccess = await onSubmit(formData);

    if (isSuccess) {
      setMessage('');
    } else {
      setMessage('An error occurred while submitting the data.');
    }
  // }
  };


    
  return (
    <div>
      
      <CompNavbar/>
        
      <div className=' bg-[url("/bg1.png")]  overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
        <div className='md:w-[800px] lg:w-[1000px] mx-auto '>
          <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
             <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
          </div>

          <div className='mx-auto w-[300px] md:w-[700px] lg:w-[800px] font-ntr mb-[50px]  py-[30px] text-black flex flex-col  bg-[#FFF] text-center md:rounded-[50px] rounded-[30px] mt-[106px]  '>
          
                    <div >
                    <div className= ' font-mitr font-bold text-[20px] md:text-[25px] ml-[20px] md:ml-[50px] w-[258px] md:w-[600px]  '>
                    {/* <p className='text-[#000] text-[15px] md:text-[16px] font-mitr md:mt-[20px]  text-left  mt-[5px] '>ข้อมูลตรวจสอบวันนี้</p> */}
                    <h1 className=' text-[#5A985E]  ml-[10px] md:ml-[0] md:w-[300px]  text-left  '>  {t("Verified information")}</h1>
                    <div className="mt-[5px] md:mt-[10px] md:ml-[-30px] border-t md:border w-full md:w-[650px] lg:w-[750px] border-gray-300"></div>


                    <div className='text-black text-left ml-[10px] md:ml-[0]  mt-[15px]  md:mt-[0] flex'>
                    <select
                      className="    text-[13px] md:text-[16px] font-mitr md:mt-[20px]  border border-gray-400 rounded-md pl-1 "
                      value={selectedOption}
                      onChange={handleDropdownChange}
                      
                    >
                      
                      {nameExamineList.length > 0 && nameExamineList.map((name, index) => (
                        <option key={index} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>

                    <select
                      className=" ml-[15px]    text-[13px] md:text-[16px] font-mitr md:mt-[20px]   border border-gray-400 rounded-md pl-1 "
                      value={selectedExamineOption}
                      onChange={handleDropdownExamineChange}
                    >
                      {nameExamine.length > 0 && nameExamine.map((name, index) => (
                        <option key={index} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                    </div>
                    </div>
                    </div>

                    <div className='mx-auto md:w-[620px] lg:w-[705px] text-black '>

                    <div className='flex items-center  mt-[15px]  text-[13px] md:text-[16px] font-mitr md:mt-[20px] text-left ml-[10px] md:ml-[10px] '>
                    <p>{t('Date')}</p>
                    <p className='ml-[10px] '>:</p>
                    <p className=' ml-[10px]'>{date}</p>

                    </div>

                    <div className='flex items-center mt-[8px]  text-[13px] md:text-[16px] font-mitr md:mt-[15px] text-left ml-[10px] md:ml-[10px] '>
                    
                    <p>{t('Inspector')}</p>
                    <p className='ml-[10px]'>:</p>
                    <p className='ml-[10px] w-[150px]  md:w-[300px] whitespace-nowrap overflow-hidden overflow-ellipsis'>{checkList.name}  {checkList.lastname}</p>

                    </div>

                    <div className='mx-auto'>

                      <div className='h-[300px]  md:w-[610px] lg:w-[690px] px-2 font-mitr  text-black text-center mt-[15px] mx-auto justify-center text-sm md:text-[18px] rounded-[10px] w-[235px] py-2 md:py-4 bg-[#F5F5F5] ml-[5px]  overflow-auto'>
                        
                        {useEmployee === false && (
                        <div className="w-full ">
                          <table className="min-w-full   divide-gray-200 ">
                            <thead className="bg-gray-50 sticky top-0 z-10 ">
                              <tr className='text-center '>
                              <th scope="col"  style={{ whiteSpace: 'nowrap' }} className="border px-6 py-3  text-xs text-gray-500 uppercase tracking-wider">
                                  {t('No')}
                                </th>
                                <th scope="col"  style={{ whiteSpace: 'nowrap' }} className="border px-6  py-3 text-xs  text-gray-500 uppercase tracking-wider">
                                  {t('Name')}
                                </th>
                                <th scope="col"  style={{ whiteSpace: 'nowrap' }} className="border px-6 py-3  text-xs  text-gray-500 uppercase tracking-wider">
                                  {t('Status')}
                                </th>
                                <th scope="col"  style={{ whiteSpace: 'nowrap' }} className="border px-6 py-3  text-xs  text-gray-500 uppercase tracking-wider">
                                  {t('Details')}
                                </th>
                                
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 ">
                              {todoList.map((item , index) => (
                                <tr key={index} className='text-center'>
                                <td className="px-6 py-4 border whitespace-nowrap">
                                  <div >{index + 1}</div>
                                </td>
                                <td className="px-6 py-4 border whitespace-nowrap">
                                  <div className="text-left">{item.examinename}</div>
                                </td>
                                <td className={`px-6 py-4 border whitespace-nowrap ${item.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                                  <div>{item.status}</div>
                                </td>
                                <td className="px-6 py-4 border whitespace-nowrap">
                                  <div>{item.details}</div>
                                </td>
                              </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                         )}
                         
                         {useEmployee === true && (
                          <>
                          {/* {console.log("TESTTTTT: ", todoList)} */}
                          {todoList.map((item, index) => (
                            <div key={index}>
                              {/* {console.log("TESTTTTT111111111: ", item)} */}
                              <div className="mt-[10px] md:mt-[10px] md:ml-[-30px] border-t md:border w-full md:w-[750px] border-gray-300"></div>
                              <h1 className='text-left mt-[10px]'>{index + 1}. {item.employee} {item.name} </h1>
                              <div className="mt-[5px] md:mt-[10px] md:ml-[-30px] border-t md:border w-full md:w-[750px] border-gray-300"></div>

                              <table className="min-w-full divide-gray-200 mt-[10px]">
                                <thead className="bg-gray-50 top-0 z-10">
                                  <tr className='text-center'>
                                    <th scope="col" style={{ whiteSpace: 'nowrap' }} className="border px-6 py-3 text-xs text-gray-500 uppercase tracking-wider">
                                      {t('No')}
                                    </th>
                                    <th scope="col" style={{ whiteSpace: 'nowrap' }} className="border px-6 py-3 text-xs text-gray-500 uppercase tracking-wider">
                                      {t('Name')}
                                    </th>
                                    <th scope="col" style={{ whiteSpace: 'nowrap' }} className="border px-6 py-3 text-xs text-gray-500 uppercase tracking-wider">
                                      {t('Status')}
                                    </th>
                                    <th scope="col" style={{ whiteSpace: 'nowrap' }} className="border px-6 py-3 text-xs text-gray-500 uppercase tracking-wider">
                                      {t('Details')}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {item.items.map((entry, entryIndex) => (
                                    entry.map((data, dataIndex) => (
                                      <tr key={dataIndex} className='text-center'>
                                        {/* {console.log("RRRRRRRRRR: ", entry)} */}
                                        <td className="px-6 py-4 border whitespace-nowrap">
                                          <div>{dataIndex + 1}</div>
                                        </td>
                                        <td className="px-6 py-4 border whitespace-nowrap">
                                          <div className="text-left">{data.examinename_name}</div>
                                        </td>
                                        <td className={`px-6 py-4 border whitespace-nowrap ${data.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                                          <div>{data.status}</div>
                                        </td>
                                        <td className="px-6 py-4 border whitespace-nowrap">
                                          <div>{data.details}</div>
                                        </td>
                                      </tr>
                                    ))
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ))}
                        </>
                        )}
                        </div>
                        
                          
                          </div>
      
                                  
                          </div>


{/*                     
                    {formData.file && ( // เช็คว่ามีรูปภาพใน formData.file หรือไม่
                      <div>
                        <h3>รูปภาพที่อัพโหลด</h3>
                        <img src={URL.createObjectURL(formData.file)} alt="รูปภาพที่อัพโหลด" />
                      </div>
                    )} */}
      

                {/* <div >
                    <p className='font-mitr text-[#808080] text-[13px] md:text-[16px] ml-[-160px] md:ml-[-620px] mt-[20px]  md:mt-[15px]'>{t('details')}</p>
                    <textarea type="text" name="detail" value={formData.detail} onChange={handleInputChange} className='align-text-top rounded-[10px] mt-[5px] pl-[15px] w-[230px]  text-[14px] md:ml-[-25px] h-[100px] md:text-[16px] md:w-[680px] md:h-[80px] bg-[#fff] border border-gray-300  p-4 '/>
                </div> */}
              

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

                <div className=  {`font-mitr text-[15px] md:text-[17px]  flex items-center mx-auto md:px-10  md:mt-[20px]`} >
                  {/* <button type= "submit" href="/NotifyTwo" className=' mt-[20px] text-md md:text-[20px] md:ml-[480px] border-[#64CE3F] bg-[#64CE3F] px-10  py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 '>Submit</button> */}
                    <button type='submit' onClick={handleSubmit} className=' mt-[20px]   border-[#64CE3F] bg-[#64CE3F] px-10  py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 '>{t('confirm')}</button>
                   

                   
                </div>
              {/* </form> */}
              
        

          </div> 
          </div>
        </div>
        </div>
    ) 
 }
  