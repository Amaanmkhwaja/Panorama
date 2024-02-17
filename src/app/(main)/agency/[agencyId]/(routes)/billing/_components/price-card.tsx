"use client";

import { useSearchParams } from "next/navigation";

import { PricesList } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";

import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/global/custom-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubscriptionFormWrapper } from "@/components/forms/subscription-form/subscription-form-wrapper";

interface PriceCardProps {
  features: string[];
  buttonCta: string;
  title: string;
  description: string;
  amount: string;
  duration: string;
  highlightTitle: string;
  highlightDescription: string;
  customerId: string;
  prices: PricesList["data"];
  planExists: boolean;
}

export const PriceCard = ({
  features,
  buttonCta,
  title,
  description,
  amount,
  duration,
  highlightTitle,
  highlightDescription,
  customerId,
  prices,
  planExists,
}: PriceCardProps) => {
  const { setOpen } = useModal();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  const handleManagePlanClick = async () => {
    setOpen(
      <CustomModal
        title="Manage Your Plan"
        subheading="You can change your plan at any time from the billings settings."
      >
        <SubscriptionFormWrapper
          customerId={customerId}
          planExists={planExists}
        />
      </CustomModal>,
      async () => ({
        plans: {
          defaultPriceId: plan ? plan : "",
          plans: prices,
        },
      })
    );
  };

  return (
    <Card className="flex flex-col justify-between lg:w-1/2">
      <div>
        <CardHeader className="flex flex-col md:!flex-row justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <p className="text-6xl font-bold">
            {amount}
            <small className="text-xs font-light text-muted-foreground">
              {duration}
            </small>
          </p>
        </CardHeader>
        <CardContent>
          <ul>
            {features.map((feature) => (
              <li
                key={feature}
                className="list-disc ml-4 text-muted-foreground"
              >
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </div>
      <CardFooter>
        <Card className="w-full">
          <div className="flex flex-col md:!flex-row items-center justify-between rounded-lg border gap-4 p-4">
            <div>
              <p>{highlightTitle}</p>
              <p className="text-sm text-muted-foreground">
                {highlightDescription}
              </p>
            </div>

            <Button className="md:w-fit w-full" onClick={handleManagePlanClick}>
              {buttonCta}
            </Button>
          </div>
        </Card>
      </CardFooter>
    </Card>
  );
};
