

// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useUser } from "@/context/UserContext";
// import Image from "next/image";
// import { usePathname } from "next/navigation";



// export default function AuthWrapper({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { user, loading } = useUser(); // Add loading to your UserContext!
//   const router = useRouter();
//   const pathname = usePathname();
//   const isAuth = pathname === "/Login";
  
// useEffect(() => {
//   console.log("User:", user);
//   console.log("Loading:", loading);
// }, [user, loading]);


//   useEffect(() => {
//     if (!loading && !user && !isAuth) {
//       console.log("Redirecting to login...");
//       router.replace("/Login");
//       console.log("AuthWrapper running on", pathname);
//     }
//   }, [loading, user, router, isAuth]);

  
//   useEffect(() => {
//     console.log("AuthWrapper running on", pathname);
//     console.log("User:", user);
//     console.log("Loading:", loading);

//     // ✅ Wait until loading is false AND user is still null
//     if (!loading && user === null) {
//       router.replace("/Login");
//     }
//   }, [user, loading, pathname, router]);

//   if (loading ) {
//     // Or a spinner
//     return (
//       <div className="flex items-center justify-center h-screen bg-[#0B091A] text-white">
//         <div className="relative">
//           {/* Spinner */}
//           <div className="w-46 h-46 border-4 border-[#14f195] border-t-transparent rounded-full animate-spin" />

//           {/* Centered Logo */}
//           <div className="absolute inset-0 flex items-center justify-center">
//             {/* <Image src={Logo} alt="Logo" className="w-10 h-10" /> */}
//             <div className="flex items-end-safe justify-items-end-safe">
//               {/* <img
//                 src="/logo4.svg"
//                 alt="ppicture of logo"
//                 className=" w-12 h-12"
//               /> */}

//               <Image
//                 src="/logo4.svg"
//                 alt="logo"
//                 width={48}
//                 height={48}
//                 className="w-12 h-12"
//               />
//               {/* <Image
//                 src="/logo4.svg"
//                 alt="Picture of the logo"
//                 className="mb-2"
//                 width={40} //automatically provided
//                 height={40} //automatically provided
//                 style={{ width:40, height: "auto" }}

//                 // blurDataURL="data:..." automatically provided
//                 // placeholder="blur" // Optional blur-up while loading
//               /> */}
//               <h1 className="font-bold text-xl bg-gradient-to-tl from-[#9945ff]  via-[#14f195] to-[#14f195] text-transparent bg-clip-text ">
//                 OLAPAY
//               </h1>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Unauthenticated & not on login → redirect
//   if (!user && !isAuth) {
    
//     return null; // Don't render anything yet
//   }
//   // User is authenticated, render children
//   return (
//     <div
//       className={`${!isAuth && user ? "lg:ml-[250px]" : "lg:ml-0 lg:mx-0"} `}>
//       {children}
//     </div>
//   );
// }

"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Image from "next/image";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, hasFetched } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/Login";

  useEffect(() => {
    console.log("AuthWrapper running on", pathname);
    console.log("User:", user);
    console.log("Loading:", loading);
    if (!hasFetched) return; // ⛔ Don't run anything until user fetch is done
    // Redirect if finished loading AND user is not authenticated AND not on login page
    if (!user && !isLoginPage) {
      console.log("Redirecting to login...");
      router.replace("/Login");
    }
  }, [hasFetched, user, isLoginPage, router, pathname]);

  if (!hasFetched) {
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
