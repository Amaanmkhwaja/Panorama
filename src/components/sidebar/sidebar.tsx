import { getAuthUserDetails } from "@/data/user";
import { MenuOptions } from "./menu-options";

interface SidebarProps {
  id: string;
  type: "agency" | "subaccount";
}

export const Sidebar = async ({ id, type }: SidebarProps) => {
  const userDetails = await getAuthUserDetails();
  if (!userDetails) return null;

  if (!userDetails.Agency) return;

  const details =
    type === "agency"
      ? userDetails?.Agency
      : userDetails?.Agency.SubAccount.find(
          (subaccount) => subaccount.id === id
        );

  const isWhiteLabeledAgency = userDetails.Agency.whiteLabel;
  if (!details) return;

  let sidebarLogo = userDetails.Agency.agencyLogo || "/assets/logo.svg";

  if (!isWhiteLabeledAgency) {
    if (type === "subaccount") {
      sidebarLogo =
        userDetails?.Agency.SubAccount.find(
          (subaccount) => subaccount.id === id
        )?.subAccountLogo || userDetails.Agency.agencyLogo;
    }
  }

  const sidebarOpt =
    type === "agency"
      ? userDetails.Agency.SidebarOption || []
      : userDetails.Agency.SubAccount.find((subaccount) => subaccount.id === id)
          ?.SidebarOption || [];

  const subaccounts = userDetails.Agency.SubAccount.filter((subaccount) =>
    userDetails.Permissions.find(
      (permission) =>
        permission.subAccountId === subaccount.id && permission.access
    )
  );

  return (
    <>
      <MenuOptions
        defaultOpen={true}
        details={details}
        id={id}
        sidebarLogo={sidebarLogo}
        sidebarOpt={sidebarOpt}
        subAccounts={subaccounts}
        user={userDetails}
      />

      {/* this is going to be the mobile sidebar */}
      <MenuOptions
        details={details}
        id={id}
        sidebarLogo={sidebarLogo}
        sidebarOpt={sidebarOpt}
        subAccounts={subaccounts}
        user={userDetails}
      />
    </>
  );
};
