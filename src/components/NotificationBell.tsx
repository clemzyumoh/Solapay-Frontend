"use client";

// components/NotificationBell.tsx
import { IoIosNotifications } from "react-icons/io";
//import { useRouter } from "next/router";
import Link from "next/link";

export default function NotificationBell({ unreadCount = 0 }) {
  return (
    <Link href="/Notification" className="relative inline-block">
      <IoIosNotifications className="text-2xl dark:text-[#14f195 text-[#9945ff]" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
          {unreadCount}
        </span>
      )}
    </Link>
  );
}