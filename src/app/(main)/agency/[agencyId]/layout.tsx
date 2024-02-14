import { redirect } from "next/navigation";

import { currentRole } from "@/lib/auth";
import { verifyAndAcceptInvitation } from "@/data/agency";
import { getNotificationAndUser } from "@/data/notification";

import { Unauthorized } from "@/components/unauthorized";
import { Sidebar } from "@/components/sidebar/sidebar";
import { BlurPage } from "@/components/blur-page";
import { InfoBar } from "@/components/info-bar";

interface MainAgencyLayoutProps {
  children: React.ReactNode;
  params: {
    agencyId: string;
  };
}

export default async function MainAgencyLayout({
  children,
  params,
}: MainAgencyLayoutProps) {
  const agencyId = await verifyAndAcceptInvitation();
  const userRole = await currentRole();

  if (!agencyId) {
    redirect("/agency");
  }

  if (userRole !== "AGENCY_OWNER" && userRole !== "AGENCY_ADMIN") {
    return <Unauthorized />;
  }

  let allNotifications: any = [];
  const notifications = await getNotificationAndUser(agencyId);
  if (notifications) {
    allNotifications = notifications;
  }

  return (
    <div className="h-screen max-w-full overflow-hidden">
      <Sidebar id={params.agencyId} type="agency" />
      <div className="md:pl-[300px]">
        <InfoBar
          notifications={allNotifications}
          role={allNotifications.User?.role}
        />
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  );
}
