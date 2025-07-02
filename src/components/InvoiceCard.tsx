

"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";


export interface InvoiceData {
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
  activities?: {
    type: string;
    timestamp: string;
  }[];
}


// Props expected by the InvoiceCard component
interface InvoiceCardProps {
  invoice: InvoiceData; // Invoice data to display
  onClick?: () => void; // Optional click handler
  highlight?: boolean; // NEW
}

// Map invoice status to color class for visual feedback
const statusColor: Record<string, string> = {
  paid: "text-green-500",
  pending: "text-yellow-500",
  expired: "text-red-500",
};

// Functional component to render an invoice summary card
const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, onClick , highlight}) => {
  return (
    <div
      id={`invoice-${invoice._id}`}
      
      onClick={onClick} // Handle card click
      className={`py-4 px-6 dark:bg-gray-950 bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c] lg:p-6 rounded-4xl transition cursor-pointer flex justify-between items-center w-full ${
        highlight
          ? "border-2 border-[#14f195]  bg-[#ecfff9] shadow-lg scale-[1.01] "
          : " "
      }`}>
      {/* Left section: Title and description */}
      <div>
        <div className="text-sm font-medium">{invoice.title}</div>
        <div className="text-xs text-muted-foreground">
          {invoice.amount} {invoice.token.toUpperCase()} · {invoice.status}
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date(invoice.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Right section: Status and icon */}
      <div className="flex flex-col items-end gap-1">
        <span
          className={`text-xs font-semibold ${statusColor[invoice.status]}`}>
          {invoice.status.toUpperCase()}
        </span>
        <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  );
};

export default InvoiceCard;
