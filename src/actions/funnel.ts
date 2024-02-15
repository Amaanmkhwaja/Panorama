"use server";

import * as z from "zod";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import { CreateFunnelSchema } from "@/schemas";

export const upsertFunnel = async (
  subaccountId: string,
  funnel: z.infer<typeof CreateFunnelSchema> & { liveProducts: string },
  funnelId: string
) => {
  const validatedFields = CreateFunnelSchema.safeParse(funnel);

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
