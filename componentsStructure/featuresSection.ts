import { ComponentStructure } from "./types";
import { sharedTextStyleFields } from "./sharedTextStyleFields";

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
        { key: "headingTextProps", label: "Heading Style", type: "object", fields: sharedTextStyleFields },
        { key: "featureTitleTextProps", label: "Feature Title Style", type: "object", fields: sharedTextStyleFields },
        { key: "featureDescriptionTextProps", label: "Feature Description Style", type: "object", fields: sharedTextStyleFields },
        { key: "certificationTextProps", label: "Certification Style", type: "object", fields: sharedTextStyleFields },
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
