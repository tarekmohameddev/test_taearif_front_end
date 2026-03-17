import { ComponentStructure } from "./types";
import { sharedTextStyleFields } from "./sharedTextStyleFields";

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
        { key: "headingTextProps", label: "Heading Style", type: "object", fields: sharedTextStyleFields },
        { key: "leadTextProps", label: "Lead Style", type: "object", fields: sharedTextStyleFields },
        { key: "bodyTextProps", label: "Body Style", type: "object", fields: sharedTextStyleFields },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "heading", label: "Heading", type: "text" },
        { key: "lead", label: "Lead", type: "text" },
        { key: "body1", label: "Body 1", type: "textarea" },
        { key: "body2", label: "Body 2", type: "textarea" },
        { key: "headingTextProps.fontSize", label: "Heading Font Size", type: "text" },
        { key: "headingTextProps.color", label: "Heading Color", type: "color" },
      ],
    },
  ],
};
