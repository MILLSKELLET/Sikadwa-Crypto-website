import prisma from "@/lib/prisma";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId, oddsId, reference } = await req.json();

    if (!userId || !oddsId || !reference) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

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

    // Create order in DB
    const order = await prisma.order.create({
      data: {
        userId,
        oddsId,
        status: paymentStatus,
        paymentReference: reference,
        transactionId: String(paymentData.id), // ✅ Convert transactionId to String
      },
    });

    console.log("====================================");
    console.log(order);
    console.log("====================================");

    return NextResponse.json(
      { message: "Order processed", order, paymentStatus },
      { status: 200 }
    );
  } catch (error) {
    console.error({ error: "Error verifying payment: "+error });
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
