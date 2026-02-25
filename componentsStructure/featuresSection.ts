import { ComponentStructure } from "./types";

export const featuresSectionStructure: ComponentStructure = {
  componentType: "featuresSection",
  variants: [
    {
      id: "featuresSection1",
      name: "Features Section 1",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "dir", label: "Direction", type: "select", options: [{ label: "RTL", value: "rtl" }, { label: "LTR", value: "ltr" }] },
        { key: "heading", label: "Heading", type: "text" },
        {
          key: "features",
          label: "Features",
          type: "array",
          of: [
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
          ],
        },
        {
          key: "certifications",
          label: "Certifications",
          type: "array",
          of: [
            { key: "imageSrc", label: "Image URL", type: "text" },
            { key: "imageAlt", label: "Image Alt", type: "text" },
            { key: "text", label: "Text", type: "text" },
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
