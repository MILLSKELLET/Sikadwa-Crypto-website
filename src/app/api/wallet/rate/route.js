import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: /api/wallet/rate
export async function GET() {
  try {
    // Fetch exchange rate from admin
    const admin = await prisma.user.findUnique({
      where: { email: "admin@gmail.com" },
      select: { usdToCedisRate: true }
    });

    if (!admin || admin.usdToCedisRate <= 0) {
      return NextResponse.json({ error: "Exchange rate not set by admin." }, { status: 400 });
    }

    return NextResponse.json({ exchangeRate: admin.usdToCedisRate });
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
