import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

// POST: /api/wallet/convert
export async function POST(req) {
  try {
    const { userId, amountGHS, amountUSD } = await req.json();

    if (!userId || (!amountGHS && !amountUSD)) {
      return NextResponse.json(
        { error: "Invalid data provided." },
        { status: 400 }
      );
    }

    // Fetch admin for exchange rates and seller ID
    const admin = await prisma.user.findUnique({
      where: { email: "admin@gmail.com" },
      select: { id: true, usdToCedisRate: true, cedisToUsdRate: true }, // ✅ Fetch usdToCedisRate and cedisToUsdRate
    });

    if (!admin || admin.usdToCedisRate <= 0) {
      return NextResponse.json(
        { error: "Exchange rate not set by admin." },
        { status: 400 }
      );
    }

    const { usdToCedisRate, cedisToUsdRate, id: sellerId } = admin;

    // Fetch user wallet balances
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, localWallet: true, usdWallet: true }, // Ensure all fields are selected
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    let updatedUser;
    let newOrder;
    let orderData = {
      buyerId: userId,
      sellerId,
      status: "PENDING",
      orderRef: randomUUID(),
    };

    if (amountGHS) {
      const convertedUSD = parseFloat((amountGHS / cedisToUsdRate).toFixed(2));
      if (user.localWallet < amountGHS) {
        return NextResponse.json(
          { error: "Insufficient GHS balance." },
          { status: 400 }
        );
      }

      const newLocalWallet = parseFloat(
        (user.localWallet - amountGHS).toFixed(2)
      );
      const newUsdWallet = parseFloat(
        (user.usdWallet + convertedUSD).toFixed(2)
      );

      // 🛠 Ensure valid numbers before update
      if (Number.isNaN(newLocalWallet) || Number.isNaN(newUsdWallet)) {
        console.error("Invalid wallet values: ", {
          newLocalWallet,
          newUsdWallet,
        });
        return NextResponse.json(
          { error: "Invalid wallet values." },
          { status: 400 }
        );
      }

      // Update balances and create order
      [updatedUser, newOrder] = await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: {
            localWallet: newLocalWallet,
            usdWallet: newUsdWallet,
          },
        }),
        prisma.order.create({
          data: {
            ...orderData,
            currency: "USD",
            amountCrypto: parseFloat(amountGHS),
            amountUSD: convertedUSD,
          },
        }),
      ]);
    } else if (amountUSD) {
      const convertedGHS = parseFloat((amountUSD * usdToCedisRate).toFixed(2));
      if (user.usdWallet < amountUSD) {
        return NextResponse.json(
          { error: "Insufficient USD balance." },
          { status: 400 }
        );
      }

      const newUsdWallet = parseFloat((user.usdWallet - amountUSD).toFixed(2));
      const newLocalWallet = parseFloat(
        (user.localWallet + convertedGHS).toFixed(2)
      );

      // 🛠 Ensure valid numbers before update
      if (Number.isNaN(newLocalWallet) || Number.isNaN(newUsdWallet)) {
        console.error("Invalid wallet values: ", {
          newLocalWallet,
          newUsdWallet,
        });
        return NextResponse.json(
          { error: "Invalid wallet values." },
          { status: 400 }
        );
      }

      // Update balances and create order
      [updatedUser, newOrder] = await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: {
            usdWallet: newUsdWallet,
            localWallet: newLocalWallet,
          },
        }),
        prisma.order.create({
          data: {
            ...orderData,
            currency: "GHS",
            amountCrypto: parseFloat(amountUSD),
            amountUSD: convertedGHS,
          },
        }),
      ]);
    }

    // Update order status to COMPLETED
    const completedOrder = await prisma.order.update({
      where: { id: newOrder.id },
      data: { status: "COMPLETED" },
    });

    return NextResponse.json({
      message: "Conversion successful.",
      order: completedOrder,
      updatedBalances: {
        localWallet: updatedUser.localWallet,
        usdWallet: updatedUser.usdWallet,
      },
    });
  } catch (error) {
    console.error("Error in conversion:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
