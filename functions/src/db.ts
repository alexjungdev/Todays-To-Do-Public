import express from "express";
import cors from "cors";
import admin from "firebase-admin";

const getAdmin = () => {
    const firebaseAdminSDK = JSON.parse(process.env.FIREBASE_ADMIN_SDK || "");
    const app = !admin.apps.length ?
      admin.initializeApp({
        credential: admin.credential.cert(firebaseAdminSDK),
      }) :
      admin.app();

    return app;
  };

const app = express();
app.use(cors({ origin: ["https://todays-to-do.com"]}));
app.post("/", async (req:any, res:any) => {
    const { id, todosByDate } = req.body;
    if (!id || id == "guest") {
        return res.status(400).json({
            code: 400,
            message: "Wrong id!",
        });
    }

    const app = getAdmin();
    const db = admin.firestore(app);

    db.collection("todo_list").doc(id).set(todosByDate);


    return res.status(200).json({ msg: "Success" });
}
);

app.get("/", async (req:any, res:any) => {
    const {id} = req.query;

    const app = getAdmin();
    const db = admin.firestore(app);

    const data = db.collection("todo_list").doc(id?.toString() || "");
    const document = await data.get();
    if (!document.exists) {
        res.status(400).send("Bad Request");
    }

    return res.status(200).json(document.data());
});

export { app as db };
