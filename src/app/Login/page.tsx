
"use client";

import React, { useState } from "react";
import SignIn from "@/components/SignIn"; // adjust path if needed
import SignUp from "@/components/SignUp";
import Image from "next/image";
import img from "../../../public/login-bg2.png"

export default function LoginPage() {
  
  const [showSignIn, setShowSignIn] = useState(true);

  return (
    <main className="   flex lg:justify-between justify-center items-center flex-col lg:flex-row relative overflow-hidden bg-[#0B091A] text-white w-full  min-h-screen">
      {/* Left image container pinned to bottom */}

      <div className=" relative h-screen lg:flex justify-center items-start w-full  hidden overflow-hidden ">
        <Image
          src={img}
          alt="login image"
          className=" absolute  -left-32 w-full "
        />
      </div>

      {/* Right form container */}
      <div className="w-full md:w-full flex items-center h-screen flex-col gap-10 justify-center z-10 p-8 lg:bg-transparent  backdrop-blur-[1px]  border-white/10 rounded-xl  ">
        <div className="flex items-end-safe justify-items-end-safe">
          {/* <img src="/logo4.svg" alt="ppicture of logo" className="  w-16 h-16" /> */}

          <Image
            src="/logo4.svg"
            alt="Picture of the logo"
            className="mb-2"
            width={60} //automatically provided
            height={60} //automatically provided
            // blurDataURL="data:..." automatically provided
            // placeholder="blur" // Optional blur-up while loading
          />
          <h1 className="font-bold text-2xl dark:bg-gradient-to-tl from-[#9945ff]  via-[#14f195] to-[#14f195] dark:text-transparent bg-clip-text ">
            OLAPAY
          </h1>
        </div>
        {showSignIn ? (
          <SignIn onSwitchToSignUp={() => setShowSignIn(false)} />
        ) : (
          <SignUp onSwitchToSignIn={() => setShowSignIn(true)} />
        )}
      </div>
      <div className="flex justify-center items-center w-full absolute inset-x-0 md:-bottom-72 -bottom-60 h-screen lg:hidden ">
        <div className=" w-full ">
          <Image
            src={img}
            alt="login image"
            className=" priority  w-full "
            priority
          />
        </div>
      </div>
    </main>
  );
}
