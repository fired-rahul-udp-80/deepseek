import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import {AppContextProvider} from "@/context/AppContext";

const inter = Inter({
  variable: "--font-inder",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeepSeek - GreatStack",
  description: "Full Stack Project for Deep Learning and AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <AppContextProvider>
      <html
      lang="en"
      className={`${inter.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
      </AppContextProvider>
    </ClerkProvider>

 
    
  );
}
