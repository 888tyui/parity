"use client";

import type { UserPath } from "@/types/playground";
import SolanaWalletProvider from "./SolanaWalletProvider";
import WaitlistFlow from "./WaitlistFlow";

interface WaitlistModalProps {
  path: UserPath;
  onClose: () => void;
}

export default function WaitlistModal({ path, onClose }: WaitlistModalProps) {
  return (
    <SolanaWalletProvider>
      <WaitlistFlow path={path} onClose={onClose} />
    </SolanaWalletProvider>
  );
}
