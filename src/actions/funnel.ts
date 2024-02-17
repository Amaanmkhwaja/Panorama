"use server";

import * as z from "zod";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import { FunnelSchema } from "@/schemas";

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
