"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { v4 as uuid } from "uuid";

export const upsertPipeline = async (
  pipeline: Prisma.PipelineUncheckedCreateWithoutLaneInput
) => {
  if (!pipeline) {
    return { error: "Invalid fields." };
  }

  try {
    const pipelineSaved = await db.pipeline.upsert({
      where: { id: pipeline.id || uuid() },
      update: pipeline,
      create: pipeline,
    });

    return { success: "Saved pipeline details", pipeline: pipelineSaved };
  } catch (error) {
    return { error: "Something went wrong." };
  }
};

export const deletePipeline = async (pipelineId: string) => {
  if (!pipelineId) {
    return { error: "Missing Pipeline ID" };
  }

  try {
    const deletedPipeline = await db.pipeline.delete({
      where: { id: pipelineId },
    });
    return { success: "Deleted pipeline!", deletedPipeline };
  } catch (error) {
    return { error: "Something went wrong." };
  }
};
