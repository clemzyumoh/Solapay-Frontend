export type Activity = {
  type: string;
  timestamp: string;
};

export type User = {
  wallet: string;
  username: string;
  email?: string;
};

export type Invoice = {
  id: string;
  sender: User;
  //fromName: string
  recipient: User;
  amount: number;
  token: string;
  status: string;
  description: string;
  createdAt: string;
  transactionUrl: string;
  activities: Activity[];
  reference?: string; // Optional: Solana Pay reference
};
