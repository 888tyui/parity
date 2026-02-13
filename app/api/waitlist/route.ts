import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wallet, email, path } = body as {
      wallet?: string;
      email?: string;
      path?: string;
    };

    if (!wallet || typeof wallet !== "string" || wallet.length < 32) {
      return NextResponse.json(
        { error: "Valid wallet address is required" },
        { status: 400 },
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 },
      );
    }

    const entry = await prisma.waitlist.upsert({
      where: { wallet },
      update: { email, path: path ?? null },
      create: { wallet, email, path: path ?? null },
    });

    return NextResponse.json({ success: true, position: entry.id });
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
