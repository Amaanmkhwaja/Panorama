import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { getDomainContent } from "@/data/domain";
import EditorProvider from "@/providers/editor/editor-provider";

import FunnelEditor from "../(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor";

interface DomainPageProps {
  params: {
    domain: string;
  };
}

const DomainPage = async ({ params }: DomainPageProps) => {
  const domainData = await getDomainContent(params.domain.slice(0, -1));
  if (!domainData) return notFound();

  const pageData = domainData.funnelPages.find((page) => !page.pathName);

  if (!pageData) return notFound();

  // await db.funnelPage.update({
  //   where: {
  //     id: pageData.id,
  //   },
  //   data: {
  //     visits: {
  //       increment: 1,
  //     },
  //   },
  // });

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

export default DomainPage;
