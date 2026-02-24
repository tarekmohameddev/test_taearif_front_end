import { ComponentStructure } from "./types";

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
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "roleLabel", label: "Role Label", type: "text" },
        { key: "name", label: "Name", type: "text" },
        { key: "heading", label: "Heading", type: "text" },
        { key: "quote", label: "Quote", type: "textarea" },
      ],
    },
  ],
};
