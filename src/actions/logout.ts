"use server";

import { signOut } from "@/auth";

// why do this with actions?
// If you want to do some server stuff before you log out the user.
export const logout = async () => {
  await signOut({
    redirectTo: "/site",
  });
};
