"use client"

import "../globals.css"

import { useContext, useEffect } from "react";
import { IoIosLogOut } from "react-icons/io";

import { UserAuth } from "@/components/auth";


export default function Header() {

    const { user, loading, guestMode, SignOut } = useContext(UserAuth);

    if (!user && !guestMode) {
        return;
    }

    return (
        <header className="h-16 flex items-center px-4">
            <text className="text-large text-white">오늘의 할일</text>
            <nav className="ml-auto flex space-x-4">
                <button onClick={SignOut}>
                    <IoIosLogOut size={40} color="white" />
                </button>
            </nav>
        </header>
    );
}