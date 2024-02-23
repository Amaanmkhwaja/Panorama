"use server";

import * as z from "zod";

import { signIn } from "@/auth";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateTwoFactorToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  // check if passwords match or not before going forward
  const passwordsMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordsMatch) {
    return { error: "Invalid credentials." };
  }

  // user is not verified
  if (!existingUser.emailVerified) {
    // user provided a code to verify email
    if (code) {
      // get token from db
      const existingToken = await getTwoFactorTokenByEmail(existingUser.email);
      // token does not exist so send new token
      if (!existingToken) {
        const verificationToken = await generateTwoFactorToken(
          existingUser.email
        );
        await sendVerificationEmail(
          verificationToken.email,
          verificationToken.token
        );
        return {
          success: "Code does not exist. Verification code emailed to you.",
          code: verificationToken.token,
        };
      }
      // incorrect token
      if (existingToken.token !== code) {
        return { error: "Invalid code." };
      }

      // check if token is expired
      const hasExpired = new Date(existingToken.expires) < new Date();
      // token has expired so sending a new one
      if (hasExpired) {
        const verificationToken = await generateTwoFactorToken(
          existingUser.email
        );
        await sendVerificationEmail(
          verificationToken.email,
          verificationToken.token
        );
        return {
          success: "Code expired. Verification code emailed to you.",
          code: verificationToken.token,
        };
      }

      // verify email
      await db.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          emailVerified: new Date(),
          email: existingToken.email, // why need this update? we are also going to use this server action whenever the user wants to modify their email
          // we dont want to immediately update the email in the db, we want them to verify it first before making the change
        },
      });

      // delete token
      await db.twoFactorToken.delete({
        where: { id: existingToken.id },
      });

      // return { success: "Email verified. Logging in..." };
      console.log("Email verified. Logging in...");

      // user is not verified and did not provide a code so send new code
    } else {
      const verificationToken = await generateTwoFactorToken(
        existingUser.email
      );
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );

      return {
        success:
          "Please verify account first. Verification code emailed to you.",
        code: verificationToken.token,
      };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
      // redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default: {
          return { error: "Something went wrong!" };
        }
      }
    }

    throw error;
  }
};
