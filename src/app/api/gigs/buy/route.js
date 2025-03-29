import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if necessary


export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { gigId, amountCrypto } = await req.json();

    const gig = await prisma.gig.findUnique({ where: { id: gigId } });
    if (!gig) return NextResponse.json({ error: "Gig not found" }, { status: 404 });

    if (gig.quantityAvailable < amountCrypto) {
      return NextResponse.json({ error: "Not enough quantity available" }, { status: 400 });
    }

    const totalPrice = gig.price * amountCrypto;

    const buyer = await prisma.user.findUnique({ where: { id: session.user.id } });
    const seller = await prisma.user.findUnique({ where: { id: gig.userId } });

    if (!buyer || !seller) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const walletKey = gig.currency.toLowerCase() + "Wallet";

    if (gig.type === "SELL") {
      // Buyer purchases from a seller
      if ((buyer)[walletKey] < totalPrice) {
        return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
      }

      await prisma.$transaction(async (prisma) => {
        await prisma.user.update({
          where: { id: buyer.id },
          data: { [walletKey]: { decrement: totalPrice } },
        });

        await prisma.user.update({
          where: { id: seller.id },
          data: { [walletKey]: { increment: totalPrice } },
        });
      });
    } else if (gig.type === "BUY") {
      // Seller accepts a buy request
      if ((seller)[walletKey] < amountCrypto) {
        return NextResponse.json({ error: "Seller does not have enough crypto" }, { status: 400 });
      }

      await prisma.$transaction(async (prisma) => {
        await prisma.user.update({
          where: { id: seller.id },
          data: { [walletKey]: { decrement: amountCrypto } },
        });

        await prisma.user.update({
          where: { id: buyer.id },
          data: { [walletKey]: { increment: amountCrypto } },
        });
      });
    }

    // Update gig
    await prisma.gig.update({
      where: { id: gig.id },
      data: {
        quantityAvailable: { decrement: amountCrypto },
        status: gig.quantityAvailable - amountCrypto <= 0 ? "completed" : "active",
      },
    });

    return NextResponse.json({ message: "Transaction successful" }, { status: 201 });
  } catch (error) {
    console.error("Buy Gig Error:", error);
    return NextResponse.json({ error: "Failed to process transaction" }, { status: 500 });
  }
}

