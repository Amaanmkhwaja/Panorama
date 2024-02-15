import { getAgencyDetailsWithSubaccountById } from "@/data/agency";
import { getUserDetailsById } from "@/data/user";
import { currentUser } from "@/lib/auth";

import { AgencyDetails } from "@/components/forms/agency-details";
import { UserDetails } from "@/components/forms/user-details";

interface SettingsPageProps {
  params: {
    agencyId: string;
  };
}

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const user = await currentUser();
  if (!user?.id) {
    return null;
  }

  const userDetails = await getUserDetailsById(user.id);
  if (!userDetails) return null;

  const agencyDetails = await getAgencyDetailsWithSubaccountById(
    params.agencyId
  );
  if (!agencyDetails) return null;

  const subAccounts = agencyDetails.SubAccount;

  return (
    <div className="flex flex-col lg:!flex-row gap-4">
      <AgencyDetails data={agencyDetails} />
      <UserDetails
        type="agency"
        id={params.agencyId}
        subAccounts={subAccounts}
        userData={userDetails}
      />
    </div>
  );
};

export default SettingsPage;
