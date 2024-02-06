"use client"

import "../globals.css"

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import firebaseAuth from "@/lib/firebase/fireAuth";
import { createContext } from "react";

import { RiKakaoTalkFill } from "react-icons/ri";
import { FaGoogle } from "react-icons/fa";

const UserAuth = createContext({
    user: null,

});

const SignIn = async () => {
    const provider = new GoogleAuthProvider();
    const selected_user = await signInWithPopup(firebaseAuth, provider);

    console.log(selected_user);
}

export default function AuthContextProvider({ children }: any) {
    return (
        <main className="flex w-screen h-screen justify-center items-center bg-gradient-to-r from-emerald-500 to-teal-500">
            <div className="flex flex-col justify-start items-start w-11/12 h-11/12 bg-slate-50 rounded-xl shadow-2xl">
                <div className="auth auth-title">
                    <text className="text-large">
                        오늘의 할일
                    </text>
                </div>
                <div className="auth auth-content">
                    <text className="text-small">
                        오늘 해야할 일들을 계획하고 목표를 달성해보세요.
                        <br />
                        설치없이 간편하게 이용하실 수 있습니다.
                    </text>
                </div>
                <div className="auth auth-container">
                    <div className="auth auth-img-container">
                        <img src="undraw_studying_re_deca.svg"/>
                    </div>
                    <div className="auth auth-btn-container">
                        <button className="auth-btn yellow">
                            <RiKakaoTalkFill size={10} color={"white"} className="auth-btn-icon" />
                            <text className="text-small auth-btn-text font-bold tracking-tighter text-white">
                                카카오톡으로 시작하기
                            </text>
                        </button>
                        <button className="auth-btn red">
                            <FaGoogle size={10} color={"white"} className="auth-btn-icon" />
                            <text className="text-small auth-btn-text font-bold tracking-tighter text-white">
                                구글로 시작하기
                            </text>
                        </button>
                    </div>
                </div>

            </div>
        </main>
    );
}