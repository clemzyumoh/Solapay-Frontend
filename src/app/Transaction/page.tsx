"use client";

import React, { useState, useEffect } from "react";
import InvoiceModal from "@/components/InvoiceModal";
import InvoiceCard, { InvoiceData } from "@/components/InvoiceCard";

import { useInvoiceContext } from "@/context/InvoiceContext";
import { useSearchParams } from "next/navigation";

export default function InvoiceDetailPage() {
  const { allInvoices, selectedInvoice, setSelectedInvoice , setAllInvoices} =
    useInvoiceContext();
    const [mounted, setMounted] = useState(false); // flag to delay modal rendering
    const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");
  
  useEffect(() => {
    if (highlightId) {
      const element = document.getElementById(`invoice-${highlightId}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightId]);
  

    useEffect(() => {
      setSelectedInvoice(null); // clear any invoice
      setMounted(true); // now it's safe to render
    }, []);

  return (
    <main className=" max-w-3xl mx-auto pb-10 p-6 mt-20">
      <h1 className="text-2xl font-bold mb-6">All Invoices</h1>
      <div className="space-y-4">
      
        {allInvoices.length === 0 ? (
          <p className="text-sm text-center my-20 text-gray-500">
            No pending invoices yet.
          </p>
        ) : (
          allInvoices.map((invoice) => (
            <InvoiceCard
              key={invoice._id}
              invoice={invoice}
              onClick={() => setSelectedInvoice(invoice)}
              highlight={invoice._id === highlightId}
            />
          ))
        )}
      </div>
    
      {mounted && selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </main>
  );
}
