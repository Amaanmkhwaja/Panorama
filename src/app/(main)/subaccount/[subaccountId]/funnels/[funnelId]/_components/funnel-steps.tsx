"use client";

import { useEffect, useState } from "react";

import {
  DragDropContext,
  DragStart,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { useMutation, useQuery } from "convex/react";

import { Funnel } from "@prisma/client";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useModal } from "@/providers/modal-provider";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { CustomModal } from "@/components/global/custom-modal";
import { FunnelPageForm } from "@/components/forms/funnel-page";

import { FunnelStepCard } from "./funnel-step-card";
import { FunnelPageSettings } from "./funnel-page-settings";

interface FunnelStepsProps {
  funnel: Funnel;
  subaccountId: string;
  pages: Doc<"funnelPage">[];
  funnelId: string;
}

export const FunnelSteps = ({
  funnel,
  funnelId,
  pages,
  subaccountId,
}: FunnelStepsProps) => {
  const { setOpen } = useModal();

  const funnelPages = useQuery(api.funnelPage.getFunnelPages, { funnelId });
  const updateFunnelPageOrder = useMutation(api.funnelPage.updateOrder);

  const [pagesState, setPagesState] = useState<Doc<"funnelPage">[]>([]);
  const [clickedPage, setClickedPage] = useState<Doc<"funnelPage"> | undefined>(
    undefined
  );
  useEffect(() => {
    if (funnelPages) {
      setClickedPage(funnelPages[0]);
      setPagesState(funnelPages);
    }
  }, [funnelPages]);
  const onDragStart = (event: DragStart) => {
    //current chosen page
    const { draggableId } = event;
    const value = pages.find((page) => page._id === draggableId);
  };

  const onDragEnd = (dropResult: DropResult) => {
    const { destination, source } = dropResult;

    //no destination or same position
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }
    //change state
    const newPageOrder = [...pagesState]
      .toSpliced(source.index, 1)
      .toSpliced(destination.index, 0, pagesState[source.index])
      .map((page, idx) => {
        return { ...page, order: idx };
      });

    setPagesState(newPageOrder);
    newPageOrder.forEach(async (page, index) => {
      updateFunnelPageOrder({ id: page._id, order: index })
        .then(() => {
          // toast.success("Saved page order");
        })
        .catch((error) => {
          toast.error(error || "Couldn not save page order!");
        });
    });
  };

  return (
    <AlertDialog>
      <div className="flex border-[1px] lg:!flex-row flex-col ">
        <aside className="flex-[0.3] bg-background p-6  flex flex-col justify-between ">
          <ScrollArea className="h-full ">
            <div className="flex gap-4 items-center">
              <Check />
              Funnel Steps
            </div>
            {pagesState.length ? (
              <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                <Droppable
                  droppableId="funnels"
                  direction="vertical"
                  key="funnels"
                >
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {pagesState.map((page, idx) => (
                        <div
                          className="relative"
                          key={page._id}
                          onClick={() => setClickedPage(page)}
                        >
                          <FunnelStepCard
                            funnelPage={page}
                            index={idx}
                            key={page._id}
                            activePage={page._id === clickedPage?._id}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <div className="text-center text-muted-foreground py-6">
                No Pages
              </div>
            )}
          </ScrollArea>
          <Button
            className="mt-4 w-full"
            disabled={!funnelPages}
            onClick={() => {
              if (funnelPages) {
                setOpen(
                  <CustomModal
                    title=" Create or Update a Funnel Page"
                    subheading="Funnel Pages allow you to create step by step processes for customers to follow"
                  >
                    <FunnelPageForm
                      subaccountId={subaccountId}
                      funnelId={funnelId}
                      order={funnelPages.length}
                    />
                  </CustomModal>
                );
              }
            }}
          >
            Create New Steps
          </Button>
        </aside>
        <FunnelPageSettings
          pages={pages}
          clickedPage={clickedPage}
          funnelId={funnelId}
          subaccountId={subaccountId}
          subDomainName={funnel.subDomainName}
        />
      </div>
    </AlertDialog>
  );
};
