import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import firebaseConfig from "./config";

const firebaseApp = app.initializeApp(firebaseConfig);
export const db = firebaseApp.firestore();
export const auth = firebaseApp.auth();
export const storage = firebaseApp.storage();

export async function register(name, email, password) {
  try {
    const newUser = await auth.createUserWithEmailAndPassword(email, password);
    return await newUser.user.updateProfile({
      displayName: name,
    });
  } catch (err) {
    alert(err);
  }
}
