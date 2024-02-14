import { verifyAndAcceptInvitation } from "@/data/agency";

import { Unauthorized } from "@/components/unauthorized";
import { getAuthUserDetails } from "@/data/user";
import { redirect } from "next/navigation";

interface SubAccountPageProps {
  searchParams: { state: string; code: string };
}

const SubAccountPage = async ({ searchParams }: SubAccountPageProps) => {
  const agencyId = await verifyAndAcceptInvitation();
  if (!agencyId) {
    return <Unauthorized />;
  }

  const user = await getAuthUserDetails();
  if (!user) return null;

  const getFirstSubaccountWithAccess = user.Permissions.find(
    (permission) => permission.access === true
  );

  if (searchParams.state) {
    const statePath = searchParams.state.split("___")[0];
    const stateSubaccountId = searchParams.state.split("___")[1];
    if (!stateSubaccountId) return <Unauthorized />;
    return redirect(
      `/subaccount/${stateSubaccountId}/${statePath}?code=${searchParams.code}`
    );
  }

  if (getFirstSubaccountWithAccess) {
    return redirect(`/subaccount/${getFirstSubaccountWithAccess.subAccountId}`);
  }

  return <Unauthorized />;
};

export default SubAccountPage;
