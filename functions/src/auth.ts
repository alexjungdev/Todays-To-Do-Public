import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import { UserRecord } from "firebase-admin/auth";

import axios from "axios";
import { config } from "dotenv";
config();

import { KakaoUser } from "../types";

interface TokenResponse {
  access_token: string;
  token_type: string;
  id_token?: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope?: string;
}

const getToken = async (code: string): Promise<TokenResponse> => {
  const body = new URLSearchParams();
  body.append("grant_type", "authorization_code");
  body.append("client_id", process.env.KAKAO_API_KEY || "");
  body.append("redirect_uri", process.env.KAKAO_REDIRECT_URI || "");
  body.append("code", code);

  const headers = {
    "content-type": "application/x-www-form-urlencoded;charset=utf-8",
  };

  const res = await axios.post(
    "https://kauth.kakao.com/oauth/token",
    body, {headers}
  );

  return res.data;
};

const getKakaoUser = async (token: string): Promise<KakaoUser> => {
  const res = await axios.get(
    "https://kapi.kakao.com/v2/user/me", { //현재 로그인한 사용자의 정보 불러오는 Kakao URL
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const getAdmin = () => {
  const firebaseAdminSDK = JSON.parse(process.env.FIREBASE_ADMIN_SDK || "");
  const app = !admin.apps.length ?
    admin.initializeApp({
      credential: admin.credential.cert(firebaseAdminSDK),
    }) :
    admin.app();

  return app;
};

const updateOrCreateUser = async (user: KakaoUser): Promise<UserRecord> => {
  const app = getAdmin();
  const auth = admin.auth(app);

  const kakaoAccount = user.kakao_account;
  const properties = {
    uid: `kakao:${user.id}`,
    provider: "KAKAO",
    email: kakaoAccount?.email,
  };

  try {
    return await auth.updateUser(properties.uid, properties);
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      return await auth.createUser(properties);
    }
    throw error.code;
  }
};

const app = express();
app.use(cors({ origin: ["https://todays-to-do.com"]}));//출시할때 origin은 특정 주소로 고정하기
app.post("/", async (req:any, res:any) => { //1.Kakao에서 code 전달받기
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({
      code: 400,
      message: "You need to specify the code",
    });
  }

  const response = await getToken(code); //2.code를 이용하여 토큰 발급
  const token = response.access_token;
  const kakaoUser = await getKakaoUser(token); //3.토큰으로 사용자 정보 받아오기
  const authuser = await updateOrCreateUser(kakaoUser);
  const firebaseToken = await admin
    .auth()
    .createCustomToken(authuser.uid, { provider: "KAKAO" });

  return res.status(200).json(
    {
      kakaoUser: {
        ...kakaoUser,
      },
      firebaseToken,
    });
});

export { app as auth };
