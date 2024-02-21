// "use client";

import Link from "next/link";
import { redirect } from "next/navigation";

import { ArrowLeft } from "lucide-react";
// import { useQuery } from "convex/react";
import { getFunnelById } from "@/data/funnel";

import { BlurPage } from "@/components/blur-page";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { FunnelSteps } from "./_components/funnel-steps";
import { FunnelSettings } from "./_components/funnel-settings";
import { getFunnelByIdWithPages } from "@/actions/funnel";
// import { api } from "@/convex/_generated/api";

interface FunnelIdPageProps {
  params: { funnelId: string; subaccountId: string };
}

const FunnelIdPage = async ({ params }: FunnelIdPageProps) => {
  // const funnelPages = await getFunnelById(params.funnelId);
  // if (!funnelPages)
  //   return redirect(`/subaccount/${params.subaccountId}/funnels`);
  // const funnelPages = useQuery(api.funnelPage.getFunnelPages, {
  //   funnelId: params.funnelId,
  // });
  // console.log(funnelPages);
  const { funnel, funnelPages } = await getFunnelByIdWithPages(params.funnelId);
  if (!funnel) {
    return redirect(`/subaccount/${params.subaccountId}/funnels`);
  }

  return (
    <BlurPage>
      <Link
        href={`/subaccount/${params.subaccountId}/funnels`}
        className={buttonVariants({
          variant: "secondary",
        })}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Link>
      {/* <h1 className="text-3xl mt-5 mb-8">{funnelPages.name}</h1> */}
      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="grid  grid-cols-2 w-[50%] bg-transparent ">
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="steps">
          <FunnelSteps
            funnel={funnel}
            subaccountId={params.subaccountId}
            pages={funnelPages}
            funnelId={params.funnelId}
          />
        </TabsContent>
        <TabsContent value="settings">
          <FunnelSettings
            subaccountId={params.subaccountId}
            defaultData={funnel}
          />
        </TabsContent>
      </Tabs>
    </BlurPage>
  );
};

export default FunnelIdPage;
