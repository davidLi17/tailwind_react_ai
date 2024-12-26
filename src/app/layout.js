import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from 'react';

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap'
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap'
});

export const metadata = {
  title: "React音乐播放器",
  description: "React音乐播放器",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin">加载中...</div>
            </div>
          }
        >
          {children}
        </Suspense>
      </body>
    </html>
  );
}