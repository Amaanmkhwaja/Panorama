"use server";

import * as z from "zod";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserDetailsSchema } from "@/schemas";

export const getUserDetailsById = async (id: string) => {
  if (!id) {
    return { error: "UserDetails ID is required." };
  }

  try {
    const userDetails = await db.userDetails.findUnique({
      where: { id },
    });
    if (!userDetails) {
      return { error: "Couldn't find user's details." };
    }

    return { success: "Found user.", userDetails };
  } catch (error) {
    return { error: "Something went wrong." };
  }
};

export const getAuthUserDetails = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return null;
    }

    const userData = await db.userDetails.findUnique({
      where: { email: user.email! },
      include: {
        Agency: {
          include: {
            SidebarOption: true,
            SubAccount: {
              include: { SidebarOption: true },
            },
          },
        },
        Permissions: true,
      },
    });

    return userData;
  } catch (error) {
    return null;
  }
};

export const getUserPermissions = async (userId: string) => {
  try {
    const userPermissions = await db.userDetails.findUnique({
      where: { id: userId },
      select: { Permissions: { include: { SubAccount: true } } },
    });

    return userPermissions;
  } catch (error) {
    return null;
  }
};

// export const updateUser = async (user: Partial<UserDetails>) => {
export const updateUser = async (values: z.infer<typeof UserDetailsSchema>) => {
  const validatedFields = UserDetailsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, email, avatarUrl, role } = validatedFields.data;

  try {
    const updatedUserDetails = await db.userDetails.update({
      where: { email },
      data: {
        name,
        email,
        image: avatarUrl,
        role: role || "SUBACCOUNT_USER",
      },
    });

    await db.user.update({
      where: { id: updatedUserDetails.userId },
      data: {
        name,
        email,
        image: avatarUrl,
        role: role || "SUBACCOUNT_USER",
      },
    });

    return { success: "Updated user information." };
  } catch (error) {
    console.error("updateUser server action error: ", error);
    return { error: "Something went wrong." };
  }
};

export const changeUserPermissions = async (
  permissionId: string | undefined,
  userEmail: string,
  subAccountId: string,
  permission: boolean
) => {
  try {
    await db.permissions.upsert({
      where: { id: permissionId },
      update: { access: permission },
      create: {
        access: permission,
        email: userEmail,
        subAccountId: subAccountId,
      },
    });
    return { success: "Updated permissions." };
  } catch (error) {
    console.error("🔴Could not change persmission", error);
    return { error: "🔴Could not change persmission" };
  }
};

export const deleteUserbyId = async (userId: string) => {
  if (!userId) {
    return { error: "Subaccount ID is required." };
  }

  try {
    // Delete the user details
    await db.userDetails.delete({
      where: { id: userId },
    });

    // Delete the user
    await db.user.delete({
      where: { id: userId },
    });

    return { success: "User deleted successfully." };
  } catch (error) {
    console.error("deleteUser server action error: ", error);
    return { error: "Something went wrong while deleting the user." };
  }
};
