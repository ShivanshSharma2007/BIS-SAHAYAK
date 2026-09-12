import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import FeatureDrawer from "@/components/FeatureDrawer";
import AIAssistant from "@/components/AIAssistant";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BIS Sahayak | AI-Powered Standards & Compliance Intelligence",
  description: "Official BIS Sahayak platform for Indian Standards (BIS) certification, Gold HUID verification, and GeM pre-bid compliance.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

import { NextAuthProvider } from "@/components/NextAuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#F7F9FB] text-slate-900 flex flex-col font-sans`}
      >
        <NextAuthProvider>
          <Header />
          {children}
          <FeatureDrawer />
          <AIAssistant />
        </NextAuthProvider>
      </body>
    </html>
  );
}
