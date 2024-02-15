"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Pipeline } from "@prisma/client";
import { deletePipeline } from "@/actions/pipeline";
import { saveActivityLogsNotification } from "@/actions/notification";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { CreatePipelineForm } from "@/components/forms/create-pipeline";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const PipelineSettings = ({
  pipelineId,
  subaccountId,
  pipelines,
}: {
  pipelineId: string;
  subaccountId: string;
  pipelines: Pipeline[];
}) => {
  const router = useRouter();
  return (
    <AlertDialog>
      <div>
        <div className="flex items-center justify-between mb-4">
          <AlertDialogTrigger asChild>
            <Button variant={"destructive"}>Delete Pipeline</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="items-center">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  try {
                    const response = await deletePipeline(pipelineId);
                    if (response.success) {
                      await saveActivityLogsNotification({
                        agencyId: undefined,
                        description: `Deleted a pipeline | ${response.deletedPipeline.name}`,
                        subaccountId: subaccountId,
                      });
                      toast({
                        variant: "success",
                        title: "Success",
                        description: response.success,
                      });
                      router.replace(`/subaccount/${subaccountId}/pipelines`);
                    }
                    if (response.error) {
                      toast({
                        variant: "destructive",
                        title: "Error!",
                        description: response.error,
                      });
                    }
                  } catch (error) {
                    toast({
                      variant: "destructive",
                      title: "Oppse!",
                      description: "Could Delete Pipeline",
                    });
                  }
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </div>

        <CreatePipelineForm
          subAccountId={subaccountId}
          defaultData={pipelines.find((p) => p.id === pipelineId)}
        />
      </div>
    </AlertDialog>
  );
};
