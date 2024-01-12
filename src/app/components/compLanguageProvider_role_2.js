
// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import axios from 'axios';
// import { LanguageContext } from 'path-to-your-language-context'; // Import LanguageContext from its actual location

// export function CompLanguageProvider({ children }) {
//   const { i18n } = useTranslation();
//   const [id, setId] = useState('');

//   // Fetch data when the component mounts or 'id' changes
//   // Fetch data when the component mounts or 'id' changes
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const storedId = localStorage.getItem('id');
//         if (storedId) {
//           setId(storedId);
//         }

//         const requestData = { storedId };

//         const response = await axios.post('/api/profile', requestData, {
//           headers: { 'Content-Type': 'application/json' },
//         });

//         const resdata = response.data;

//         if (response.status === 200 && resdata.success === true) {
//           console.log('DATAProfile: ', resdata.profile[0]);
//           // Do something with the profile data

//           const storedData = localStorage.getItem('rememberedData');
//           let rememberedData = [];

//           if (storedData) {
//             rememberedData = JSON.parse(storedData);

//             for (const item of rememberedData) {
//               if (item.hasOwnProperty('employee') && resdata.profile[0].employee === item.employee) {
//                 console.log('Matched storage item: ', item);
//                 // Set the language from the stored data
//                 const lang = item.language || 'EN';
//                 i18n.changeLanguage(lang);
//               }
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();  // Call the fetchData function
//   }, [id, i18n]);  // Depend on 'id' and 'i18n' to trigger the effect when they change
//   const [language, setLanguage] = useState(i18n.language);

//   // Set up language context based on the availability of localStorage
//   if (typeof window !== 'undefined' && window.localStorage) {

//     const toggleLanguage = () => {
//       setLanguage((prevLanguage) => (prevLanguage === 'EN' ? 'TH' : 'EN'));
//       const newLanguage = language === 'EN' ? 'TH' : 'EN';
//       i18n.changeLanguage(newLanguage);
//     };

//     const contextValue = { language, toggleLanguage };

//     return (
//       <LanguageContext.Provider value={contextValue}>
//         {children}
//       </LanguageContext.Provider>
//     );
//   } else {
//     // If localStorage is not available
//     const [language, setLanguage] = useState('EN');

//     const toggleLanguage = () => {
//       const newLanguage = language === 'EN' ? 'TH' : 'EN';
//       setLanguage(newLanguage);
//     };

//     const contextValue = { language, toggleLanguage };

//     return (
//       <LanguageContext.Provider value={contextValue}>
//         {children}
//       </LanguageContext.Provider>
//     );
//   }
// }

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import i18n from '../i18n'

const LanguageContext = createContext();

export const CompLanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('');
  const [shouldCallEditLanguage, setshouldCallEditLanguage] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedId = localStorage.getItem('id');
        if (storedId) {
          console.log('Stored: ', storedId);
        }
  
        const AddData = { storedId, lang_role_2: true };
        const data = JSON.stringify(AddData);
        console.log('DD: ', data);
  
        const response = await axios.post('/api/lang', data, {
          headers: { 'Content-Type': 'application/json' },
        });
  
        const resdata = response.data;
        console.log('DATA: ', response.data.dbLang[0]);
  
        if (response.status === 200) {
          if (resdata.success === true) {
            setLanguage(response.data.dbLang[0]);
            i18n.changeLanguage(response.data.dbLang[0]);

            // localStorage.setItem("language", response.data.dbLang[0]);
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
    };
  
    fetchData();
    console.log('LANGGGGG111: ', language);
  
  }, [language]);
  

  const toggleLanguage = async () => {
    setLanguage((prevLanguage) => {
      const newLanguage = prevLanguage === 'EN' ? 'TH' : 'EN';
      i18n.changeLanguage(newLanguage);
      setshouldCallEditLanguage(true);
      return newLanguage;
    });
  };
  
  useEffect(() => {
    const editLanguage = async () => {
      console.log('StoredLanguage: ', language);
  
      try {
        const storedId = localStorage.getItem('id');
        if (storedId) {
          console.log('Stored: ', storedId);
        }
        console.log('D2222: ', language);
        localStorage.setItem("language", language);
  
        const AddData = { storedId, language, edit_lang_role_2: true };
        const data = JSON.stringify(AddData);
        console.log('DD: ', data);
  
        const response = await axios.post('/api/lang', data, {
          headers: { 'Content-Type': 'application/json' },
        });
  
        const resdata = response.data;
        console.log('DATA8888edit: ', response.data.dbLang[0]);
  
        if (response.status === 200) {
          if (resdata.success === true) {
            setLanguage(response.data.dbLang[0]);
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
    };
  
    if (shouldCallEditLanguage) {
      editLanguage();
      setshouldCallEditLanguage(false);
    }
  }, [language, shouldCallEditLanguage]);
  

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a CompLanguageProvider');
  }
  return context;
};