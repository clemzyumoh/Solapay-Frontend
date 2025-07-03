

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

// ✅ Solana wallet hook to get public key
import { useWallet } from "@solana/wallet-adapter-react";

// ✅ Custom context for user data
import { useUser } from "@/context/UserContext";

interface FundWalletButtonProps {
  // Optional className if you want to style it externally
  className?: string;
}

export const FundWalletButton: React.FC<FundWalletButtonProps> = ({
  className,
}) => {
  const { publicKey } = useWallet(); // 👛 Connected wallet public key
  const { user } = useUser(); // 👤 Logged-in user from context (must include _id and lastFundedAt)
const [cooldownSeconds, setCooldownSeconds] = useState(0);

 // const [cooldown, setCooldown] = useState(false); // ⏱ 24-hour cooldown state
  const [loading, setLoading] = useState(false); // 🔄 Button loading state

 
  useEffect(() => {
    if (!user?.lastFundedAt) return;

    const last = new Date(user.lastFundedAt).getTime();
    const now = Date.now();
    const diff = now - last;

    const remaining = Math.floor((86400000 - diff) / 1000); // in seconds

    if (remaining > 0) {
      setCooldownSeconds(remaining);

      const interval = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [user?.lastFundedAt]);
  

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h}h ${m}m ${s}s`;
  };
  

  const handleFund = async () => {
    if (!user?._id || !publicKey) {
      return toast.error("User or wallet not found");
    }

    setLoading(true);

    try {
      // 📡 Call your backend API to fund wallet
      await axios.post("https://solapay-backend.onrender.com/solapay/fund", {
        userId: user._id,
        walletAddress: publicKey.toBase58(),
      });

      toast.success("Wallet funded with SOL + USDC");
      setCooldownSeconds(0); // Set cooldown manually after success
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Failed to fund wallet. Try again later.";
      toast.error(msg);
    } finally {
      setLoading(false); // 🔄 Reset loading state
    }
  };

  return (
    <button
      onClick={handleFund}
      disabled={cooldownSeconds > 0 || loading}
      className={` px-3 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
        cooldownSeconds
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-transparent hover:bg-purple-700 hover:text-white dark:hover:bg-green-700 text-[#9945ff]  border-2 dark:border[#14f195] dark:text-[#14f195] shadow-md animate-pulse"
      } ${loading ? "opacity-75" : ""} ${className || ""}`}>
      {/* 🧾 Button text based on state */}
      {cooldownSeconds
        ? `Try again in ${formatTime(cooldownSeconds)}`
        : loading
        ? "⏳ Funding..."
        : " Fund Wallet"}
    </button>
  );
};
