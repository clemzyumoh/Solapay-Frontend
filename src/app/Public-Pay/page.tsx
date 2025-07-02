

"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";

import Image from "next/image";


import { SolanaPayQRCode } from "@/components/SolanaPayQRCode";
import toast from "react-hot-toast";
import { BigNumber } from "bignumber.js";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletContextState } from "@solana/wallet-adapter-react";

import { useSearchParams } from "next/navigation";






import { TransactionInstruction } from "@solana/web3.js";





import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  ComputeBudgetProgram,
  //sendAndConfirmTransaction,
  
} from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";

import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
 // TOKEN_PROGRAM_ID,
} from "@solana/spl-token";




export default function PaymentPage() {
  const wallet = useWallet(); // ✅ full WalletContextState
      const { disconnect  } =
        useWallet();
  

      const [load, setLoad] = useState(false);
    
        const [loading, setLoading] = useState(true); // NEW
  //const [activeTab, setActiveTab] = useState<"invoice" | "direct">("invoice");
  // const [formData, setFormData] = useState({
  //   recipient: "",
  //   amount: "",
  //   token: "Sol",
  //   note: "",
  // });
  const { connection } = useConnection();
  // DEVNET USDC (fake for devnet testing)
  const USDC_MINT = new PublicKey(
    "EGcvNycAx1dkZUjm5GBgK5bj2sMNEK3cUhVwKLAXnyU9" // "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
  );
  const {
    connect,

    connected,
    select,
    wallets,

    publicKey,
    //sendTransaction
  } = useWallet();


    const [triggerConnect, setTriggerConnect] = useState(false);

    const handleConnect = async () => {
        if (!wallet.wallet && wallets.length > 0) {
            await select(wallets[0].adapter.name); // ✅ correct condition
            setTriggerConnect(true); // trigger connect after wallet is selected
        } else if (wallet.wallet && !connected) {
            await connect();
            toast.success("Wallet Connected!");
        }else {
          //console.error("Connection error:", error);
          toast.error("Connection failed");
        }
      }
    

    // useEffect will run after `wallet` is set
    useEffect(() => {
        const doConnect = async () => {
          if (triggerConnect && wallet.wallet && !connected) {
            try {
              await connect();
              toast.success("Wallet Connected!");
            } catch (error) {
              console.error("Connection error:", error);
              toast.error("Connection failed");
            } finally {
              setTriggerConnect(false); // clear flag
            }
          }
        };
      
        doConnect();
      }, [wallet.wallet, triggerConnect, connect, connected]);
      
    const handelDisconnect = () => {
        disconnect()
      toast.success("Wallet Disconnected!");

    }


  const shortenAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-6)}`;
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("invoiceId");
    const reference = searchParams.get("reference");
    
  type Invoice = {
    invoiceId: string;
    reference: string;
    fromName: string;
    fromAddress: string;
    toName: string;
    amount: number;
    token: "SOL" | "USDC";
    title?: string;
    description?: string;
    dueDate?: string;
    solanaUrl?: string;
    fromEmail?: string;
  };
  
    
    const [invoice, setInvoice] = useState<Invoice | null>(null);

    
    useEffect(() => {
      const fetchInvoice = async () => {
        try {
          const res = await fetch(
            `http://localhost:5000/invoice/getbyid?${
              invoiceId ? `invoiceId=${invoiceId}` : `reference=${reference}`
            }`
          );
          const data = await res.json();
          if (data.status === "paid") {
            setInvoice(null); // or set a `paid` state
            toast.error("Invoice already paid");
          } else {
            setInvoice(data);
          }
        } catch (err) {
          console.error("Failed to load invoice", err);
        } finally {
          setLoading(false); // ✅ Stop loading regardless of result
        }
      };

        if (invoiceId || reference) {
          fetchInvoice();
        } else {
          setLoading(false); // ✅ Stop loading if no invoiceId/reference
        }
    }, [invoiceId, reference]);


  interface SendDirectPaymentParams {
    connection: Connection;
    wallet: WalletContextState;
    recipient: string;
    amount: number;
    token: "SOL" | "USDC";
    
  }

  const sendDirectPayment = async ({
    connection,
    wallet,
    recipient,
    amount,
    token,
  }: SendDirectPaymentParams)  => {
    try {
      if (!wallet.publicKey) throw new Error("Wallet not connected");
      if (!invoice?.reference) throw new Error("Invoice reference is missing");

      const sender = wallet.publicKey;
      const recipientPubkey = new PublicKey(recipient.trim());

      const transaction = new Transaction();

      if (token === "SOL") {
        const lamports = amount * LAMPORTS_PER_SOL;

        const transferIx = SystemProgram.transfer({
          fromPubkey: sender,
          toPubkey: recipientPubkey,
          lamports,
        });

        // Attach the reference pubkey manually
        transferIx.keys.push({
          pubkey: new PublicKey(invoice.reference),
          isSigner: false,
          isWritable: false,
        });

        transaction.add(transferIx);

        if (invoice.invoiceId) {
          transaction.add(
            new TransactionInstruction({
              keys: [],
              programId: new PublicKey(
                "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
              ),
             // data: Buffer.from(invoice.invoiceId),
              data: Buffer.from(invoice.invoiceId, "utf-8"), // ✅ CORRECT
            })
          );
        }
      } else if (token === "USDC") {
        const mint = USDC_MINT;
        const amountInSmallestUnit = amount * 10 ** 6; // USDC has 6 decimals

        const senderTokenAccount = await getAssociatedTokenAddress(
          mint,
          wallet.publicKey!
        );

        const recipientTokenAccount = await getAssociatedTokenAddress(
          mint,
          recipientPubkey
        );

        const recipientInfo = await connection.getAccountInfo(
          recipientTokenAccount
        );

        transaction.add(
          ComputeBudgetProgram.setComputeUnitLimit({ units: 200_000 })
        );
        if (!recipientInfo) {
          transaction.add(
            createAssociatedTokenAccountInstruction(
              wallet.publicKey!, // payer
              recipientTokenAccount, // associated token account to create
              recipientPubkey, // owner of the token account
              mint // token mint (USDC)
            )
          );
        }

        // ✅ Manually create instruction with reference key as additional account
        const transferIx = createTransferInstruction(
          senderTokenAccount,
          recipientTokenAccount,
          wallet.publicKey!,
          amountInSmallestUnit,
          [] // multisig signers
        );

        // ✅ Add the reference key manually
        transferIx.keys.push({
          pubkey: new PublicKey(invoice!.reference), // 👈 you MUST assert non-null here
          isSigner: false,
          isWritable: false,
        });

        // ✅ Add to transaction
        transaction.add(transferIx);

        if (invoice && invoice.invoiceId) {
          transaction.add(
            new TransactionInstruction({
              keys: [],
              programId: new PublicKey(
                "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
              ),
                data: Buffer.from(invoice.invoiceId, "utf-8"), // ✅ CORRECT
              //  console.log("Memo being encoded and sent:", invoice.invoiceId)

            })
          );
        }
      } else {
        throw new Error("Unsupported token");
      }

      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");
      // ✅ Call backend to update invoice
      await fetch(
        `http://localhost:5000/invoice/updateinvoice?signature=${signature}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );
      // ✅ Determine correct reference
      const reference = invoice?.reference;
      if (!reference) throw new Error("Invoice reference is missing");

     

      toast.success(`${token} payment successful!`);
      console.log("Transaction Signature:", signature);
      console.log("Transaction ref:", reference);
      setInvoice(null); // Clear the invoice from the UI
    } catch (err) {
      console.error("Direct payment error:", err);
      toast.error("Payment failed");
    }
  };
  
  const handlePayment = ()=> {
    if (!invoice?.fromName || !invoice?.amount || !invoice?.fromAddress) {
      toast.error("Missing payment details.");
      return;
    }
    // ❌ Disallow payment if invoice is expired
    if (invoice.dueDate && new Date() > new Date(invoice.dueDate)) {
      toast.error("This invoice is expired and cannot be paid manually.");
      return;
    }
    setLoad(true); // ✅ Start loading here

    sendDirectPayment({
      connection,
      wallet,
      recipient: invoice.fromAddress, // now safely assumed as string
      amount: invoice.amount,
      token: invoice.token.toUpperCase() as "SOL" | "USDC",
    });
  }
    
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen bg-[#0B091A] text-white">
          <div className="relative">
            {/* Spinner */}
            <div className="w-46 h-46 border-4 border-[#14f195] border-t-transparent rounded-full animate-spin" />

            {/* Centered Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-end-safe justify-items-end-safe">
                <Image
                  src="/logo4.svg"
                  alt="Picture of the logo"
                  width={40}
                  height={40}
                  className="mb-1"
                />
                <h1 className="font-bold text-xl bg-gradient-to-tl from-[#9945ff] via-[#14f195] to-[#14f195] text-transparent bg-clip-text">
                  OLAPAY
                </h1>
              </div>
            </div>
          </div>
        </div>
      );
    }
      
  return (
    <div className="max-w-3xl mx-auto mt-16 p-4 space-y-6">
      {/* Invoice Section */}

      {!invoice ? (
        <div className="text-center text-gray-500 font-semibold">
          Invoice already paid or not found.
        </div>
      ) : (
        // ) : invoice.fromEmail === user?.email ? (
        //   <div className="text-center text-red-500 font-semibold">
        //     You have not received any invoice
        //   </div>
        <div className=" rounded-4xl p-6 space-y-6 text-black bg-gray-950   shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c] w-full">
          <div className="flex items-center justify-between w-full flex-col md:flex-row gap-4">
            <div className="flex items-center justify-center w-full">
              {/* <Image
                src="/logo4.svg"
                alt="Picture of the logo"
                className="mb-2"
                width={40} //automatically provided
                height={40} //automatically provided
                // blurDataURL="data:..." automatically provided
                // placeholder="blur" // Optional blur-up while loading
              /> */}
           
              <Image
                src="/logo4.svg"
                alt="Picture of the logo"
                width={40}
                height={40}
                  className="w-12 h-12 mb-5"
                  priority
              />

              <h1 className="font-bold text-2xl bg-gradient-to-br from-[#9945ff] via-[#14f195] to-[#14f195] text-transparent bg-clip-text ">
                OLAPAY
              </h1>
            </div>
            <div className="flex w-full justify-start text-white items-center flex-col ">
              <h2 className="text-xl text-white font-semibold">
                {invoice?.fromName}
              </h2>

              <p className="text-lg font-bold">
                {invoice?.amount} {invoice?.token}
              </p>
              <p className="text-sm text-gray-600">{invoice?.title}</p>

              <p className="text-sm text-gray-600">{invoice?.description}</p>
              <p className="text-sm text-gray-500">Due: {invoice?.dueDate}</p>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            {/* <QRCode value={invoice.solanaPayLink} size={160} /> */}
            {invoice?.toName && invoice?.reference && invoice?.fromAddress && (
              <SolanaPayQRCode
                reference={new PublicKey(invoice?.reference)}
                recipient={new PublicKey(invoice?.fromAddress)}
                amount={new BigNumber(invoice.amount).toNumber()} // ✅ FIXED
                label="Pay Invoice"
                message={`Invoice #${invoice?.invoiceId}`}
                memo={`solapay-${invoice?.invoiceId}`}
                //reference={new PublicKey(invoice?.reference)}
                trackPayment
                onConfirmed={() => {
                  toast.success("Payment received!");
                }}
              />
            )}
            <button
              className="bg-gray-950 rounded-xl mt-5 cursor-pointer text-white shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c] px-4 py-3 text-sm "
              onClick={() => {
                if (invoice?.solanaUrl) {
                  navigator.clipboard.writeText(invoice.solanaUrl);
                  toast.success("copied");
                }
              }}>
              Copy Payment Link
            </button>
          </div>

          <div className="space-y-2 text-white">
            {!connected || !publicKey ? (
              <button
                onClick={handleConnect}
                className="w-full py-2 bg-gray-950 rounded-xl my-3 cursor-pointer shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c]">
                Connect Wallet
              </button>
            ) : (
              <div className="w-full py-2 bg-gray-950 rounded-xl my-3 cursor-default  shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c] flex justify-center gap-3 items-center">
                <span>{shortenAddress(publicKey.toBase58())}</span>
                <button
                  onClick={handelDisconnect}
                  className="cursor-pointer py-2 px-3 bg-red-500 rounded-2xl ml-5 text-white">
                  Disconnect
                </button>
              </div>
            )}

            <button
              disabled={load}
              onClick={handlePayment}
              className="w-full py-2 bg-[#14f195]  dark:shadow-none  text-white rounded-xl hover:bg-[#04834e] cursor-pointer">
              {load ? " Pay with Wallet...." : " Pay with Wallet"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

