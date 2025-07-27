
"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
export default function AuthRedirect() {
  const { user, loading, getMe } = useUser();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     const checkUser = async () => {
//       if (!user && !loading) {
//         // If no user and not loading, try to fetch user once more
//         await getMe();
//       }
//       setChecking(false);
//     };
//     checkUser();
//   }, []);

//   useEffect(() => {
//     if (!checking) {
//       if (user) {
//         router.replace("/dashboard");
//       } else {
//         router.replace("/Login");
//       }
//     }
//   }, [user, checking, router]);
 useEffect(() => {
   const checkUserAndToken = async () => {
     if (!user) {
       await getMe();
     }

     // Wait for token to appear in cookies (middleware depends on this!)
     let attempts = 0;
     let hasToken = false;
     while (attempts < 10) {
       const token = document.cookie
         .split("; ")
         .find((row) => row.startsWith("token="));
       if (token) {
         hasToken = true;
         break;
       }
       await new Promise((res) => setTimeout(res, 200)); // short delay
       attempts++;
     }

     setChecking(false);

     if (user && hasToken) {
       router.replace("/dashboard");
     } else {
       router.replace("/Login");
     }
   };

   checkUserAndToken();
 }, []);
  // Show spinner while checking or loading
  if (checking || loading) {
   
     return (
       <div className="flex items-center justify-center h-screen bg-[#0B091A] text-white">
         <div className="relative">
           <div className="w-46 h-46 border-4 border-[#14f195] border-t-transparent rounded-full animate-spin" />
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="flex items-end">
               <Image
                 src="/logo4.svg"
                 alt="logo"
                 width={48}
                 height={48}
                 className="w-12 h-12"
               />
               <h1 className="font-bold text-xl bg-gradient-to-tl from-[#9945ff] via-[#14f195] to-[#14f195] text-transparent bg-clip-text">
                 OLAPAY
               </h1>
             </div>
           </div>
         </div>
       </div>
     );
  }

  return null; // won't reach here normally
}
