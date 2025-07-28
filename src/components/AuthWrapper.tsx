"use client";

import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Correct for `app/` directory

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, hasFetched } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [redirecting, setRedirecting] = useState(true); // show spinner until redirected

  const isLoginPage = pathname === "/Login";

  // useEffect(() => {
  //   console.log("AuthWrapper running on", pathname);
  //   console.log("User:", user);
  //   console.log("Loading:", loading);
  //   if (!hasFetched) return; // ⛔ Don't run anything until user fetch is done
  //   // Redirect if finished loading AND user is not authenticated AND not on login page
  //   if (!user) {
  //     console.log("Redirecting to login...");


  //     router.push("/Login");
  //     return
  //   } // prevent flash of content or bg
  //     // setRedirecting(false);
    
  // }, [hasFetched, user, router]);

 useEffect(() => {
   if (!hasFetched) return;

   if (!user && pathname !== "/Login") {
     router.push("/Login");
   } else {
     setRedirecting(false); // ✅ Only stop redirecting when logic is done
   }
 }, [hasFetched, user, router, pathname]);


  useEffect(() => {
    if (router && window.location.pathname !== "/Login") {
      setRedirecting(false);
      
    }
  }, [router]);

  if (redirecting || (!user && pathname !== "/Login")) {
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

  // Still waiting to verify auth
  if (!user && !isLoginPage) {
    return null;
  }

  return (
    <div
      className={`${
        !isLoginPage && user ? "lg:ml-[250px]" : "lg:ml-0 lg:mx-0"
      }`}>
      {children}
    </div>
  );
}
