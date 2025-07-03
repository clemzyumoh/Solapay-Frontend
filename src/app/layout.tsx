


// export const metadata = {
//   title: "SolaPay",
//   description: "Fast, secure invoice payments on Solana.",
//   icons: {
//     icon: "/logo7.svg",
//   },
// };



// import PageTracker from "@/components/PageTracker";
// import ThemeProvider from "@/components/ThemeProvider";
// import SolanaProvider from "@/components/SolanaProvider";
// import { Space_Grotesk, Sora } from "next/font/google";
// import { usePathname } from "next/navigation";
// import "./globals.css";
// import Sidebar from "@/components/SideBar";
// import Header from "@/components/Header";
// import Navigation from "@/components/Navigation";
// import Footer from "@/components/Footer";
// import { Toaster } from "react-hot-toast";
// import AuthWrapper from "../components/AuthWrapper"
// import { UserProvider } from "@/context/UserContext";
// import { InvoiceProvider } from "@/context/InvoiceContext";
// import { Suspense } from "react";





// const spaceGrotesk = Space_Grotesk({
//   subsets: ["latin"],
//   variable: "--font-space-grotesk",
//   weight: "700",
// });

// const sora = Sora({
//   subsets: ["latin"],
//   variable: "--font-sora",
//   weight: "700",
// });



// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
  
//   const pathname = usePathname();

 

//   const isAuth = pathname === "/Login";

//   // ✅ public payment page
//   if (pathname.startsWith("/Public-Pay")) {
//     return (
//       <html
//         lang="en"
//         className={`bg-[#0B091A] text-white 
//       `}>
       
        
//         <body>
//           <Toaster position="top-right" />
//           <Suspense>
//             <SolanaProvider>{children}</SolanaProvider>
//           </Suspense>
          
//         </body>
//       </html>
//     );
//   }

//   return (
//     <html
//       lang="en"
//       className={`dark:bg-[#0B091A] dark:text-white bg-[#E3EEFF] ${
//         isAuth ? "lg:ml-0  lg:mx-0" : "  "
//       }
//       text-black`}>
//       <body
//         className={`min-h-screen flex flex-col   ${spaceGrotesk.variable} ${sora.variable} antialiased`}>
//         <UserProvider>
//           <AuthWrapper>
//             <SolanaProvider>
//               <ThemeProvider>
//                 <PageTracker /> {/* 👈 Client-only hook now safe here */}
//                 {!isAuth && <Header />}
//                 {!isAuth && <Sidebar />}
//                 <main className="flex-grow w-full min-h-screen">
//                   <Toaster position="top-right" />
//                   <InvoiceProvider>{children}</InvoiceProvider>
//                 </main>
//                 {!isAuth && <Navigation />}
//                 {!isAuth && <Footer />}
//               </ThemeProvider>
//             </SolanaProvider>
//           </AuthWrapper>
//         </UserProvider>
//       </body>
//     </html>
//   );
// }
// app/layout.tsx
import "./globals.css";
import { Space_Grotesk, Sora } from "next/font/google";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata = {
  title: "SolaPay",
  description: "Fast, secure invoice payments on Solana.",
  icons: {
    icon: "/favicon.ico",
  },
};

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${sora.variable} antialiased`}>
      <LayoutWrapper>{children}</LayoutWrapper>
    </html>
  );
}
