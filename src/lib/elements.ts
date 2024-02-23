import { v4 as uuid } from "uuid";
import { defaultStyles } from "./constants";
import {
  EditorElement,
  deleteAnElement,
} from "@/providers/editor/editor-provider";
import { EditorAction } from "@/providers/editor/editor-actions";
import { updateFunnelPageContentInDB } from "@/actions/funnel";
import { Id } from "@/convex/_generated/dataModel";

export const elementDetails: {
  text: EditorElement;
  link: EditorElement;
  video: EditorElement;
  container: EditorElement;
  contactForm: EditorElement;
  paymentForm: EditorElement;
  "2Col": EditorElement;
  "3Col": EditorElement;
} = {
  text: {
    content: { innerText: "Text Element" },
    id: uuid(),
    name: "Text",
    styles: {
      color: "black",
      ...defaultStyles,
    },
    type: "text",
  },
  link: {
    content: {
      innerText: "Link Element",
      href: "#",
    },
    id: uuid(),
    name: "Link",
    styles: {
      color: "black",
      ...defaultStyles,
    },
    type: "link",
  },
  video: {
    content: {
      src: "https://www.youtube.com/embed/n61ULEU7CO0?si=PuQC-d2ZR0cWlodH",
    },
    id: uuid(),
    name: "Video",
    styles: {},
    type: "video",
  },
  container: {
    content: [],
    id: uuid(),
    name: "Container",
    styles: { ...defaultStyles },
    type: "container",
  },
  contactForm: {
    content: [],
    id: uuid(),
    name: "Contact Form",
    styles: {},
    type: "contactForm",
  },
  paymentForm: {
    content: [],
    id: uuid(),
    name: "Contact Form",
    styles: {},
    type: "paymentForm",
  },
  "2Col": {
    content: [
      {
        content: [],
        id: uuid(),
        name: "Container",
        styles: { ...defaultStyles, width: "100%" },
        type: "container",
      },
      {
        content: [],
        id: uuid(),
        name: "Container",
        styles: { ...defaultStyles, width: "100%" },
        type: "container",
      },
    ],
    id: uuid(),
    name: "Two Columns",
    styles: { ...defaultStyles, display: "flex" },
    type: "2Col",
  },
  "3Col": {
    content: [
      {
        content: [],
        id: uuid(),
        name: "Container",
        styles: { ...defaultStyles, width: "100%" },
        type: "container",
      },
      {
        content: [],
        id: uuid(),
        name: "Container",
        styles: { ...defaultStyles, width: "100%" },
        type: "container",
      },
      {
        content: [],
        id: uuid(),
        name: "Container",
        styles: { ...defaultStyles, width: "100%" },
        type: "container",
      },
    ],
    id: uuid(),
    name: "Two Columns",
    styles: { ...defaultStyles, display: "flex" },
    type: "3Col",
  },
};

export const deleteElementAndSaveToDB = async (
  funnelPageId: Id<"funnelPage">,
  editorArray: EditorElement[],
  element: EditorElement
) => {
  const action: EditorAction = {
    type: "DELETE_ELEMENT",
    payload: {
      elementDetails: element,
    },
  };
  const deletedElementFromArray = deleteAnElement(editorArray, action);
  const elementsToString = JSON.stringify(deletedElementFromArray);

  const response = await updateFunnelPageContentInDB(
    funnelPageId,
    elementsToString
  );

  return response;
};
