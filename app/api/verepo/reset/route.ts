// Temporary admin endpoint — delete after testing
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);
    const secret = body?.secret;

    // Simple protection
    if (secret !== "parity-reset-2026") {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // Delete all usage records, error results, and specific repo cache
    const [usage, errors, paritycx] = await Promise.all([
        prisma.verepoUsage.deleteMany({}),
        prisma.verepoResult.deleteMany({ where: { status: "error" } }),
        prisma.verepoResult.deleteMany({ where: { repoKey: { startsWith: "paritydotcx/" } } }),
    ]);

    return NextResponse.json({
        cleared: {
            usageRecords: usage.count,
            errorResults: errors.count,
            paritycxResults: paritycx.count,
        },
    });
}
