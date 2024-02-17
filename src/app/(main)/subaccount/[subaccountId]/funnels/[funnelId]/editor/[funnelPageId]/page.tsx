import { redirect } from "next/navigation";

import { db } from "@/lib/db";

interface EditorFunnelPageProps {
  params: {
    subaccountId: string;
    funnelId: string;
    funnelPageId: string;
  };
}

const EditorFunnelPage = async ({ params }: EditorFunnelPageProps) => {
  const funnelPageDetails = await db.funnelPage.findFirst({
    where: {
      id: params.funnelPageId,
    },
  });
  if (!funnelPageDetails) {
    return redirect(
      `/subaccount/${params.subaccountId}/funnels/${params.funnelId}`
    );
  }

  return <div>EditorFunnelPage</div>;
};

export default EditorFunnelPage;
