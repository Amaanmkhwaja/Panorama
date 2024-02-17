import { db } from "@/lib/db";

export const getFunnels = async (subaccountId: string) => {
  const funnels = await db.funnel.findMany({
    where: { subAccountId: subaccountId },
    include: { FunnelPages: true },
  });

  return funnels;
};

export const getFunnelById = async (id: string) => {
  const funnel = await db.funnel.findUnique({
    where: { id },
    include: {
      FunnelPages: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  return funnel;
};
