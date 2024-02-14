import { Notification, UserRole } from "@prisma/client";

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
