// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Added Firestore import

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsYQ4sVjfFSUMTZFr537LYUFct_0pCW0M",
    authDomain: "jobtrackerportal.firebaseapp.com",
    projectId: "jobtrackerportal",
    storageBucket: "jobtrackerportal.firebasestorage.app",
    messagingSenderId: "404127303755",
    appId: "1:404127303755:web:52f9b64dd90efa0196e5ce",
    measurementId: "G-MTNFD834WS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firestore Database for your components to use
export const db = getFirestore(app);