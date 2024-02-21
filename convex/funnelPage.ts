import { v } from "convex/values";

import { mutation } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    pathName: v.string(),
    order: v.number(),
    funnelId: v.string(),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const date = new Date();
    const dateString = date.toLocaleString();

    const funnelPage = await ctx.db.insert("funnelPage", {
      name: args.name,
      pathName: args.pathName,
      createdAt: dateString,
      updatedAt: dateString,
      visits: 0,
      order: args.order,
      content: args.content
        ? args.content
        : JSON.stringify([
            {
              content: [],
              id: "__body",
              name: "Body",
              styles: { backgroundColor: "white" },
              type: "__body",
            },
          ]),
      funnelId: args.funnelId,
    });

    return funnelPage;
  },
});

export const update = mutation({
  args: {
    funnelPage: v.object({
      id: v.id("funnelPage"),
      name: v.string(),
      pathName: v.string(),
      createdAt: v.string(),
      updatedAt: v.string(),
      visits: v.number(),
      content: v.optional(v.string()),
      order: v.number(),
      previewImage: v.optional(v.string()),
      funnelId: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const date = new Date();
    const dateString = date.toLocaleString();

    const { funnelPage } = args;

    const existingFunnelPage = await ctx.db.get(funnelPage.id);
    if (!existingFunnelPage) {
      throw new Error("Funnel Page not found!");
    }

    const updatedFunnelPage = await ctx.db.patch(funnelPage.id, {
      ...funnelPage,
      updatedAt: dateString,
    });

    return updatedFunnelPage;
  },
});
