import React from "react";

import { EditorElement } from "@/providers/editor/editor-provider";

import { Checkout } from "./checkout";
import { TextComponent } from "./text";
import { Container } from "./container";
import { VideoComponent } from "./video";
import { LinkComponent } from "./link-component";
import { ContactFormComponent } from "./contact-form-component";
import { Id } from "@/convex/_generated/dataModel";

interface RecursiveProps {
  element: EditorElement;
  funnelPageId: Id<"funnelPage">;
}

export const Recursive = ({ element, funnelPageId }: RecursiveProps) => {
  switch (element.type) {
    case "text":
      return <TextComponent element={element} funnelPageId={funnelPageId} />;
    case "container":
      return <Container element={element} funnelPageId={funnelPageId} />;
    case "video":
      return <VideoComponent element={element} />;
    case "contactForm":
      return (
        <ContactFormComponent element={element} funnelPageId={funnelPageId} />
      );
    case "paymentForm":
      return <Checkout element={element} />;
    case "2Col":
      return <Container element={element} funnelPageId={funnelPageId} />;
    case "__body":
      return <Container element={element} funnelPageId={funnelPageId} />;

    case "link":
      return <LinkComponent element={element} />;
    default:
      return null;
  }
};
