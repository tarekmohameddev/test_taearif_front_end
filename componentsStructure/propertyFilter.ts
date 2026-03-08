import { ComponentStructure } from "./types";

export const propertyFilterStructure: ComponentStructure = {
  componentType: "propertyFilter",
  variants: [
    {
      id: "propertyFilter1",
      name: "Property Filter 1 - Search & Filter Form",
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
              key: "searchPlaceholder",
              label: "Search Input Placeholder",
              type: "text",
            },
            {
              key: "propertyTypePlaceholder",
              label: "Property Type Placeholder",
              type: "text",
            },
            {
              key: "pricePlaceholder",
              label: "Price Input Placeholder",
              type: "text",
            },
            {
              key: "searchButtonText",
              label: "Search Button Text",
              type: "text",
            },
            {
              key: "noResultsText",
              label: "No Results Text",
              type: "text",
            },
            {
              key: "propertyTypesSource",
              label: "Property Types Source",
              type: "select",
              options: [
                { label: "Static List", value: "static" },
                { label: "Dynamic API", value: "dynamic" },
              ],
              defaultValue: "dynamic",
            },
            {
              key: "propertyTypes",
              label: "Property Types List",
              type: "array",
              of: [
                {
                  key: "value",
                  label: "Property Type",
                  type: "text",
                },
              ],
              condition: {
                field: "content.propertyTypesSource",
                value: "static",
              },
            },
            {
              key: "propertyTypesApiUrl",
              label: "Property Types API URL",
              type: "text",
              placeholder:
                "https://api.taearif.com/api/v1/tenant-website/{tenantId}/properties/categories/direct",
              condition: {
                field: "content.propertyTypesSource",
                value: "dynamic",
              },
            },
            {
              key: "tenantId",
              label: "Tenant ID",
              type: "text",
              placeholder: "Enter tenant ID",
              condition: {
                field: "content.propertyTypesSource",
                value: "dynamic",
              },
            },
          ],
        },
        {
          key: "styling",
          label: "Styling",
          type: "object",
          fields: [
            {
              key: "form",
              label: "Form Styling",
              type: "object",
              fields: [
                {
                  key: "bgColor",
                  label: "Background Color",
                  type: "text",
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
                  placeholder: "16",
                  unit: "px",
                },
                {
                  key: "gap",
                  label: "Gap Between Fields",
                  type: "number",
                  placeholder: "12",
                  unit: "px",
                },
              ],
            },
            {
              key: "inputs",
              label: "Input Fields Styling",
              type: "object",
              fields: [
                {
                  key: "bgColor",
                  label: "Background Color",
                  type: "text", // Keep as text for input backgrounds
                },
                {
                  key: "borderColor",
                  label: "Border Color",
                  type: "text", // Keep as text for border colors
                },
                {
                  key: "textColor",
                  label: "Text Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "secondary", // Input text uses secondary color
                },
                {
                  key: "placeholderColor",
                  label: "Placeholder Color",
                  type: "text", // Keep as text for placeholder colors
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
                  key: "height",
                  label: "Height",
                  type: "number",
                  placeholder: "40",
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
              key: "dropdown",
              label: "Dropdown Styling",
              type: "object",
              fields: [
                {
                  key: "bgColor",
                  label: "Background Color",
                  type: "text", // Keep as text for dropdown backgrounds
                },
                {
                  key: "borderColor",
                  label: "Border Color",
                  type: "text", // Keep as text for border colors
                },
                {
                  key: "textColor",
                  label: "Text Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "secondary", // Dropdown text uses secondary color
                },
                {
                  key: "hoverBgColor",
                  label: "Hover Background Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Dropdown hover uses primary color
                },
                {
                  key: "borderRadius",
                  label: "Border Radius",
                  type: "text",
                },
                {
                  key: "maxHeight",
                  label: "Max Height",
                  type: "number",
                  placeholder: "300",
                  unit: "px",
                },
                {
                  key: "shadow",
                  label: "Box Shadow",
                  type: "text",
                },
              ],
            },
            {
              key: "searchButton",
              label: "Search Button Styling",
              type: "object",
              fields: [
                {
                  key: "bgColor",
                  label: "Background Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Search button background uses primary color
                },
                {
                  key: "textColor",
                  label: "Text Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Search button text uses primary color
                },
                {
                  key: "hoverBgColor",
                  label: "Hover Background Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Search button hover uses primary color
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
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
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
              key: "formLayout",
              label: "Form Layout",
              type: "select",
              options: [
                { label: "Grid", value: "grid" },
                { label: "Flex", value: "flex" },
              ],
            },
            {
              key: "responsive",
              label: "Responsive Settings",
              type: "object",
              fields: [
                {
                  key: "mobileColumns",
                  label: "Mobile Grid Columns",
                  type: "number",
                },
                {
                  key: "tabletColumns",
                  label: "Tablet Grid Columns",
                  type: "number",
                },
                {
                  key: "desktopColumns",
                  label: "Desktop Grid Columns",
                  type: "number",
                },
              ],
            },
            {
              key: "fieldWidths",
              label: "Field Widths",
              type: "object",
              fields: [
                { key: "searchWidth", label: "Search Field Width", type: "number", placeholder: "200", unit: "px" },
                { key: "typeWidth", label: "Type Field Width", type: "number", placeholder: "150", unit: "px" },
                { key: "priceWidth", label: "Price Field Width", type: "number", placeholder: "120", unit: "px" },
                { key: "buttonWidth", label: "Button Width", type: "number", placeholder: "120", unit: "px" },
              ],
            },
            {
              key: "spacing",
              label: "Spacing",
              type: "object",
              fields: [
                { key: "marginBottom", label: "Margin Bottom", type: "number", placeholder: "24", unit: "px" },
                { key: "gap", label: "Gap Between Fields", type: "number", placeholder: "12", unit: "px" },
              ],
            },
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        {
          key: "content.searchPlaceholder",
          label: "Search Input Placeholder",
          type: "text",
        },
        {
          key: "content.propertyTypePlaceholder",
          label: "Property Type Placeholder",
          type: "text",
        },
        {
          key: "content.pricePlaceholder",
          label: "Price Input Placeholder",
          type: "text",
        },
        {
          key: "content.searchButtonText",
          label: "Search Button Text",
          type: "text",
        },
        {
          key: "content.noResultsText",
          label: "No Results Text",
          type: "text",
        },
        {
          key: "content.propertyTypesSource",
          label: "Property Types Source",
          type: "select",
          options: [
            { label: "Static List", value: "static" },
            { label: "Dynamic API", value: "dynamic" },
          ],
          defaultValue: "dynamic",
        },
        {
          key: "content.propertyTypes",
          label: "Property Types List",
          type: "array",
          condition: {
            field: "content.propertyTypesSource",
            value: "static",
          },
        },
        {
          key: "content.propertyTypesApiUrl",
          label: "Property Types API URL",
          type: "text",
          placeholder:
            "https://api.taearif.com/api/v1/tenant-website/{tenantId}/properties/categories/direct",
          condition: {
            field: "content.propertyTypesSource",
            value: "dynamic",
          },
        },
        {
          key: "content.tenantId",
          label: "Tenant ID",
          type: "text",
          placeholder: "Enter tenant ID",
          condition: {
            field: "content.propertyTypesSource",
            value: "dynamic",
          },
        },
      ],
    },
  ],
};
