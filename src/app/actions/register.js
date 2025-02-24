"use server";

import bcrypt from "bcrypt";
import prisma from "../../lib/prisma";

// const prisma = new PrismaClient();

export async function registerUser(
  name,
  email,
  password,
  phone,
  role = "user"
) {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return { error: "Email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, phone, email, password: hashedPassword, role },
    });

    return { success: "User registered successfully!", user: newUser };
  } catch (error) {
    return { error: error + "Something went wrong." };
  }
}
