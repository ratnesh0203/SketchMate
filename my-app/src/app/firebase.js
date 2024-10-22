// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth} from "firebase/auth";
import { getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCC2gmWd8bLc-ZFJKb90Gho-VrI6XixetM",
  authDomain: "drawing-app-2e9c0.firebaseapp.com",
  projectId: "drawing-app-2e9c0",
  storageBucket: "drawing-app-2e9c0.appspot.com",
  messagingSenderId: "779267764682",
  appId: "1:779267764682:web:ef25cb649e4d4345601f33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const firestore = getFirestore(app);
export const storage = getStorage(app);
