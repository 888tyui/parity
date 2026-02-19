// ========================================
// Verepo — Status Polling Endpoint
// GET /api/verepo/status?repo=owner/repo
// ========================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const repoKey = req.nextUrl.searchParams.get("repo");

    if (!repoKey) {
        return NextResponse.json({ error: "Missing 'repo' query parameter" }, { status: 400 });
    }

    const result = await prisma.verepoResult.findUnique({ where: { repoKey } });

    if (!result) {
        return NextResponse.json({ status: "not_found" });
    }

    if (result.status === "done" && result.result) {
        return NextResponse.json({
            status: "done",
            data: result.result,
        });
    }

    if (result.status === "error") {
        return NextResponse.json({
            status: "error",
            error: result.error,
        });
    }

    // Still analyzing
    return NextResponse.json({
        status: "analyzing",
        message: "Analysis in progress. Please wait...",
    });
}
