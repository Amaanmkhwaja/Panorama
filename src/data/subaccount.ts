import { db } from "@/lib/db";

export const getMediaBySubaccountId = async (subAccountId: string) => {
  try {
    const mediaFiles = await db.subAccount.findUnique({
      where: { id: subAccountId },
      include: { Media: true },
    });
    return mediaFiles;
  } catch (error) {
    return null;
  }
};
