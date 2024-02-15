"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { v4 as uuid } from "uuid";

export const searchContacts = async (searchTerms: string) => {
  const response = await db.contact.findMany({
    where: {
      name: {
        contains: searchTerms,
      },
    },
  });
  return response;
};

export const upsertContact = async (
  contact: Prisma.ContactUncheckedCreateInput
) => {
  const response = await db.contact.upsert({
    where: { id: contact.id || uuid() },
    update: contact,
    create: contact,
  });
  return response;
};
