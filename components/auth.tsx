"use client"

import "../globals.css"

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import firebaseAuth from "@/lib/firebase/fireAuth";
import { createContext } from "react";

const UserAuth = createContext({
    user: null,

});

const SignIn = async ()=>{
    const provider = new GoogleAuthProvider();
    const selected_user = await signInWithPopup(firebaseAuth,provider);

    console.log(selected_user);
}

export default function AuthContextProvider({children}:any) {
    return (
        <main className="flex w-screen h-screen justify-center items-center bg-gradient-to-r from-emerald-500 to-teal-500">
            <div className="container flex flex-col justify-start items-start w-1/2 h-3/4 min-w-24 min-h-24 bg-slate-50 rounded-xl">
                <div className="auth auth-title">
                    <text className="text-large">
                        오늘의 할일
                    </text>
                </div>
                <div className="auth auth-content">
                    <text className="text-small">
                        오늘 해야할 일들을 계획하고 목표를 달성해보세요.
                        <br/>
                        설치없이 간편하게 이용하실 수 있습니다.
                    </text>
                </div>
            </div>
        </main>
    );
}