"use server";

import * as z from "zod";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { InviteUserSchema } from "@/schemas";
import { Agency, Plan, UserDetails, UserRole } from "@prisma/client";

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
      email: user.email!,
      name: user.name || "",
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

export const upsertAgency = async (agency: Agency, price?: Plan) => {
  if (!agency.companyEmail) return { error: "Missing company email!" };

  try {
    await db.agency.upsert({
      where: {
        id: agency.id,
      },
      update: agency,
      create: {
        users: {
          connect: { email: agency.companyEmail },
        },
        ...agency,
        SidebarOption: {
          create: [
            {
              name: "Dashboard",
              icon: "category",
              link: `/agency/${agency.id}`,
            },
            {
              name: "Launchpad",
              icon: "clipboardIcon",
              link: `/agency/${agency.id}/launchpad`,
            },
            {
              name: "Billing",
              icon: "payment",
              link: `/agency/${agency.id}/billing`,
            },
            {
              name: "Settings",
              icon: "settings",
              link: `/agency/${agency.id}/settings`,
            },
            {
              name: "Sub Accounts",
              icon: "person",
              link: `/agency/${agency.id}/all-subaccounts`,
            },
            {
              name: "Team",
              icon: "shield",
              link: `/agency/${agency.id}/team`,
            },
          ],
        },
      },
    });

    return { success: "Created agency!" };
  } catch (error) {
    console.error("upsertAgency server action error: ", error);
    return { error: "Something went wrong." };
  }
};

export const sendInvitation = async (
  values: z.infer<typeof InviteUserSchema>,
  agencyId: string
) => {
  const validatedFields = InviteUserSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  if (!agencyId) {
    return { error: "Agency ID is required." };
  }

  const { email, role } = validatedFields.data;

  try {
    const userDetailsExist = await db.userDetails.findUnique({
      where: {
        email,
      },
    });
    if (userDetailsExist) {
      return {
        error:
          "User already tied with an agency. Users are maxed to 1 agency per account.",
      };
    }

    const ifPendingInvite = await db.invitation.findUnique({
      where: { email },
    });
    if (ifPendingInvite) {
      return { error: "User already has a pending invite!" };
    }

    await db.invitation.create({
      data: {
        email,
        agencyId,
        role,
      },
    });
    return { success: "Invite sent!" };
  } catch (error) {
    console.error("sendInvitation error: ", error);
    return { error: "Something went wrong." };
  }
};
