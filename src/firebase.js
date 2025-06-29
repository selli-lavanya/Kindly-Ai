// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "kindlyai.firebaseapp.com",
  projectId: "kindlyai",
  storageBucket: "kindlyai.firebasestorage.app",
  messagingSenderId: "358337351502",
  appId: "1:358337351502:web:fb53bf7497a296538ed81f",
  measurementId: "G-267V4BSNNQ",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
