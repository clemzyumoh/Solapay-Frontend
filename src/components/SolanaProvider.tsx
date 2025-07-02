"use client";

import { FC, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  
} from "@solana/wallet-adapter-wallets";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { SlopeWalletAdapter } from "@solana/wallet-adapter-slope";
import { SolletWalletAdapter } from "@solana/wallet-adapter-sollet";

// Required once for default wallet UI styling
import "@solana/wallet-adapter-react-ui/styles.css";

const SolanaProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet; // Change to testnet or MainnetBeta when ready
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
   // () => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })],
    () => [new SolflareWalletAdapter({ network }),
      new SlopeWalletAdapter(),
    new SolletWalletAdapter(),

    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default SolanaProvider;
