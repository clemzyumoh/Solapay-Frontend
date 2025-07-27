"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCog } from "react-icons/fa";

import { IoHomeOutline } from "react-icons/io5";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { TbListDetails } from "react-icons/tb";
import { ImCoinDollar } from "react-icons/im";


const Navigation = () => {
  const pathname = usePathname();

  const Menus = [
    {
      href: "/dashboard",
      label: "dashboard",
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
    {
      href: "/Transaction",
      label: "Transaction",
      icon: <FaFileInvoiceDollar />,
      disabled: false,
    },
    {
      href: "/Settings",
      label: "Settings",
      icon: <FaCog />,
      disabled: false,
    },
  ];

  const activeIndex = Menus.findIndex((menu) => menu.href === pathname);

 // const [active, setActive] = useState(0);
  const [spanLeft, setSpanLeft] = useState("");

  useEffect(() => {
    if (activeIndex !== -1) {
      // setActive(activeIndex);
      setSpanLeft(
        `calc(${(activeIndex + 0.5) * (100 / Menus.length)}% - 2rem)`
      );
    } else {
      setSpanLeft("unset");
    }
  }, [activeIndex, Menus.length]);

  return (
    <div className="dark:bg-gray-800 bg-white shadow-2xl px-6 pb-1 rounded-t-3xl z-50 flex justify-between items-center text-black dark:text-white lg:hidden bottom-0 mt-10 w-full fixed">
      <ul className="grid grid-cols-5 relative w-full">
        <span
          className="dark:bg-gray-800 bg-white duration-500 dark:shadow-lg w-16 h-9 absolute -top-5 rounded-t-full"
          style={{
            left: spanLeft,
            opacity: activeIndex === -1 ? 0 : 1,
          }}></span>

        {Menus.map((menu, index) => (
          <li
            key={menu.label}
            className="flex flex-col items-center pt-6 relative w-full cursor-pointer"
            // onClick={() => {
            //   if (!menu.disabled) setActive(index);
          // }}
          >
           
            <Link
              href={menu.disabled ? "#" : menu.href}
              onClick={(e) => {
                if (menu.disabled) {
                  e.preventDefault();
                  alert("No document to view yet.");
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className={`text-xl z-10 duration-300 ${
                index === activeIndex
                  ? "-mt-9 dark:text-[#14f195] text-[#9945ff] border-2 border-[#9945ff] dark:border-[#14f195] p-2 rounded-full shadow-md"
                  : menu.disabled
                  ? "text-gray-300"
                  : "text-gray-400"
              }`}>
              {menu.icon}
            </Link>

            <span
              className={`text-xs font-semibold mt-1 transition-all duration-300 ${
                index === activeIndex
                  ? "opacity-100 translate-y-2 text-4xl text-[#9945ff] dark:text-[#14f195]"
                  : "opacity-0 translate-y-4"
              }`}>
              {menu.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navigation;
