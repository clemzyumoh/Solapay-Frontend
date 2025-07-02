"use client";

import { useState, useEffect } from "react";

import Image from "next/image";
import TokenSelect from "@/components/TokenSelect";

import { SolanaPayQRCode } from "@/components/SolanaPayQRCode";
import toast from "react-hot-toast";
import { BigNumber } from "bignumber.js";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { useInvoiceContext } from "@/context/InvoiceContext";
import { useUser } from "@/context/UserContext";






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
  
} from "@solana/spl-token";




export default function PaymentPage() {
  const wallet = useWallet(); // ✅ full WalletContextState
  const { user } = useUser()
    const [load, setLoad] = useState(false);
  

  const [activeTab, setActiveTab] = useState<"invoice" | "direct">("invoice");
  const [formData, setFormData] = useState({
    recipient: "",
    amount: "",
    token: "Sol",
    note: "",
  });
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
   // sendTransaction
  } = useWallet();

  const [triggerConnect, setTriggerConnect] = useState(false);

  const handleConnect = async () => {
    if (!wallet.wallet && wallets.length > 0) {
      await select(wallets[0].adapter.name); // ✅ correct condition
      setTriggerConnect(true); // trigger connect after wallet is selected
    } else if (wallet.wallet && !connected) {
      await connect();
      toast.success("Wallet Connected!");
    } else {
      //console.error("Connection error:", error);
      toast.error("Connection failed");
    }
  };

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
    
 
  const shortenAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-6)}`;

  const { selectedInvoice, unpaidInvoices,setUnpaidInvoices, setSelectedInvoice , refreshInvoices} =
    useInvoiceContext();
    
    const invoice = selectedInvoice;
   // const { selectedInvoice: invoice } = useInvoiceContext();
    
  
    

    useEffect(() => {
      if (!selectedInvoice && unpaidInvoices.length > 0) {
        setSelectedInvoice(unpaidInvoices[0]); // Set most recent unpaid as default
      }
    }, [selectedInvoice, unpaidInvoices, setSelectedInvoice]);
    
  

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
              data: Buffer.from(invoice.invoiceId),
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
              data: Buffer.from(invoice?.invoiceId ?? ""),
            })
          );
        }
      } else {
        throw new Error("Unsupported token");
      }

      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      // ✅ Determine correct reference
      const reference = invoice?.reference || invoice?.fromAddress;
      if (!reference) throw new Error("Invoice reference is missing");

      // ✅ Call backend to update invoice
      await fetch(
        `http://localhost:5000/invoice/updateinvoice?signature=${signature}&reference=${reference}`,
        {
          method: "PATCH",
        }
      );

      toast.success(`${token} payment successful!`);
      console.log("Transaction Signature:", signature);
   
      setUnpaidInvoices((prev) => {
        const updated = prev.filter(
          (inv) => inv.invoiceId !== invoice.invoiceId
        );
        setSelectedInvoice(updated[0] || null);
        return updated;
      });
      
      refreshInvoices();

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
    setLoad(true); // ✅ Start loading here
    sendDirectPayment({
      connection,
      wallet,
      recipient: invoice.fromAddress, // now safely assumed as string
      amount: invoice.amount,
      token: invoice.token.toUpperCase() as "SOL" | "USDC",
    });
  }
    

  return (
    <div className="max-w-3xl mx-auto mt-16 p-4 space-y-6">
      <div className="flex justify-center gap-4">
        <button
          className={`px-4 py-2 rounded-xl cursor-pointer font-medium ${
            activeTab === "invoice"
              ? "dark:bg-gray-950 dark:text-[#14f195]  bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c]"
              : "border border-gray-500 text-gray-700"
          }`}
          onClick={() => setActiveTab("invoice")}>
          Pay Invoice
        </button>
        <button
          className={`px-4 py-2 rounded-xl cursor-pointer font-medium ${
            activeTab === "direct"
              ? "dark:bg-gray-950 dark:text-[#14f195]  bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c]"
              : "border border-gray-500 text-gray-700"
          }`}
          onClick={() => setActiveTab("direct")}>
          Direct Payment
        </button>
      </div>

      {/* Invoice Section */}
      {activeTab === "invoice" || invoice ? (
        !invoice ? (
          <div className="text-center text-gray-500 font-semibold">
            No unpaid invoice available.
          </div>
        ) : invoice.fromEmail === user?.email ? (
          <div className="text-center text-red-500 font-semibold">
            You have not received any invoice
          </div>
        ) : (
          <div className=" rounded-4xl p-6 space-y-6 dark:bg-gray-950   bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c] w-full">
            <div className="flex items-center justify-between w-full flex-col md:flex-row gap-4">
              <div className="flex items-center justify-center w-full">
              
                <Image
                  src="/logo4.svg"
                  alt="picture of logo"
                  className="w-12 mb-2 h-12"
                />

                <h1 className="font-bold text-2xl dark:bg-gradient-to-br from-[#9945ff] via-[#14f195] to-[#14f195] dark:text-transparent bg-clip-text ">
                  OLAPAY
                </h1>
              </div>
              <div className="flex w-full justify-start items-center flex-col ">
                <h2 className="text-xl font-semibold">{invoice?.fromName}</h2>

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
              {activeTab === "invoice" &&
                invoice?.toName &&
                invoice?.reference &&
                invoice?.fromAddress && (
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
                className="dark:bg-gray-950 rounded-xl mt-5 cursor-pointer   bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c] px-4 py-3 text-sm "
                onClick={() => {
                  if (invoice?.solanaUrl) {
                    navigator.clipboard.writeText(invoice.solanaUrl);
                    toast.success("copied");
                  }
                }}>
                Copy Payment Link
              </button>
            </div>

            <div className="space-y-2">
              {!connected || !publicKey ? (
                <button
                  onClick={handleConnect}
                  className="w-full py-2 dark:bg-gray-950 rounded-xl my-3 cursor-pointer bg-[#FFFFFF] shadow-[...]">
                  Connect Wallet
                </button>
              ) : (
                <div className="w-full py-2 dark:bg-gray-950 rounded-xl my-3 cursor-default bg-[#FFFFFF] shadow-[...] flex justify-center gap-3 items-center">
                  <span>{shortenAddress(publicKey.toBase58())}</span>
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
        )
      ) : (
        // Direct Payment Section
        <div className=" rounded-4xl  dark:bg-gray-950   bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c] w-full p-6 space-y-4 ">
          <h2 className="text-lg font-semibold mb-2">Direct Payment</h2>
          <input
            type="text"
            placeholder="Recipient Wallet Address"
            className="w-full border px-4 py-2 rounded-xl"
          />
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Amount"
              className="w-1/2 border px-4 py-2 rounded-xl"
            />

            <div className="w-1/2 text-black">
              <TokenSelect
                value={formData.token}
                onChange={(val) => setFormData({ ...formData, token: val })}
              />
            </div>
          </div>
          <input
            type="text"
            placeholder="Note or Description (optional)"
            className="w-full border px-4 py-2 rounded-xl"
          />

          <div className="space-y-2 mt-4">
            {!connected || !publicKey ? (
              <button
                onClick={handleConnect}
                className="w-full py-2 dark:bg-gray-950 border-2 rounded-xl my-3 cursor-pointer bg-[#FFFFFF] shadow-[...]">
                Connect Wallet
              </button>
            ) : (
              <div className="w-full py-2 dark:bg-gray-950 rounded-xl my-3 cursor-default bg-[#FFFFFF] shadow-[...] flex justify-center gap-3 items-center">
                <span>{shortenAddress(publicKey.toBase58())}</span>
              </div>
            )}
            <button
              onClick={handlePayment}
              className="w-full py-2 bg-[#14f195] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-none  text-white rounded-xl hover:bg-[#04834e] cursor-pointer">
              Pay with Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

