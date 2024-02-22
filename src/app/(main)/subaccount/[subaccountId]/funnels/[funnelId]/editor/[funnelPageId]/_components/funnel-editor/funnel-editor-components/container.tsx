"use client";

import clsx from "clsx";
import { toast } from "sonner";
import { Trash } from "lucide-react";

import { EditorBtns } from "@/lib/constants";
import {
  EditorElement,
  addAnElement,
  useEditor,
} from "@/providers/editor/editor-provider";

import { Badge } from "@/components/ui/badge";

import { Recursive } from "./recursive";
import { EditorAction } from "@/providers/editor/editor-actions";
import { updateFunnelPageContentInDB } from "@/actions/funnel";
import { Id } from "@/convex/_generated/dataModel";
import { deleteElementAndSaveToDB, elementDetails } from "@/lib/elements";

interface ContainerProps {
  element: EditorElement;
  funnelPageId: Id<"funnelPage">;
}

export const Container = ({ element, funnelPageId }: ContainerProps) => {
  const { id, content, name, styles, type } = element;
  const { dispatch, state } = useEditor();

  const handleOnDrop = async (e: React.DragEvent, type: string) => {
    e.stopPropagation();
    const componentType = e.dataTransfer.getData("componentType") as EditorBtns;
    let action: EditorAction | null = null;

    switch (componentType) {
      case "text":
        action = {
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: elementDetails["text"],
          },
        };
        break;
      case "link":
        action = {
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: elementDetails["link"],
          },
        };
        break;
      case "video":
        action = {
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: elementDetails["video"],
          },
        };
        break;
      case "container":
        action = {
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: elementDetails["container"],
          },
        };
        break;
      case "contactForm":
        action = {
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: elementDetails["contactForm"],
          },
        };
        break;
      case "paymentForm":
        action = {
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: elementDetails["paymentForm"],
          },
        };
        break;
      case "2Col":
        action = {
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: elementDetails["2Col"],
          },
        };
        break;
      default:
        return;
    }

    const updatedElementsArray = addAnElement(state.editor.elements, action);
    const elementsToString = JSON.stringify(updatedElementsArray);
    const res = await updateFunnelPageContentInDB(
      funnelPageId,
      elementsToString
    );
    if (res.error) {
      toast.error(res.error);
    }
    if (res.success) {
      toast.success(res.success);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent, type: string) => {
    if (type === "__body") return;
    e.dataTransfer.setData("componentType", type);
  };

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

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

  return (
    <div
      style={styles}
      className={clsx("relative p-4 transition-all group", {
        "max-w-full w-full": type === "container" || type === "2Col",
        "h-fit": type === "container",
        "h-full": type === "__body",
        "overflow-auto ": type === "__body",
        "flex flex-col md:!flex-row": type === "2Col",
        "!border-blue-500":
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type !== "__body",
        "!border-yellow-400 !border-4":
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type === "__body",
        "!border-solid":
          state.editor.selectedElement.id === id && !state.editor.liveMode,
        "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
      })}
      onDrop={(e) => handleOnDrop(e, id)}
      onDragOver={handleDragOver}
      draggable={type !== "__body"}
      onClick={handleOnClickBody}
      onDragStart={(e) => handleDragStart(e, "container")}
      // TODO Challenge: When you are dragging a component itself, we have to send a new state. How it works right now
      // is that when we drag an element from the Components tab, we are only sending the componentType in the metadata.
      // But now we want to send the entir component itself so that we can rebuild or copy the component below that. (see 14:18:03)
    >
      <Badge
        className={clsx(
          "absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden",
          {
            block:
              state.editor.selectedElement.id === element.id &&
              !state.editor.liveMode,
          }
        )}
      >
        {element.name}
      </Badge>

      {Array.isArray(content) &&
        content.map((childElement) => (
          <Recursive
            key={childElement.id}
            element={childElement}
            funnelPageId={funnelPageId}
          />
        ))}

      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode &&
        state.editor.selectedElement.type !== "__body" && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg ">
            <Trash size={16} onClick={handleDeleteElement} />
          </div>
        )}
    </div>
  );
};
