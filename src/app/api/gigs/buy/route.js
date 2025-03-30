// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import prisma from "@/lib/prisma";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if necessary

// export async function POST(req) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const body = await req.json();
//     const { gigId, amountCrypto } = body;

//     // Validate input
//     if (!gigId) {
//       return NextResponse.json({ error: "Missing gigId" }, { status: 400 });
//     }

//     // Ensure amountCrypto is a valid number
//     const amount = parseFloat(amountCrypto);
//     if (isNaN(amount) || amount <= 0) {
//       return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
//     }

//     const gig = await prisma.gig.findUnique({ where: { id: gigId } });
//     if (!gig)
//       return NextResponse.json({ error: "Gig not found" }, { status: 404 });

//     // Check if we have enough quantity
//     // Note: Schema shows quantityAvailable should be non-null, but handle safely
//     if ((gig.quantityAvailable || 0) < amount) {
//       return NextResponse.json(
//         { error: "Not enough quantity available" },
//         { status: 400 }
//       );
//     }

//     // Ensure price is a valid number
//     const gigPrice = parseFloat(gig.price) || 0;
//     const totalPrice = parseFloat((gigPrice * amount).toFixed(8));

//     const buyer = await prisma.user.findUnique({
//       where: { id: session.user.id },
//     });
//     const seller = await prisma.user.findUnique({ where: { id: gig.userId } });

//     if (!buyer || !seller)
//       return NextResponse.json({ error: "User not found" }, { status: 404 });

//     // Determine which wallet to update based on currency
//     const walletKey = gig.currency.toLowerCase() + "Wallet";

//     // Handle potential null wallet values - schema shows default 0
//     const buyerBalance = parseFloat(buyer[walletKey]) || 0;
//     const sellerBalance = parseFloat(seller[walletKey]) || 0;


//     if (gig.type === "BUY") {
//       // User is buying crypto from someone who posted they want to sell
//       if (sellerBalance < amount) {
//         return NextResponse.json(
//           { error: "Seller does not have enough crypto" },
//           { status: 400 }
//         );
//       }

//       // Perform the transaction using direct value updates (not increment/decrement)
//       await prisma.$transaction([
//         // Update seller wallet
//         prisma.user.update({
//           where: { id: seller.id },
//           data: { [walletKey]: sellerBalance - amount },
//         }),
//         // Update buyer wallet
//         prisma.user.update({
//           where: { id: buyer.id },
//           data: { [walletKey]: buyerBalance + amount },
//         }),
//         // Create an order record
//         prisma.order.create({
//           data: {
//             buyerId: buyer.id,
//             sellerId: seller.id,
//             currency: gig.currency,
//             amountCrypto: amount,
//             amountUSD: totalPrice,
//             status: "COMPLETED",
//             orderRef: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
//           },
//         }),
//       ]);
//     } else if (gig.type === "SELL") {
//       // User is selling crypto to someone who posted they want to buy
//       if (buyerBalance < totalPrice) {
//         return NextResponse.json(
//           { error: "Insufficient balance" },
//           { status: 400 }
//         );
//       }

//       // Perform the transaction using direct value updates
//       await prisma.$transaction([
//         // Update buyer wallet
//         prisma.user.update({
//           where: { id: buyer.id },
//           data: { [walletKey]: buyerBalance - totalPrice },
//         }),
//         // Update seller wallet
//         prisma.user.update({
//           where: { id: seller.id },
//           data: { [walletKey]: sellerBalance + totalPrice },
//         }),
//         // Create an order record
//         prisma.order.create({
//           data: {
//             buyerId: buyer.id,
//             sellerId: seller.id,
//             currency: gig.currency,
//             amountCrypto: amount,
//             amountUSD: totalPrice,
//             status: "COMPLETED",
//             orderRef: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
//           },
//         }),
//       ]);
//     }

//     // Update gig quantity
//     await prisma.gig.update({
//       where: { id: gig.id },
//       data: {
//         // Direct assignment instead of decrement
//         quantityAvailable: Math.max(0, (gig.quantityAvailable || 0) - amount),
//         status:
//           (gig.quantityAvailable || 0) - amount <= 0 ? "completed" : "active",
//       },
//     });

//     return NextResponse.json(
//       { message: "Transaction successful" },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Transaction error:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to process transaction" },
//       { status: 500 }
//     );
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

    // Get crypto wallet key based on currency
    const cryptoWalletKey = gig.currency.toLowerCase() + "Wallet";
    
    // Handle potential null wallet values
    const buyerCryptoBalance = parseFloat(buyer[cryptoWalletKey]) || 0;
    const sellerCryptoBalance = parseFloat(seller[cryptoWalletKey]) || 0;
    const buyerUsdBalance = parseFloat(buyer.usdWallet) || 0;
    const sellerUsdBalance = parseFloat(seller.usdWallet) || 0;

    if (gig.type === "BUY") {
      // This is a BUY gig - Someone posted they want to BUY crypto
      // The current user (session.user) is SELLING crypto to them
      
      // Check if current user (seller) has enough crypto
      if (buyerCryptoBalance < amount) {
        return NextResponse.json(
          { error: "You do not have enough crypto to sell" },
          { status: 400 }
        );
      }

      // Check if gig poster (buyer) has enough USD
      if (sellerUsdBalance < totalPrice) {
        return NextResponse.json(
          { error: "Buyer does not have enough USD" },
          { status: 400 }
        );
      }

      // Perform the transaction
      await prisma.$transaction([
        // Current user gives crypto
        prisma.user.update({
          where: { id: buyer.id },
          data: { [cryptoWalletKey]: buyerCryptoBalance - amount },
        }),
        // Current user receives USD
        prisma.user.update({
          where: { id: buyer.id },
          data: { usdWallet: buyerUsdBalance + totalPrice },
        }),
        // Gig poster gives USD
        prisma.user.update({
          where: { id: seller.id },
          data: { usdWallet: sellerUsdBalance - totalPrice },
        }),
        // Gig poster receives crypto
        prisma.user.update({
          where: { id: seller.id },
          data: { [cryptoWalletKey]: sellerCryptoBalance + amount },
        }),
        // Create an order record
        prisma.order.create({
          data: {
            buyerId: seller.id, // The gig poster is buying crypto
            sellerId: buyer.id, // The current user is selling crypto
            currency: gig.currency,
            amountCrypto: amount,
            amountUSD: totalPrice,
            status: "COMPLETED",
            orderRef: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          },
        }),
      ]);
    } else if (gig.type === "SELL") {
      // This is a SELL gig - Someone posted they want to SELL crypto
      // The current user (session.user) is BUYING crypto from them
      
      // Check if current user (buyer) has enough USD
      if (buyerUsdBalance < totalPrice) {
        return NextResponse.json(
          { error: "You do not have enough USD" },
          { status: 400 }
        );
      }

      // Check if gig poster (seller) has enough crypto
      if (sellerCryptoBalance < amount) {
        return NextResponse.json(
          { error: "Seller does not have enough crypto" },
          { status: 400 }
        );
      }

      // Perform the transaction
      await prisma.$transaction([
        // Current user gives USD
        prisma.user.update({
          where: { id: buyer.id },
          data: { usdWallet: buyerUsdBalance - totalPrice },
        }),
        // Current user receives crypto
        prisma.user.update({
          where: { id: buyer.id },
          data: { [cryptoWalletKey]: buyerCryptoBalance + amount },
        }),
        // Gig poster gives crypto
        prisma.user.update({
          where: { id: seller.id },
          data: { [cryptoWalletKey]: sellerCryptoBalance - amount },
        }),
        // Gig poster receives USD
        prisma.user.update({
          where: { id: seller.id },
          data: { usdWallet: sellerUsdBalance + totalPrice },
        }),
        // Create an order record
        prisma.order.create({
          data: {
            buyerId: buyer.id, // The current user is buying crypto
            sellerId: seller.id, // The gig poster is selling crypto
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