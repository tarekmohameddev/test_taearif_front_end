import { ComponentStructure } from "./types";
import { sharedTextStyleFields } from "./sharedTextStyleFields";

export const commitmentSectionStructure: ComponentStructure = {
  componentType: "commitmentSection",
  variants: [
    {
      id: "commitmentSection1",
      name: "Commitment Section 1 - CEO Quote",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        {
          key: "dir",
          label: "Direction",
          type: "select",
          options: [
            { label: "RTL", value: "rtl" },
            { label: "LTR", value: "ltr" },
          ],
        },
        { key: "imageSrc", label: "CEO Image URL", type: "text" },
        { key: "imageAlt", label: "CEO Image Alt", type: "text" },
        { key: "backgroundImageSrc", label: "Background/Frame Image URL", type: "text" },
        { key: "roleLabel", label: "Role Label", type: "text" },
        { key: "name", label: "Name", type: "text" },
        { key: "heading", label: "Heading", type: "text" },
        { key: "quote", label: "Quote", type: "textarea" },
        { key: "roleLabelTextProps", label: "Role Label Style", type: "object", fields: sharedTextStyleFields },
        { key: "nameTextProps", label: "Name Style", type: "object", fields: sharedTextStyleFields },
        { key: "headingTextProps", label: "Heading Style", type: "object", fields: sharedTextStyleFields },
        { key: "quoteTextProps", label: "Quote Style", type: "object", fields: sharedTextStyleFields },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "roleLabel", label: "Role Label", type: "text" },
        { key: "name", label: "Name", type: "text" },
        { key: "heading", label: "Heading", type: "text" },
        { key: "quote", label: "Quote", type: "textarea" },
        { key: "headingTextProps.fontSize", label: "Heading Font Size", type: "text" },
        { key: "headingTextProps.color", label: "Heading Color", type: "color" },
      ],
    },
  ],
};
