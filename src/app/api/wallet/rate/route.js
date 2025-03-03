import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/admin/rate
export async function GET() {
  try {
    const admin = await prisma.user.findUnique({
      where: { email: "admin@gmail.com" },
      select: {
        usdToCedisRate: true,
        cedisToUsdRate: true,
      },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({
      usdToCedisRate: admin.usdToCedisRate,
      cedisToUsdRate: admin.cedisToUsdRate,
    });
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
