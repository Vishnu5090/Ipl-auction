import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBqLi8diSCQfbhifrVCfDd_VRfk3LswJjY",
    authDomain: "ipl-auction-1eb84.firebaseapp.com",
    projectId: "ipl-auction-1eb84",
    storageBucket: "ipl-auction-1eb84.firebasestorage.app",
    messagingSenderId: "678392282893",
    appId: "1:678392282893:web:60278477a38c435be0fa44",
    measurementId: "G-LV65VG9RYB"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Test connection
console.log("Firebase initialized:", app.name);

console.log("Firebase auth state:", auth.currentUser);

export { database, auth };