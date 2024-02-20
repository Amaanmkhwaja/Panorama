import { redirect } from "next/navigation";

import { Loader } from "lucide-react";
import { db } from "@/lib/db";

import { Room } from "@/components/global/room";
import { Canvas } from "./_components/canvas";

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

  return (
    <Room
      roomId={params.funnelPageId}
      fallback={
        <div className="fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden flex flex-col gap-6 items-center justify-center">
          <span className="text-4xl font-bold">Loading canvas...</span>
          <Loader className="animate-spin h-12 w-12" />
        </div>
      }
    >
      <Canvas
        funnelPageDetails={funnelPageDetails}
        subaccountId={params.subaccountId}
        funnelId={params.funnelId}
        funnelPageId={params.funnelPageId}
      />
    </Room>
  );
};

export default EditorFunnelPage;
