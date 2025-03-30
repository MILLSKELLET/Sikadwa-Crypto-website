// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import prisma from "@/lib/prisma";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if necessary

// export async function POST(req) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { gigId, amountCrypto } = await req.json();

//     const gig = await prisma.gig.findUnique({ where: { id: gigId } });
//     if (!gig)
//       return NextResponse.json({ error: "Gig not found" }, { status: 404 });

//     if (gig.quantityAvailable < amountCrypto) {
//       return NextResponse.json(
//         { error: "Not enough quantity available" },
//         { status: 400 }
//       );
//     }

//     const totalPrice = gig.price * amountCrypto;

//     const buyer = await prisma.user.findUnique({
//       where: { id: session.user.id },
//     });
//     const seller = await prisma.user.findUnique({ where: { id: gig.userId } });

//     if (!buyer || !seller)
//       return NextResponse.json({ error: "User not found" }, { status: 404 });

//     const walletKey = gig.currency.toLowerCase() + "Wallet";

//     if (gig.type === "SELL") {
//       // Buyer purchases from a seller
//       if (buyer[walletKey] < totalPrice) {
//         return NextResponse.json(
//           { error: "Insufficient balance" },
//           { status: 400 }
//         );
//       }

//       await prisma.$transaction(async (prisma) => {
//         await prisma.user.update({
//           where: { id: buyer.id },
//           data: { [walletKey]: { decrement: totalPrice } },
//         });

//         await prisma.user.update({
//           where: { id: seller.id },
//           data: { [walletKey]: { increment: totalPrice } },
//         });
//       });
//     } else if (gig.type === "BUY") {
//       // Seller accepts a buy request
//       if (seller[walletKey] < amountCrypto) {
//         return NextResponse.json(
//           { error: "Seller does not have enough crypto" },
//           { status: 400 }
//         );
//       }

//       await prisma.$transaction(async (prisma) => {
//         await prisma.user.update({
//           where: { id: seller.id },
//           data: { [walletKey]: { decrement: amountCrypto } },
//         });

//         await prisma.user.update({
//           where: { id: buyer.id },
//           data: { [walletKey]: { increment: amountCrypto } },
//         });
//       });
//     }

//     // Update gig
//     await prisma.gig.update({
//       where: { id: gig.id },
//       data: {
//         quantityAvailable: { decrement: amountCrypto },
//         status:
//           gig.quantityAvailable - amountCrypto <= 0 ? "completed" : "active",
//       },
//     });

//     return NextResponse.json(
//       { message: "Transaction successful" },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error }, { status: 500 });
//     // return NextResponse.json(
//     //   { error: "Failed to process transaction" },
//     //   { status: 500 }
//     // );
//   }
// }

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if necessary

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { gigId, amountCrypto } = body;

    // Validate input
    if (!gigId) {
      return NextResponse.json({ error: "Missing gigId" }, { status: 400 });
    }

    // Ensure amountCrypto is a valid number
    const amount = parseFloat(amountCrypto);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const gig = await prisma.gig.findUnique({ where: { id: gigId } });
    if (!gig)
      return NextResponse.json({ error: "Gig not found" }, { status: 404 });

    // Check if we have enough quantity
    // Note: Schema shows quantityAvailable should be non-null, but handle safely
    if ((gig.quantityAvailable || 0) < amount) {
      return NextResponse.json(
        { error: "Not enough quantity available" },
        { status: 400 }
      );
    }

    // Ensure price is a valid number
    const gigPrice = parseFloat(gig.price) || 0;
    const totalPrice = parseFloat((gigPrice * amount).toFixed(8));

    const buyer = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    const seller = await prisma.user.findUnique({ where: { id: gig.userId } });

    if (!buyer || !seller)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Determine which wallet to update based on currency
    const walletKey = gig.currency.toLowerCase() + "Wallet";

    // Handle potential null wallet values - schema shows default 0
    const buyerBalance = parseFloat(buyer[walletKey]) || 0;
    const sellerBalance = parseFloat(seller[walletKey]) || 0;

    if (gig.type === "BUY") {
      // User is buying crypto from someone who posted they want to sell
      if (sellerBalance < amount) {
        return NextResponse.json(
          { error: "Seller does not have enough crypto" },
          { status: 400 }
        );
      }

      // Perform the transaction using direct value updates (not increment/decrement)
      await prisma.$transaction([
        // Update seller wallet
        prisma.user.update({
          where: { id: seller.id },
          data: { [walletKey]: sellerBalance - amount },
        }),
        // Update buyer wallet
        prisma.user.update({
          where: { id: buyer.id },
          data: { [walletKey]: buyerBalance + amount },
        }),
        // Create an order record
        prisma.order.create({
          data: {
            buyerId: buyer.id,
            sellerId: seller.id,
            currency: gig.currency,
            amountCrypto: amount,
            amountUSD: totalPrice,
            status: "COMPLETED",
            orderRef: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          },
        }),
      ]);
    } else if (gig.type === "SELL") {
      // User is selling crypto to someone who posted they want to buy
      if (buyerBalance < totalPrice) {
        return NextResponse.json(
          { error: "Insufficient balance" },
          { status: 400 }
        );
      }

      // Perform the transaction using direct value updates
      await prisma.$transaction([
        // Update buyer wallet
        prisma.user.update({
          where: { id: buyer.id },
          data: { [walletKey]: buyerBalance - totalPrice },
        }),
        // Update seller wallet
        prisma.user.update({
          where: { id: seller.id },
          data: { [walletKey]: sellerBalance + totalPrice },
        }),
        // Create an order record
        prisma.order.create({
          data: {
            buyerId: buyer.id,
            sellerId: seller.id,
            currency: gig.currency,
            amountCrypto: amount,
            amountUSD: totalPrice,
            status: "COMPLETED",
            orderRef: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          },
        }),
      ]);
    }

    // Update gig quantity
    await prisma.gig.update({
      where: { id: gig.id },
      data: {
        // Direct assignment instead of decrement
        quantityAvailable: Math.max(0, (gig.quantityAvailable || 0) - amount),
        status:
          (gig.quantityAvailable || 0) - amount <= 0 ? "completed" : "active",
      },
    });

    return NextResponse.json(
      { message: "Transaction successful" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Transaction error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process transaction" },
      { status: 500 }
    );
  }
}
