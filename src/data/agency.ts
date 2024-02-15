import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserDetails, UserRole } from "@prisma/client";
import { saveActivityLogsNotification } from "./notification";
import { redirect } from "next/navigation";

export const getAgencyDetailsById = async (id: string) => {
  try {
    const agencyDetails = await db.agency.findUnique({
      where: { id },
    });
    return agencyDetails;
  } catch (error) {
    return null;
  }
};

export const getAgencyDetailsWithSubaccountById = async (id: string) => {
  try {
    const agencyDetails = await db.agency.findUnique({
      where: { id },
      include: {
        SubAccount: true,
      },
    });
    return agencyDetails;
  } catch (error) {
    return null;
  }
};

export const createTeamUser = async (agencyId: string, user: UserDetails) => {
  try {
    if (user.role === "AGENCY_OWNER") return null; // already has access

    const response = await db.userDetails.create({
      data: {
        ...user,
        image:
          user.image ||
          "https://utfs.io/f/973e016a-44fe-4142-b9d1-de18c64a456f-77ybic.jpg",
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
    if (!user) {
      console.log("verifyAndAcceptInvitation error: Not signed in");
      return null;
    }

    const invitationExists = await db.invitation.findUnique({
      where: { email: user.email!, status: "PENDING" },
    });

    if (invitationExists) {
      const userDetails = await createTeamUser(invitationExists.agencyId, {
        userId: user.id!,
        email: invitationExists.email,
        agencyId: invitationExists.agencyId,
        image: user.image || null,
        id: user.id!,
        name: user.name!,
        role: invitationExists.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await saveActivityLogsNotification({
        agencyId: invitationExists.agencyId,
        description: "Joined",
        subaccountId: undefined,
      });

      if (userDetails) {
        await db.user.update({
          where: { id: userDetails.userId },
          data: {
            role: userDetails.role || "SUBACCOUNT_USER",
          },
        });

        await db.invitation.delete({
          where: { email: userDetails.email! },
        });

        return userDetails.agencyId;
      } else {
        return null;
      }
    } else {
      const agency = await db.userDetails.findUnique({
        where: { email: user.email! },
      });

      return agency ? agency.agencyId : null;
    }
  } catch (error) {
    console.log("verifyAndAcceptInvitation error: ", error);
    return null;
  }
};
