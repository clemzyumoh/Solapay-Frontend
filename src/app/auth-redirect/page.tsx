
"use client";


import { useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import toast from "react-hot-toast";

export default function AuthRedirect() {
  const { user,  hasFetched, getMe } = useUser();
  const router = useRouter();
 // const [checking, setChecking] = useState(true);
const [hasRedirected, setHasRedirected] = useState(false);
  const [redirecting, setRedirecting] = useState(true); // show spinner until redirected

  //  useEffect(() => {
  //    const checkUserAndToken = async () => {
  //      if (!user && !loading) {
  //        await getMe();
  //      }

  //      // Wait for token to appear in cookies (middleware depends on this!)
  //      let attempts = 0;
  //      let hasToken = false;
  //      while (attempts < 10) {
  //        const token = document.cookie
  //          .split("; ")
  //          .find((row) => row.startsWith("token="));
  //        if (token) {
  //          hasToken = true;
  //          break;
  //        }
  //        await new Promise((res) => setTimeout(res, 200)); // short delay
  //        attempts++;
  //      }

  //      setChecking(false);
  // console.log("User after getMe:", user);
  // console.log("Token found:", hasToken);

  //      if (user && hasToken) {
  //        router.replace("/dashboard");
  //      } else {
  //        router.replace("/Login");
  //      }
  //    };

  //    checkUserAndToken();
  //      }, [user]);

    
    useEffect(() => {
      const fetchUser = async () => {
       // await new Promise((resolve) => setTimeout(resolve, 1000)); // 2s delay
          await getMe();
      //setChecking(false);
          
      };
        fetchUser();
      
        
    }, []);
    
//   useEffect(() => {
//     const checkUserAndToken = async () => {
//         if (!user && !loading) {
//           await new Promise((resolve) => setTimeout(resolve, 3000)); // 1-second delay
//           await getMe();
//         }

   

//       setChecking(false);

//       console.log("User after getMe:", user);
//      // console.log("Token found:", hasToken);
//     };

//     checkUserAndToken();
//   }, [user]); // run once on mount

//   useEffect(() => {
//     if (!checking) {
//     //   const token = document.cookie
//     //     .split("; ")
//     //     .find((row) => row.startsWith("token="));
//       if (user ) {
//           router.replace("/dashboard");
//         toast.success("Login Successful.");
          
//       } else {
//           router.replace("/Login");
//         toast.error("Login UnSuccessful.");
          
//       }
//     }
//   }, [user, checking, router]);

  // When route changes away from /auth-redirect, hide spinnera

useEffect(() => {
  if (hasFetched && !hasRedirected) {
    const redirectAfterDelay = async () => {
      //   await new Promise((res) => setTimeout(res, 1000)); // wait for 3 seconds
      setHasRedirected(true); // prevent future triggers
      if (user) {
        router.replace("/dashboard");
        toast.success("Login Successful.");
      } else {
        router.replace("/Login");
        toast.error("Login Unsuccessful.");
      }
    };

    redirectAfterDelay(); // run the redirect with delay
  }
}, [user, hasFetched, hasRedirected]);
    
   


    useEffect(() => {
    if (router && window.location.pathname !== "/auth-redirect") {
      setRedirecting(false);
        }
        
  }, [router]);
    
    
  if (redirecting) {
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
