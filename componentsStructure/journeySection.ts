import { ComponentStructure } from "./types";

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
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "heading", label: "Heading", type: "text" },
      ],
    },
  ],
};
