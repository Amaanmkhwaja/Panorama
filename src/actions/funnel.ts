"use server";

import { revalidatePath } from "next/cache";

import * as z from "zod";
import { db } from "@/lib/db";
import { v4 as uuid } from "uuid";

import { FunnelSchema } from "@/schemas";
import { UpsertFunnelPage } from "@/lib/types";

export const upsertFunnel = async (
  subaccountId: string,
  funnel: z.infer<typeof FunnelSchema> & { liveProducts: string },
  funnelId: string
) => {
  const validatedFields = FunnelSchema.safeParse(funnel);

  if (!validatedFields.success || !subaccountId || !funnelId) {
    return { error: "Invalid fields!" };
  }

  const funnelData = validatedFields.data;

  try {
    const funnelSaved = await db.funnel.upsert({
      where: { id: funnelId },
      update: funnelData,
      create: {
        ...funnelData,
        id: funnelId || uuid(),
        subAccountId: subaccountId,
      },
    });

    return { success: "Saved funnel details", funnel: funnelSaved };
  } catch (error) {
    return { error: "Something went wrong." };
  }
};

export const getFunnels = async (subaccountId: string) => {
  const funnels = await db.funnel.findMany({
    where: { subAccountId: subaccountId },
    include: { FunnelPages: true },
  });

  return funnels;
};

export const updateFunnelProducts = async (
  products: string,
  funnelId: string
) => {
  if (!funnelId || !products) {
    return { error: "Invalid fields!" };
  }

  try {
    const updatedFunnel = await db.funnel.update({
      where: { id: funnelId },
      data: { liveProducts: products },
    });
    return { success: "Updated funnel products!", updatedFunnel };
  } catch (error) {
    console.error("updateFunneProducts error:", error);
    return { error: "Something went wrong." };
  }
};

export const upsertFunnelPage = async (
  subaccountId: string,
  funnelPage: UpsertFunnelPage,
  funnelId: string
) => {
  if (!subaccountId || !funnelId) return;
  const response = await db.funnelPage.upsert({
    where: { id: funnelPage.id || "" },
    update: { ...funnelPage },
    create: {
      ...funnelPage,
      content: funnelPage.content
        ? funnelPage.content
        : JSON.stringify([
            {
              content: [],
              id: "__body",
              name: "Body",
              styles: { backgroundColor: "white" },
              type: "__body",
            },
          ]),
      funnelId,
    },
  });

  revalidatePath(`/subaccount/${subaccountId}/funnels/${funnelId}`, "page");
  return response;
};

export const deleteFunnelePage = async (funnelPageId: string) => {
  const response = await db.funnelPage.delete({ where: { id: funnelPageId } });

  return response;
};

export const getFunnelPageDetails = async (funnelPageId: string) => {
  const response = await db.funnelPage.findUnique({
    where: {
      id: funnelPageId,
    },
  });

  return response;
};
