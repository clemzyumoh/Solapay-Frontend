"use client";

export const dynamic = "force-static";

import React, { useState, useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { BsTwitterX } from "react-icons/bs";
import { TbBrandLinkedinFilled } from "react-icons/tb";

import { FaUserEdit } from "react-icons/fa";
import { toast } from "react-hot-toast";

import { Sun, Moon } from "lucide-react";
import NotificationBell from "../../components/NotificationBell";
import { motion } from "framer-motion";

//import { ThemeContext } from "../../components/ThemeProvider";
import { useTheme } from "../../components/ThemeProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import { useUser } from "@/context/UserContext";
import { uploadToCloudinary } from "@/services/cloudinary";
import axios from "axios";
import { RxAvatar } from "react-icons/rx";

import { logOut } from "@/services/api";
import { useRouter } from "next/navigation";
import { FundWalletButton } from "@/components/FundWalletButton";
export default function SettingsPage() {
  // const [profileImage, setProfileImage] = useState<string | null>(null);
  // const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  // const [primaryWallet, setPrimaryWallet] = useState("8Ka...def");
  // const [secondaryWallets, setSecondaryWallets] = useState<string[]>([
  //   "6Ut...mno",
  // ]);
  //const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { darkMode, toggleTheme} = useTheme();
  const { connect, disconnect, connected, select, wallets, wallet, publicKey } =
    useWallet();
  
  const handleConnect = async () => {
  try {
    if (!wallet && wallets.length > 0) {
      await select(wallets[0].adapter.name); // select default wallet
    }

    await connect(); // connect after selection
    toast.success("Wallet Connected!");
  } catch (error) {
    console.error("Connection error:", error);
    toast.error("Connection failed");
  }
};

  const router = useRouter();
  // const shortenAddress = (address: string) =>
  //   `${address.slice(0, 6)}...${address.slice(-4)}`;

  const shortenAddressMob = (address: string) =>
    `${address.slice(0, 3)}...${address.slice(-3)}`;

  // const addSecondaryWallet = () => {
  //   // For demo: add a dummy wallet, implement real input logic as needed
  //   setSecondaryWallets((w) => [...w, "NewWalletAddress..."]);
  // };

  // const removeSecondaryWallet = (index: number) => {
  //   setSecondaryWallets((w) => w.filter((_, i) => i !== index));
  // };

  // const disconnectWallet = () => {
  //   disconnect();
  //   toast.success("Wallet disconnected!");
  // };
  const handleLogout = async () => {
    try {
      await logOut(); // wait for backend to clear the cookie
      // Cookies.remove("token"); // remove token from frontend (optional if httpOnly, but fine if you store elsewhere)
      disconnect();
      router.push("/Login");

      toast.success("Logout  Successful!");
    } catch (err) {
      toast.error("Logout failed!");
      console.error(err);
    }
  };

  // const handleSaveProfile = () => {
  //   if (!username.trim()) {
  //     toast.error("Username is required");
  //     return;
  //   }

  //   if (email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
  //     toast.error("Enter a valid email");
  //     return;
  //   }

  //   // Simulate save
  //   console.log("Saving profile:", { username, email, profileImage });
  //   toast.success("Profile saved successfully");
  // };

 

  // //setting user image
  const { user, setUser } = useUser();
  console.log("user context value →", user);

  const [uploading, setUploading] = useState(false);


  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null); // 👈 for instant preview

  useEffect(() => {
    return () => {
      if (tempImageUrl) {
        URL.revokeObjectURL(tempImageUrl);
      }
    };
  }, [tempImageUrl]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("Image file selected", e.target.files?.[0]);
    if (!file || !user) return;
    console.log(user);
    // 👇 Show image immediately before uploading
    const localUrl = URL.createObjectURL(file);
    setTempImageUrl(localUrl);

    try {
      setUploading(true);

      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file);
      console.log("Cloudinary Image URL:", imageUrl);


      const response = await axios.put(
        "https://solapay-backend.onrender.com/auth/profile/image",
        {
          userId: user._id,
          imageUrl,
        }
      );

      const updatedUser = response.data.user;
      setUser(updatedUser);
      console.log("Final image URL in context:", updatedUser.imageUrl);

      toast.success("Image updated successfully!");
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-20 md:mt-24 p-6 space-y-8 rounded-4xl  dark:bg-gray-950   bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c]">
      {/* Profile Image */}
      <div className="relative w-28 h-28 md:w-32 md:h-32 mx-auto">
        <input
          id="profileImageUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        {user === null ? (
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full  flex items-center justify-center dark:bg-gray-950   bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c]">
            <RxAvatar className="w-full h-full" />
          </div>
        ) : user ? (
          <img
            // src={user.imageUrl}
            src={tempImageUrl || user.imageUrl || "/default-avatar.png"} // 👈 preview immediately
            // src={user.imageUrl}
            alt="Profile"
            className="w-28 h-28 md:w-32 md:h-32 rounded-full dark:bg-gray-950 bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c] object-cover border-2 border-[#14f195] "
          />
        ) : (
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full  flex items-center justify-center dark:bg-gray-950   bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c]">
            <RxAvatar className="w-full h-full" />
          </div>
        )}
        <label
          htmlFor="profileImageUpload"
          className="absolute bottom-0 right-0 dark:bg-gray-950  bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-none dark:border-[#14f195] dark:border-2 rounded-full p-2  cursor-pointer "
          title="Edit Profile Image">
          <FaUserEdit className=" w-4 h-4" />
        </label>

        {uploading && <p>Uploading...</p>}
      </div>

      {/* Connected Wallets */}
      <div>
        <h2 className="text-xl font-semibold my-5 text-center">Profile</h2>
        <p className="mb-1 font-medium">Name</p>
        <div className="mb-4 p-3 dark:bg-gray-950  cursor-pointer bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c] rounded-2xl">
          {user?.name}
        </div>
        <p className="mb-1 font-medium">Email</p>
        <div className="mb-4 p-3 dark:bg-gray-950  cursor-pointer bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c] rounded-2xl">
          {user?.email}
        </div>
        <p className="mb-1 font-medium">Primary Wallet</p>
        <div className=" flex justify-center items-center w-full mb-4 p-3 dark:bg-gray-950  cursor-pointer bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c] rounded-2xl">
          {/*primaryWallet*/}
          {!connected || !publicKey ? (
            <button onClick={handleConnect} className="cursor-pointer">
              Connect Wallet
            </button>
          ) : (
            //<span>{shortenAddress(publicKey.toBase58())}</span>
            <div className="flex justify-between  items-center w-full">
              <span>{shortenAddressMob(publicKey.toBase58())}</span>
              <FundWalletButton />
            </div>
          )}
        </div>

       
      </div>

   

      <div>
        <h2 className="text-xl font-semibold mb-2 flex justify-between w-full items-center gap-2">
          Theme
          <motion.button
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            animate={{ rotate: darkMode ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => toggleTheme()}
            className="w-[24px] ">
            {darkMode ? (
              <Sun size={24} className="dark:text-[#14f195]" />
            ) : (
              <Moon size={24} className="text-[#9945ff]" />
            )}
          </motion.button>
        </h2>
      </div>
      {/* Notification Preferences */}
      <div>
        <h2 className="text-xl font-semibold mb-2 flex justify-between w-full items-center gap-2">
          Notification
          <div className="flex items-center justify-center">
            <NotificationBell />
          </div>
        </h2>
      </div>

    

      {/* Social Links */}
      <div className="flex gap-6 justify-between w-full items-center mt-8">
        <h2 className="text-xl font-semibold mb-2 flex justify-between w-full items-center gap-2">
          Socials
          <div className="flex items-center gap-3 justify-center">
            <a
              href="https://x.com/UmohPet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl hover:text-[#14f195]"
              aria-label="X (Twitter)">
              <BsTwitterX />
            </a>
            <a
              href="https://github.com/clemzyumoh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl hover:text-[#14f195]"
              aria-label="GitHub">
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/clement-umoh-a17b8629b/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl hover:text-[#14f195]"
              aria-label="GitHub">
              <TbBrandLinkedinFilled />
            </a>
          </div>
        </h2>
      </div>

      {/* Logout / Disconnect */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white cursor-pointer px-6 py-2 rounded hover:bg-red-700 flex items-center gap-2">
          <FiLogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
