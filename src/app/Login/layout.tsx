
"use client";

import { UserProvider } from "@/context/UserContext";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}
