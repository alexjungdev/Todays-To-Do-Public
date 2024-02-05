import Link from "next/link";

import { IoIosLogOut } from "react-icons/io";


export default function Header() {
    return (
        <header className="h-16 flex items-center px-4">
            <text className="text-white text-2xl font-bold">오늘의 할일</text>
            <nav className="ml-auto flex space-x-4">
                <IoIosLogOut size={40} color="white" />
            </nav>
        </header>
    );
}