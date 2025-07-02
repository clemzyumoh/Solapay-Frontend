import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { FcBusinessman } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/hooks/useNotifications";
import { format, isToday, isYesterday } from "date-fns";
import { Notifications } from "@/types/notification";
import { useUser } from "@/context/UserContext";
import NotificationActions from "@/components/NotActions";

export default function NotificationTicker() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [unreadIds, setUnreadIds] = useState<string[]>(["1", "3"]);

  const router = useRouter();

  const { user } = useUser();
  const { notifications, loading, setNotifications } = useNotifications();

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || isPaused) return;

    let isResetting = false;

    const scroll = () => {
      if (!container || isPaused || isResetting) return;

      container.scrollTop += 1;

      const nearBottom =
        container.scrollTop + 1 >=
        container.scrollHeight - container.clientHeight;

      if (nearBottom) {
        isResetting = true;
        setTimeout(() => {
          container.scrollTop = 0;
          isResetting = false;
        }, 1000); // pause 1 second before resetting
      }
    };

    const interval = setInterval(scroll, 30);
    return () => clearInterval(interval);
  }, [isPaused]);

  if (loading) return <p>Loading...</p>;

  const grouped = notifications.reduce((acc, notif) => {
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

  return (
    <div
      className="h-[300px] lg:h-[400px] overflow-hidden  rounded-4xl flex justify-center items-center flex-col w-1/1 "
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}>
      <h1 className="text-center font-bold text-2xl mb-5">Notifications</h1>
      <div
        ref={scrollRef}
        className="space-y-8 h-full overflow-y-scroll scroll-smooth ticker-scroll-hide">
        {Object.entries(grouped).map(([day, notifs]) => (
          <div key={day} className="mb-6">
            <h2 className="text-sm font-semibold text-center text-gray-500 mb-2">{day}</h2>
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
                      isUnread
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
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
                          setNotifications((prev: any[]) =>
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

                    <div className="flex md:gap-3 justify-around items-center w-[90vw] md:w-[40vw] h-full ">
                      <div className="flex justify-between items-center w-[15vw]   md:mr-0 h-full overflow-hidden">
                        {avatarUrl ? (
                          <div className="rounded-full border-[#14f195] border-2 w-12 h-12 ">
                            <img
                              src={avatarUrl}
                              alt="avatar"
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className=" flex items-center justify-center rounded-full mr- border-[#14f195] border-2 w-12 h-12 ">
                            <FcBusinessman className="text-2xl" />
                          </div>
                        )}
                      </div>

                      <div className="text-sm flex flex-col justify-center items-start w-[50vw]">
                        <h4 className="font-semibold">{notif.title}</h4>
                        <p className="text-gray-600 line-clamp-2">
                          {notif.message}
                        </p>

                        <span className="text-xs text-gray-400">
                          {new Date(notif.createdAt).toLocaleString()} {"  "}
                          {notif.isRead ? "Read" : "Unread"}
                        </span>
                      </div>
                      <div className="flex justify-center items-center w-[20vw] ">
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
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
