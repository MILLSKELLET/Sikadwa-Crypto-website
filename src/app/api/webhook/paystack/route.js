// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const paystackSignature = req.headers.get("x-paystack-signature");

//     if (!paystackSignature) {
//       return NextResponse.json(
//         { message: "Unauthorized: No signature" },
//         { status: 401 }
//       );
//     }

//     const event = await req.json();

//     if (event.event === "charge.success") {
//       const { reference, id: transactionId, status } = event.data;

//       // Find the order using paymentReference
//       const order = await prisma.order.findUnique({
//         where: { paymentReference: reference },
//       });

//       if (!order) {
//         // If no order exists, create one (edge case)
//         const newOrder = await prisma.order.create({
//           data: {
//             userId: event.data.customer.id,
//             oddsId: "unknown",
//             status: status === "success" ? "success" : "failed",
//             paymentReference: reference,
//             transactionId,
//             transactionId: String(transactionId), // ✅ Convert transactionId to String
//           },
//         });

//         return NextResponse.json(
//           { message: "New order created via webhook", newOrder },
//           { status: 200 }
//         );
//       }

//       // Update order with transactionId and status
//       await prisma.order.update({
//         where: { id: order.id },
//         data: {
//           status: status === "success" ? "success" : "failed",
//           transactionId,
//         },
//       });

//       return NextResponse.json(
//         { message: "Order updated successfully" },
//         { status: 200 }
//       );
//     }

//     return NextResponse.json({ message: "Event received" }, { status: 200 });
//   } catch (error) {
//     console.error({ error: "Webhook Error:" });
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
