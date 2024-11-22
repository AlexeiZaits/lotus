import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAzICZXtuzCJEc_33QHcb1Hx_eTbmDZZZ8",
    authDomain: "lotus-test-task-edc1a.firebaseapp.com",
    projectId: "lotus-test-task-edc1a",
    storageBucket: "lotus-test-task-edc1a.firebasestorage.app",
    messagingSenderId: "567196813919",
    appId: "1:567196813919:web:705b455837652b6ec9e9ea",
    measurementId: "G-6FY9E26HJD",
    databaseUrl: 'https://lotus-test-task-edc1a-default-rtdb.europe-west1.firebasedatabase.app'
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const database = getDatabase(app);