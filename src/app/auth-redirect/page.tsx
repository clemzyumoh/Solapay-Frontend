
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser} from "@/context/UserContext"; // your context
import Image from "next/image";
export default function AuthRedirect() {
  const { user} = useUser();
  const router = useRouter();

  useEffect(() => {
    
      
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login"); // fallback if not logged in
      }
    

    
  }, [user]);

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
