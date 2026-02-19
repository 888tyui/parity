"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import SubNav from "@/components/ui/SubNav";
import RepoInput from "./RepoInput";
import AnalysisView from "./AnalysisView";
import type { VerepoResponse, VerepoError } from "@/lib/verepo/types";
import bs58 from "bs58";

const SIGN_MESSAGE_PREFIX = "Parity Verepo: verify wallet ownership\n\nTimestamp: ";
const SIGNATURE_TTL = 5 * 60 * 1000; // 5 minutes

type Phase = "input" | "loading" | "polling" | "result" | "error";

interface AnalysisState {
    repoUrl: string;
    repoKey: string;
    result: (VerepoResponse & { meta: { repoName: string; filesAnalyzed: number; totalLines: number } }) | null;
    error: string | null;
    cached: boolean;
}

interface UsageInfo {
    ipRemaining: number;
    walletRemaining?: number;
    resetIn: number;
}

interface WalletSignature {
    signature: string;
    timestamp: number;
}

export default function VerepoClient() {
    const [phase, setPhase] = useState<Phase>("input");
    const [state, setState] = useState<AnalysisState>({
        repoUrl: "",
        repoKey: "",
        result: null,
        error: null,
        cached: false,
    });
    const [usage, setUsage] = useState<UsageInfo | null>(null);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const { publicKey, connected, signMessage } = useWallet();
    const { setVisible } = useWalletModal();
    const walletAddress = publicKey?.toBase58();
    const [walletSig, setWalletSig] = useState<WalletSignature | null>(null);
    const [sigPending, setSigPending] = useState(false);
    const [shareTooltip, setShareTooltip] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    // Fetch usage info when wallet connects
    const fetchUsage = useCallback(async () => {
        if (!walletAddress) {
            setUsage(null);
            return;
        }
        try {
            const res = await fetch(`/api/verepo/usage?wallet=${walletAddress}`);
            if (res.ok) {
                setUsage(await res.json());
            }
        } catch {
            // Silently fail
        }
    }, [walletAddress]);

    useEffect(() => {
        fetchUsage();
    }, [fetchUsage]);

    // Auto-load shared result from URL ?repo= param
    useEffect(() => {
        const repoParam = searchParams.get("repo");
        if (!repoParam || phase !== "input") return;

        const loadSharedResult = async () => {
            setPhase("loading");
            setState((s) => ({ ...s, repoUrl: `https://github.com/${repoParam}` }));
            try {
                const res = await fetch(`/api/verepo/status?repo=${encodeURIComponent(repoParam)}`);
                const data = await res.json();
                if (data.status === "done" && data.data) {
                    setState((s) => ({ ...s, result: data.data, cached: true }));
                    setPhase("result");
                } else if (data.status === "analyzing") {
                    setState((s) => ({ ...s, repoKey: repoParam }));
                    setPhase("polling");
                    startPolling(repoParam);
                } else {
                    // No cached result — go back to input
                    setPhase("input");
                    router.replace("/verepo", { scroll: false });
                }
            } catch {
                setPhase("input");
            }
        };
        loadSharedResult();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!connected || !signMessage || !walletAddress || sigPending) return;
        // Already have a valid signature
        if (walletSig && (Date.now() - walletSig.timestamp) < SIGNATURE_TTL) {
            console.log("[WALLET DEBUG] Already have valid sig, skipping");
            return;
        }

        const doSign = async () => {
            setSigPending(true);
            console.log("[WALLET DEBUG] Requesting signature...");
            try {
                const timestamp = Date.now();
                const message = new TextEncoder().encode(`${SIGN_MESSAGE_PREFIX}${timestamp}`);
                const sig = await signMessage(message);
                console.log("[WALLET DEBUG] Signature received!", sig.length, "bytes");
                setWalletSig({ signature: bs58.encode(sig), timestamp });
            } catch (err) {
                console.error("[WALLET DEBUG] Signature REJECTED:", err);
                setWalletSig(null);
            } finally {
                setSigPending(false);
            }
        };
        doSign();
    }, [connected, signMessage, walletAddress, walletSig, sigPending]);

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, []);

    const startPolling = useCallback((repoKey: string) => {
        if (pollRef.current) clearInterval(pollRef.current);

        pollRef.current = setInterval(async () => {
            try {
                const res = await fetch(`/api/verepo/status?repo=${encodeURIComponent(repoKey)}`);
                const data = await res.json();

                if (data.status === "done") {
                    if (pollRef.current) clearInterval(pollRef.current);
                    setState((s) => ({ ...s, result: data.data, cached: true }));
                    setPhase("result");
                    fetchUsage();
                } else if (data.status === "error") {
                    if (pollRef.current) clearInterval(pollRef.current);
                    setState((s) => ({ ...s, error: data.error || "Analysis failed" }));
                    setPhase("error");
                }
            } catch {
                // Keep polling on network errors
            }
        }, 3000);
    }, [fetchUsage]);

    const handleSubmit = async (url: string) => {
        if (!walletAddress || !walletSig) {
            setVisible(true);
            return;
        }

        // Re-sign if signature expired
        let sig = walletSig;
        if ((Date.now() - sig.timestamp) >= SIGNATURE_TTL && signMessage) {
            try {
                const timestamp = Date.now();
                const message = new TextEncoder().encode(`${SIGN_MESSAGE_PREFIX}${timestamp}`);
                const rawSig = await signMessage(message);
                sig = { signature: bs58.encode(rawSig), timestamp };
                setWalletSig(sig);
            } catch {
                setState((s) => ({ ...s, error: "Wallet signature required to analyze." }));
                setPhase("error");
                return;
            }
        }

        setState({ repoUrl: url, repoKey: "", result: null, error: null, cached: false });
        setPhase("loading");

        try {
            const res = await fetch("/api/verepo/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    repoUrl: url,
                    wallet: walletAddress,
                    signature: sig.signature,
                    timestamp: sig.timestamp,
                }),
            });

            const data = await res.json();

            // Handle "analyzing" status (someone else is analyzing)
            if (data.status === "analyzing") {
                setState((s) => ({ ...s, repoKey: data.repoKey }));
                setPhase("polling");
                startPolling(data.repoKey);
                return;
            }

            if (!res.ok) {
                const errData = data as VerepoError;
                setState((s) => ({ ...s, error: errData.error || "Analysis failed" }));
                setPhase("error");
                return;
            }

            setState((s) => ({ ...s, result: data, cached: !!data.cached }));
            setPhase("result");
            fetchUsage();
            // Update URL for sharing
            const repoKey = data.meta?.repoName || "";
            if (repoKey) {
                router.replace(`/verepo?repo=${encodeURIComponent(repoKey)}`, { scroll: false });
            }
        } catch {
            setState((s) => ({ ...s, error: "Network error. Please try again." }));
            setPhase("error");
        }
    };

    const handleReset = () => {
        if (pollRef.current) clearInterval(pollRef.current);
        setState({ repoUrl: "", repoKey: "", result: null, error: null, cached: false });
        setPhase("input");
        router.replace("/verepo", { scroll: false });
    };

    // Show remaining scans only when wallet is connected
    const remaining = (connected && usage)
        ? Math.min(usage.ipRemaining, usage.walletRemaining ?? Infinity)
        : null;

    return (
        <>
            {/* Header — always visible */}
            <SubNav
                label="VEREPO"
                centerExtra={<>
                    {phase !== "input" && (
                        <>
                            <div className="w-px h-3.5 bg-border" />
                            <span className="text-xs font-[family-name:var(--font-dm-sans)] font-medium text-text-primary truncate max-w-[200px]">
                                {state.repoUrl.replace(/^https?:\/\/(www\.)?github\.com\//, "")}
                            </span>
                        </>
                    )}
                    {(phase === "loading" || phase === "polling") && (
                        <span className="flex items-center gap-1.5 text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-blue-primary">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-primary animate-pulse" />
                            {phase === "polling" ? "Waiting..." : "Analyzing..."}
                        </span>
                    )}
                </>}
                rightContent={phase !== "input" ? (
                    <div className="flex items-center gap-3">
                        {phase === "result" && (
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    setShareTooltip(true);
                                    setTimeout(() => setShareTooltip(false), 2000);
                                }}
                                className="flex items-center gap-1.5 text-[11px] font-[family-name:var(--font-dm-sans)] text-text-secondary hover:text-text-primary transition-colors"
                            >
                                <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="6" y="6" width="8" height="8" rx="1.5" />
                                    <path d="M10 6V3.5A1.5 1.5 0 008.5 2h-5A1.5 1.5 0 002 3.5v5A1.5 1.5 0 003.5 10H6" />
                                </svg>
                                <span className="hidden sm:inline">{shareTooltip ? "Copied!" : "Share"}</span>
                            </button>
                        )}
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-1.5 text-[11px] font-[family-name:var(--font-dm-sans)] text-text-secondary hover:text-text-primary transition-colors"
                        >
                            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M1 1l10 10M11 1L1 11" />
                            </svg>
                            <span className="hidden sm:inline">New Scan</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        {/* Remaining scans — only visible after wallet connect */}
                        {connected && remaining !== null && (
                            <span className="text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary">
                                {remaining} scan{remaining !== 1 ? "s" : ""} left
                            </span>
                        )}
                        {/* Wallet button */}
                        {connected && walletAddress ? (
                            <span className="flex items-center gap-1.5 text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-green-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                            </span>
                        ) : (
                            <button
                                onClick={() => setVisible(true)}
                                className="flex items-center gap-1.5 text-[10px] font-[family-name:var(--font-dm-sans)] font-medium text-blue-primary hover:text-blue-deep transition-colors"
                            >
                                <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="2" y="4" width="12" height="9" rx="1.5" />
                                    <path d="M4 4V3a2 2 0 012-2h4a2 2 0 012 2v1" />
                                    <circle cx="11" cy="8.5" r="1" fill="currentColor" />
                                </svg>
                                Connect Wallet
                            </button>
                        )}
                    </div>
                )}
                rightLink={undefined}
            />

            {/* Content */}
            <AnimatePresence mode="wait">
                {phase === "input" && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col"
                    >
                        <RepoInput
                            onSubmit={handleSubmit}
                            walletConnected={connected}
                            onConnectWallet={() => setVisible(true)}
                        />
                    </motion.div>
                )}

                {phase === "loading" && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center gap-6"
                    >
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full border-2 border-blue-light/30 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full border-2 border-blue-primary/50 flex items-center justify-center animate-pulse">
                                    <div className="w-5 h-5 rounded-full bg-blue-primary/80" />
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-[family-name:var(--font-dm-sans)] font-medium text-text-primary">
                                Analyzing Repository
                            </p>
                            <p className="mt-2 text-xs font-[family-name:var(--font-dm-sans)] text-text-secondary max-w-[300px] leading-relaxed">
                                Cloning repo, extracting source files, and running deep code analysis...
                            </p>
                            <p className="mt-1 text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary/60">
                                Usually takes 20–60 seconds
                            </p>
                        </div>
                    </motion.div>
                )}

                {phase === "polling" && (
                    <motion.div
                        key="polling"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center gap-6"
                    >
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full border-2 border-blue-light/30 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full border-2 border-blue-primary/50 flex items-center justify-center animate-pulse">
                                    <svg className="w-5 h-5 text-blue-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 6v6l4 2" />
                                        <circle cx="12" cy="12" r="10" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-[family-name:var(--font-dm-sans)] font-medium text-text-primary">
                                Analysis In Progress
                            </p>
                            <p className="mt-2 text-xs font-[family-name:var(--font-dm-sans)] text-text-secondary max-w-[300px] leading-relaxed">
                                Someone else has already started analyzing this repository. Hang tight — results will appear shortly.
                            </p>
                        </div>
                    </motion.div>
                )}

                {phase === "error" && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center gap-4 px-6"
                    >
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 8v4M12 16h.01" />
                            </svg>
                        </div>
                        <p className="text-sm font-[family-name:var(--font-dm-sans)] font-medium text-text-primary text-center">
                            Analysis Failed
                        </p>
                        <p className="text-xs font-[family-name:var(--font-dm-sans)] text-text-secondary text-center max-w-md leading-relaxed">
                            {state.error}
                        </p>
                        <button
                            onClick={handleReset}
                            className="mt-2 px-5 py-2 text-xs font-[family-name:var(--font-dm-sans)] font-medium bg-blue-primary text-white rounded-lg hover:bg-blue-deep transition-colors"
                        >
                            Try Again
                        </button>
                    </motion.div>
                )}

                {phase === "result" && state.result && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col overflow-hidden"
                    >
                        <AnalysisView result={state.result} onReset={handleReset} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
