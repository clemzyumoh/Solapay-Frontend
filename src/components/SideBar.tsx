"use client";

import {  FaCog } from "react-icons/fa";

import { IoHomeOutline } from "react-icons/io5";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";


import { FaSignOutAlt } from "react-icons/fa";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { TbListDetails } from "react-icons/tb";
import Image from "next/image";
import { ImCoinDollar } from "react-icons/im";
import toast from "react-hot-toast";

import { logOut } from "@/services/api";


const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { disconnect } = useWallet();
  // const handleDisconnect = () => {
  //   disconnect();
  //   router.push("/");
  
  //   toast.success("Wallet disconnected!");
  // };
  const handleLogout = async () => {
    try {
      await logOut(); // wait for backend to clear the cookie
      //Cookies.remove("token"); // remove token from frontend (optional if httpOnly, but fine if you store elsewhere)
      disconnect();
      router.push("/Login");
      
      toast.success("Logout  Successful!");
    } catch (err) {
      toast.error("Logout failed!");
      console.error(err);
    }
  };
  

  return (
    <div className="w-56 rounded-r-4xl mr-0 hidden lg:block dark:bg-gray-950 fixed bg-[#FFFFFF] z-50 left-0 top-0 h-screen text-black dark:text-white p-6">
      {/* Logo */}
      <div className="flex items-end-safe justify-items-end-safe">
        <Image
          src="/logo4.svg"
          alt="Picture of the logo"
          className="mb-2"
          width={60} //automatically provided
          height={60} //automatically provided
          // blurDataURL="data:..." automatically provided
          // placeholder="blur" // Optional blur-up while loading
          priority
        />
        <h1 className="font-bold text-2xl dark:bg-gradient-to-tl from-[#9945ff]  via-[#14f195] to-[#14f195] dark:text-transparent bg-clip-text ">
          OLAPAY
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-4 mt-16 font-bold w-full">
        {[
          {
            href: "/dashboard",
            label: "Dashboard",
            icon: <IoHomeOutline />,
            disabled: false,
          },
          {
            href: "/Create",
            label: "Create",
            icon: <TbListDetails />,
            disabled: false,
          },
          {
            href: "/Payment",
            label: "Payment",
            icon: <ImCoinDollar />,
            disabled: false,
          },
          //{ to: `/view/${latestDocId}`, label: "View", icon: <FaEye /> },
          {
            href: `/Transaction`,
            label: "Transaction",
            icon: <FaFileInvoiceDollar />,
            disabled: false,

            //disabled: !latestDocId,
          },
          {
            href: `/Settings`,
            label: "Settings",
            icon: <FaCog />,
            disabled: false,

            //disabled: !latestDocId,
          },
          // {
          //   href: `/Help`,
          //   label: "Help",
          //   icon: <TfiHelpAlt />,
          //   disabled: false,

          //   //disabled: !latestDocId,
          // },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={(e) => {
              if (item.disabled) {
                e.preventDefault(); // prevent navigating to "/view/null"
              }
            }}
            className={`flex items-center space-x-2 py-4 px-8 rounded transition w-full ${
              item.disabled
                ? "text-neutral-300 cursor-not-allowed "
                : pathname === item.href
                ? "hover:scale-105 text-[#9945ff] bg-[#e3eeff] dark:bg-transparent border-r-4"
                : "text-neutral-400 dark:text-gray-400 hover:scale-105 dark:shadow-[2px_2px_2px_#040f4c]"
            }`}>
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-12 left-6 font-bold space-y-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 py-4 px-8 rounded shadow-[2px_2px_2px_#040f4c] text-[#9945ff] dark:text-gray-100 hover:border hover:border-[#040f4c] dark:hover:border-[#9945ff] cursor-pointer hover:scale-100 ">
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
