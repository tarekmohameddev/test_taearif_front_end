import { ComponentStructure } from "./types";
import { sharedTextStyleFields } from "./sharedTextStyleFields";

export const journeySectionStructure: ComponentStructure = {
  componentType: "journeySection",
  variants: [
    {
      id: "journeySection1",
      name: "Journey Section 1",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "dir", label: "Direction", type: "select", options: [{ label: "RTL", value: "rtl" }, { label: "LTR", value: "ltr" }] },
        { key: "heading", label: "Heading", type: "text" },
        { key: "journeyLabel", label: "Journey Label", type: "text" },
        { key: "flagImageSrc", label: "Flag Image URL", type: "text" },
        { key: "flagImageAlt", label: "Flag Image Alt", type: "text" },
        {
          key: "steps",
          label: "Steps",
          type: "array",
          of: [
            { key: "number", label: "Number", type: "number" },
            { key: "title", label: "Title", type: "text" },
            { key: "duration", label: "Duration", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "ctaLabel", label: "CTA Label", type: "text" },
            { key: "ctaHref", label: "CTA URL", type: "text" },
          ],
        },
        { key: "headingTextProps", label: "Heading Style", type: "object", fields: sharedTextStyleFields },
        { key: "journeyLabelTextProps", label: "Journey Label Style", type: "object", fields: sharedTextStyleFields },
        { key: "stepTitleTextProps", label: "Step Title Style", type: "object", fields: sharedTextStyleFields },
        { key: "stepDurationTextProps", label: "Step Duration Style", type: "object", fields: sharedTextStyleFields },
        { key: "stepDescriptionTextProps", label: "Step Description Style", type: "object", fields: sharedTextStyleFields },
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
