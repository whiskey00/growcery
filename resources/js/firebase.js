import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBojADIPdNkOODjOlIq7lZko9YkEedM2UQ",
  authDomain: "growceryv2.firebaseapp.com",
  projectId: "growceryv2",
  storageBucket: "growceryv2.firebasestorage.app",
  messagingSenderId: "714503942751",
  appId: "1:714503942751:web:5031ad688fa516cbbce1ea",
  measurementId: "G-HPCE0LKMJG",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
