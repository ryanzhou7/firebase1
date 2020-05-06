import firebase from "firebase/app"; // import firebase, imports everything
import "firebase/firestore"; // aka database
import "firebase/auth"; // auth

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: `${process.env.apiKey}`,
  authDomain: "think-piece-8b070.firebaseapp.com",
  databaseURL: "https://think-piece-8b070.firebaseio.com",
  projectId: "think-piece-8b070",
  storageBucket: "think-piece-8b070.appspot.com",
  messagingSenderId: "1001308372341",
  appId: "1:1001308372341:web:1c1906f54d2f725d48273c",
  measurementId: "G-M6N1124MR9",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// just for playing around
window.firebase = firebase;

// db
const firestore = firebase.firestore();

// auth
const auth = firebase.auth();

// onClick={signOut} will sign them out
const signOut = auth.signOut();

// For the sign in technique what is the auth
const provider = new firebase.auth.GoogleAuthProvider();

// set onClick={signInWithGoogle}
const signInWithGoogle = () => auth.signInWithPopup(provider);

// Creates a user profile document, we need this because we also want to store things
// in addition to just the email (like display name)
const createUserProfileDocument = async (user, additionalData) => {
  if (!user) return;

  // Points to where the user should be if they are in the database
  const userRef = firestore.doc(`users/${user.uid}`);

  // Actually do the fetch
  const snapshot = await userRef.get();

  // There is no user with this id
  if (!snapshot.exist) {
    const { displayName, email, photoURL } = user;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  return getUserDocument(user.uid);
};

const getUserDocument = async (uid) => {
  if (!uid) return;
  try {
    const userDocument = firestore.collection("users").doc(uid).get();
    return { uid, ...userDocument };
  } catch (error) {
    console.error(error.message);
  }
};

export default firebase;
//firebase.analytics();

export {
  firestore,
  auth,
  signOut,
  provider,
  signInWithGoogle,
  createUserProfileDocument,
  getUserDocument,
};
