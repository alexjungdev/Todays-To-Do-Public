"use client"
import { UserAuth } from "@/components/auth";
import { signInWithCustomToken } from "firebase/auth";
import { firebaseauth } from "@/lib/firebase/fireAuth";

import { useEffect, useContext } from "react";
import axios, { AxiosResponse } from "axios";
import { RotatingLines } from "react-loader-spinner";

interface KakaoAccount {
    has_email: boolean;
    email_needs_agreement: boolean;
    is_email_valid: boolean;
    is_email_verified: boolean;
    email: string;
}

interface KakaoUser {
    id: number;
    connected_at: string;
    kakao_account: KakaoAccount;
}

interface KakaoUserResponse {
    kakaoUser: KakaoUser;
  }

  interface Auth {
    firebaseToken: string;
  }

export default function KakaoAuthLoading() {

    useEffect(() => {
        (async () => {
            try {
                const code = new URL(window.location.href).searchParams.get('code');
                const response: AxiosResponse<Auth> = await axios.post(`api/auth`, { code });

                const {firebaseToken} = response.data;
                await signInWithCustomToken(firebaseauth, firebaseToken);
                //const kakaoUser = response.data.kakaoUser;
            } catch (error) { }
        })();
    }, []);

    return (
        <div>
            <RotatingLines

                visible={true}
                width="64"
                strokeColor="green"
                strokeWidth="3"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
            />
        </div>
    );
}