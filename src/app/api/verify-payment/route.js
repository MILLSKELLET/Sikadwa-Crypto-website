import prisma from "@/lib/prisma";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId, amount, reference } = await req.json();

    if (!userId || !amount || !reference) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      return NextResponse.json(
        { message: "Paystack secret key is missing" },
        { status: 500 }
      );
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return NextResponse.json(
        { message: "Invalid amount format" },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${paystackSecretKey}` },
      }
    );

    const paymentData = response.data.data;
    const paymentStatus =
      paymentData.status === "success" ? "success" : "failed";

    // Create transaction in DB
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type: "DEPOSIT",
        amount: parsedAmount,
        status: paymentStatus,
        transactionRef: reference,
        transactionId: String(paymentData.id), // Convert transactionId to String
      },
    });

    if (transaction) {
      // Fetch user again to get the latest localWallet balance
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { localWallet: true }, // Fetch only the required field
      });

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          localWallet: (user.localWallet || 0) + parsedAmount, // Ensure valid number
        },
      });
    }

    revalidatePath("/user/wallet"); // Revalidate user data

    return NextResponse.json(
      { message: "Transaction processed", transaction, paymentStatus },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
