import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "sonner";
import { ConversationProvider } from "@/app/_contexts/ConversationProvider";

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
  children 
}: {
  children: React.ReactNode;
}) {
  return (
    <ConversationProvider>
      {children}
      <Toaster position="top-right" duration={2000} className="translate-y-[50px]" />
    </ConversationProvider>
  );
}