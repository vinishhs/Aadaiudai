import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDsJJm-quaEiWHCIACAGpg1U5R0BU3e1w8",
    authDomain: "aadaiudai.firebaseapp.com",
    projectId: "aadaiudai",
    storageBucket: "aadaiudai.firebasestorage.app",
    messagingSenderId: "456270478166",
    appId: "1:456270478166:web:9e254d36eefcd5fcacf4f7",
    measurementId: "G-MMZKFCE8QP"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { auth };
