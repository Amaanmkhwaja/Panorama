import React from "react";

import { EditorElement } from "@/providers/editor/editor-provider";

import { TextComponent } from "./text";
import { Container } from "./container";

interface RecursiveProps {
  element: EditorElement;
}

export const Recursive = ({ element }: RecursiveProps) => {
  switch (element.type) {
    case "text":
      return <TextComponent element={element} />;
    case "__body":
      return <Container element={element} />;
    default:
      return null;
  }
};
