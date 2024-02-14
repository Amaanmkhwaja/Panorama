"use client";

import { PlusCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useModal } from "@/providers/modal-provider";
import {
  Agency,
  AgencySidebarOption,
  SubAccount,
  UserDetails,
} from "@prisma/client";

// import SubAccountDetails from '@/components/forms/subaccount-details'
import { CustomModal } from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import { SubAccountDetails } from "@/components/forms/subaccount-details";

type CreateSubaccountButtonProps = {
  user: UserDetails & {
    Agency:
      | (
          | Agency
          | (null & {
              SubAccount: SubAccount[];
              SideBarOption: AgencySidebarOption[];
            })
        )
      | null;
  };
  id: string;
  className: string;
};

export const CreateSubaccountButton = ({
  className,
  id,
  user,
}: CreateSubaccountButtonProps) => {
  const { setOpen } = useModal();
  const agencyDetails = user.Agency;

  if (!agencyDetails) return;

  return (
    <Button
      className={cn("w-full flex gap-4", className)}
      onClick={() => {
        setOpen(
          <CustomModal
            title="Create a Subaccount"
            subheading="You can switch bettween"
          >
            <SubAccountDetails
              agencyDetails={agencyDetails}
              userId={user.id}
              userName={user.name}
            />
          </CustomModal>
        );
      }}
    >
      <PlusCircleIcon size={15} />
      Create Sub Account
    </Button>
  );
};
