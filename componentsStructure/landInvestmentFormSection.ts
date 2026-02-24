import { ComponentStructure } from "./types";

export const landInvestmentFormSectionStructure: ComponentStructure = {
  componentType: "landInvestmentFormSection",
  variants: [
    {
      id: "landInvestmentFormSection1",
      name: "Land Investment Form Section 1",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "dir", label: "Direction", type: "select", options: [{ label: "RTL", value: "rtl" }, { label: "LTR", value: "ltr" }] },
        { key: "id", label: "Section ID", type: "text" },
        { key: "heading", label: "Heading", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "bottomImageSrc", label: "Bottom Image URL", type: "text" },
        { key: "bottomImageAlt", label: "Bottom Image Alt", type: "text" },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "heading", label: "Heading", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
      ],
    },
  ],
};
