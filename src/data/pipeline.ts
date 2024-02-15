import { db } from "@/lib/db";

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

export const getLanesWithTicketAndTags = async (pipelineId: string) => {
  try {
    const response = await db.lane.findMany({
      where: {
        pipelineId,
      },
      orderBy: { order: "asc" },
      include: {
        Tickets: {
          orderBy: {
            order: "asc",
          },
          include: {
            Tags: true,
            Assigned: true,
            Customer: true,
          },
        },
      },
    });
    return response;
  } catch (error) {
    return null;
  }
};
