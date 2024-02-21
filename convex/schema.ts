import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  funnelPage: defineTable({
    name: v.string(),
    pathName: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
    visits: v.number(),
    content: v.optional(v.string()),
    order: v.number(),
    previewImage: v.optional(v.string()),
    funnelId: v.string(),
  }).index("by_funnel_id", ["funnelId"]),
});
