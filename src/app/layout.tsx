"use client";

import {  useEffect } from "react";
import ThemeProvider from "@/components/ThemeProvider";
import SolanaProvider from "@/components/SolanaProvider";
import { Space_Grotesk, Sora } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import Sidebar from "@/components/SideBar";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import AuthWrapper from "../components/AuthWrapper"
import { UserProvider } from "@/context/UserContext";
import { InvoiceProvider } from "@/context/InvoiceContext";
import { Suspense } from "react";
import Head from "next/head";




const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: "700",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: "700",
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const pathname = usePathname();

  useEffect(() => {
    const previous = sessionStorage.getItem("currentPath");
    sessionStorage.setItem("previousPath", previous || "/");
    sessionStorage.setItem("currentPath", pathname);
  }, [pathname]);

  const isAuth = pathname === "/Login";

  // ✅ public payment page
  if (pathname.startsWith("/Public-Pay")) {
    return (
      <html
        lang="en"
        className={`bg-[#0B091A] text-white 
      `}>
        <Head>
          <title>SolaPay</title>
          <link
            rel="icon"
            href="/logo7.svg"
            type="image/svg+xml"
            sizes="180x180"
          />
        </Head>
        <body>
          <Toaster position="top-right" />
          <Suspense>
            <SolanaProvider>{children}</SolanaProvider>
          </Suspense>
          
        </body>
      </html>
    );
  }

  return (
    <html
      lang="en"
      className={`dark:bg-[#0B091A] dark:text-white bg-[#E3EEFF] ${
        isAuth ? "lg:ml-0  lg:mx-0" : "  "
      }
      text-black`}>
      <Head>
        <title>SolaPay</title>
        <link
          rel="icon"
          href="/logo7.svg"
          type="image/svg+xml"
          sizes="180x180"
        />
      </Head>

      <body
        className={`min-h-screen flex flex-col   ${spaceGrotesk.variable} ${sora.variable} antialiased`}>
        <UserProvider>
          <AuthWrapper>
            <SolanaProvider>
              <ThemeProvider>
                {!isAuth && <Header />}

                {!isAuth && <Sidebar />}

                <main className="flex-grow w-full min-h-screen">
                  <Toaster position="top-right" />
                  <InvoiceProvider>{children}</InvoiceProvider>
                </main>
                {!isAuth && <Navigation />}
                {!isAuth && <Footer />}
              </ThemeProvider>
            </SolanaProvider>
          </AuthWrapper>
        </UserProvider>
      </body>
    </html>
  );
}
