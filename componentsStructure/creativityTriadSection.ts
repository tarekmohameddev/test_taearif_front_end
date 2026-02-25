import { ComponentStructure } from "./types";

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
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "heading", label: "Heading", type: "text" },
        { key: "intro", label: "Intro", type: "textarea" },
      ],
    },
  ],
};
