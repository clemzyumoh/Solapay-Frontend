// types/notification.ts

export interface Notifications {
  _id: string;
  userId: string;
    title: string;      // New
  message: string;
  type: "invoice" | "system";
  invoiceId?: string;
  isRead: boolean;
  createdAt: string; // from Mongo
  senderImageUrl: string;
  receiverImageUrl: string;
  fromEmail: string; // 🔥 New - who sent the invoice
  toEmail: string; 
}
