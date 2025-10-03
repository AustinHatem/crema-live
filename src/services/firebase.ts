import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1ftsgRi8oZwuBE2H4EgaEZ-BICfmcITw",
  authDomain: "crema-live.firebaseapp.com",
  projectId: "crema-live",
  storageBucket: "crema-live.firebasestorage.app",
  messagingSenderId: "854751232483",
  appId: "1:854751232483:web:b0c896e325c141df92e0d6",
  measurementId: "G-FMD2D0F4DV"
};

// Initialize Firebase only if it hasn't been initialized already
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Auth (web version)
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { auth, db, storage };
export default app;