import { ComponentStructure } from "./types";

export const essenceSectionStructure: ComponentStructure = {
  componentType: "essenceSection",
  variants: [
    {
      id: "essenceSection1",
      name: "Essence Section 1",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "dir", label: "Direction", type: "select", options: [{ label: "RTL", value: "rtl" }, { label: "LTR", value: "ltr" }] },
        { key: "heading", label: "Heading", type: "text" },
        { key: "lead", label: "Lead", type: "text" },
        { key: "body1", label: "Body 1", type: "textarea" },
        { key: "body2", label: "Body 2", type: "textarea" },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "heading", label: "Heading", type: "text" },
        { key: "lead", label: "Lead", type: "text" },
        { key: "body1", label: "Body 1", type: "textarea" },
        { key: "body2", label: "Body 2", type: "textarea" },
      ],
    },
  ],
};
