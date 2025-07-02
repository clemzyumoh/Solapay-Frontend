"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

import TokenSelect from "@/components/TokenSelect";

//import { PublicKey } from "@solana/web3.js";

//import { Invoice } from "@/types/invoice";

import { useWallet } from "@solana/wallet-adapter-react";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { useInvoiceContext } from "@/context/InvoiceContext";

export default function CreateInvoicePage() {
  //const [createdInvoice, setCreatedInvoice] = useState<Invoice | null>(null);
 // const [showModal, setShowModal] = useState(false);
  
  const { publicKey } = useWallet();
  const { setAllInvoices, setUnpaidInvoices } = useInvoiceContext();
  const { user } = useUser(); // user.name, user.email, etc.
  // const isValidPublicKey = (key: string) => {
  //   try {
  //     new PublicKey(key);
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // };
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    recipient: "",
    toemail: "",
    title: "",
    amount: "",
    token: "SOL",
    description: "",
    //email: "",
    dueDate: "",
    isRecurring: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.recipient) newErrors.recipient = "Recipient is required";
    if (!formData.title) newErrors.title = "Title is required";
    if (
      !formData.amount ||
      isNaN(Number(formData.amount)) ||
      Number(formData.amount) <= 0
    ) {
      newErrors.amount = "Enter a valid amount";
    }
    if (
      formData.toemail &&
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.toemail)
    ) {
      newErrors.toemail = "Enter a valid email";
    }
    if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = "Due date must be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix form errors");
      return;
    }

    setLoading(true); // ✅ Start loading here
    try {
      const response = await axios.post(
        "http://localhost:5000/invoice/create",
        {
          title: formData.title,
          description: formData.description,
          amount: parseFloat(formData.amount),
          token: formData.token,
          toName: formData.recipient,
          toemail: formData.toemail,
          dueDate: formData.dueDate || null,
          fromName: user?.name || "", // ✅ from UserContext
          fromEmail: user?.email || "", // ✅ from UserContext
          fromAddress: publicKey?.toBase58() || "", // ✅ from wallet
        }
      );

      const createdInvoice = response.data.invoice;
     // setCreatedInvoice(createdInvoice);
//setShowModal(true);
      toast.success("Invoice created successfully");
      setAllInvoices((prev) => [createdInvoice, ...prev]);
      setUnpaidInvoices((prev) => [createdInvoice, ...prev]);

      // Clear form
      setFormData({
        recipient: "",
        toemail: "",
        title: "",
        amount: "",
        token: "SOL",
        description: "",
        //email: "",
        dueDate: "",
        isRecurring: false,
      });
      setErrors({});
    } catch (err) {
      console.error("Invoice creation failed:", err);
      toast.error("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mb-32 mt-20 p-6 space-y-8 rounded-4xl  dark:bg-gray-950   bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c]">
      <h1 className="text-2xl font-bold text-center">Create Invoice</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Recipient */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Recipient Name
          </label>
          <input
            name="recipient"
            value={formData.recipient}
            onChange={handleChange}
            type="text"
            placeholder="Full Name"
            className="w-full border rounded px-4 py-2"
          />
          {errors.recipient && (
            <p className="text-red-500 text-sm">{errors.recipient}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Recipient Email
          </label>
          <input
            name="toemail"
            value={formData.toemail}
            onChange={handleChange}
            type="email"
            placeholder="example@email.com"
            className="w-full border rounded px-4 py-2"
          />
          {errors.toemail && (
            <p className="text-red-500 text-sm">{errors.toemail}</p>
          )}
        </div>

        {/* Amount & Token */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              type="number"
              placeholder="0.00"
              className="w-full border rounded px-4 py-2"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Token</label>

            <div className="text-black">
              <TokenSelect
                value={formData.token}
                onChange={(val) => setFormData({ ...formData, token: val })}
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            type="text"
            placeholder="title"
            className="w-full border rounded px-4 py-2"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>
        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            rows={3}
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Due Date (optional)
          </label>
          <input
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            type="date"
            className="w-full border  rounded px-4 py-2 bg-white dark:bg-black text-black dark:text-white appearance-none"
          />
          {errors.dueDate && (
            <p className="text-red-500 text-sm">{errors.dueDate}</p>
          )}
        </div>

        {/* Action Button */}
        <button
          disabled={loading}
          type="submit"
          className="w-full dark:border-2 bg-[#14f195] dark:bg-transparent rounded-2xl dark:border-[#14f195] dark:text-[#14f195] cursor-pointer py-2 px-4 ">
          {loading ? "Generating..." : "Generate Invoice"}
        </button>
      </form>
    </div>
  );
}
