// src/components/SignUp.tsx
//"use client";

import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/api"; // Register function
//import Cookies from "js-cookie"; // Set token
import toast from "react-hot-toast";
import {  loginWithDiscord, loginWithGoogle } from "@/services/api"; // Your login API function
//import { useUser } from "@/context/UserContext"; // 👈 import context


interface SignUpProps {
  onSwitchToSignIn: () => void; // function prop to toggle to Sign In
}

export default function SignUp({ onSwitchToSignIn }: SignUpProps) {
  // State for inputs: name, email, password
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const router = useRouter();
   // const { getMe } = useUser(); // 👈 get the function from context
  

  // Handle form submit (replace with actual signup logic later)
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(""); // Reset error
      

      // ✅ Frontend validation
      if (!name || !email || !password) {
        setError("All fields are required.");
        toast.error("Please fill in all fields.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Invalid email format.");
        toast.error("Enter a valid email address.");
        return;
      }

      if (password.length < 8) {
        setError("Password must be at least 6 characters.");
        toast.error("Password too short.");
        return;
      }

    try {
      // Call your API to register
      const response = await registerUser({ name, email, password });

      // Save token in cookie (if returned immediately)
     // Cookies.set("token", response.token);

      

      // 👇 Fetch user details and set in context
     // await getMe();
      // Redirect to dashboard or home
      router.push("/auth-redirect");
     // toast.success("Login Successful.");
    }  catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Sign up failed. Please try again.";
      setError(errorMsg);
      toast.error("Sign Up Failed");
    }
    
  };

 const handleGoogle = async () => {
    loginWithGoogle();
    toast.success("Google Authetication.");
 
   
  };
  const handleDiscord = async () => {
    loginWithDiscord();
    toast.success("Discord Authetication.");
  

  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <h2>Sign Up</h2>
      {error && <p className="text-red-500">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center w-full md:px-10 gap-5 my-4
        ">
        {/* Name input */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border-2 rounded-xl px-3 py-3 w-full "
        />
        {/* Email input */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-2 rounded-xl px-3 py-3 w-full "
        />
        {/* Password input */}
        <input
          type="password"
          name="password"
          minLength={8}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-2 rounded-xl px-3 py-3 w-full "
        />
        {/* Submit button */}
        <button
          className="px-3 py-2 rounded-xl font-bold bg-gradient-to-br from-[#14f195] to-[#9945ff] w-1/2 cursor-pointer"
          type="submit">
          Register
        </button>
      </form>
      {/* Link to toggle to Sign In */}
      <p>
        Already have an account?{" "}
        <button className="ml-3 cursor-pointer" onClick={onSwitchToSignIn}>
          Sign In
        </button>
      </p>

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
