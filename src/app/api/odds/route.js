// // API Routes (/app/api/odds/route.js)
// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function GET() {
//   const odds = await prisma.odds.findMany();
//   return NextResponse.json(odds);
// }

// export async function POST(req) {
//   const data = await req.json();
//   const newOdd = await prisma.odds.create({ data });
//   return NextResponse.json(newOdd);
// }

// export async function DELETE(req) {
//   const { id } = await req.json();
//   await prisma.odds.delete({ where: { id } });
//   return NextResponse.json({ message: "Deleted" });
// }

// export async function PUT(req) {
//   const { id,data } = await req.json();
//   await prisma.odds.update({ where: { id } });
//   return NextResponse.json({ message: "Deleted" });
// }




// /app/api/odds/route.js
import prisma from "@/lib/prisma";

export async function POST(req) {
  const { dateFilter } = await req.json();
  try {
    const filteredOdds = await prisma.odds.findMany({
      where: { games_date: dateFilter },
      orderBy: { createdAt: "desc" },
    });
    return new Response(JSON.stringify(filteredOdds), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();
  try {
    await prisma.odds.delete({ where: { id } });
    return new Response(JSON.stringify({ message: "Odd deleted successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req) {
  const { id, updatedData } = await req.json();
  try {
    const updatedOdd = await prisma.odds.update({
      where: { id },
      data: updatedData,
    });
    return new Response(JSON.stringify(updatedOdd), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PATCH(req) {
  const { newOdd } = await req.json();
  try {
    const createdOdd = await prisma.odds.create({
      data: newOdd,
    });
    return new Response(JSON.stringify(createdOdd), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
