import { redirect } from "next/navigation";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserDetails } from "@prisma/client";

export const createTeamUser = async (agencyId: string, user: UserDetails) => {
  try {
    if (user.role === "AGENCY_OWNER") return null; // already has access

    const response = await db.userDetails.create({
      data: {
        ...user,
      },
    });

    return response;
  } catch (error) {
    return null;
  }
};

export const verifyAndAcceptInvitation = async () => {
  try {
    const user = await currentUser();
    if (!user) return redirect("/");

    const invitationExists = await db.invitation.findUnique({
      where: { email: user.email!, status: "PENDING" },
    });

    if (invitationExists) {
      const userDetails = await createTeamUser(invitationExists.agencyId, {
        email: invitationExists.email,
        agencyId: invitationExists.agencyId,
        image: user.image || null,
        id: user.id!,
        name: user.name!,
        role: invitationExists.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    return null;
  }
};
