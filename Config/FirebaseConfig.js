// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "book-8d19b.firebaseapp.com",
  projectId: "book-8d19b",
  storageBucket: "book-8d19b.appspot.com",
  messagingSenderId: "21062996969",
  appId: "1:21062996969:web:75f61756ceae4034d3b178",
  measurementId: "G-94SDWFXEV9"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app); 
