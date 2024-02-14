"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { saveActivityLogsNotification } from "@/actions/notification";
import {
  deleteSubAccountById,
  getSubaccountDetailsById,
} from "@/actions/subaccount";
import { toast } from "sonner";

interface DeleteButtonProps {
  subaccountId: string;
}

export const DeleteButton = ({ subaccountId }: DeleteButtonProps) => {
  const router = useRouter();

  const handleClick = async () => {
    try {
      const response = await getSubaccountDetailsById(subaccountId);
      if (response.error) {
        toast.error(response.error);
      }
      if (response.success) {
        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Deleted a subaccount | ${response.subAccountDetails.name}`,
          subaccountId,
        });
        const deleted = await deleteSubAccountById(subaccountId);
        if (deleted.success) {
          toast.success(deleted.success);
          router.refresh();
        }
        if (deleted.error) {
          toast.error(deleted.error);
        }
      }
    } catch (error) {
      console.error("deleteButton error: ", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="text-white" onClick={handleClick}>
      Delete Sub Account
    </div>
  );
};
