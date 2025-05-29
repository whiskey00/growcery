import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDA_HCqMgaOkgFhSbxTdPSwR3tcEDtXNjQ",
  authDomain: "growcery-acef4.firebaseapp.com",
  projectId: "growcery-acef4",
  storageBucket: "growcery-acef4.appspot.com",
  messagingSenderId: "799938196330",
  appId: "1:799938196330:web:085dfcf195a405f622eb13",
  measurementId: "G-CT3PHMSTHE",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
