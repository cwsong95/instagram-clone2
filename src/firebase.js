import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDb0Ge4qq6Ejjp1OVbaJn_skRa3VP2sq4Y",
  authDomain: "instagram-clone-react-81f66.firebaseapp.com",
  databaseURL: "https://instagram-clone-react-81f66-default-rtdb.firebaseio.com",
  projectId: "instagram-clone-react-81f66",
  storageBucket: "instagram-clone-react-81f66.appspot.com",
  messagingSenderId: "976513591491",
  appId: "1:976513591491:web:6b2b4436c28eae63311a76",
  measurementId: "G-QCTCMZ7T7P"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };