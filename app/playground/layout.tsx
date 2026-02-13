import SolanaWalletProvider from "@/components/playground/SolanaWalletProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col bg-bg-primary">
      <SolanaWalletProvider>{children}</SolanaWalletProvider>
    </div>
  );
}
