import { db } from "./db";
import {
  Contact,
  Lane,
  Notification,
  Prisma,
  Tag,
  Ticket,
  UserDetails,
  UserRole,
} from "@prisma/client";
import { getAuthUserDetails } from "@/data/user";
import { getUserPermissions } from "@/actions/user";
import { getMediaBySubaccountId } from "@/data/subaccount";
import { getPipelineDetails } from "@/data/pipeline";
import { getTicketsWithTags } from "@/actions/ticket";

export type NotificationWithUser =
  | ({
      User: {
        id: string;
        name: string;
        avatarUrl: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        role: UserRole;
        agencyId: string | null;
      };
    } & Notification)[]
  | undefined;

export type UserWithPermissionsAndSubAccounts = Prisma.PromiseReturnType<
  typeof getUserPermissions
>;

export type AuthUserWithAgencySibebarOptionsSubAccounts =
  Prisma.PromiseReturnType<typeof getAuthUserDetails>;

const __getUsersWithAgencySubAccountPermissionsSidebarOptions = async (
  agencyId: string
) => {
  return await db.userDetails.findFirst({
    where: { Agency: { id: agencyId } },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  });
};

export type UsersWithAgencySubAccountPermissionsSidebarOptions =
  Prisma.PromiseReturnType<
    typeof __getUsersWithAgencySubAccountPermissionsSidebarOptions
  >;

export type GetMediaFiles = Prisma.PromiseReturnType<
  typeof getMediaBySubaccountId
>;

export type CreateMediaType = Prisma.MediaCreateWithoutSubaccountInput;

export type TicketAndTags = Ticket & {
  Tags: Tag[];
  Assigned: UserDetails | null;
  Customer: Contact | null;
};

export type LaneDetail = Lane & {
  Tickets: TicketAndTags[];
};

export type PipelineDetailsWithLanesCardsTagsTickets = Prisma.PromiseReturnType<
  typeof getPipelineDetails
>;

export type TicketWithTags = Prisma.PromiseReturnType<
  typeof getTicketsWithTags
>;
