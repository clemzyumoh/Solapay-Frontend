
import React from "react";
import toast from "react-hot-toast";
import { FaRegCircleXmark } from "react-icons/fa6";
import { useInvoiceContext } from "@/context/InvoiceContext";
import { Toaster } from "react-hot-toast";
import { useUser } from "@/context/UserContext";
import { deleteInvoiceById } from "@/services/api";
import { useRouter } from "next/navigation";



// Matches your backend model
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

type Props = {
  invoice: Invoice;
  onClose: () => void;
};



export default function InvoiceModal({ invoice, onClose }: Props) {
  const { setSelectedInvoice } = useInvoiceContext();
  const { user } = useUser();

  const router = useRouter();

  // ✅ Move handleCopy inside the component
  const handleCopy = () => {
    if (invoice.solanaUrl) {
      navigator.clipboard.writeText(invoice.solanaUrl);
      toast.success("Copied payment link!");
    } else {
      toast.error("No payment link to copy.");
    }
  };

  const shortenAddress = (address: string) =>
    `${address.slice(0, 8)}......${address.slice(-8)}`;


  interface AxiosErrorResponse {
    response?: {
      data?: {
        error?: string;
      };
    };
  }

 // const InvoiceModal = ({ invoice, onClose, onDeleted }: any) => {
    const handleDelete = async () => {
      try {
        await deleteInvoiceById(invoice.invoiceId);
        toast.success("Invoice deleted successfully");
        // onDeleted?.(); // optional callback to refresh list or close modal
        onClose();
      } catch (err: unknown) {
        const error = err as AxiosErrorResponse;
        const msg = error.response?.data?.error || "Error deleting invoice";
        toast.error(msg);
      }
      
    };
  
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto overscroll-contain">
      {/* <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">*/}
      <div className="bg-white text-black pt-12 pb-20  rounded-lg shadow-lg w-full max-w-md p-4 m-4 relative max-h-[calc(100vh-4rem)] overflow-y-auto">
        <Toaster position="top-right" />

        {/* Close Modal Button */}
        <button
          className="absolute top-12 right-3 text-gray-600 hover:text-gray-900"
          onClick={onClose}
          aria-label="Close modal">
          <FaRegCircleXmark className="text-2xl" />
        </button>

        {/* Invoice Header */}
        <h2 className="lg:text-xl text-left font-bold mb-4">
          Invoice #{shortenAddress(invoice.invoiceId)}
        </h2>

        {/* Sender Details */}
        <div className="mb-3">
          <strong>From:</strong> {invoice.fromName} ({invoice.fromEmail})<br />
          {invoice.fromAddress && (
            <span>Wallet: {shortenAddress(invoice.fromAddress)}</span>
          )}
        </div>

        {/* Recipient Details */}
        <div className="mb-3">
          <strong>To:</strong> {invoice.toName} ({invoice.toemail})
        </div>

        {/* Amount and Token */}
        <div className="mb-3">
          <strong>Amount:</strong> {invoice.amount}{" "}
          {invoice.token.toUpperCase()}
        </div>

        {/* Status */}
        <div className="mb-3">
          <strong>Status:</strong> {invoice.status.toUpperCase()}
        </div>

        {/* Title and Description */}
        <div className="mb-3">
          <strong>Title:</strong> {invoice.title}
          <br />
          <strong>Description:</strong> {invoice.description}
        </div>

        {/* Dates */}
        <div className="mb-3">
          <strong>Created:</strong>{" "}
          {new Date(invoice.createdAt).toLocaleString()}
          <br />
          {invoice.dueDate && (
            <>
              <strong>Due:</strong> {new Date(invoice.dueDate).toLocaleString()}
              <br />
            </>
          )}
          {invoice.paidAt && (
            <>
              <strong>Paid:</strong> {new Date(invoice.paidAt).toLocaleString()}
              <br />
            </>
          )}
        </div>

        {/* Solana Explorer Link */}
        {invoice.solanaUrl && (
          <div className="mb-3">
            <strong>Explorer:</strong>{" "}
            <a
              href={invoice.solanaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#14f195] hover:underline">
              View Transaction
            </a>
          </div>
        )}

        {/* QR Code (optional image url) */}
        {invoice.qrCodeUrl && (
          <div className="mb-3">
            <img src={invoice.qrCodeUrl} alt="QR Code" className="w-32 h-32" />
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-4 space-y-2">
          <button
            className="w-full bg-[#14f195] text-white cursor-pointer py-2 rounded"
            onClick={handleCopy}
            disabled={!invoice.solanaUrl}>
            Copy Payment Link
            {}
          </button>

          <button
            disabled={
              invoice.fromEmail === user?.email || invoice.status !== "pending"
            }
            className={`w-full py-2 rounded ${
              invoice.fromEmail === user?.email || invoice.status !== "pending"
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-[#14f195] text-white cursor-pointer"
            }`}
            onClick={() => {
              if (invoice.fromEmail === user?.email) {
                toast.error("You created this invoice. No action needed.");
                return;
              }

              if (!invoice.solanaUrl || invoice.status !== "pending") {
                toast.error(
                  "This invoice has already been paid or is invalid."
                );
                return;
              }

              setSelectedInvoice(invoice);
              router.push("/Payment");
              onClose();
            }}>
            Pay this Invoice
          </button>
          <button
            disabled={invoice.status !== "pending"}
            onClick={handleDelete}
            className={`w-full py-2 rounded ${
              invoice.status !== "pending"
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-[#14f195] text-white cursor-pointer"
            }`}>
            Delete Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
