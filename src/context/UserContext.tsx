 "use client";

 import React, { createContext, useContext, useState, useEffect } from "react";
// import Cookies from "js-cookie";
//import toast from "react-hot-toast";

 import axios from "axios";

interface UserType {
  _id: string;
  name: string;
  email: string;
  imageUrl?: string;
  lastFundedAt: Date
}
interface UserContextType {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  loading: boolean;
  //setUser: (user: UserType | null) => void;
  getMe: () => Promise<void>;
  hasFetched: boolean
}



 const UserContext = createContext<UserContextType | undefined>(undefined);


export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);




  const getMe = async () => {
    try {
      const res = await axios.get(
        "https://solapay-backend.onrender.com/auth/me",

        {
          withCredentials: true,
        }
      );
      console.log("Fetched user:", res.data);
      setUser(res.data.user); // ✅ set user
    } catch (error) {
      console.error("Error fetching user", error);
      setUser(null); // ❗ important fallback
    } finally {
      setLoading(false); // ✅ done loading
      setHasFetched(true); // ✅ important
    }
  };


  

  // useEffect(() => {
  //   const path = typeof window !== "undefined" ? window.location.pathname : "";
  //   const isPublic = path === "/Login";

  //   if (isPublic) {
    
  //     setHasFetched(true);
  //     return;
  //   }

  //   let retries = 0;
  //   const maxRetries = 5;

  //   const fetchUserWithRetry = async () => {
  //     try {
  //       await getMe();
  //       if (user) {
  //         setHasFetched(true);
  //       } else if (retries < maxRetries) {
  //         retries++;
  //         setTimeout(fetchUserWithRetry, 1000); // retry after 1s
  //       } else {
  //         setHasFetched(true);
  //         setLoading(false);
  //       }
  //     } catch {
  //       if (retries < maxRetries) {
  //         retries++;
  //         setTimeout(fetchUserWithRetry, 1000);
  //       } else {
  //         setHasFetched(true);
  //         setLoading(false);
  //       }
  //     }
  //   };

  //   fetchUserWithRetry();
  // }, [user]);


useEffect(() => {
 getMe()
}, []);



  return (
    <UserContext.Provider value={{ user, loading, setUser,getMe,  hasFetched}}>
      {children}
    </UserContext.Provider>
  );
 
  
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};