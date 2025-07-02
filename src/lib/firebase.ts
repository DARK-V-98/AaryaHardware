import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARzGUQpki7TrzmlSZSoSS4FuwcOyWNoEc",
  authDomain: "aarya-bathware.firebaseapp.com",
  projectId: "aarya-bathware",
  storageBucket: "aarya-bathware.firebasestorage.app",
  messagingSenderId: "480140706464",
  appId: "1:480140706464:web:5ca9db86c04023743d3fc5"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
