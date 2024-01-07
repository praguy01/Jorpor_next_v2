// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useLanguage } from './components/compLanguageProvider_role_1'; // เพิ่มการ import useLanguage


i18n
  .use(initReactI18next)
  .init({
    resources: {
      EN: {
        translation: {
          'Report results': 'Report results',
          Evalution: 'Evalution',
          pass: 'pass',
          fail: 'fail',
          Details: 'Details',
          Inspector: 'Inspector',
          Yes: 'Yes',
          attachments: 'attachments',
          details: 'details',
          confirm: 'confirm',
          submit: 'submit',
          Join: 'Join',
          Phone: 'Phone',
          Line: 'Line',
          Email: 'Email',
          Name: 'Name',
          on: 'on',
          off: 'off',
          No: 'No',
          Add: 'Add',
          Cancel: 'Cancel',
          Activity: 'Activity',
          Edit: 'Edit',
          Profile: 'Profile',
          Plan: 'Plan',
          Meeting: 'Meeting',
          Topic: 'Topic',
          Status: 'Status',
          Location: 'Location',
          Date: 'Date',
          Employee: 'Employee',
          Examine: 'Examine',
          Submit: 'Submit',
          Notify: 'Notify',
          Response: 'Response',
          // เพิ่มข้อความในภาษาอังกฤษที่คุณต้องการ
        },
      },
      TH: {
        translation: {
          Evalution: 'การประเมินผล',
          'Report results': 'ผลการรายงาน',
          pass: 'ผ่าน',
          fail: 'ไม่ผ่าน',
          Details: 'รายละเอียด',
          Inspector: 'ผู้ตรวจสอบ',
          Yes: 'ใช่',
          attachments: 'ไฟล์แนบ',
          details: 'รายละเอียด',
          submit: 'ส่ง',
          confirm: 'ยืนยัน',
          Join: 'เข้าร่วม',
          Phone: 'โทรศัพท์',
          Line: 'ไลน์',
          Email: 'อีเมล์',
          Name: 'ชื่อ',
          on: 'เปิด',
          off: 'ปิด',
          Add: 'เพิ่ม',
          Cancel: 'ยกเลิก',
          No: 'ลำดับ',
          Activity: 'ชื่อกิจกรรม',
          Edit: 'แก้ไข',
          Plan: 'แผนงาน',
          Meeting: 'ประชุม',
          Profile: 'โปรไฟล์',
          Topic: 'หัวข้อ',
          Status: 'สถานะ',
          Location: 'ที่ตั้ง',
          Date: 'วันที่',
          Employee: 'รหัสพนักงาน',
          Examine: 'ตรวจสอบ',
          Submit: 'ส่ง',
          Notify: 'แจ้งเตือน',
          Response: 'ผลแจ้งเตือน',
          // เพิ่มข้อความในภาษาไทยที่คุณต้องการ
        },
      },
    },
    lng: 'EN',
    fallbackLng: 'EN',
    interpolation: {
      escapeValue: false,
    },
  });


export default i18n;
