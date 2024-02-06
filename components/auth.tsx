"use client"

import "../globals.css"

import { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";
import firebaseAuth from "@/lib/firebase/fireAuth";
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


export default function AuthContextProvider({ children }: any) {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
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
    }

    

    const SignIn_Google = async () => {
        //기본적으로 LocalStorage 데이터 사용
        //if LocalStorage가 존재하지 않으면 Database에서 직접 Fetch
        const provider = new GoogleAuthProvider();
        try{
            await signInWithPopup(firebaseAuth, provider);
        }
        catch(error){
            throw error;

        }
    }

    const Skip_SignIn = async () => {
        //기본적으로 LocalStorage 데이터 사용
    }

    const SignOut = async () => {
        signOut(firebaseAuth);
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