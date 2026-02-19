import SolanaWalletProvider from "@/components/playground/SolanaWalletProvider";

export default function VerepoLayout({ children }: { children: React.ReactNode }) {
    return (
        <SolanaWalletProvider>
            <div className="h-screen flex flex-col bg-bg-primary">{children}</div>
        </SolanaWalletProvider>
    );
}
