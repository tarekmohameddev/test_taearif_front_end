import { ComponentStructure } from "./types";
import { sharedTextStyleFields } from "./sharedTextStyleFields";

export const creativityTriadSectionStructure: ComponentStructure = {
  componentType: "creativityTriadSection",
  variants: [
    {
      id: "creativityTriadSection1",
      name: "Creativity Triad Section 1",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "dir", label: "Direction", type: "select", options: [{ label: "RTL", value: "rtl" }, { label: "LTR", value: "ltr" }] },
        { key: "heading", label: "Heading", type: "text" },
        { key: "intro", label: "Intro", type: "textarea" },
        {
          key: "cards",
          label: "Cards",
          type: "array",
          of: [
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "imageSrc", label: "Image URL", type: "text" },
            { key: "imageAlt", label: "Image Alt", type: "text" },
          ],
        },
        { key: "headingTextProps", label: "Heading Style", type: "object", fields: sharedTextStyleFields },
        { key: "introTextProps", label: "Intro Style", type: "object", fields: sharedTextStyleFields },
        { key: "cardTitleTextProps", label: "Card Title Style", type: "object", fields: sharedTextStyleFields },
        { key: "cardDescriptionTextProps", label: "Card Description Style", type: "object", fields: sharedTextStyleFields },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "heading", label: "Heading", type: "text" },
        { key: "intro", label: "Intro", type: "textarea" },
        { key: "headingTextProps.fontSize", label: "Heading Font Size", type: "text" },
        { key: "headingTextProps.color", label: "Heading Color", type: "color" },
      ],
    },
  ],
};
