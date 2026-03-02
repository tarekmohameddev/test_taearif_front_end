import { ComponentStructure } from "./types";

export const mapSectionStructure: ComponentStructure = {
  componentType: "mapSection",
  variants: [
    {
      id: "mapSection1",
      name: "Map Section 1 - Google Maps Embed",
      fields: [
        {
          key: "visible",
          label: "Visible",
          type: "boolean",
        },
        {
          key: "title",
          label: "Section Title",
          type: "text",
          placeholder:
            "ويمكنك أيضا زيارتنا في أي وقت من خلال موقعنا على الخريطة اسفله",
        },
        {
          key: "mapUrl",
          label: "Google Maps Embed URL",
          type: "text",
          placeholder: "https://www.google.com/maps/embed?pb=...",
        },
        {
          key: "styling",
          label: "Styling",
          type: "object",
          fields: [
            {
              key: "titleColor",
              label: "Title Color",
              type: "color",
            },
            {
              key: "titleSize",
              label: "Title Size",
              type: "object",
              fields: [
                {
                  key: "mobile",
                  label: "Mobile",
                  type: "text",
                  placeholder: "text-xl",
                },
                {
                  key: "tablet",
                  label: "Tablet",
                  type: "text",
                  placeholder: "text-2xl",
                },
                {
                  key: "desktop",
                  label: "Desktop",
                  type: "text",
                  placeholder: "text-2xl",
                },
              ],
            },
            {
              key: "mapHeight",
              label: "Map Height",
              type: "number",
              placeholder: "400",
              unit: "px",
            },
          ],
        },
        {
          key: "spacing",
          label: "Spacing",
          type: "object",
          fields: [
            {
              key: "paddingTop",
              label: "Padding Top",
              type: "object",
              fields: [
                { key: "mobile", label: "Mobile", type: "number", placeholder: "48", unit: "px" },
                { key: "tablet", label: "Tablet", type: "number", placeholder: "56", unit: "px" },
                { key: "desktop", label: "Desktop", type: "number", placeholder: "64", unit: "px" },
              ],
            },
            {
              key: "paddingBottom",
              label: "Padding Bottom",
              type: "object",
              fields: [
                { key: "mobile", label: "Mobile", type: "number", placeholder: "32", unit: "px" },
                { key: "tablet", label: "Tablet", type: "number", placeholder: "40", unit: "px" },
                { key: "desktop", label: "Desktop", type: "number", placeholder: "48", unit: "px" },
              ],
            },
          ],
        },
      ],

      // ═══════════════════════════════════════════════════════════
      // SIMPLE FIELDS - For basic/simple editing mode
      // ═══════════════════════════════════════════════════════════
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "title", label: "Title", type: "text" },
        { key: "mapUrl", label: "Map URL", type: "text" },
      ],
    },
  ],
};
