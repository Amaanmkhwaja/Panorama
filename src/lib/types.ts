import { Notification, Prisma, UserRole } from "@prisma/client";
import { getAuthUserDetails } from "@/data/user";
import { getUserPermissions } from "@/actions/user";

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
