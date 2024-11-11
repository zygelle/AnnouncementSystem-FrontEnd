import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDNRH4l_lQ07tDHEfkhGUSOCEwcHDp6ZGQ",
    authDomain: "announcementsystem-frontend.firebaseapp.com",
    projectId: "announcementsystem-frontend",
    storageBucket: "announcementsystem-frontend.firebasestorage.app",
    messagingSenderId: "817941088549",
    appId: "1:817941088549:web:cf6499f712669d3fc6f2cc"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
