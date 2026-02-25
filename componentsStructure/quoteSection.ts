import { ComponentStructure } from "./types";

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
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "quote", label: "Quote", type: "textarea" },
        { key: "name", label: "Name", type: "text" },
        { key: "role", label: "Role", type: "text" },
      ],
    },
  ],
};
