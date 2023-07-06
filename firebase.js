import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyBqlsV51OOQvOMrLMJM2sEt_gDO4PEO1eo",

  authDomain: "geogr-1272f.firebaseapp.com",

  projectId: "geogr-1272f",

  storageBucket: "geogr-1272f.appspot.com",

  messagingSenderId: "688841716716",

  appId: "1:688841716716:web:1db3822961cbf5628c86c9",

  measurementId: "G-2NKM0324H1"

};





// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;