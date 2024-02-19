"use server";

import { db } from "@/lib/db";
import { Lane, Prisma, Ticket } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";

export const getPipelineDetails = async (pipelineId: string) => {
  try {
    const pipeline = await db.pipeline.findUnique({
      where: {
        id: pipelineId,
      },
    });

    return pipeline;
  } catch (error) {
    return null;
  }
};

export const upsertPipeline = async (
  pipeline: Prisma.PipelineUncheckedCreateWithoutLaneInput
) => {
  if (!pipeline) {
    return { error: "🔴 Invalid fields." };
  }

  try {
    const pipelineSaved = await db.pipeline.upsert({
      where: { id: pipeline.id || uuid() },
      update: pipeline,
      create: pipeline,
    });

    return { success: "Saved pipeline details", pipeline: pipelineSaved };
  } catch (error) {
    return { error: "🔴 Something went wrong." };
  }
};

export const deletePipeline = async (pipelineId: string) => {
  if (!pipelineId) {
    return { error: "🔴 Missing Pipeline ID" };
  }

  try {
    const deletedPipeline = await db.pipeline.delete({
      where: { id: pipelineId },
    });
    return { success: "Deleted pipeline!", deletedPipeline };
  } catch (error) {
    return { error: "🔴 Something went wrong." };
  }
};

export const upsertLane = async (lane: Prisma.LaneUncheckedCreateInput) => {
  if (!lane) {
    return { error: "Invalid fields." };
  }

  let order: number;

  try {
    if (!lane.order) {
      const lanes = await db.lane.findMany({
        where: {
          pipelineId: lane.pipelineId,
        },
      });

      order = lanes.length;
    } else {
      order = lane.order;
    }

    const savedLane = await db.lane.upsert({
      where: { id: lane.id || uuid() },
      update: lane,
      create: { ...lane, order },
    });

    return { success: "Saved lane info.", savedLane };
  } catch (error) {
    return { error: "🔴 Something went wrong." };
  }
};

export const updateLanesOrder = async (lanes: Lane[]) => {
  if (!lanes) {
    toast.error("🔴 Missing 'lanes' field.");
    return;
  }

  try {
    const updateTrans = lanes.map((lane) =>
      db.lane.update({
        where: {
          id: lane.id,
        },
        data: {
          order: lane.order,
        },
      })
    );

    await db.$transaction(updateTrans);
    console.log("🟢 Done reordered 🟢");
  } catch (error) {
    console.log(error, "🔴 ERROR UPDATE LANES ORDER");
    toast.error("🔴 ERROR UPDATE LANES ORDER");
  }
};

export const updateTicketsOrder = async (tickets: Ticket[]) => {
  if (!tickets) {
    toast.error("🔴 Missing 'tickets' field.");
    return;
  }

  try {
    const updateTrans = tickets.map((ticket) =>
      db.ticket.update({
        where: {
          id: ticket.id,
        },
        data: {
          order: ticket.order,
          laneId: ticket.laneId,
        },
      })
    );

    await db.$transaction(updateTrans);
    console.log("🟢 Done reordered 🟢");
  } catch (error) {
    console.log(error, "🔴 ERROR UPDATE TICKET ORDER");
    toast.error("🔴 ERROR UPDATE TICKET ORDER");
  }
};

export const deleteLane = async (laneId: string) => {
  const resposne = await db.lane.delete({ where: { id: laneId } });
  return resposne;
};

export const getPipelines = async (subaccountId: string) => {
  const response = await db.pipeline.findMany({
    where: { subAccountId: subaccountId },
    include: {
      Lane: {
        include: { Tickets: true },
      },
    },
  });
  return response;
};
