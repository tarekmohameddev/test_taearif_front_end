import { ComponentStructure } from "./types";

export const propertiesPageStructure: ComponentStructure = {
  componentType: "propertiesPage",
  variants: [
    {
      id: "propertiesPage1",
      name: "Properties Page 1 - Complete Properties Listing",
      fields: [
        {
          key: "visible",
          label: "Visible",
          type: "boolean",
        },
        {
          key: "content",
          label: "Content",
          type: "object",
          fields: [
            {
              key: "title",
              label: "Page Title",
              type: "text",
            },
            {
              key: "subtitle",
              label: "Page Subtitle",
              type: "text",
            },
            {
              key: "defaultTransactionType",
              label: "Default Transaction Type",
              type: "select",
              options: ["rent", "sale"],
            },
          ],
        },
        {
          key: "styling",
          label: "Styling",
          type: "object",
          fields: [
            {
              key: "bgColor",
              label: "Background Color",
              type: "text", // Keep as text for page backgrounds
            },
            {
              key: "textColor",
              label: "Text Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "secondary", // Text uses secondary color
            },
            {
              key: "titleColor",
              label: "Title Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "secondary", // Title uses secondary color
            },
            {
              key: "subtitleColor",
              label: "Subtitle Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "secondary", // Subtitle uses secondary color
            },
            {
              key: "containerMaxWidth",
              label: "Container Max Width",
              type: "number",
              placeholder: "1280",
              unit: "px",
            },
            {
              key: "padding",
              label: "Page Padding",
              type: "number",
              placeholder: "24",
              unit: "px",
            },
          ],
        },
        {
          key: "layout",
          label: "Layout Settings",
          type: "object",
          fields: [
            {
              key: "showFilter",
              label: "Show Property Filter",
              type: "boolean",
            },
            {
              key: "showFilterButtons",
              label: "Show Filter Buttons",
              type: "boolean",
            },
            {
              key: "showGrid",
              label: "Show Property Grid",
              type: "boolean",
            },
            {
              key: "spacing",
              label: "Spacing",
              type: "object",
              fields: [
                {
                  key: "betweenSections",
                  label: "Spacing Between Sections",
                  type: "number",
                  placeholder: "32",
                  unit: "px",
                },
                {
                  key: "pagePadding",
                  label: "Page Padding",
                  type: "number",
                  placeholder: "24",
                  unit: "px",
                },
              ],
            },
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "content.title", label: "Page Title", type: "text" },
        { key: "content.subtitle", label: "Page Subtitle", type: "text" },
        {
          key: "content.defaultTransactionType",
          label: "Default Transaction Type",
          type: "select",
        },
        { key: "styling.bgColor", label: "Background Color", type: "text" },
        { key: "styling.textColor", label: "Text Color", type: "text" },
        { key: "styling.titleColor", label: "Title Color", type: "text" },
        { key: "styling.subtitleColor", label: "Subtitle Color", type: "text" },
        {
          key: "styling.containerMaxWidth",
          label: "Container Max Width",
          type: "text",
        },
        { key: "styling.padding", label: "Page Padding", type: "text" },
        {
          key: "layout.showFilter",
          label: "Show Property Filter",
          type: "boolean",
        },
        {
          key: "layout.showFilterButtons",
          label: "Show Filter Buttons",
          type: "boolean",
        },
        {
          key: "layout.showGrid",
          label: "Show Property Grid",
          type: "boolean",
        },
        {
          key: "layout.spacing.betweenSections",
          label: "Spacing Between Sections",
          type: "text",
        },
        {
          key: "layout.spacing.pagePadding",
          label: "Page Padding",
          type: "text",
        },
      ],
    },
  ],
};
