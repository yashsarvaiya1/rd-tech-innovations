// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const APP_IDENTIFIER = "rdtechinnovations";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, APP_IDENTIFIER);

export const rdTechDb = getFirestore(app);
export const rdTechStorage = getStorage(app);
export const rdTechAuth = getAuth(app);

// Namespaced collections
export const collections = {
  content: `${APP_IDENTIFIER}_content`,
  submissions: `${APP_IDENTIFIER}_submission`,
  admins: `${APP_IDENTIFIER}_admins`,
};

// Namespaced storage paths
export const storagePaths = {
  assets: `${APP_IDENTIFIER}/assets/`,
  pdfs: `${APP_IDENTIFIER}/pdfs/`,
};
