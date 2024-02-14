"use client"

import "../globals.css"

import { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";
import { firebaseauth as firebaseAuth} from "@/lib/firebase/fireAuth";
import { createContext } from "react";

export const UserAuth = createContext({
    user: null as User | null,
    loading: false,
    guestMode: false,
    SignIn_Kakao: async () => { },
    SignIn_Google: async () => { },
    Skip_SignIn: async () => { },
    SignOut: async () => { }
});

declare global {
    interface Window {
        Kakao: any;
    }
}

export default function AuthContextProvider({ children }: any) {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [guestMode, setGuestMode] = useState(false);

    useEffect(() => {
        const unsubscribe = firebaseAuth.onAuthStateChanged((authUser) => {
            setUser(authUser);
            setLoading(false);
        });

        // Cleanup function
        return () => unsubscribe();
    }, []);

    const SignIn_Kakao = async () => {
        //기본적으로 LocalStorage 데이터 사용
        //if LocalStorage가 존재하지 않으면 Database에서 직접 Fetch
        const Kakao = window.Kakao;
        if (Kakao && !Kakao.isInitialized()) {
            Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
        }
        try {
            const redirectUri = `${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`;

            await window.Kakao.Auth.authorize({
                redirectUri,
            });
        }
        catch (error) {
            throw error;
        }

    }




    const SignIn_Google = async () => {
        //기본적으로 LocalStorage 데이터 사용
        //if LocalStorage가 존재하지 않으면 Database에서 직접 Fetch
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(firebaseAuth, provider);
        }
        catch (error) {
            throw error;

        }
    }

    const Skip_SignIn = async () => {
        //기본적으로 LocalStorage 데이터 사용
        setGuestMode(true);
    }

    const SignOut = async () => {
        if (user) {
            signOut(firebaseAuth);
        }
        else {
            if (guestMode)
                setGuestMode(false);
        }

    }

    const values = {
        user,
        loading,
        guestMode,
        SignIn_Kakao,
        SignIn_Google,
        Skip_SignIn,
        SignOut
    }

    return <UserAuth.Provider value={values}>{children}</UserAuth.Provider>;
}