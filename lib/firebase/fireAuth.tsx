import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebase_index from ".";

/* index에서  config들을 기반으로 initializeApp 이후 firebase*/
export const firebaseauth = getAuth(firebase_index);
export const firestoreDB = getFirestore(firebase_index);
