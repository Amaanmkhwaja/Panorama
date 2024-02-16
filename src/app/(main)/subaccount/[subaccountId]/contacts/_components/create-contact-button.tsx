"use client";

import { useModal } from "@/providers/modal-provider";

import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/global/custom-modal";
import { ContactUserForm } from "@/components/forms/contact-user-form";

export const CreateContactButton = ({
  subaccountId,
}: {
  subaccountId: string;
}) => {
  const { setOpen } = useModal();

  const handleCreateContact = async () => {
    setOpen(
      <CustomModal
        title="Create Or Update Contact information"
        subheading="Contacts are like customers."
      >
        <ContactUserForm subaccountId={subaccountId} />
      </CustomModal>
    );
  };

  return <Button onClick={handleCreateContact}>Create Contact</Button>;
};
