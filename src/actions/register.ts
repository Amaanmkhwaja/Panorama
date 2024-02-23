"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      image:
        "https://utfs.io/f/973e016a-44fe-4142-b9d1-de18c64a456f-77ybic.jpg",
    },
  });

  // const verificationToken = await generateVerificationToken(email);
  const verificationCode = await generateTwoFactorToken(email);
  await sendVerificationEmail(verificationCode.email, verificationCode.token);

  return {
    success: "Please enter verification code emailed to you",
    code: verificationCode.token,
  };
};
