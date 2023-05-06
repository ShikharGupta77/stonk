import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA7rI9e8XGye4MLtrT9o1wUrm__HeATGYQ",
    authDomain: "stonk-9d591.firebaseapp.com",
    projectId: "stonk-9d591",
    storageBucket: "stonk-9d591.appspot.com",
    messagingSenderId: "513069142789",
    appId: "1:513069142789:web:f3a75668c8db33694cdd6c",
    measurementId: "G-BCLMYS4V34",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth, db };

// db
// -- users
//      -- email
//      -- # of stocks
//      -- $ amount
// -- current stock price
// -- stock price history ([t=0, t=1, t=2])
