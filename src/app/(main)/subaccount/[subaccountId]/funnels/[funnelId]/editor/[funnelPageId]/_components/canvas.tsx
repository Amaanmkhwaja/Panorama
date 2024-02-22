"use client";

import { useMyPresence, useOthers } from "@/liveblocks.config";
import EditorProvider from "@/providers/editor/editor-provider";
import { connectionIdToColor } from "@/lib/utils";

import { Cursor } from "./cursor";
import FunnelEditor from "./funnel-editor";
import FunnelEditorSidebar from "./funnel-editor-sidebar";
import { FunnelEditorNavigation } from "./funnel-editor-navigation";
import { Doc, Id } from "@/convex/_generated/dataModel";

interface CanvasProps {
  funnelPageDetails: Doc<"funnelPage">;
  subaccountId: string;
  funnelId: string;
  funnelPageId: Id<"funnelPage">;
}

export const Canvas = ({
  funnelPageDetails,
  subaccountId,
  funnelId,
  funnelPageId,
}: CanvasProps) => {
  const [{ cursor }, updateMyPresence] = useMyPresence();
  const others = useOthers();

  return (
    <main
      className="fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden touch-none"
      onPointerMove={(event) => {
        // update the cursor position on every pointer move
        updateMyPresence({
          cursor: {
            x: Math.round(event.clientX),
            y: Math.round(event.clientY),
          },
        });
      }}
      onPointerLeave={() =>
        // When the pointer goes out, set cursor to null
        updateMyPresence({
          cursor: null,
        })
      }
    >
      {others.map(({ connectionId, presence, info }) => {
        if (presence.cursor === null) {
          return null;
        }

        const name = info?.name || "Teammate";

        return (
          <Cursor
            key={`cursor-${connectionId}`}
            // connectionId is an integer that is incremented at every new connections
            // assigning a color with a modula makes sure that specific user has the same colors on every clients
            color={connectionIdToColor(connectionId)}
            x={presence.cursor.x}
            y={presence.cursor.y}
            connectionId={connectionId}
            name={name}
          />
        );
      })}
      {/* {funnelPageDetails && ( */}
      <EditorProvider
        subaccountId={subaccountId}
        funnelId={funnelId}
        pageDetails={funnelPageDetails}
      >
        <FunnelEditorNavigation
          funnelId={funnelId}
          funnelPageDetails={funnelPageDetails}
          subaccountId={subaccountId}
        />
        <div className="h-full flex justify-center">
          <FunnelEditor funnelPageDetails={funnelPageDetails} />
        </div>

        <FunnelEditorSidebar
          subaccountId={subaccountId}
          funnelPageId={funnelPageId}
        />
      </EditorProvider>
      {/* )} */}
    </main>
  );
};
