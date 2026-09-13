import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase only if config is valid (prevent crash on load without env vars)
const isConfigValid = Object.values(firebaseConfig).every(Boolean);

const app = isConfigValid 
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null;

const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

export { app, auth, db, isConfigValid };
