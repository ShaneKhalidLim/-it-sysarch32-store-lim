// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQIcOwIz_sWGFvqFZSo3dsrFYIGOVm7kM",
  authDomain: "it-sysarch32-store-lim.firebaseapp.com",
  projectId: "it-sysarch32-store-lim",
  storageBucket: "it-sysarch32-store-lim.appspot.com",
  messagingSenderId: "783055590967",
  appId: "1:783055590967:web:301673f294747317a791b2",
  measurementId: "G-9KK646622R"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);

export const storage = getStorage(app);
const analytics = getAnalytics(app);