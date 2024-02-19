import { notFound } from "next/navigation";

import { getDomainContent } from "@/data/domain";
import EditorProvider from "@/providers/editor/editor-provider";

import FunnelEditor from "@/app/(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor";

interface DomainPathPageProps {
  params: {
    domain: string;
    path: string;
  };
}

const DomainPathPage = async ({ params }: DomainPathPageProps) => {
  const domainData = await getDomainContent(params.domain.slice(0, -1)); // to not get the period ex: "manny."

  const pageData = domainData?.FunnelPages.find(
    (page) => page.pathName === params.path
  );

  if (!pageData || !domainData) return notFound();

  return (
    <EditorProvider
      subaccountId={domainData.subAccountId}
      pageDetails={pageData}
      funnelId={domainData.id}
    >
      <FunnelEditor funnelPageId={pageData.id} liveMode={true} />
    </EditorProvider>
  );
};

export default DomainPathPage;
