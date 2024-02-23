"use client";

import Link from "next/link";

import { ExternalLink, LucideEdit } from "lucide-react";

import { Doc } from "@/convex/_generated/dataModel";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FunnelPageForm } from "@/components/forms/funnel-page";
import { FunnelPagePlaceholder } from "@/components/icons/funnel-page-placeholder";

interface FunnelPageSettingsProps {
  pages: Doc<"funnelPage">[];
  subaccountId: string;
  funnelId: string;
  subDomainName: string | null;
  clickedPage: Doc<"funnelPage"> | undefined;
}

export const FunnelPageSettings = ({
  pages,
  subaccountId,
  funnelId,
  subDomainName,
  clickedPage,
}: FunnelPageSettingsProps) => {
  return (
    <aside className="flex-[0.7] bg-muted p-4 ">
      {!!pages.length ? (
        <Card className="h-full flex justify-between flex-col">
          <CardHeader>
            <p className="text-sm text-muted-foreground">Page name</p>
            <CardTitle>{clickedPage?.name}</CardTitle>
            <CardDescription className="flex flex-col gap-4">
              <div className="border-2 rounded-lg sm:w-80 w-full overflow-clip">
                <Link
                  href={`/subaccount/${subaccountId}/funnels/${funnelId}/editor/${clickedPage?._id}`}
                  className="relative group"
                >
                  <div className="cursor-pointer group-hover:opacity-30 w-full">
                    <FunnelPagePlaceholder />
                  </div>
                  <LucideEdit
                    size={50}
                    className="!text-muted-foreground absolute top-1/2 left-1/2 opacity-0 transofrm -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 transition-all duration-100"
                  />
                </Link>

                <Link
                  target="_blank"
                  href={`${process.env.NEXT_PUBLIC_SCHEME}${subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${clickedPage?.pathName}`}
                  className="group flex items-center justify-start p-2 gap-2 hover:text-primary transition-colors duration-200"
                >
                  <ExternalLink size={15} />
                  <div className="w-64 overflow-hidden overflow-ellipsis ">
                    {process.env.NEXT_PUBLIC_SCHEME}
                    {subDomainName}.{process.env.NEXT_PUBLIC_DOMAIN}/
                    {clickedPage?.pathName}
                  </div>
                </Link>
              </div>

              <FunnelPageForm
                subaccountId={subaccountId}
                defaultData={clickedPage}
                funnelId={funnelId}
                order={clickedPage?.order || 0}
              />
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="h-[600px] flex items-center justify-center text-muted-foreground">
          Create a page to view page settings.
        </div>
      )}
    </aside>
  );
};
