

// context/InvoiceContext.tsx

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useUser } from "./UserContext";
export type Invoice = {
  _id: string;
  invoiceId: string;
  title: string;
  description: string;
  amount: number;
  token: string;
  fromName?: string;
  fromAddress?: string;
  fromEmail?: string;
  toName: string;
  toemail: string;
  status: "pending" | "paid" | "expired";
  createdAt: string;
  dueDate?: string;
  paidAt?: string;
  reference?: string;
  signature?: string;
  solanaUrl?: string;
  qrCodeUrl?: string;
};

interface InvoiceContextProps {
  allInvoices: Invoice[];
  unpaidInvoices: Invoice[];
  setUnpaidInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>; // ✅ correct type
  selectedInvoice: Invoice | null;
  setSelectedInvoice: (invoice: Invoice | null) => void;
  refreshInvoices: () => void;
  setAllInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
}

const InvoiceContext = createContext<InvoiceContextProps | undefined>(undefined);

export const useInvoiceContext = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoiceContext must be used within an InvoiceProvider");
  }
  return context;
};

export const InvoiceProvider = ({ children }: { children: React.ReactNode }) => {
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [unpaidInvoices, setUnpaidInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const { user } = useUser();

  // const fetchInvoices = async () => {
  //   try {
  //     const res = await axios.get(
  //       `http://localhost:5000/invoice/getall?email=${user?.email}`
  //     );

  //     const invoices: Invoice[] = res.data;
  //     setAllInvoices(invoices);
  //     setUnpaidInvoices(invoices.filter((inv) => inv.status === "pending"));
  //   } catch (err) {
  //     console.error("Error fetching invoices:", err);
  //   }
  // };




  const fetchInvoices = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/invoice/getall?email=${user?.email}`
      );
      const invoices: Invoice[] = res.data;
      setAllInvoices(invoices);
      setUnpaidInvoices(invoices.filter((inv) => inv.status === "pending"));
    } catch (err) {
      console.error("Error fetching invoices:", err);
    }
  }, [user?.email]); // dependencies used inside the function

  useEffect(() => {
    if (user?.email) {
      fetchInvoices(); // fetch initially

      const interval = setInterval(() => {
        fetchInvoices(); // poll every 10s
      }, 10000);

      return () => clearInterval(interval); // cleanup
    }
  }, [user?.email, fetchInvoices]);

  const value: InvoiceContextProps = {
    allInvoices,
    unpaidInvoices,
    selectedInvoice,
    setSelectedInvoice,
    setUnpaidInvoices,
    refreshInvoices: fetchInvoices,
    setAllInvoices, //
  };

  return (
    <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
  );
};
