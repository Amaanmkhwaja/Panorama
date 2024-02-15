"use client";
import { useModal } from "@/providers/modal-provider";
import React from "react";
import { Button } from "../ui/button";
import { CustomModal } from "../global/custom-modal";
import UploadMediaForm from "../forms/upload-media";

interface MediaUploadButtonProps {
  subaccountId: string;
}

export const MediaUploadButton = ({ subaccountId }: MediaUploadButtonProps) => {
  const { setOpen } = useModal();

  return (
    <Button
      onClick={() => {
        setOpen(
          <CustomModal
            title="Upload Media"
            subheading="Upload a file to your media bucket"
          >
            <UploadMediaForm subaccountId={subaccountId}></UploadMediaForm>
          </CustomModal>
        );
      }}
    >
      Upload
    </Button>
  );
};
