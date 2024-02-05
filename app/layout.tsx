import type { Metadata } from "next";
import { Poor_Story} from "next/font/google";
import Header from "../components/header";
import "../globals.css";

const inter = Poor_Story({ 
  subsets: ["latin"],
  weight: ["400"]
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
