// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";  // For file storage
import { getFirestore } from "firebase/firestore";   
import { isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-c0w9XiPgG3tqsrQ-NvttOcBBxQyoe9I",
  authDomain: "upload-file-f7705.firebaseapp.com",
  projectId: "upload-file-f7705",
  storageBucket: "upload-file-f7705.firebasestorage.app",
  messagingSenderId: "775371081259",
  appId: "1:775371081259:web:9959cfa91ae67aa93f4c6e",
  measurementId: "G-VL07PT3SDK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics only on the client-side (browser)
let analytics;
if (typeof window !== "undefined" && isSupported()) {
  analytics = getAnalytics(app);
}

const storage = getStorage(app);  // Use the modular method for storage
const firestore = getFirestore(app);  // Use the modular method for Firestore

export { storage, firestore, analytics };