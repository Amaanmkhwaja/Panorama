"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import clsx from "clsx";
import { toast } from "sonner";
import { Trash } from "lucide-react";

import { EditorBtns } from "@/lib/constants";
import { getStripe } from "@/lib/stripe/stripe-client";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";

import { getFunnelById } from "@/actions/funnel";
import { getSubaccountDetailsById } from "@/actions/subaccount";

import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/global/loading";
import { Id } from "@/convex/_generated/dataModel";
import { deleteElementAndSaveToDB } from "@/lib/elements";

interface CheckoutProps {
  element: EditorElement;
  funnelPageId: Id<"funnelPage">;
}

export const Checkout = (props: CheckoutProps) => {
  const { dispatch, state, subaccountId, funnelId, pageDetails } = useEditor();
  console.log({ subaccountId });
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState("");
  const [livePrices, setLivePrices] = useState([]);
  const [subAccountConnectAccId, setSubAccountConnectAccId] = useState("");
  const options = useMemo(() => ({ clientSecret }), [clientSecret]);

  const styles = props.element.styles;

  useEffect(() => {
    if (!subaccountId) {
      toast.error("No subbaccountId was given!");
      return;
    }
    const fetchData = async () => {
      const subaccountDetails = await getSubaccountDetailsById(subaccountId);
      if (subaccountDetails.error) {
        toast.error(subaccountDetails.error);
        return;
      }
      if (subaccountDetails.success) {
        console.log("success got subaccountDetails");
        console.log({
          subAccountDetails: subaccountDetails.subAccountDetails,
        });
        console.log(
          "subbaccountDetails.subAccountDetails.connectedAccountId: ",
          subaccountDetails.subAccountDetails.connectAccountId
        );
        if (!subaccountDetails.subAccountDetails.connectAccountId) {
          toast.error("SubAccountDetails connectedAccountId doesnt exist");
          return;
        }
        setSubAccountConnectAccId(
          subaccountDetails.subAccountDetails.connectAccountId
        );
      }
    };
    fetchData();
  }, [subaccountId]);

  useEffect(() => {
    if (funnelId) {
      const fetchData = async () => {
        const funnelData = await getFunnelById(funnelId);
        console.log("funnelData: ", funnelData);
        setLivePrices(JSON.parse(funnelData?.liveProducts || "[]"));
      };
      fetchData();
    }
  }, [funnelId]);

  useEffect(() => {
    if (livePrices.length && subaccountId && subAccountConnectAccId) {
      console.log("inside if statement");
      console.log(
        "livePrices.length && subaccountId && subAccountConnectAccId"
      );
      console.log({ livePrices });
      console.log({ subaccountId });
      console.log({ subAccountConnectAccId });
      const getClientSercet = async () => {
        try {
          const body = JSON.stringify({
            subAccountConnectAccId,
            prices: livePrices,
            subaccountId,
          });
          console.log("making api call");
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}api/stripe/create-checkout-session`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body,
            }
          );
          const responseJson = await response.json();
          console.log(responseJson);
          if (!responseJson) throw new Error("Something went wrong");
          if (responseJson.error) {
            throw new Error(responseJson.error);
          }
          if (responseJson.clientSecret) {
            setClientSecret(responseJson.clientSecret);
          }
        } catch (error) {
          // toast({
          //   open: true,
          //   className: "z-[100000]",
          //   variant: "destructive",
          //   title: "Oppse!",
          //   //@ts-ignore
          //   description: error.message,
          // });
          // @ts-ignore
          toast.error(error.message, {
            className: "z-[100000]",
          });
        }
      };
      getClientSercet();
    }
  }, [livePrices, subaccountId, subAccountConnectAccId]);

  // this is only needed for the challenge
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

  // same thing like the contact form
  const goToNextPage = async () => {
    if (!state.editor.liveMode) return;
    const funnelPages = await getFunnelById(funnelId);
    if (!funnelPages || !pageDetails) return;
    if (funnelPages.FunnelPages.length > pageDetails.order + 1) {
      console.log(funnelPages.FunnelPages.length, pageDetails.order + 1);
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
      toast.error(response.error);
    }
  };

  return (
    <div
      style={styles}
      draggable // these two are for the challenge
      onDragStart={(e) => handleDragStart(e, "contactForm")} // this one
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

      <div className="border-none transition-all w-full">
        <div className="flex flex-col gap-4 w-full">
          {options.clientSecret && subAccountConnectAccId && (
            <div className="text-white">
              <EmbeddedCheckoutProvider
                stripe={getStripe(subAccountConnectAccId)}
                options={options}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          )}

          {!options.clientSecret && (
            <div className="flex items-center justify-center w-full h-40">
              <Loading />
            </div>
          )}
        </div>
      </div>

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
