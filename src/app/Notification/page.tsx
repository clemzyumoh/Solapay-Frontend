// pages/notifications.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Search } from "lucide-react";
import { FcBusinessman } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/hooks/useNotifications";
import { format, isToday, isYesterday } from "date-fns";
import { Notifications } from "@/types/notification";
import { useUser } from "@/context/UserContext";
import NotificationActions from "@/components/NotActions";

export default function NotificationsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [unreadIds, setUnreadIds] = useState<string[]>(["1", "3"]);
  const { user } = useUser();
  const { notifications, loading, setNotifications } = useNotifications();

  if (loading) return <p>Loading...</p>;

  const filtered = notifications.filter((n) =>
    (n.title?.toLowerCase() + n.message?.toLowerCase()).includes(
      query.toLowerCase()
    )
  );

  const grouped = filtered.reduce((acc, notif) => {
    const date = new Date(notif.createdAt);
    const group = isToday(date)
      ? "Today"
      : isYesterday(date)
      ? "Yesterday"
      : format(date, "dd MMM yyyy");

    if (!acc[group]) acc[group] = [];
    acc[group].push(notif);
    return acc;
  }, {} as Record<string, Notifications[]>);

  const handleMarkAsRead = (id: string) => {
    setUnreadIds((prev) => prev.filter((uid) => uid !== id));
  };

  const handleBack = () => {
    const prev = sessionStorage.getItem("previousPath") || "/";
    router.push(prev);
  };

  return (
    <div className="min-h-screen my-24  p-4 pb-8 sm:max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={handleBack}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">Notifications</h1>
        <Search className="w-5 h-5" />
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search notifications..."
        className="w-full p-2 mb-4 rounded-2xl border text-center dark:border-none dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c]"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Notifications List */}
      {Object.entries(grouped).map(([day, notifs]) => (
        <div key={day} className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">{day}</h2>
          <div className="space-y-4">
            {notifs.map((notif) => {
              const isUnread = unreadIds.includes(notif._id);
              const isSender = notif.fromEmail === user?.email;
              const avatarUrl = isSender
                ? notif.receiverImageUrl
                : notif.senderImageUrl;

              return (
                <div
                  key={notif._id}
                  onClick={() => handleMarkAsRead(notif._id)}
                  className={`flex justify-between items-center pt-5  gap-3 p-3 dark:bg-gray-950 bg-[#FFFFFF] rounded-2xl relative shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c]  ${
                    isUnread ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  }`}>
                  <div className="absolute top-4 right-3">
                    <NotificationActions
                      notificationId={notif._id}
                      onDeleted={() => {
                        // Remove from unread
                        setUnreadIds((prev: string[]) =>
                          prev.filter((id) => id !== notif._id)
                        );

                        // Remove from notifications list
                        setNotifications((prev: Notifications[]) =>
                          prev.filter((n) => n._id !== notif._id)
                        );
                      }}
                      onMarkedRead={() => {
                        setUnreadIds((prev: string[]) =>
                          prev.filter((id) => id !== notif._id)
                        );
                      }}
                    />
                  </div>

                  <div className="flex md:gap-3 justify-center items-center w-full h-full ">
                    <div className="flex justify-between items-center w-[40%]  md:w-1/3 md:mr-0 h-full overflow-hidden">
                      {avatarUrl ? (
                        <div className="rounded-full border-[#14f195] border-2 w-12 h-12 ">
                          <Image
                            src={avatarUrl}
                            alt="avatar"
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className=" flex items-center justify-center rounded-full border-[#14f195] border-2 w-12 h-12 ">
                          <FcBusinessman className="text-2xl" />
                        </div>
                      )}
                    </div>

                    <div className="text-sm flex flex-col justify-center items-start w-full">
                      <h4 className="font-semibold">{notif.title}</h4>
                      <p className="text-gray-600 line-clamp-2">
                        {notif.message}
                      </p>

                      <span className="text-xs text-gray-400">
                        {notif.createdAt}|| {notif.isRead ? "Read" : "Unread"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center items-center w-[20%]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(
                          `/Transaction?highlight=${notif.invoiceId}`
                        );
                      }}
                      className="text-xs border-2 border-[#14f195] px-3 py-1 rounded h-fit mt-2">
                      view
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
