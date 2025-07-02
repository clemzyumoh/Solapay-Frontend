

"use client";
import { useState } from "react";
import { useRef, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { SlOptionsVertical } from "react-icons/sl";
import { CiCircleCheck } from "react-icons/ci";
import { IoTrashBin } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
interface Props {
  notificationId: string;
  onDeleted?: () => void;
  onMarkedRead?: () => void;
}

export default function NotificationActions({
  notificationId,
  onDeleted,
  onMarkedRead,
}: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !(menuRef.current as any).contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/notify/deletenot/${notificationId}`
      );
      toast.success("Notification deleted");
      onDeleted?.();
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  const handleMarkRead = async () => {
    try {
      await axios.patch("http://localhost:5000/notify/markasRead", {
        notificationIds: [notificationId],
      });
      toast.success("Marked as read");
      onMarkedRead?.();
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };


  return (
    <div ref={menuRef} className="relative">
    
      <button onClick={() => setOpen((prev) => !prev)}>
        {open ? <MdCancel
            className="text-lg cursor-pointer"
        
        />
          : <SlOptionsVertical
          className="text-lg cursor-pointer"
          
          />}
      </button>
      {open && (
        <div className="absolute top-0  right-5 mt-2 w-32 bg-white dark:bg-black  shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c]  rounded-xl z-50">
          <button
            onClick={() => {
              handleMarkRead();
              setOpen(false);
            }}
            className="flex items-center w-full px-3 py-2 border-b-[1px] dark:border-[#14ff95] hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-800 text-sm">
            <CiCircleCheck className="text-xl mr-1" />
            Mark as read
          </button>
          <button
            onClick={() => {
              handleDelete();
              setOpen(false);
            }}
            className="flex items-center w-full px-3 py-2 text-red-500 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-800 text-sm">
            <IoTrashBin className="text-xl mr-2" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
