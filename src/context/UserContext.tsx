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

// useEffect(() => {
//   const fetchUser = async () => {
//     try {
//     const res = await axios.get(
//       "https://solapay-backend.onrender.com/auth/me",
//       {
//         withCredentials: true,
//       }
//     );

//       setUser(res.data.user);
//     } catch (err) {
//       setUser(null); // not authenticated
//     } finally {
//       setHasFetched(true); // ✅ this must be set only after user is known
//     }
//   };

//   fetchUser();
// }, []);


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

  useEffect(() => {
    const path = window.location.pathname;
    const isPublic = path.startsWith("/Public-Pay") || path === "/Login";
    if (!isPublic) {
      getMe();
    } else {
      setLoading(false); // Skip fetching but end loading state
         setHasFetched(true); 
    }
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