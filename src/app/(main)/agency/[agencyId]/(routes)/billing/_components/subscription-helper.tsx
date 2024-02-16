"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { PricesList } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";

import { CustomModal } from "@/components/global/custom-modal";
import { SubscriptionFormWrapper } from "@/components/forms/subscription-form/subscription-form-wrapper";

interface SubscriptionHelperProps {
  prices: PricesList["data"];
  customerId: string;
  planExists: boolean;
}

export const SubscriptionHelper = ({
  customerId,
  planExists,
  prices,
}: SubscriptionHelperProps) => {
  const { setOpen } = useModal();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  useEffect(() => {
    if (plan)
      setOpen(
        <CustomModal
          title="Upgrade Plan!"
          subheading="Get started today to get access to premium features"
        >
          <SubscriptionFormWrapper
            planExists={planExists}
            customerId={customerId}
          />
        </CustomModal>,
        async () => ({
          plans: {
            defaultPriceId: plan ? plan : "",
            plans: prices,
          },
        })
      );
  }, [plan]);

  return <div>SubscriptionHelper</div>;
};
