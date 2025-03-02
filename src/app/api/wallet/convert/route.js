import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST: /api/wallet/convert
export async function POST(req) {
  try {
    const { userId, amountGHS, amountUSD } = await req.json();

    if (!userId || (!amountGHS && !amountUSD)) {
      return NextResponse.json({ error: "Invalid data provided." }, { status: 400 });
    }

    // Fetch the admin's exchange rate
    const admin = await prisma.user.findUnique({
      where: { email: "admin@gmail.com" },
      select: { usdToCedisRate: true }
    });

    if (!admin || admin.usdToCedisRate <= 0) {
      return NextResponse.json({ error: "Exchange rate not set by admin." }, { status: 400 });
    }

    const exchangeRate = admin.usdToCedisRate;

    // Fetch the user's wallet balances
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { localWallet: true, usdWallet: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Perform the conversion
    let updatedUser;
    if (amountGHS) {
      const amountUSD = parseFloat((amountGHS / exchangeRate).toFixed(2));
      if (user.localWallet < amountGHS) {
        return NextResponse.json({ error: "Insufficient GHS balance." }, { status: 400 });
      }
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          localWallet: user.localWallet - amountGHS,
          usdWallet: user.usdWallet + amountUSD
        }
      });
    } else if (amountUSD) {
      const amountGHS = parseFloat((amountUSD * exchangeRate).toFixed(2));
      if (user.usdWallet < amountUSD) {
        return NextResponse.json({ error: "Insufficient USD balance." }, { status: 400 });
      }
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          localWallet: user.localWallet + amountGHS,
          usdWallet: user.usdWallet - amountUSD
        }
      });
    }

    return NextResponse.json({
      message: "Conversion successful.",
      updatedBalances: {
        localWallet: updatedUser.localWallet,
        usdWallet: updatedUser.usdWallet
      }
    });
  } catch (error) {
    console.error("Error in conversion:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
