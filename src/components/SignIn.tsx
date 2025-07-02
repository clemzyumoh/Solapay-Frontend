// src/components/SignIn.tsx
//"use client"; // React client component

import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord } from "react-icons/fa";

import { useRouter } from "next/navigation"; // Router for programmatic navigation
import { loginUser, loginWithDiscord, loginWithGoogle } from "@/services/api"; // Your login API function
import Cookies from "js-cookie"; // To store JWT token in cookies
import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext"; // 👈 import context

interface SignInProps {
  onSwitchToSignUp: () => void; // function prop to toggle to Sign Up
}

export default function SignIn({ onSwitchToSignUp }: SignInProps) {
  // Local state for email and password inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for showing any login error
  const [error, setError] = useState("");

  // Router instance for redirecting after login
  const router = useRouter();

  const { getMe } = useUser(); // 👈 get the function from


  const handleGoogle = async () => {
    loginWithGoogle();
    toast.success("Google Authetication.");
    await getMe(); // Fetch and set user first
    router.push("/"); // Then redirect
   
  };
  const handleDiscord = async () => {
    loginWithDiscord();
    toast.success("Discord Authetication.");
    await getMe(); // Fetch and set user first
    router.push("/"); // Then redirect
   
  };
 

  // Handle form submit (replace with actual login logic later)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call your loginUser API function
      const response = await loginUser({ email, password });

      // If login is successful, set token in cookies
      Cookies.set("token", response.token);


      // Redirect to dashboard or home
      router.push("/");

      // 👇 Fetch user details and set in context
      await getMe();
      toast.success("Login Successful.");
    } catch (err: any) {
      // If there's an error, show the message
      setError(err.message || "Login failed. Please try again.");
      toast.error("Login failed. Please try again.");
    }
  };
  return (
    <div className="flex flex-col justify-center  items-center w-full">
      <h2>Sign In</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full md:px-10 justify-center gap-6 my-4">
        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          name="email"
          className="border-2 px-3 rounded-xl py-3 w-full"
        />
        {/* Password input */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-2 rounded-xl px-3 py-3 w-full "
        />
        {/* Submit button */}
        <button
          className="px-3 py-2 rounded-xl font-bold w-1/2 cursor-pointer bg-gradient-to-br from-[#14f195] to-[#9945ff]"
          type="submit">
          Login
        </button>
      </form>
      {/* Link to toggle to Sign Up */}
      <div className="flex justify-center items-center my-6 gap-4">
        <p className="">
          Don't have an account?{" "}
          <button className="ml-3 cursor-pointer" onClick={onSwitchToSignUp}>
            Sign Up
          </button>
        </p>
      </div>
      <div className="flex justify-center gap-5 flex-col items-center">
        <p className="">Or Sign Up with</p>
        <div className="flex justify-center items-center gap-5">
          <button onClick={handleGoogle}>
            <div className="rounded-full bg-white flex items-center justify-center cursor-pointer w-14 h-14">
              <FcGoogle className="text-2xl" />
            </div>
          </button>
          <button onClick={handleDiscord}>
            <div className="rounded-full bg-[#9945ff] cursor-pointer flex items-center justify-center w-14 h-14">
              <FaDiscord className="text-2xl" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
