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
  if (!domainData) return notFound();

  const pageData = domainData.funnelPages.find((page) => !page.pathName);

  if (!pageData) return notFound();

  return (
    <EditorProvider
      subaccountId={domainData.funnel.subAccountId}
      pageDetails={pageData}
      funnelId={domainData.funnel.id}
    >
      <FunnelEditor funnelPageDetails={pageData} liveMode={true} />
    </EditorProvider>
  );
};

export default DomainPathPage;
