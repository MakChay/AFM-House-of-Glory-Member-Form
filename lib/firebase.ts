import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA2RZJLzCPxQehF9FtC_nEmQBU2DjL-aEo",
  authDomain: "house-of-glory-form.firebaseapp.com",
  projectId: "house-of-glory-form",
  storageBucket: "house-of-glory-form.firebasestorage.app",
  messagingSenderId: "725540763116",
  appId: "1:725540763116:web:611b798163ed91bf0fbcc9",
  measurementId: "G-QHMMQEE7CL"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
