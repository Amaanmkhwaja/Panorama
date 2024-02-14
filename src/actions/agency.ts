"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Agency, UserDetails } from "@prisma/client";

export const updateAgencyDetails = async (
  agencyId: string,
  agencyDetails: Partial<Agency>
) => {
  try {
    const updatedAgency = await db.agency.update({
      where: { id: agencyId },
      data: {
        ...agencyDetails,
      },
    });

    return { success: "ok", updatedAgency };
  } catch (error) {
    return { error: "Error updating agency details." };
  }
};

export const deleteAgency = async (agencyId: string) => {
  try {
    await db.agency.delete({ where: { id: agencyId } });

    return { success: "Successfully deleted agency!" };
  } catch (error) {
    console.error("deleteAgency servera action error: ", error);
    return { error: "Something went wrong." };
  }
};

export const initUser = async (newUser: Partial<UserDetails>) => {
  const user = await currentUser();
  if (!user) return { error: "Not authenticated." };

  const userData = await db.userDetails.upsert({
    where: {
      email: user.email!,
    },
    update: newUser,
    create: {
      image: user.image,
      email: user.email,
      name: user.name,
      role: newUser.role || "SUBACCOUNT_USER",
      userId: user.id!,
    },
  });

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      role: newUser.role || "SUBACCOUNT_USER",
    },
  });

  return { success: "ok", userData };
};
