// Import necessary modules
import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

// Create a context for language
const LanguageContext = createContext();

// Custom hook to use language context
export function useLanguage() {
  return useContext(LanguageContext);
}

// Language provider component
export function CompLanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const [id, setId] = useState('');

  // Fetch data when the component mounts or 'id' changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedId = localStorage.getItem('id');
        if (storedId) {
          setId(storedId);
        }

        const requestData = { storedId };

        const response = await axios.post('/api/profile', requestData, {
          headers: { 'Content-Type': 'application/json' },
        });

        const resdata = response.data;

        if (response.status === 200 && resdata.success === true) {
          console.log('DATAProfile: ', resdata.profile[0]);
          // Do something with the profile data

          const storedData = localStorage.getItem('rememberedData');
          let rememberedData = [];

          if (storedData) {
            rememberedData = JSON.parse(storedData);

            for (const item of rememberedData) {
              if (item.hasOwnProperty('employee') && resdata.profile[0].employee === item.employee) {
                console.log('Matched storage item: ', item);
                // Set the language from the stored data
                const lang = item.language || 'EN';
                i18n.changeLanguage(lang);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();  // Call the fetchData function
  }, [id, i18n]);  // Depend on 'id' and 'i18n' to trigger the effect when they change

  // Set up language context based on the availability of localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    const [language, setLanguage] = useState(i18n.language);

    const toggleLanguage = () => {
      setLanguage((prevLanguage) => (prevLanguage === 'EN' ? 'TH' : 'EN'));
      const newLanguage = language === 'EN' ? 'TH' : 'EN';
      i18n.changeLanguage(newLanguage);
    };

    const contextValue = { language, toggleLanguage };

    return (
      <LanguageContext.Provider value={contextValue}>
        {children}
      </LanguageContext.Provider>
    );
  } else {
    // If localStorage is not available
    const [language, setLanguage] = useState('EN');

    const toggleLanguage = () => {
      const newLanguage = language === 'EN' ? 'TH' : 'EN';
      setLanguage(newLanguage);
    };

    const contextValue = { language, toggleLanguage };

    return (
      <LanguageContext.Provider value={contextValue}>
        {children}
      </LanguageContext.Provider>
    );
  }
}
