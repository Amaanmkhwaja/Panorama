import { redirect } from "next/navigation";

import { currentRole } from "@/lib/auth";
import { verifyAndAcceptInvitation } from "@/data/agency";
import { getNotificationAndUser } from "@/data/notification";

import { Unauthorized } from "@/components/unauthorized";
import { Sidebar } from "@/components/sidebar/sidebar";

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

  let allNotifications: any[] = [];
  const notifications = await getNotificationAndUser(agencyId);
  if (notifications) {
    allNotifications = notifications;
  }

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={params.agencyId} type="agency" />
      <div className="md:pl-[300px]">{children}</div>
    </div>
  );
}
