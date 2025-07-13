"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { Keypair, PublicKey } from "@solana/web3.js";
import { encodeURL, findReference } from "@solana/pay";
import QRCode from "react-qr-code";
import { BigNumber } from "bignumber.js";


import { useConnection } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";

interface SolanaPayQRCodeProps {
  recipient: PublicKey | string;
  amount?: number;
  label?: string;
  message?: string;
  memo?: string;
  reference?: PublicKey;
  trackPayment?: boolean;
  onConfirmed?: () => void;
}

export const SolanaPayQRCode: FC<SolanaPayQRCodeProps> = ({
  recipient,
  amount,
  label,
  message,
  memo,
  reference,
  trackPayment = false,
  onConfirmed,
}) => {
  const { connection } = useConnection();
  const [confirmed, setConfirmed] = useState(false);

  // Generate reference if not provided
  // const finalReference = useMemo(
  //   () => reference || Keypair.generate().publicKey,
  //   [reference]
  // );
  const finalReference = useMemo(() => {
    if (reference) return reference;
    console.warn("Missing reference — this will break payment tracking.");
    return Keypair.generate().publicKey; // fallback (not ideal)
  }, [reference]);


  // Build Solana Pay URL
  const url = useMemo(() => {
    try {
      return encodeURL({
        recipient: new PublicKey(recipient),
        amount: amount ? new BigNumber(amount) : undefined,
        reference: finalReference,
        label,
        message,
        memo,
      }).toString();
    } catch (err) {
      console.error("Invalid Solana Pay URL:", err);
      toast.error("Invalid Solana Pay URL:");
      return "";
    }
  }, [recipient, amount, label, message, memo, finalReference]);

  // Poll transaction confirmation
  useEffect(() => {
    if (!trackPayment || confirmed) return;

    const interval = setInterval(async () => {
      try {
        await findReference(connection, finalReference, {
          finality: "confirmed",
        });
        setConfirmed(true);
        onConfirmed?.();
        clearInterval(interval);
      } catch  {
        // Not confirmed yet
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [connection, finalReference, confirmed, trackPayment, onConfirmed]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 rounded-xl border bg-white shadow-md">
      <QRCode value={url} size={160} />
      <a href={url} target="_blank" rel="noopener noreferrer">
        Pay with Wallet
      </a>
      {trackPayment && confirmed && (
        <div className="text-green-600 font-medium">✅ Payment Confirmed</div>
      )}
    </div>
  );
};
