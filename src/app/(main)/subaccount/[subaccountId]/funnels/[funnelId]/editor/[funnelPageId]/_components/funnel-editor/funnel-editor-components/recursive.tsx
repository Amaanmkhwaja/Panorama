import React from "react";

import { EditorElement } from "@/providers/editor/editor-provider";

import { Checkout } from "./checkout";
import { TextComponent } from "./text";
import { Container } from "./container";
import { VideoComponent } from "./video";
import { LinkComponent } from "./link-component";
import { ContactFormComponent } from "./contact-form-component";

interface RecursiveProps {
  element: EditorElement;
}

export const Recursive = ({ element }: RecursiveProps) => {
  switch (element.type) {
    case "text":
      return <TextComponent element={element} />;
    case "container":
      return <Container element={element} />;
    case "video":
      return <VideoComponent element={element} />;
    case "contactForm":
      return <ContactFormComponent element={element} />;
    case "paymentForm":
      return <Checkout element={element} />;
    case "2Col":
      return <Container element={element} />;
    case "__body":
      return <Container element={element} />;

    case "link":
      return <LinkComponent element={element} />;
    default:
      return null;
  }
};
