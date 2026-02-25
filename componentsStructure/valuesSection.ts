import { ComponentStructure } from "./types";

export const valuesSectionStructure: ComponentStructure = {
  componentType: "valuesSection",
  variants: [
    {
      id: "valuesSection1",
      name: "Values Section 1",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "dir", label: "Direction", type: "select", options: [{ label: "RTL", value: "rtl" }, { label: "LTR", value: "ltr" }] },
        { key: "heading", label: "Heading", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        {
          key: "cards",
          label: "Cards",
          type: "array",
          of: [
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
            {
              key: "iconKey",
              label: "Icon",
              type: "select",
              options: [
                { label: "Community", value: "community" },
                { label: "Heritage", value: "heritage" },
                { label: "Quality", value: "quality" },
              ],
            },
            {
              key: "bgVariant",
              label: "Background",
              type: "select",
              options: [
                { label: "Muted", value: "muted-foreground" },
                { label: "Darken", value: "darken" },
                { label: "Black", value: "black" },
              ],
            },
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "heading", label: "Heading", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
      ],
    },
  ],
};
