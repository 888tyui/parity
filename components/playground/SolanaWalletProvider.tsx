"use client";

import { useMemo, useCallback, useEffect, type ReactNode } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import type { WalletError, Adapter } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

// Debug component that logs all wallet state changes
function WalletDebugger() {
  const { publicKey, connected, connecting, disconnecting, wallet, wallets } = useWallet();

  useEffect(() => {
    console.log("[WALLET DEBUG] State changed:", {
      connected,
      connecting,
      disconnecting,
      publicKey: publicKey?.toBase58() ?? null,
      selectedWallet: wallet?.adapter?.name ?? null,
      readyState: wallet?.adapter?.readyState ?? null,
      availableWallets: wallets.map(w => ({
        name: w.adapter.name,
        readyState: w.adapter.readyState,
      })),
    });
  }, [publicKey, connected, connecting, disconnecting, wallet, wallets]);

  // Check if Phantom is available in window
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    const phantom = w.phantom as Record<string, unknown> | undefined;
    const solana = w.solana as Record<string, unknown> | undefined;
    console.log("[WALLET DEBUG] Browser check:", {
      hasPhantom: !!phantom,
      hasPhantomSolana: !!phantom?.solana,
      isPhantom: !!(phantom?.solana as Record<string, unknown>)?.isPhantom,
      hasWindowSolana: !!solana,
    });
  }, []);

  return null;
}

export default function SolanaWalletProvider({
  children,
}: {
  children: ReactNode;
}) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Phantom explicitly added for reliable popup; Wallet Standard still auto-detects others
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  const onError = useCallback((error: WalletError, adapter?: Adapter) => {
    console.error("[WALLET DEBUG] onError:", error.name, error.message, adapter?.name);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
        <WalletModalProvider>
          <WalletDebugger />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
