import fireBase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyBEzUroSdjFzpnLT57FYJKZfHIoQiw7f4k",
  authDomain: "music-app-abac8.firebaseapp.com",
  databaseURL: "https://music-app-abac8.firebaseio.com",
  projectId: "music-app-abac8",
  storageBucket: "music-app-abac8.appspot.com",
  messagingSenderId: "43640355719",
  appId: "1:43640355719:web:51c21c632e09fa36c4f122",
  measurementId: "G-HGGCYN5Q3T",
};

fireBase.initializeApp(config);

export const auth = fireBase.auth();
export const firestore = fireBase.firestore();

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const snapShot = await userRef.get();
  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.log("Error in creating user", error.message);
    }
  }

  return userRef;
};

const provider = new fireBase.auth.GoogleAuthProvider();

provider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default fireBase;