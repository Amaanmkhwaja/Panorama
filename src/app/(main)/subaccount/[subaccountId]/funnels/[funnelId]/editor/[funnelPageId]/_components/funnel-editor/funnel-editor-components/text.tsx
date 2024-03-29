"use client";

import clsx from "clsx";
import { Trash } from "lucide-react";

import {
  EditorElement,
  updateAnElement,
  useEditor,
} from "@/providers/editor/editor-provider";

import { Badge } from "@/components/ui/badge";
import { Id } from "@/convex/_generated/dataModel";
import { deleteElementAndSaveToDB } from "@/lib/elements";
import { toast } from "sonner";
import { EditorAction } from "@/providers/editor/editor-actions";
import { updateFunnelPageContentInDB } from "@/actions/funnel";

interface TextComponentProps {
  element: EditorElement;
  funnelPageId: Id<"funnelPage">;
}

export const TextComponent = ({
  element,
  funnelPageId,
}: TextComponentProps) => {
  const { dispatch, state } = useEditor();

  const handleDeleteElement = async () => {
    const response = await deleteElementAndSaveToDB(
      funnelPageId,
      state.editor.elements,
      element
    );
    if (response.error) {
      toast.error(response.error);
    }
  };
  const styles = element.styles;

  const handleOnClickBody = (e: React.MouseEvent) => {
    // using stopPropagation bc the elements are within each other, and bc of event bubbling,
    // this event is going to go all the way up the child (up the tree), and fire at the body tag.
    // We only want this to fire at this specific element
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  //WE ARE NOT ADDING DRAG DROP
  // TODO CHALLENGE: 'draggable' prop on the main div
  return (
    <div
      // draggable
      style={styles}
      className={clsx(
        "p-[2px] w-full m-[5px] relative text-[16px] transition-all",
        {
          "!border-blue-500": state.editor.selectedElement.id === element.id,

          "!border-solid": state.editor.selectedElement.id === element.id,
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
        }
      )}
      onClick={handleOnClickBody}
    >
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
            {state.editor.selectedElement.name}
          </Badge>
        )}
      <span
        contentEditable={!state.editor.liveMode}
        onBlur={async (e) => {
          const spanElement = e.target as HTMLSpanElement;
          const action: EditorAction = {
            type: "UPDATE_ELEMENT",
            payload: {
              elementDetails: {
                ...element,
                content: {
                  innerText: spanElement.innerText,
                },
              },
            },
          };
          const updatedElementsArray = updateAnElement(
            state.editor.elements,
            action
          );

          const elementsToString = JSON.stringify(updatedElementsArray);
          const response = await updateFunnelPageContentInDB(
            funnelPageId,
            elementsToString
          );
          if (response.error) {
            toast.error(response.error);
          }
        }}
      >
        {!Array.isArray(element.content) && element.content.innerText}
      </span>
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash
              className="cursor-pointer"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  );
};
