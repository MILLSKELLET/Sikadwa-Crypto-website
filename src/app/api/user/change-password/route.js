import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";
import bcrypt from "bcrypt";


const prisma = new PrismaClient();

export async function PUT(req) {
  const { oldPassword, newPassword, email } = await req.json();

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // ✅ Verify Old Password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: "Incorrect old password" }), {
        status: 401,
      });
    }

    // 🔒 Hash New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return new Response(JSON.stringify({ message: "Password updated" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Password update failed" }), {
      status: 500,
    });
  }
}
