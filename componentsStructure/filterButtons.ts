import { ComponentStructure } from "./types";

export const filterButtonsStructure: ComponentStructure = {
  componentType: "filterButtons",
  variants: [
    {
      id: "filterButtons1",
      name: "Filter Buttons 1 - Property Filters",
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
              key: "inspectionButtonText",
              label: "Inspection Request Button Text",
              type: "text",
            },
            {
              key: "inspectionButtonUrl",
              label: "Inspection Request Button URL",
              type: "text",
            },
            {
              key: "allButtonText",
              label: "All Button Text",
              type: "text",
            },
            {
              key: "availableButtonText",
              label: "Available Button Text",
              type: "text",
            },
            {
              key: "soldButtonText",
              label: "Sold Button Text",
              type: "text",
            },
            {
              key: "rentedButtonText",
              label: "Rented Button Text",
              type: "text",
            },
          ],
        },
        {
          key: "styling",
          label: "Styling",
          type: "object",
          fields: [
            {
              key: "inspectionButton",
              label: "Inspection Button Styling",
              type: "object",
              fields: [
                {
                  key: "bgColor",
                  label: "Background Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Button background uses primary color
                },
                {
                  key: "textColor",
                  label: "Text Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Button text uses primary color
                },
                {
                  key: "hoverBgColor",
                  label: "Hover Background Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Button hover uses primary color
                },
                {
                  key: "borderRadius",
                  label: "Border Radius",
                  type: "text",
                },
                {
                  key: "padding",
                  label: "Padding",
                  type: "number",
                  placeholder: "12",
                  unit: "px",
                },
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "number",
                  unit: "px",
                  defaultValue: 14,
                },
              ],
            },
            {
              key: "filterButtons",
              label: "Filter Buttons Styling",
              type: "object",
              fields: [
                {
                  key: "activeBgColor",
                  label: "Active Background Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Active button uses primary color
                },
                {
                  key: "activeTextColor",
                  label: "Active Text Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Active button text uses primary color
                },
                {
                  key: "inactiveBgColor",
                  label: "Inactive Background Color",
                  type: "text", // Keep as text for white/transparent backgrounds
                },
                {
                  key: "inactiveTextColor",
                  label: "Inactive Text Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Inactive button text uses primary color
                },
                {
                  key: "hoverBgColor",
                  label: "Hover Background Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Hover uses primary color
                },
                {
                  key: "borderRadius",
                  label: "Border Radius",
                  type: "text",
                },
                {
                  key: "padding",
                  label: "Padding",
                  type: "number",
                  placeholder: "12",
                  unit: "px",
                },
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "number",
                  unit: "px",
                  defaultValue: 14,
                },
                {
                  key: "gap",
                  label: "Gap Between Buttons",
                  type: "number",
                  placeholder: "8",
                  unit: "px",
                },
              ],
            },
          ],
        },
        {
          key: "layout",
          label: "Layout Settings",
          type: "object",
          fields: [
            {
              key: "direction",
              label: "Layout Direction",
              type: "select",
              options: [
                { value: "column", label: "Column" },
                { value: "row", label: "Row" },
              ],
            },
            {
              key: "alignment",
              label: "Button Alignment",
              type: "select",
              options: [
                { value: "center", label: "Center" },
                { value: "start", label: "Start" },
                { value: "end", label: "End" },
                { value: "between", label: "Between" },
              ],
            },
            {
              key: "inspectionButtonWidth",
              label: "Inspection Button Width",
              type: "number",
              placeholder: "200",
              unit: "px",
            },
            {
              key: "spacing",
              label: "Spacing",
              type: "object",
              fields: [
                { key: "marginBottom", label: "Margin Bottom", type: "number", placeholder: "24", unit: "px" },
                { key: "gap", label: "Gap Between Elements", type: "number", placeholder: "12", unit: "px" },
              ],
            },
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        {
          key: "content.inspectionButtonText",
          label: "Inspection Request Button Text",
          type: "text",
        },
        {
          key: "content.inspectionButtonUrl",
          label: "Inspection Request Button URL",
          type: "text",
        },
        {
          key: "content.allButtonText",
          label: "All Button Text",
          type: "text",
        },
        {
          key: "content.availableButtonText",
          label: "Available Button Text",
          type: "text",
        },
        {
          key: "content.soldButtonText",
          label: "Sold Button Text",
          type: "text",
        },
        {
          key: "content.rentedButtonText",
          label: "Rented Button Text",
          type: "text",
        },
      ],
    },
  ],
};
