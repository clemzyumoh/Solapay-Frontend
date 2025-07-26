// components/LayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import SolanaProvider from "./SolanaProvider";
import ThemeProvider from "./ThemeProvider";
import Sidebar from "./SideBar";
import Header from "./Header";
import Navigation from "./Navigation";
import Footer from "./Footer";
import AuthWrapper from "./AuthWrapper";
import { UserProvider } from "@/context/UserContext";
import { InvoiceProvider } from "@/context/InvoiceContext";
import PageTracker from "./PageTracker";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuth = pathname === "/Login";

  const isPublicPay =
    pathname.startsWith("/Public-Pay") || pathname.startsWith("/public-pay");

  // ✅ special layout for public payment pages
  if (isPublicPay) {
    //  console.log("PublicPay Layout detected");
    return (
      <div className="bg-[#0B091A] text-white min-h-screen h-full">
        <Toaster position="top-right" />

        <Suspense>
          <SolanaProvider>{children}</SolanaProvider>
        </Suspense>
      </div>
    );
  }

  //const isPublicPay = pathname === "/public-pay"; // ✅ Add this

  return (
    <div
      className={`min-h-screen flex flex-col text-black dark:text-white dark:bg-[#0B091A] bg-[#E3EEFF] ${
        isAuth ? "lg:ml-0  lg:mx-0" : ""
      }`}>
      <UserProvider>
        {/* <AuthWrapper>
          <SolanaProvider>
            <ThemeProvider>
              <PageTracker />
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
        </AuthWrapper> */}
        {isAuth ? (
          <main className="flex-grow w-full min-h-screen">
            <Toaster position="top-right" />
            <InvoiceProvider>{children}</InvoiceProvider>
          </main>
        ) : (
          <AuthWrapper>
            <SolanaProvider>
              <ThemeProvider>
                <PageTracker />
                <Header />
                <Sidebar />
                <main className="flex-grow w-full min-h-screen">
                  <Toaster position="top-right" />
                  <InvoiceProvider>{children}</InvoiceProvider>
                </main>
                <Navigation />
                <Footer />
              </ThemeProvider>
            </SolanaProvider>
          </AuthWrapper>
        )}
      </UserProvider>
    </div>
  );
}
