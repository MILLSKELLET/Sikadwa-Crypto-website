import prisma from "@/lib/prisma";

export async function PUT(req) {
  const { name, email, phone } = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { email }, // Assuming email is unique
      data: { name, phone },
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update profile" }), {
      status: 500,
    });
  }
}
