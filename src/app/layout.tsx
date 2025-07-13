



import "./globals.css";
import { Space_Grotesk, Sora } from "next/font/google";
import LayoutWrapper from "@/components/LayoutWrapper";


export const metadata = {
  title: "SolaPay",
  description: "Fast, secure invoice payments on Solana.",
  icons: {
    icon: "/favicon.ico",
  },
};

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: "700",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: "700",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${sora.variable} antialiased`}>
      {/* ✨ Moved LayoutWrapper logic inside <body> to avoid wrapping public routes */}

      <body className="min-h-screen flex flex-col text-black dark:text-white dark:bg-[#0B091A] bg-[#E3EEFF]">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
