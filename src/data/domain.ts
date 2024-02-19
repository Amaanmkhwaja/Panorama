import { db } from "@/lib/db";

export const getDomainContent = async (subDomainName: string) => {
  const domainContent = await db.funnel.findUnique({
    where: {
      subDomainName,
    },
    include: {
      FunnelPages: true,
    },
  });
  return domainContent;
};
