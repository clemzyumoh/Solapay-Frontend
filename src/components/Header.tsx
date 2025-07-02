"use client";
import { useState,useEffect } from "react";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaSearch, FaUser, FaBell, FaCog, FaSignOutAlt } from "react-icons/fa";
import { Sun, Moon } from "lucide-react";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useContext } from "react";
import Image from "next/image";
//import { ThemeContext } from "./ThemeProvider";
import { useTheme } from "./ThemeProvider";
import { usePathname } from "next/navigation";
import { IoIosNotifications } from "react-icons/io";
import NotificationBell from "./NotificationBell";
import NotificationSidebar from "./NotificationSidebar";
import toast from "react-hot-toast";
import { RxAvatar } from "react-icons/rx";
import { useUser } from "@/context/UserContext";
import { FundWalletButton } from "./FundWalletButton";

const routeLabels: Record<string, string> = {
  "/": "Home",
  "/Create": "Create",
  "/Details": "Details",
  "/Settings": "Settings",
};
const Header = () => {
  //const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { darkMode, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const { user } = useUser();

  const currentLabel: string = routeLabels[pathname] || "SolaPay";
  const { connect, disconnect, connected, select, wallets, wallet, publicKey } =
    useWallet();
  
    // const handleConnect = async () => {
    //   try {
    //     if (!wallet && wallets.length > 0) {
    //       await select(wallets[0].adapter.name); // select default wallet
    //     }

    //     await connect(); // connect after selection
    //     toast.success("Wallet Connected!");
    //   } catch (error) {
    //     console.error("Connection error:", error);
    //     toast.error("Connection failed");
    //   }
    // };
    const [triggerConnect, setTriggerConnect] = useState(false);

    const handleConnect = async () => {
      if (!wallet && wallets.length > 0) {
        await select(wallets[0].adapter.name); // ✅ correct condition
        setTriggerConnect(true); // trigger connect after wallet is selected
      } else if (wallet && !connected) {
        await connect();
        toast.success("Wallet Connected!");
      } else {
        //console.error("Connection error:", error);
        toast.error("Connection failed");
      }
    };

    // useEffect will run after `wallet` is set
    useEffect(() => {
      const doConnect = async () => {
        if (triggerConnect && wallet && !connected) {
          try {
            await connect();
            toast.success("Wallet Connected!");
          } catch (error) {
            console.error("Connection error:", error);
            toast.error("Connection failed");
          } finally {
            setTriggerConnect(false); // clear flag
          }
        }
      };

      doConnect();
    }, [wallet, triggerConnect]);
  

  const shortenAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const shortenAddressMob = (address: string) =>
    `${address.slice(0, 3)}...${address.slice(-3)}`;

  return (
    <motion.div className="fixed top-0 left-0 lg:left-32 right-0 w-full  overflow-hidden   lg:dark:bg-[#0b091a]  bg-white lg:bg-[#e3eeff]  flex justify-between items-center p-4 z-40 text-black dark:text-white   dark:bg-gray-950">
      {/* 🔹 Laptop Layout */}
      <div className="hidden lg:flex items-center overflow-hidden justify-center w-[90vw] ">
        <div className="flex justify-center items-center w-[80vw] ">
          {/* Logo / Title */}
          <div className="flex  justify-center w-full   items-center">
            <h1 className="text-3xl font-bold">{currentLabel}</h1>
          </div>

          {/* Right Side: Dark Mode Toggle & User Icon */}
          <div className="flex items-center justify-center w-full  space-x-4">
            {/* Search Bar */}
            <div className="flex items-center border-2 border-[#EBF2FD] shadow p-2 max-w-[30vw]   rounded-2xl  ">
              <div className="text-neutral-400 text-xl mr-16">
                <FaSearch className="" />
              </div>
              <input
                type="text"
                placeholder="Search Invoice..."
                className="bg-transparent focus:outline-none w-[80vw] text-neutral-500"
                // onChange={(e) => setSearchTerm(e.target.value)}
                //onKeyDown={handleSearch}
              />
            </div>
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
            <IoIosNotifications
              className="text-2xl text-[#9945ff]"
              onClick={() => setOpen(true)}
            />
            <NotificationSidebar isOpen={open} onClose={() => setOpen(false)} />
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center justify-center gap-4">
             
              </div>
            </div>
          </div>
          <div className="flex justify-center  w-full items-center gap-4 ">
            <div className="flex justify-center items-center w-ful">
              {user ? (
                <div className="rounded-full w-10 h-10 border-2 border-[#14f195] flex justify-center items-center ">
                  <img
                    src={user.imageUrl}
                    alt="Picture of the logo"
                    className="w-full h-full  rounded-full dark:bg-gray-950 bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c] object-cover border-2 border-[#14f195] "
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full  flex items-center justify-center dark:bg-gray-950   bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c]">
                  <RxAvatar className="w-full h-full" />
                </div>
              )}
            </div>
            <div className="flex items-center justify-center w-">
              {!connected || !publicKey ? (
                <button
                  onClick={handleConnect}
                  className="cursor-pointer px-3 py-2  rounded-xl from-transparent to-transparent border-2 border-[#14f195] text-[#14f195]  ">
                  Connect
                </button>
              ) : (
                <div className="flex justify-center gap-3 items-center w-full">
                  <span>{shortenAddress(publicKey.toBase58())}</span>
                  <FundWalletButton />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Mobile Layout */}
      <div className="lg:hidden flex w-full justify-between items-center">
        {/* Left: Settings Button */}

        <div className="flex  justify-center items-center">
          <div className="flex items-end-safe justify-items-end-safe">
            <img src="/logo4.svg" alt="picture of logo" className="w-12 h-12" />
            {/* <Image
              src="/logo4.svg"
              alt="Picture of the logo"
              className="mb-2"
              width={40} //automatically provided
              height={40} //automatically provided
              // blurDataURL="data:..." automatically provided
              // placeholder="blur" // Optional blur-up while loading
            /> */}
            <h1 className="font-bold text-2xl dark:bg-gradient-to-br from-[#9945ff] via-[#14f195] to-[#14f195] dark:text-transparent bg-clip-text ">
              OLAPAY
            </h1>
          </div>
        </div>

        {/* Right: Menu Toggle & Search Icon */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex justify-center items-center ">
            {user ? (
              <div className="rounded-full w-10 h-10 border-2 border-[#14f195] flex justify-center items-center ">
                <img
                  src={user.imageUrl}
                  alt="Picture of the logo"
                  className="w-full h-full  rounded-full dark:bg-gray-950 bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c] object-cover border-2 border-[#14f195] "
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full  flex items-center justify-center dark:bg-gray-950   bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c]">
                <RxAvatar className="w-full h-full" />
              </div>
            )}
          </div>
          {/* //<NotificationBell /> */}
          {!connected || !publicKey ? (
            <button
              onClick={handleConnect}
              className="cursor-pointer px-3 py-2 rounded-xl bg-transparent border-2 border-[#14f195] text-[#14f195] ">
              Connect 
            </button>
          ) : (
            <div className="flex justify-center gap-3 items-center w-full">
              <span>{shortenAddressMob(publicKey.toBase58())}</span>
              
            </div>
          )}
        </div>
     
      </div>

   
    </motion.div>
  );
};

export default Header;
