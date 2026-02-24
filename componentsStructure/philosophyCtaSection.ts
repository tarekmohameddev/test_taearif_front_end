import { ComponentStructure } from "./types";

export const philosophyCtaSectionStructure: ComponentStructure = {
  componentType: "philosophyCtaSection",
  variants: [
    {
      id: "philosophyCtaSection1",
      name: "Philosophy CTA Section 1",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "dir", label: "Direction", type: "select", options: [{ label: "RTL", value: "rtl" }, { label: "LTR", value: "ltr" }] },
        { key: "heading", label: "Heading", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "ctaLabel", label: "CTA Label", type: "text" },
        { key: "ctaHref", label: "CTA URL", type: "text" },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "heading", label: "Heading", type: "text" },
        { key: "ctaLabel", label: "CTA Label", type: "text" },
        { key: "ctaHref", label: "CTA URL", type: "text" },
      ],
    },
  ],
};
