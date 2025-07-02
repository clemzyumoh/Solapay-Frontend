

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import { usePathname } from "next/navigation";



export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser(); // Add loading to your UserContext!
  const router = useRouter();
  const pathname = usePathname();
  const isAuth = pathname === "/Login";

  useEffect(() => {
    if (!loading && !user) {
      router.push("/Login");
    }
  }, [loading, user, router]);

  if (loading) {
    // Or a spinner
    return (
      <div className="flex items-center justify-center h-screen bg-[#0B091A] text-white">
        <div className="relative">
          {/* Spinner */}
          <div className="w-46 h-46 border-4 border-[#14f195] border-t-transparent rounded-full animate-spin" />

          {/* Centered Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* <Image src={Logo} alt="Logo" className="w-10 h-10" /> */}
            <div className="flex items-end-safe justify-items-end-safe">
              {/* <img
                src="/logo4.svg"
                alt="ppicture of logo"
                className=" w-12 h-12"
              /> */}
              
              <Image
                src="/logo4.svg"
                alt="logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              {/* <Image
                src="/logo4.svg"
                alt="Picture of the logo"
                className="mb-2"
                width={40} //automatically provided
                height={40} //automatically provided
                style={{ width:40, height: "auto" }}

                // blurDataURL="data:..." automatically provided
                // placeholder="blur" // Optional blur-up while loading
              /> */}
              <h1 className="font-bold text-xl dark:bg-gradient-to-tl from-[#9945ff]  via-[#14f195] to-[#14f195] dark:text-transparent bg-clip-text ">
                OLAPAY
              </h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
 

  // User is authenticated, render children
  return (
    <div
      className={`${
       !isAuth  && user ? "lg:ml-[250px]" : "lg:ml-0 lg:mx-0"
      } `}>
      {children}
    </div>
  );
}
