import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if necessary
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma"; // Adjust the path to where your singleton file is located

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, description, currency, price, quantityAvailable, type } =
      await req.json();

    if (!["BUY", "SELL"].includes(type)) {
      return NextResponse.json({ error: "Invalid gig type" }, { status: 400 });
    }

    console.log(type);


    if (quantityAvailable <= 0) {
      return NextResponse.json(
        { error: "Quantity must be greater than zero" },
        { status: 400 }
      );
    }

    const gig = await prisma.gig.create({
      data: {
        userId: session.user.id,
        title,
        description,
        currency,
        price,
        quantityAvailable,
        type, // BUY or SELL
        status: "active",
      },
    });

    return NextResponse.json(gig, { status: 201 });
  } catch (error) {
    console.error("Gig Creation Error:", error);
    return NextResponse.json(
      { error: "Failed to create gig" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const gigs = await prisma.gig.findMany({
      where: { status: "active" },
      include: { User: true },
    });

    // console.log(gigs);
    return NextResponse.json(gigs);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
