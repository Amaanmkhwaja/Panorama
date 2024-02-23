import { api } from "@/convex/_generated/api";
import { db } from "@/lib/db";
import { fetchQuery } from "convex/nextjs";

// export const getDomainContent = async (subDomainName: string) => {
//   const domainContent = await db.funnel.findUnique({
//     where: {
//       subDomainName,
//     },
//     include: {
//       FunnelPages: true,
//     },
//   });
//   return domainContent;
// };

export const getDomainContent = async (subDomainName: string) => {
  const funnel = await db.funnel.findUnique({
    where: {
      subDomainName,
    },
  });
  if (!funnel) {
    return null;
  }

  const funnelPages = await fetchQuery(api.funnelPage.getFunnelPages, {
    funnelId: funnel.id,
  });

  return { funnel, funnelPages };
};
