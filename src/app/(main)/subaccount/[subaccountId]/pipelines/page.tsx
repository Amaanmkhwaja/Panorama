import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface SubaccountPipelinesPageProps {
  params: { subaccountId: string };
}

const SubaccountPipelinesPage = async ({
  params,
}: SubaccountPipelinesPageProps) => {
  const pipelineExists = await db.pipeline.findFirst({
    where: { subAccountId: params.subaccountId },
  });

  if (pipelineExists) {
    return redirect(
      `/subaccount/${params.subaccountId}/pipelines/${pipelineExists.id}`
    );
  }

  try {
    const response = await db.pipeline.create({
      data: { name: "First Pipeline", subAccountId: params.subaccountId },
    });

    return redirect(
      `/subaccount/${params.subaccountId}/pipelines/${response.id}`
    );
  } catch (error) {
    console.error(error);

    return <div>Error loading page</div>;
  }
};

export default SubaccountPipelinesPage;
