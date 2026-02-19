// ========================================
// Verepo — Usage Info Endpoint
// GET /api/verepo/usage?wallet=xxx
// ========================================

import { NextRequest, NextResponse } from "next/server";
import { getRemainingUsage } from "@/lib/verepo/rate-limit";

export async function GET(req: NextRequest) {
    try {
        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            req.headers.get("x-real-ip") ||
            "unknown";

        const wallet = req.nextUrl.searchParams.get("wallet") || undefined;

        const usage = await getRemainingUsage(ip, wallet);

        return NextResponse.json(usage);
    } catch (err) {
        console.error("[verepo/usage] Error:", err);
        return NextResponse.json(
            { error: String(err), ipRemaining: 5, resetIn: 86400000 },
            { status: 200 }
        );
    }
}
