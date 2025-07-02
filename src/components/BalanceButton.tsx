

"use client";
import React, { useState, useCallback } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface BalanceButtonProps {
  balance: number;
  decimals?: number; // Optional decimals, default 3
  currencySymbol?: any; // Optional currency symbol, e.g. "$"
  className?: string; // optional styling class
}

const BalanceButton: React.FC<BalanceButtonProps> = React.memo(
  ({ balance, decimals = 3, currencySymbol = "", className }) => {
    const [showBalance, setShowBalance] = useState(false);

    const toggleShow = useCallback(() => {
      setShowBalance((prev) => !prev);
    }, []);

    const formattedBalance = balance.toFixed(decimals);

    return (
      <div className={`flex items-center gap-2 ${className || ""}`}>
        <span
          aria-label={showBalance ? "Hide balance" : "Show balance"}
          className="font-semibold text-lg select-none">
          {showBalance ? `${currencySymbol}${formattedBalance}` : "••••"}
        </span>
        <button
          onClick={toggleShow}
          aria-pressed={showBalance}
          aria-label={showBalance ? "Hide balance" : "Show balance"}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none"
          type="button">
          {showBalance ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
      </div>
    );
  }
);

export default BalanceButton;
