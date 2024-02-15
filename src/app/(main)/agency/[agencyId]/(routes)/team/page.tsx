import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import DataTable from "./_components/data-table";
import { Plus } from "lucide-react";
import { columns } from "./_components/columns";
import SendInvitation from "@/components/forms/send-invitation";

interface TeamPageProps {
  params: {
    agencyId: string;
  };
}

const TeamPage = async ({ params }: TeamPageProps) => {
  const authUser = await currentUser();
  const teamMembers = await db.userDetails.findMany({
    where: {
      Agency: {
        id: params.agencyId,
      },
    },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  });

  if (!authUser) return null;
  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    include: {
      SubAccount: true,
    },
  });

  if (!agencyDetails) return;

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Add
        </>
      }
      modalChildren={<SendInvitation agencyId={agencyDetails.id} />}
      filterValue="name"
      columns={columns}
      data={teamMembers}
    />
  );
};

export default TeamPage;
