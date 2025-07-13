// "use client";
// import React from "react";

// import Image from "next/image";

// import RadialChart from "@/components/RadialChart";

// import WormChart from "@/components/WormChartCard";

// import { useTheme } from "../components/ThemeProvider";
// import { SiSolana } from "react-icons/si";
// export const dynamic = "force-static";

// import { BsCoin } from "react-icons/bs";
// import SplineAreaChart from "@/components/SplineAreaChart";
// import NotificationTicker from "@/components/NotificationTicker";
// import InvoiceCard, { InvoiceData } from "../components/InvoiceCard";
// import InvoiceModal from "../components/InvoiceModal";
// import Link from "next/link";
// import { useWalletBalance } from "@/hooks/useWalletBalance";
// import { useInvoiceContext } from "../context/InvoiceContext";
// import { useUser } from "@/context/UserContext";
// import BalanceButton from "@/components/BalanceButton";

// export default function Home() {
//   // const solanaTps = useSolanaTPS();

//   const { darkMode } = useTheme();
//   // const maxTps = 60000; // Theoretical or peak TPS
//   // const solanaPercent = (solanaTps / maxTps) * 100;
//   const usdcPercent = 80; // fixed 100% for USDC price
//   // const [showBalance, setShowBalance] = useState(true);

//   const { unpaidInvoices, allInvoices } = useInvoiceContext();
//   const { user } = useUser();

//   // Get the most recent unpaid invoices (e.g., top 4)
//   const recentInvoices = unpaidInvoices
//     .filter((inv) => inv.status === "pending")
//     .sort(
//       (a, b) =>
//         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//     )
//     .slice(0, 6);
//   const [selectedInvoice, setSelectedInvoice] =
//     React.useState<InvoiceData | null>(null);

//   const sentCount = allInvoices.filter(
//     (inv) => inv.fromEmail === user?.email
//   ).length;
//   const receivedCount = allInvoices.filter(
//     (inv) => inv.toemail === user?.email
//   ).length;

//   const mockData = {
//     "30m": [
//       [31, 40, 28, 51, 42, 109, 100],
//       [11, 32, 45, 32, 34, 52, 41],
//     ],
//     "1h": [
//       [22, 56, 43, 29, 60, 80, 75],
//       [17, 21, 44, 38, 56, 45, 62],
//     ],
//     "4h": [
//       [40, 80, 60, 90, 120, 110, 100],
//       [20, 35, 55, 50, 70, 65, 60],
//     ],
//     "7d": [
//       [100, 150, 130, 170, 160, 180, 200],
//       [80, 90, 95, 100, 110, 105, 115],
//     ],
//   };

//   const mockCategories = {
//     "30m": [...Array(7)]
//       .map((_, i) => new Date(Date.now() - i * 5 * 60000).toISOString())
//       .reverse(),
//     "1h": [...Array(7)]
//       .map((_, i) => new Date(Date.now() - i * 10 * 60000).toISOString())
//       .reverse(),
//     "4h": [...Array(7)]
//       .map((_, i) => new Date(Date.now() - i * 40 * 60000).toISOString())
//       .reverse(),
//     "7d": [...Array(7)]
//       .map((_, i) => new Date(Date.now() - i * 24 * 60 * 60000).toISOString())
//       .reverse(),
//   };

//   const { solBalance, usdcBalance, totalUsd, prices } = useWalletBalance();

//   if (!prices) return <p>Loading balances...</p>;

//   return (
//     <main className="lg:mt-24 mt-20 mb-32 flex lg:w-[80vw] w-full overflow-x-hidden justify-center items-center p-6 md:p-6 h-full">
//       <div className="flex flex-col justify-center items-center w-full h-full">
//         <div className="flex justify-between flex-col lg:flex-row items-center gap-5  w-full h-full">
//           <div className="flex flex-col justify-between items-center w-full gap-4  ">
//             <div className="dark:bg-gray-950 bg-[#FFFFFF] w-full  shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c]  lg:p-6 rounded-4xl  mb-8">
//               <div className="flex justify-between w-full p-4 items-center">
//                 <div className="flex flex-col justify-center w-full items-center">
//                   <div className="flex justify-between w-full items-center">
//                     <h1 className="font-bold text-2xl my-3 lg:my-5">Assets</h1>
//                     <div className="flex items-end-safe justify-items-end-safe">
//                       <Image
//                         src="/logo4.svg"
//                         alt="Picture of the logo"
//                         width={40}
//                         height={40}
//                         className="w-12 h-12  lg:hidden"
//                       />

                     
//                       <Image
//                         src="/logo4.svg"
//                         alt="Picture of the logo"
//                         width={60}
//                         height={60}
//                         className=" w-16 h-16 lg:block hidden"
//                       />

//                       <h1 className="font-bold lg:text-2xl text-xl dark:bg-gradient-to-tl from-[#9945ff]  via-[#14f195] to-[#14f195] dark:text-transparent bg-clip-text ">
//                         OLAPAY
//                       </h1>
//                     </div>
//                   </div>

//                   <div className="flex flex-col justify-start items-start w-full ">
//                     <p className="">Your Total Balance</p>
//                     <div className="flex justify-start  w-full  items-center gap-3  ">
//                       {/* <span className="md:text-2xl text-xl font-bold  text-neutral-800 dark:text-neutral-300">
//                         {showBalance ? totalUsd : "••••"}
//                       </span>
//                       <button onClick={() => setShowBalance(!showBalance)}>
//                         {showBalance ? (
//                           <FaEyeSlash className="text-gray-500 dark:text-neutral-200" />
//                         ) : (
//                           <FaEye className="text-gray-800 dark:text-neutral-200" />
//                         )}
//                       </button> */}
//                       {/* Show USDC balance */}
//                       <BalanceButton
//                         balance={totalUsd}
//                         decimals={2}
//                         currencySymbol="$"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <SplineAreaChart data={mockData} categories={mockCategories} />
//             </div>
//             <div className="dark:bg-gray-950 bg-[#FFFFFF] w-full p-6 shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c]  lg:p-6 rounded-4xl mb-9">
//               <div className="flex flex-col justify-center items-center w-full ">
//                 <h1 className="mb-4 font-bold text-2xl">Total Invoice</h1>
//                 <div className="flex justify-between items-center w-full">
//                   <p className="">
//                     {" "}
//                     Sent: <span className="font-bold">{sentCount}</span>
//                   </p>
//                   <p className="">
//                     {" "}
//                     Received: <span className="font-bold">{receivedCount}</span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-center  lg:flex-col h-full gap-4 mb-10 lg:mb-0 items-start md:flex-row flex-col w-full lg:w-full">
//             <div className="dark:bg-gray-950 lg:w-full  bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c] p-4 lg:p-6 rounded-4xl flex flex-col  w-full">
//               <div className="flex items-center justify-between w-full">
//                 <div className="flex justify-start w-full items-start gap-2 md:gap-4">
//                   <div className="flex justify-center rounded bg-[#a1f8d3] px-3 py-3 items-center ">
//                     <SiSolana className="text-[#14f195] text-2xl" />
//                   </div>
//                   <div className="flex flex-col items-start jusify-start">
//                     <h1 className="font-bold text-lg md:text-xl">SOLANA</h1>
//                     <p className="text-sm">Solana</p>
//                   </div>
//                 </div>

//                 <div className="flex justify-end  w-full  items-center gap-3  ">
//                   {/* Show SOL balance */}
//                   <BalanceButton
//                     balance={solBalance}
//                     decimals={3}
//                     currencySymbol=""
//                   />
//                 </div>
//               </div>
//               <div className="flex justify-between gap-[65px] md:gap-24 items-center">
//                 <p className="mt-8">${prices.sol}</p>
//                 <WormChart data={[12, 2, 50, 5, 72, 10, 80]} color="#14f195" />
//               </div>
//               <div className="flex justify-between w-full items-center mt-6 gap-8 flex-row">
//                 <h3>Daily PNL</h3>
//                 <p className="text-[#14f195]">+$342.63</p>
//                 <p className="text-[#14f195]">+26.45%</p>
//               </div>
//             </div>
//             <div className="dark:bg-gray-950 lg:w-full  bg-[#FFFFFF] shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c] p-4 lg:p-6 rounded-4xl flex justify-center items-center flex-col  w-full">
//               <div className="flex items-center justify-between w-full">
//                 <div className="flex justify-start w-full items-start gap-2 md:gap-4">
//                   <div className="flex justify-center rounded bg-[#d1b1f9] px-3 py-3 items-center  ">
//                     <BsCoin className="text-[#9945ff] text-3xl" />
//                   </div>
//                   <div className="flex flex-col items-start jusify-start w-full">
//                     <h1 className="font-bold md:text-xl text-lg">USDC/SOL</h1>
//                     <p className="text-sm">Solana</p>
//                   </div>
//                 </div>

//                 <div className="flex justify-end  w-full  items-center gap-3  ">
//                   {/* Show USDC balance */}
//                   <BalanceButton
//                     balance={usdcBalance}
//                     decimals={2}
//                     currencySymbol="$"
//                   />
//                 </div>
//               </div>
//               <div className="flex justify-between gap-20 md:gap-24 items-center w-full">
//                 <p className="mt-8">${prices.usdc}</p>
//                 <WormChart data={[12, 2, 50, 5, 72, 10, 80]} color="#9945ff" />
//               </div>
//               <div className="flex justify-between w-full items-center mt-6 gap-8 flex-row">
//                 <h3>Daily PNL</h3>
//                 <p className="text-[#9945ff]">+$342.63</p>
//                 <p className="text-[#9945ff]">+26.45%</p>
//               </div>
//             </div>
//             <div className=" flex lg:flex items-end md:hidden justify-center w-full">
//               <RadialChart
//                 key={darkMode ? "dark" : "light"}
//                 series={[50, usdcPercent]}
//                 labels={["Solana TPS", "USDC Price"]}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-center w-full gap-8 items-start flex-col md:flex-row">
//           <div className="flex justify-center items-center  w-full">
//             <section className="flex justify-center items-center w-full flex-col">
//               <h2 className="text-2xl font-bold mb-6">Recent Invoices</h2>
//               <div className="space-y-4 mb-4 w-full">
//                 {recentInvoices.length === 0 ? (
//                   <p className="text-sm text-center my-10 text-gray-500">
//                     No pending invoices yet.
//                   </p>
//                 ) : (
//                   recentInvoices.map((invoice) => (
//                     <InvoiceCard
//                       key={invoice._id}
//                       invoice={invoice}
//                       onClick={() => setSelectedInvoice(invoice)}
//                     />
//                   ))
//                 )}
//               </div>

//               {selectedInvoice && (
//                 <InvoiceModal
//                   invoice={selectedInvoice}
//                   onClose={() => setSelectedInvoice(null)}
//                 />
//               )}
//               <Link href="/Details" className="relative inline-block">
//                 <button className="dark:border-2 dark:bg-transparent shadow-[2px_2px_5px_#c0c5cc] dark:shadow-[2px_2px_5px_#040f4c,-2px_-2px_5px_#040f4c] border-[#14f195] my-3 cursor-pointer dark:text-[#14f195] py-3 px-4 rounded-2xl bg-white">
//                   View All
//                 </button>
//               </Link>
//             </section>
//           </div>
//           <div className="flex justify-center items-center w-full">
//             <NotificationTicker />
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}
