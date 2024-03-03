import { getAuth } from "firebase/auth";
import firebase_index from ".";

/* index에서  config들을 기반으로 initializeApp 이후 firebase*/
export const firebaseauth = getAuth(firebase_index);
