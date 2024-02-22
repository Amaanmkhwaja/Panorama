"use client";

import { useRouter } from "next/navigation";

import clsx from "clsx";
import { z } from "zod";
import { Trash } from "lucide-react";

import { EditorBtns } from "@/lib/constants";
import { ContactFormSchema } from "@/schemas";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";

import { getFunnelById } from "@/actions/funnel";
import { upsertContact } from "@/actions/contact";
import { saveActivityLogsNotification } from "@/actions/notification";

import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { ContactForm } from "@/components/forms/contact-form";
import { deleteElementAndSaveToDB } from "@/lib/elements";
import { Id } from "@/convex/_generated/dataModel";

interface ContactFormComponentProps {
  element: EditorElement;
  funnelPageId: Id<"funnelPage">;
}

export const ContactFormComponent = (props: ContactFormComponentProps) => {
  const { dispatch, state, subaccountId, funnelId, pageDetails } = useEditor();
  const router = useRouter();

  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: props.element,
      },
    });
  };

  const styles = props.element.styles;

  const goToNextPage = async () => {
    if (!state.editor.liveMode) return;
    const funnelPages = await getFunnelById(funnelId);
    if (!funnelPages || !pageDetails) return;
    if (funnelPages.FunnelPages.length > pageDetails.order + 1) {
      const nextPage = funnelPages.FunnelPages.find(
        (page) => page.order === pageDetails.order + 1
      );
      if (!nextPage) return;
      router.replace(
        `${process.env.NEXT_PUBLIC_SCHEME}${funnelPages.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${nextPage.pathName}`
      );
    }
  };

  const handleDeleteElement = async () => {
    const response = await deleteElementAndSaveToDB(
      props.funnelPageId,
      state.editor.elements,
      props.element
    );
    if (response.error) {
      toast({
        variant: "destructive",
        title: "Failed",
        description: response.error,
      });
    }
  };

  const onFormSubmit = async (values: z.infer<typeof ContactFormSchema>) => {
    if (!state.editor.liveMode && !state.editor.previewMode) return;

    try {
      const response = await upsertContact({
        ...values,
        subAccountId: subaccountId,
      });
      //WIP Call trigger endpoint
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `A New contact signed up | ${response?.name}`,
        subaccountId: subaccountId,
      });
      toast({
        title: "Success",
        description: "Successfully Saved your info",
      });
      await goToNextPage();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Could not save your information",
      });
    }
  };

  return (
    <div
      style={styles}
      draggable
      onDragStart={(e) => handleDragStart(e, "contactForm")}
      onClick={handleOnClickBody}
      className={clsx(
        "p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-center justify-center",
        {
          "!border-blue-500":
            state.editor.selectedElement.id === props.element.id,

          "!border-solid": state.editor.selectedElement.id === props.element.id,
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
        }
      )}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg ">
            {state.editor.selectedElement.name}
          </Badge>
        )}
      <ContactForm
        subTitle="Contact Us"
        title="Want a free quote? We can help you"
        apiCall={onFormSubmit}
      />
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
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
