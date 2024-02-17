import { Plus } from "lucide-react";
import { getFunnels } from "@/actions/funnel";

import { FunnelForm } from "@/components/forms/funnel-form";

import { columns } from "./_components/columns";
import FunnelsDataTable from "./_components/data-table";

interface FunnelsPageProps {
  params: { subaccountId: string };
}

const FunnelsPage = async ({ params }: FunnelsPageProps) => {
  const funnels = await getFunnels(params.subaccountId);
  if (!funnels) return null;

  return (
    <>
      <FunnelsDataTable
        actionButtonText={
          <>
            <Plus size={15} />
            Create Funnel
          </>
        }
        modalChildren={
          <FunnelForm subAccountId={params.subaccountId}></FunnelForm>
        }
        filterValue="name"
        columns={columns}
        data={funnels}
      />
    </>
  );
};

export default FunnelsPage;
