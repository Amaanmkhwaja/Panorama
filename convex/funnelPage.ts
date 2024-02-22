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

export const getFunnelPageById = query({
  args: {
    id: v.id("funnelPage"),
  },
  handler: async (ctx, args) => {
    const existingFunnelPage = await ctx.db.get(args.id);
    if (!existingFunnelPage) {
      throw new Error("Funnel Page does not exist");
    }

    return existingFunnelPage;
  },
});

export const updateFunnelPageName = mutation({
  args: {
    id: v.id("funnelPage"),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingFunnelPage = await ctx.db.get(args.id);
    if (!existingFunnelPage) {
      return { error: "Funnel Page does not exist" };
      // throw new Error("Funnel Page does not exist");
    }

    await ctx.db.patch(existingFunnelPage._id, {
      name: args.name,
    });

    return { success: "Saved changes" };
  },
});

export const updateFunnelPageContent = mutation({
  args: {
    id: v.id("funnelPage"),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingFunnelPage = await ctx.db.get(args.id);
    if (!existingFunnelPage) {
      return { error: "Funnel Page does not exist" };
      // throw new Error("Funnel Page does not exist");
    }

    await ctx.db.patch(existingFunnelPage._id, {
      content: args.content,
    });

    return { success: "Saved changes" };
  },
});

export const deleteFunnelPage = mutation({
  args: {
    id: v.id("funnelPage"),
  },
  handler: async (ctx, args) => {
    const existingFunnelPage = await ctx.db.get(args.id);
    if (!existingFunnelPage) {
      throw new Error("Funnel Page does not exist");
    }

    await ctx.db.delete(existingFunnelPage._id);
    // TODO: update remaining funnel pages order, decrement
  },
});
