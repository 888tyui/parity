"use client";

import { useMemo, useCallback, type ReactNode } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import type { WalletError, Adapter } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

export default function SolanaWalletProvider({
  children,
}: {
  children: ReactNode;
}) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Empty array — Wallet Standard auto-detects Phantom, Solflare, etc.
  // No Ledger/USB adapters per project rules.
  const wallets = useMemo(() => [], []);

  const onError = useCallback((error: WalletError, adapter?: Adapter) => {
    console.error("Wallet error:", error.name, error.message, adapter?.name);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={false}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
