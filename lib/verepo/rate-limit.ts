// ========================================
// Verepo — DB-backed Daily Rate Limiter
// ========================================
// Resets at UTC midnight (= KST 9:00 AM)
// Wallet: 3 analyses/day | IP: 5 analyses/day

import { prisma } from "@/lib/prisma";

const WALLET_LIMIT = 3;
const IP_LIMIT = 5;

/** Get today's date string in UTC (YYYY-MM-DD) */
function getUTCDate(): string {
    const now = new Date();
    return now.toISOString().split("T")[0];
}

/** Format next reset time (next UTC midnight = next KST 9:00 AM) */
function getResetInMs(): number {
    const now = new Date();
    const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    return tomorrow.getTime() - now.getTime();
}

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetIn: number;
    reason?: string;
}

/**
 * Check rate limits for a request.
 * - If wallet is provided: check wallet limit (3/day) AND IP limit (5/day)
 * - If no wallet: check IP limit (5/day) only
 * Does NOT increment counters — call `recordUsage` after successful analysis.
 */
export async function checkRateLimit(ip: string, wallet?: string): Promise<RateLimitResult> {
    const date = getUTCDate();
    const resetIn = getResetInMs();

    // Check IP limit
    const ipUsage = await prisma.verepoUsage.findUnique({
        where: { key_type_date: { key: `ip:${ip}`, type: "ip", date } },
    });
    const ipCount = ipUsage?.count ?? 0;

    if (ipCount >= IP_LIMIT) {
        return { allowed: false, remaining: 0, resetIn, reason: "IP daily limit reached (5/day)" };
    }

    // Check wallet limit if provided
    if (wallet) {
        const walletUsage = await prisma.verepoUsage.findUnique({
            where: { key_type_date: { key: wallet, type: "wallet", date } },
        });
        const walletCount = walletUsage?.count ?? 0;

        if (walletCount >= WALLET_LIMIT) {
            return { allowed: false, remaining: 0, resetIn, reason: "Wallet daily limit reached (3/day)" };
        }

        const walletRemaining = WALLET_LIMIT - walletCount;
        const ipRemaining = IP_LIMIT - ipCount;
        return { allowed: true, remaining: Math.min(walletRemaining, ipRemaining), resetIn };
    }

    return { allowed: true, remaining: IP_LIMIT - ipCount, resetIn };
}

/**
 * Record a usage after successful analysis start.
 */
export async function recordUsage(ip: string, wallet?: string): Promise<void> {
    const date = getUTCDate();

    // Always record IP usage
    await prisma.verepoUsage.upsert({
        where: { key_type_date: { key: `ip:${ip}`, type: "ip", date } },
        update: { count: { increment: 1 } },
        create: { key: `ip:${ip}`, type: "ip", date, count: 1 },
    });

    // Record wallet usage if provided
    if (wallet) {
        await prisma.verepoUsage.upsert({
            where: { key_type_date: { key: wallet, type: "wallet", date } },
            update: { count: { increment: 1 } },
            create: { key: wallet, type: "wallet", date, count: 1 },
        });
    }
}

/**
 * Get remaining usage counts for display.
 */
export async function getRemainingUsage(ip: string, wallet?: string): Promise<{ ipRemaining: number; walletRemaining?: number; resetIn: number }> {
    const date = getUTCDate();
    const resetIn = getResetInMs();

    const ipUsage = await prisma.verepoUsage.findUnique({
        where: { key_type_date: { key: `ip:${ip}`, type: "ip", date } },
    });

    const result: { ipRemaining: number; walletRemaining?: number; resetIn: number } = {
        ipRemaining: IP_LIMIT - (ipUsage?.count ?? 0),
        resetIn,
    };

    if (wallet) {
        const walletUsage = await prisma.verepoUsage.findUnique({
            where: { key_type_date: { key: wallet, type: "wallet", date } },
        });
        result.walletRemaining = WALLET_LIMIT - (walletUsage?.count ?? 0);
    }

    return result;
}
