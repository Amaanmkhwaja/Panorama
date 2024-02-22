"use client";

// import { redirect } from "next/navigation";

import { Loader } from "lucide-react";
// import { db } from "@/lib/db";

import { Room } from "@/components/global/room";
import { Canvas } from "./_components/canvas";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface EditorFunnelPageProps {
  params: {
    subaccountId: string;
    funnelId: string;
    funnelPageId: string;
  };
}

const EditorFunnelPage = ({ params }: EditorFunnelPageProps) => {
  // const funnelPageDetails = await db.funnelPage.findFirst({
  //   where: {
  //     id: params.funnelPageId,
  //   },
  // });
  // if (!funnelPageDetails) {
  //   return redirect(
  //     `/subaccount/${params.subaccountId}/funnels/${params.funnelId}`
  //   );
  // }
  const funnelPageDetails = useQuery(api.funnelPage.getFunnelPageById, {
    id: params.funnelPageId as Id<"funnelPage">,
  });
  // console.log(funnelPageDetails);

  return (
    // <Room
    //   roomId={params.funnelPageId}
    //   fallback={
    //     <div className="fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden flex flex-col gap-6 items-center justify-center">
    //       <span className="text-4xl font-bold">Loading canvas...</span>
    //       <Loader className="animate-spin h-12 w-12" />
    //     </div>
    //   }
    // >
    <>
      {funnelPageDetails && (
        <Canvas
          funnelPageDetails={funnelPageDetails}
          subaccountId={params.subaccountId}
          funnelId={params.funnelId}
          funnelPageId={params.funnelPageId as Id<"funnelPage">}
        />
      )}
    </>
    // </Room>
  );
};

export default EditorFunnelPage;
