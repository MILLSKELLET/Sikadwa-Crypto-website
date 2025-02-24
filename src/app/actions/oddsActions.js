"use server";
import prisma from "@/lib/prisma";

export async function getOdds() {
  return await prisma.odds.findMany();
}

// export async function createOdd(data) {
//   return await prisma.odds.create({ data });
// }

export async function deleteOdd(id) {
  return await prisma.odds.delete({ where: { id } });
}

export async function updateOdd(id, updatedData) {
  try {
    const updatedOdd = await prisma.odds.update({
      where: { id },
      data: {
        title: updatedData.title,
        booking_code: updatedData.booking_code,
        recovering_code: updatedData.recovering_code,
        games_date: updatedData.games_date,
        price: updatedData.price,
        is_free: updatedData.is_free,
        correct_score: updatedData.correct_score,
        author: {
          connect: { id: updatedData.authorId }, // Ensure author is connected
        },
      },
    });

    return updatedOdd;
  } catch (error) {
    console.error("Error updating odd:", error);
    throw new Error("Failed to update odd");
  }
}

export async function createOdd(data) {
  try {
    // Check if booking_code already exists
    const existingOdd = await prisma.odds.findUnique({
      where: { booking_code: data.booking_code },
    });

    if (existingOdd) {
      throw new Error(
        "Booking code already exists. Please use a different one."
      );
    }

    // Create the new odd entry
    const newOdd = await prisma.odds.create({
      data,
    });

    return newOdd;
  } catch (error) {
    console.error("Error creating odd:", error.message);
    throw error;
  }
}
