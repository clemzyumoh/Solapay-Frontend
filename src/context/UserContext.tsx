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
}



 const UserContext = createContext<UserContextType | undefined>(undefined);


export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const getMe = async () => {
    try {
      const response = await axios.get("http://localhost:5000/auth/me", {
        withCredentials: true,
      });
      setUser(response.data.user);
      console.log("Fetched user:", response.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Optional: only try fetching user once on first load
  useEffect(() => {
    getMe(); // comment this out if you want full manual control
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser, getMe }}>
      {children}
    </UserContext.Provider>
  );
 
  
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};