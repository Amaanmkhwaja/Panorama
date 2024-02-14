import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { email } });

    return user;
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({ where: { id } });

    return user;
  } catch (error) {
    return null;
  }
};

export const getAuthUserDetails = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return null;
    }

    const userData = await db.userDetails.findUnique({
      where: { email: user.email! },
      include: {
        Agency: {
          include: {
            SidebarOption: true,
            SubAccount: {
              include: { SidebarOption: true },
            },
          },
        },
        Permissions: true,
      },
    });

    return userData;
  } catch (error) {
    return null;
  }
};
