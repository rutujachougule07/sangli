import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeFirestore, getFirestore, Firestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxd9gCvkBqNGzP-y3y4da1WjpSQ7GDj1s",
  authDomain: "bnp-sangli.firebaseapp.com",
  projectId: "bnp-sangli",
  storageBucket: "bnp-sangli.firebasestorage.app",
  messagingSenderId: "670370710865",
  appId: "1:670370710865:web:1f079e9ff81c18dc957f70",
  measurementId: "G-NXLWM4GFC5",
};

// Initialize Firebase safely for HMR
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Initialize other services with forced long polling to avoid transport errors.
// Wrapped in try/catch to handle Vite HMR/hot-reloading cleanly.
let db: Firestore;
try {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
} catch (error) {
  db = getFirestore(app);
}

const auth = getAuth(app);
const storage = getStorage(app);

export { app, analytics, db, auth, storage };
