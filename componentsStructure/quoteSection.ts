import { ComponentStructure } from "./types";
import { sharedTextStyleFields } from "./sharedTextStyleFields";

export const quoteSectionStructure: ComponentStructure = {
  componentType: "quoteSection",
  variants: [
    {
      id: "quoteSection1",
      name: "Quote Section 1",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "dir", label: "Direction", type: "select", options: [{ label: "RTL", value: "rtl" }, { label: "LTR", value: "ltr" }] },
        { key: "quote", label: "Quote", type: "textarea" },
        { key: "imageSrc", label: "Image URL", type: "text" },
        { key: "imageAlt", label: "Image Alt", type: "text" },
        { key: "name", label: "Name", type: "text" },
        { key: "role", label: "Role", type: "text" },
        { key: "quoteTextProps", label: "Quote Style", type: "object", fields: sharedTextStyleFields },
        { key: "nameTextProps", label: "Name Style", type: "object", fields: sharedTextStyleFields },
        { key: "roleTextProps", label: "Role Style", type: "object", fields: sharedTextStyleFields },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "quote", label: "Quote", type: "textarea" },
        { key: "name", label: "Name", type: "text" },
        { key: "role", label: "Role", type: "text" },
        { key: "quoteTextProps.fontSize", label: "Quote Font Size", type: "text" },
        { key: "quoteTextProps.color", label: "Quote Color", type: "color" },
      ],
    },
  ],
};
