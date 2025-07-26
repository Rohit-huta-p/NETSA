// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "talentmatch-onboarding",
  "appId": "1:968482769406:web:427fad1c93d0de7c1dd8af",
  "storageBucket": "talentmatch-onboarding.firebasestorage.app",
  "apiKey": "AIzaSyBHaulnyvCVpsGt1jpt--5fAJ5InWUOrPk",
  "authDomain": "talentmatch-onboarding.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "968482769406"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
