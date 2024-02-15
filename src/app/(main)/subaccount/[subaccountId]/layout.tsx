import React from "react";
import { redirect } from "next/navigation";

import { currentUser } from "@/lib/auth";
import { getAuthUserDetails } from "@/data/user";
import { verifyAndAcceptInvitation } from "@/data/agency";
import { getNotificationAndUser } from "@/data/notification";

import { InfoBar } from "@/components/info-bar";
import { BlurPage } from "@/components/blur-page";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Unauthorized } from "@/components/unauthorized";

interface SubaccountIdLayoutProps {
  children: React.ReactNode;
  params: { subaccountId: string };
}

const SubaccountLayout = async ({
  children,
  params,
}: SubaccountIdLayoutProps) => {
  const agencyId = await verifyAndAcceptInvitation();
  if (!agencyId) return <Unauthorized />;

  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }

  let notifications: any = [];

  if (!user.role) {
    return <Unauthorized />;
  } else {
    const allPermissions = await getAuthUserDetails();
    const hasPermission = allPermissions?.Permissions.find(
      (permissions) =>
        permissions.access && permissions.subAccountId === params.subaccountId
    );
    if (!hasPermission) {
      return <Unauthorized />;
    }

    const allNotifications = await getNotificationAndUser(agencyId);

    if (user.role === "AGENCY_ADMIN" || user.role === "AGENCY_OWNER") {
      notifications = allNotifications;
    } else {
      const filteredNoti = allNotifications?.filter(
        (item) => item.subAccountId === params.subaccountId
      );
      if (filteredNoti) notifications = filteredNoti;
    }
  }

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={params.subaccountId} type="subaccount" />

      <div className="md:pl-[300px]">
        <InfoBar
          notifications={notifications}
          role={user.role}
          subAccountId={params.subaccountId as string}
        />
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  );
};

export default SubaccountLayout;
