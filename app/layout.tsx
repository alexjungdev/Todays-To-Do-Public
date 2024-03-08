import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Header from "../components/header";
import AuthContextProvider from "@/components/auth";

import "../globals.css";

const inter = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300"]
});

export const metadata: Metadata = {
  title: '오늘의 할일',
  description: '오늘의 할일을 간단하게 작성해보세요.'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <title>오늘의 할일</title>
        <meta property="og:title" content="오늘의 할일" />
        <meta property="og:type" content="website" />
        <meta property="og:article:author" content="오늘의 할일" />
        <meta name="description" content="오늘의 할일을 간단하게 작성해보세요." />
        <link rel="shortcut icon" href="/favicon.ico" />
        <script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js"
          integrity={process.env.NEXT_PUBLIC_INTEGRITY_VALUE}
          crossOrigin="anonymous" defer></script>
      </head>
      <body className={inter.className}>
        <AuthContextProvider>
          <Header />
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
