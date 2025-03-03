import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Search, Bookmark, Bell, SquarePlus } from 'lucide-react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex justify-between items-center px-4 py-4 border-b">
          <Link href="/" className="text-xl font-bold">
            InstaKgram
          </Link>
          <div className="flex gap-4">
            <Link href="/login">로그인</Link>
            <Link href="/join">회원가입</Link>
          </div>
        </div>
        
        <div className="flex">
          <nav className="w-64 h-[calc(100vh-65px)] border-r p-4">
            <ul className="space-y-4">
              <li>
                <Link href="/search" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                  <Search size={20} />
                  <span>검색</span>
                </Link>
              </li>
              <li>
                <Link href="/bookmark" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                  <Bookmark size={20} />
                  <span>북마크</span>
                </Link>
              </li>
              <li>
                <Link href="/notice" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                  <Bell size={20} />
                  <span>알림</span>
                </Link>
              </li>
              <li>
                <Link href="/post" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                  <SquarePlus size={20} />
                  <span>만들기</span>
                </Link>
              </li>
            </ul>
          </nav>
          
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}