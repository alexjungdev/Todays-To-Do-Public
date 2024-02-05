import Link from "next/link";


export default function Header() {
    return (
        <header className="bg-gradient-to-r from-green-400 to-green-600 h-16 flex items-center px-4">
        <text className="text-white text-2xl font-bold">My App</text>
        <nav className="ml-auto flex space-x-4">
          <a className="text-white hover:text-green-200" href="#">Home</a>
          <a className="text-white hover:text-green-200" href="#">About</a>
          <a className="text-white hover:text-green-200" href="#">Contact</a>
        </nav>
      </header>
    );
}