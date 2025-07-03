

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@/context/UserContext"; // Assuming you have this
import { Notifications } from "@/types/notification";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser(); // Assuming user has `email`

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `https://solapay-backend.onrender.com/notify/getallnot/${user?.email}`
        );
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchNotifications();
    }
  }, [user]);
  useEffect(() => {
    console.log("Fetched notifications:", notifications);
  }, [notifications]);
  
    return { notifications, loading , setNotifications};
      

      
};

