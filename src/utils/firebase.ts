import firebase from 'firebase';
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID,
  vapidKey: process.env.REACT_APP_FIREBASE_VAPIDKEY,
};
const firebaseAuth = {
  user: process.env.REACT_APP_FIREBASE_USER || '',
  password: process.env.REACT_APP_FIREBASE_PASSWORD || '',
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}
firebase
  .auth()
  .signInWithEmailAndPassword(firebaseAuth.user, firebaseAuth.password)
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log({ errorCode, errorMessage });
  });
