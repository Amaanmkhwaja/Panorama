import { redirect } from "next/navigation";

import { getLanesWithTicketAndTags, getPipelineDetails } from "@/data/pipeline";
import { db } from "@/lib/db";
import { LaneDetail } from "@/lib/types";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PipelineInfoBar } from "../_components/pipeline-infobar";
import { PipelineSettings } from "../_components/pipeline-settings";

interface PipelineIdPageProps {
  params: { subaccountId: string; pipelineId: string };
}

const PipelineIdPage = async ({ params }: PipelineIdPageProps) => {
  const pipelineDetails = await getPipelineDetails(params.pipelineId);
  if (!pipelineDetails) {
    return redirect(`/subaccount/${params.subaccountId}/pipelines`);
  }

  const pipelines = await db.pipeline.findMany({
    where: { subAccountId: params.subaccountId },
  });

  const lanes = (await getLanesWithTicketAndTags(
    params.pipelineId
  )) as LaneDetail[];

  return (
    <Tabs defaultValue="view" className="w-full">
      <TabsList className="bg-transparent border-b-2 h-16 w-full justify-between mb-4">
        <PipelineInfoBar
          pipelineId={params.pipelineId}
          subAccountId={params.subaccountId}
          pipelines={pipelines}
        />
        <div>
          <TabsTrigger value="view">Pipeline View</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value="view"></TabsContent>
      <TabsContent value="settings">
        <PipelineSettings
          pipelineId={params.pipelineId}
          pipelines={pipelines}
          subaccountId={params.subaccountId}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PipelineIdPage;
