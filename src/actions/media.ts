"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { UploadMediaSchema } from "@/schemas";

export const createMedia = async (
  values: z.infer<typeof UploadMediaSchema>,
  subAccountId: string
) => {
  const validatedFields = UploadMediaSchema.safeParse(values);

  if (!validatedFields.success || !subAccountId) {
    return { error: "Invalid fields!" };
  }

  const { link, name } = validatedFields.data;

  try {
    await db.media.create({
      data: {
        link,
        name,
        subAccountId,
      },
    });

    return { success: "Upload media file!" };
  } catch (error) {
    console.error("createMedia error: ", error);
    return { error: "Something went wrong!" };
  }
};

export const deleteMedia = async (mediaId: string) => {
  if (!mediaId) {
    return { error: "Media ID is required." };
  }

  try {
    const deletedMedia = await db.media.delete({
      where: { id: mediaId },
    });

    return { success: "Deleted media!", deletedMedia };
  } catch (error) {
    console.error("deletMedia error: ", error);
    return { error: "Something went wrong." };
  }
};
