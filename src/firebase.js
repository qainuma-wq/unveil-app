import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "unveil-2a361.firebaseapp.com",
  projectId: "unveil-2a361",
  storageBucket: "unveil-2a361.firebasestorage.app",
  messagingSenderId: "662578122728",
  appId: "1:662578122728:web:...",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);