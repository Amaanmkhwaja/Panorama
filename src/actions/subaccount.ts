"use server";

import { db } from "@/lib/db";
import { SubAccount } from "@prisma/client";
import { v4 } from "uuid";

export const upsertSubAccount = async (subAccount: SubAccount) => {
  try {
    if (!subAccount.companyEmail) return { error: "Missing company email." };

    const agencyOwner = await db.userDetails.findFirst({
      where: {
        Agency: {
          id: subAccount.agencyId,
        },
        role: "AGENCY_OWNER",
      },
    });

    if (!agencyOwner) {
      return { error: "🔴 Could not create subaccount." };
    }

    const permissionId = v4();
    const savedSubAccount = await db.subAccount.upsert({
      where: {
        id: subAccount.id,
      },
      update: subAccount,
      create: {
        ...subAccount,
        Permissions: {
          create: {
            access: true,
            email: agencyOwner.email!,
            id: permissionId,
          },
          connect: {
            subAccountId: subAccount.id,
            id: permissionId,
          },
        },
        Pipeline: {
          // just creating default pipelines for them
          create: {
            name: "Lead Cycle",
          },
        },
        SidebarOption: {
          create: [
            {
              name: "Launchpad",
              icon: "clipboardIcon",
              link: `/subaccount/${subAccount.id}/launchpad`,
            },
            {
              name: "Settings",
              icon: "settings",
              link: `/subaccount/${subAccount.id}/settings`,
            },
            {
              name: "Funnels",
              icon: "pipelines",
              link: `/subaccount/${subAccount.id}/funnels`,
            },
            {
              name: "Media",
              icon: "database",
              link: `/subaccount/${subAccount.id}/media`,
            },
            {
              name: "Automations",
              icon: "chip",
              link: `/subaccount/${subAccount.id}/automations`,
            },
            {
              name: "Pipelines",
              icon: "flag",
              link: `/subaccount/${subAccount.id}/pipelines`,
            },
            {
              name: "Contacts",
              icon: "person",
              link: `/subaccount/${subAccount.id}/contacts`,
            },
            {
              name: "Dashboard",
              icon: "category",
              link: `/subaccount/${subAccount.id}`,
            },
          ],
        },
      },
    });

    return { success: "Subaccount saved!", savedSubAccount };
  } catch (error) {
    return { error: "Something went wrong." };
  }
};
