import { ComponentStructure } from "./types";
import { sharedTextStyleFields } from "./sharedTextStyleFields";

export const projectsHeaderStructure: ComponentStructure = {
  componentType: "projectsHeader",
  variants: [
    {
      id: "projectsHeader1",
      name: "Projects Header 1",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "dir", label: "Direction", type: "select", options: [{ label: "RTL", value: "rtl" }, { label: "LTR", value: "ltr" }] },
        { key: "heading", label: "Heading", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "headingTextProps", label: "Heading Style", type: "object", fields: sharedTextStyleFields },
        { key: "descriptionTextProps", label: "Description Style", type: "object", fields: sharedTextStyleFields },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "heading", label: "Heading", type: "text" },
        { key: "headingTextProps.fontSize", label: "Heading Font Size", type: "text" },
        { key: "headingTextProps.color", label: "Heading Color", type: "color" },
      ],
    },
  ],
};
