import * as functions from "firebase-functions";
import {auth} from "./auth";
import {db} from "./db";

exports.auth = functions
  .runWith({ secrets: ["FIREBASE_ADMIN_SDK"] })
  .https.onRequest(auth);

exports.database = functions
.runWith({ secrets: ["FIREBASE_ADMIN_SDK"] })
.https.onRequest(db);
// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
