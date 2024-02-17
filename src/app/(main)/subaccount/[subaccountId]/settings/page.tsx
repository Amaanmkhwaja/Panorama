import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { BlurPage } from "@/components/blur-page";
import { UserDetails } from "@/components/forms/user-details";
import { SubAccountDetails } from "@/components/forms/subaccount-details";

interface SubaccountSettingsPageProps {
  params: { subaccountId: string };
}

const SubaccountSettingsPage = async ({
  params,
}: SubaccountSettingsPageProps) => {
  const authUser = await currentUser();
  if (!authUser) return;
  const userDetails = await db.userDetails.findUnique({
    where: {
      email: authUser.email!,
    },
  });
  if (!userDetails) return;

  const subAccount = await db.subAccount.findUnique({
    where: { id: params.subaccountId },
  });
  if (!subAccount) return;

  const agencyDetails = await db.agency.findUnique({
    where: { id: subAccount.agencyId },
    include: { SubAccount: true },
  });

  if (!agencyDetails) return;
  const subAccounts = agencyDetails.SubAccount;

  return (
    <BlurPage>
      <div className="flex flex-col lg:!flex-row gap-4">
        <SubAccountDetails
          agencyDetails={agencyDetails}
          details={subAccount}
          userId={userDetails.id}
          userName={userDetails.name}
        />
        <UserDetails
          type="subaccount"
          id={params.subaccountId}
          subAccounts={subAccounts}
          userData={userDetails}
        />
      </div>
    </BlurPage>
  );
};

export default SubaccountSettingsPage;
