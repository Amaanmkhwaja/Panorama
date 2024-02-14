import { AgencyDetails } from "@/components/forms/agency-details";
import { verifyAndAcceptInvitation } from "@/data/agency";
import { getAuthUserDetails } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { Plan } from "@prisma/client";
import { redirect } from "next/navigation";

interface AgencyPageProps {
  searchParams: {
    plan: Plan;
    state: string;
    code: string;
  };
}

const AgencyPage = async ({ searchParams }: AgencyPageProps) => {
  const agencyId = await verifyAndAcceptInvitation();
  const user = await getAuthUserDetails();

  // before we send them to the agency, we need to check if they are a subaccount user
  // NOTE: subaccount guests role is created in prisma but not going to be used.
  // Would need to implement the logic for it later for handling guests (the clients)

  if (agencyId) {
    if (user?.role === "SUBACCOUNT_GUEST" || user?.role === "SUBACCOUNT_USER") {
      return redirect("/subaccount");
    } else if (user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN") {
      if (searchParams.plan) {
        return redirect(
          `/agency/${agencyId}/billing?plan=${searchParams.plan}`
        );
      }
      if (searchParams.state) {
        const statePath = searchParams.state.split("__")[0];
        const stateAgencyId = searchParams.state.split("___")[1];
        if (!stateAgencyId) return <div>Not authorized</div>;
        return redirect(
          `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`
        );
      } else {
        return redirect(`/agency/${agencyId}`);
      }
    } else {
      <div>Not authorized</div>;
    }
  }

  const authUser = await currentUser();
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
        <h1 className="text-4xl"> Create An Agency</h1>
        <AgencyDetails data={{ companyEmail: authUser?.email! }} />
      </div>
    </div>
  );
};

export default AgencyPage;
