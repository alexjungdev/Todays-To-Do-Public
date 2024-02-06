"use client"

import Link from "next/link";

import { useContext } from "react";
import { IoIosLogOut } from "react-icons/io";

import SignIn from "@/components/signin";
import { UserAuth } from "@/components/auth";

  
export default function Header() {

    const { user, loading, guestMode, SignOut } = useContext(UserAuth);

    if (!user) {
        return;
      }

    return (
        <header className="h-16 flex items-center px-4">
            <text className="text-white text-2xl font-bold">오늘의 할일</text>
            <nav className="ml-auto flex space-x-4">
                <IoIosLogOut size={40} color="white" />
            </nav>
        </header>
    );
}