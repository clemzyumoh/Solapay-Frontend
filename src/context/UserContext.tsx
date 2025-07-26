 "use client";

 import React, { createContext, useContext, useState, useEffect } from "react";
// import Cookies from "js-cookie";
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

  // const getMe = async () => {
  //   try {
  //     const response = await axios.get(
  //       "https://solapay-backend.onrender.com/auth/me",
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     setUser(response.data.user);
  //     console.log("Fetched user:", response.data.user);
  //   } catch {
  //     setUser(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   const path = window.location.pathname;
  //   const isPublic = path.startsWith("/Public-Pay") || path === "/Login";
  //   if (!isPublic) {
  //     getMe();
  //   } else {
  //     setLoading(false); // Skip fetching but end loading state
  //   }
  // }, []);
useEffect(() => {
  getMe(); // Always try
}, []);


//   // Optional: only try fetching user once on first load
//   useEffect(() => {
//      const isPublic = window.location.pathname.startsWith("/Public-Pay");
//     if (!isPublic) {
//       getMe();
//     } // comment this out if you want full manual control
//   }, []);
// // useEffect(() => {
// //   if (window.location.pathname.startsWith("/dashboard")) {
// //     getMe(); // only fetch user for dashboard
// //   }
// // }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser, getMe , hasFetched}}>
      {children}
    </UserContext.Provider>
  );
 
  
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};