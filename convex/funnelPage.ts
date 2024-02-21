import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

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

export const updateSettings = mutation({
  args: {
    id: v.id("funnelPage"),
    name: v.string(),
    pathName: v.string(),
  },
  handler: async (ctx, args) => {
    const existingFunnelPage = await ctx.db.get(args.id);
    if (!existingFunnelPage) {
      throw new Error("Funnel Page does not exist!");
    }

    const date = new Date();
    const dateString = date.toLocaleString();

    await ctx.db.patch(existingFunnelPage._id, {
      name: args.name,
      pathName: args.pathName,
      updatedAt: dateString,
    });
  },
});

export const updateOrder = mutation({
  args: {
    id: v.id("funnelPage"),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const existingFunnelPage = await ctx.db.get(args.id);
    if (!existingFunnelPage) {
      throw new Error("Funnel page does not exist!");
    }

    const date = new Date();
    const dateString = date.toLocaleString();

    await ctx.db.patch(existingFunnelPage._id, {
      order: args.order,
      updatedAt: dateString,
    });
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
      _creationTime: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    console.log("Convex received update request");
    console.log(args);
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

export const getFunnelPages = query({
  args: {
    funnelId: v.string(),
  },
  handler: async (ctx, args) => {
    const funnelPage = await ctx.db
      .query("funnelPage")
      .withIndex("by_sorted_order")
      .order("asc")
      .filter((q) => q.eq(q.field("funnelId"), args.funnelId))
      .collect();
    return funnelPage;
  },
});
