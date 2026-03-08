import { ComponentStructure } from "./types";

export const inputsStructure: ComponentStructure = {
  componentType: "inputs",
  variants: [
    {
      id: "inputs1",
      name: "Inputs 1 - Dynamic Form Cards",
      fields: [
        {
          key: "visible",
          label: "Visible",
          type: "boolean",
          defaultValue: true,
        },
        {
          key: "layout",
          label: "Layout Settings",
          type: "object",
          fields: [
            {
              key: "direction",
              label: "Direction",
              type: "select",
              options: [
                { value: "rtl", label: "Right to Left" },
                { value: "ltr", label: "Left to Right" },
              ],
              defaultValue: "rtl",
            },
            {
              key: "maxWidth",
              label: "Max Width",
              type: "number",
              defaultValue: 1600,
              unit: "px",
            },
            {
              key: "padding",
              label: "Padding",
              type: "object",
              fields: [
                { key: "y", label: "Vertical Padding", type: "number", defaultValue: 56, unit: "px" },
                { key: "smY", label: "Small Vertical Padding", type: "number", defaultValue: 64, unit: "px" },
              ],
            },
          ],
        },
        {
          key: "theme",
          label: "Theme Settings",
          type: "object",
          fields: [
            {
              key: "primaryColor",
              label: "Primary Color",
              type: "color",
              defaultValue: "#3b82f6",
            },
            {
              key: "secondaryColor",
              label: "Secondary Color",
              type: "color",
              defaultValue: "#1e40af",
            },
            {
              key: "accentColor",
              label: "Accent Color",
              type: "color",
              defaultValue: "#60a5fa",
            },
            {
              key: "submitButtonGradient",
              label: "Submit Button Gradient",
              type: "text",
              defaultValue: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
            },
          ],
        },
        {
          key: "submitButton",
          label: "Submit Button Settings",
          type: "object",
          fields: [
            {
              key: "text",
              label: "Button Text",
              type: "text",
              defaultValue: "إرسال",
            },
            {
              key: "show",
              label: "Show Button",
              type: "boolean",
              defaultValue: true,
            },
            {
              key: "className",
              label: "CSS Classes",
              type: "text",
              defaultValue: "w-full",
            },
            {
              key: "backgroundColor",
              label: "Background Color",
              type: "color",
              defaultValue: "#3b82f6",
              useDefaultColor: true,
              globalColorType: "primary", // Button background uses primary color
            },
            {
              key: "textColor",
              label: "Text Color",
              type: "color",
              defaultValue: "#ffffff",
              useDefaultColor: true,
              globalColorType: "primary", // Button text uses primary color
            },
            {
              key: "hoverColor",
              label: "Hover Color",
              type: "color",
              defaultValue: "#1e40af",
              useDefaultColor: true,
              globalColorType: "primary", // Button hover uses primary color
            },
            {
              key: "borderRadius",
              label: "Border Radius",
              type: "text",
              defaultValue: "8px",
            },
            {
              key: "padding",
              label: "Padding",
              type: "object",
              fields: [
                { key: "y", label: "Vertical Padding", type: "number", defaultValue: 12, unit: "px" },
                { key: "x", label: "Horizontal Padding", type: "number", defaultValue: 24, unit: "px" },
              ],
            },
            {
              key: "apiEndpoint",
              label: "API Endpoint",
              type: "text",
              defaultValue: "/api/submit-form",
              placeholder: "Enter API endpoint URL",
            },
            {
              key: "apiMethod",
              label: "HTTP Method",
              type: "select",
              options: [
                { value: "POST", label: "POST" },
                { value: "PUT", label: "PUT" },
                { value: "PATCH", label: "PATCH" },
              ],
              defaultValue: "POST",
            },
            {
              key: "apiHeaders",
              label: "Custom Headers (JSON)",
              type: "textarea",
              placeholder:
                '{"Content-Type": "application/json", "Authorization": "Bearer token"}',
              defaultValue: '{"Content-Type": "application/json"}',
            },
          ],
        },
        {
          key: "layout",
          label: "Cards Layout Settings",
          type: "object",
          fields: [
            {
              key: "columns",
              label: "Number of Columns",
              type: "select",
              options: [
                { value: "1", label: "1 Column" },
                { value: "2", label: "2 Columns" },
                { value: "3", label: "3 Columns" },
                { value: "4", label: "4 Columns" },
              ],
              defaultValue: "1",
            },
            {
              key: "gap",
              label: "Gap Between Cards",
              type: "text",
              defaultValue: "24px",
            },
            {
              key: "responsive",
              label: "Responsive Layout",
              type: "object",
              fields: [
                {
                  key: "mobile",
                  label: "Mobile Columns",
                  type: "select",
                  options: [
                    { value: "1", label: "1 Column" },
                    { value: "2", label: "2 Columns" },
                  ],
                  defaultValue: "1",
                },
                {
                  key: "tablet",
                  label: "Tablet Columns",
                  type: "select",
                  options: [
                    { value: "1", label: "1 Column" },
                    { value: "2", label: "2 Columns" },
                    { value: "3", label: "3 Columns" },
                  ],
                  defaultValue: "2",
                },
                {
                  key: "desktop",
                  label: "Desktop Columns",
                  type: "select",
                  options: [
                    { value: "1", label: "1 Column" },
                    { value: "2", label: "2 Columns" },
                    { value: "3", label: "3 Columns" },
                    { value: "4", label: "4 Columns" },
                  ],
                  defaultValue: "3",
                },
              ],
            },
          ],
        },
        {
          key: "fieldsLayout",
          label: "Fields Layout Settings",
          type: "object",
          fields: [
            {
              key: "columns",
              label: "Number of Columns",
              type: "select",
              options: [
                { value: "1", label: "1 Column" },
                { value: "2", label: "2 Columns" },
                { value: "3", label: "3 Columns" },
                { value: "4", label: "4 Columns" },
              ],
              defaultValue: "1",
            },
            {
              key: "gap",
              label: "Gap Between Fields",
              type: "text",
              defaultValue: "16px",
            },
            {
              key: "responsive",
              label: "Responsive Layout",
              type: "object",
              fields: [
                {
                  key: "mobile",
                  label: "Mobile Columns",
                  type: "select",
                  options: [
                    { value: "1", label: "1 Column" },
                    { value: "2", label: "2 Columns" },
                    { value: "3", label: "3 Columns" },
                  ],
                  defaultValue: "1",
                },
                {
                  key: "tablet",
                  label: "Tablet Columns",
                  type: "select",
                  options: [
                    { value: "1", label: "1 Column" },
                    { value: "2", label: "2 Columns" },
                    { value: "3", label: "3 Columns" },
                    { value: "4", label: "4 Columns" },
                  ],
                  defaultValue: "2",
                },
                {
                  key: "desktop",
                  label: "Desktop Columns",
                  type: "select",
                  options: [
                    { value: "1", label: "1 Column" },
                    { value: "2", label: "2 Columns" },
                    { value: "3", label: "3 Columns" },
                    { value: "4", label: "4 Columns" },
                  ],
                  defaultValue: "3",
                },
              ],
            },
          ],
        },
        {
          key: "cards",
          label: "Form Cards",
          type: "array",
          of: [
            {
              key: "id",
              label: "Card ID",
              type: "text",
            },
            {
              key: "title",
              label: "Card Title",
              type: "text",
            },
            {
              key: "description",
              label: "Card Description",
              type: "text",
            },
            {
              key: "icon",
              label: "Card Icon",
              type: "text",
            },
            {
              key: "color",
              label: "Card Color Theme",
              type: "select",
              options: [
                { value: "blue", label: "Blue" },
                { value: "green", label: "Green" },
                { value: "red", label: "Red" },
                { value: "yellow", label: "Yellow" },
                { value: "purple", label: "Purple" },
                { value: "pink", label: "Pink" },
                { value: "indigo", label: "Indigo" },
                { value: "teal", label: "Teal" },
                { value: "orange", label: "Orange" },
                { value: "cyan", label: "Cyan" },
                { value: "emerald", label: "Emerald" },
                { value: "violet", label: "Violet" },
                { value: "fuchsia", label: "Fuchsia" },
                { value: "rose", label: "Rose" },
                { value: "sky", label: "Sky" },
                { value: "lime", label: "Lime" },
                { value: "amber", label: "Amber" },
                { value: "slate", label: "Slate" },
                { value: "gray", label: "Gray" },
                { value: "zinc", label: "Zinc" },
                { value: "neutral", label: "Neutral" },
                { value: "stone", label: "Stone" },
              ],
            },
            {
              key: "customColors",
              label: "Custom Colors",
              type: "object",
              fields: [
                {
                  key: "primary",
                  label: "Primary Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Primary uses primary color
                },
                {
                  key: "secondary",
                  label: "Secondary Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "secondary", // Secondary uses secondary color
                },
                {
                  key: "hover",
                  label: "Hover Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Hover uses primary color
                },
                {
                  key: "shadow",
                  label: "Shadow Color",
                  type: "color",
                  useDefaultColor: false, // Shadow color is usually custom
                },
              ],
            },
            {
              key: "isCollapsible",
              label: "Collapsible",
              type: "boolean",
              defaultValue: false,
            },
            {
              key: "showAddButton",
              label: "Show Add Button",
              type: "boolean",
              defaultValue: false,
            },
            {
              key: "addButtonText",
              label: "Add Button Text",
              type: "text",
              defaultValue: "إضافة جديد",
            },
            {
              key: "fields",
              label: "Form Fields",
              type: "array",
              of: [
                {
                  key: "id",
                  label: "Field ID",
                  type: "text",
                },
                {
                  key: "type",
                  label: "Field Type",
                  type: "select",
                  options: [
                    { value: "text", label: "Text" },
                    { value: "email", label: "Email" },
                    { value: "password", label: "Password" },
                    { value: "number", label: "Number" },
                    { value: "date", label: "Date" },
                    { value: "select", label: "Select" },
                    { value: "textarea", label: "Textarea" },
                    { value: "currency", label: "Currency" },
                    { value: "radio", label: "Radio" },
                  ],
                },
                {
                  key: "label",
                  label: "Field Label",
                  type: "text",
                },
                {
                  key: "placeholder",
                  label: "Placeholder",
                  type: "text",
                },
                {
                  key: "required",
                  label: "Required",
                  type: "boolean",
                  defaultValue: false,
                },
                {
                  key: "description",
                  label: "Field Description",
                  type: "text",
                },
                {
                  key: "icon",
                  label: "Field Icon",
                  type: "text",
                },
                {
                  key: "options",
                  label: "Field Options (for Select/Radio)",
                  type: "array",
                  of: [
                    {
                      key: "value",
                      label: "Option Value",
                      type: "text",
                    },
                    {
                      key: "label",
                      label: "Option Label",
                      type: "text",
                    },
                  ],
                },
                {
                  key: "validation",
                  label: "Validation Rules",
                  type: "object",
                  fields: [
                    {
                      key: "min",
                      label: "Minimum Value",
                      type: "number",
                    },
                    {
                      key: "max",
                      label: "Maximum Value",
                      type: "number",
                    },
                    {
                      key: "pattern",
                      label: "Pattern (Regex)",
                      type: "text",
                    },
                    {
                      key: "message",
                      label: "Custom Error Message",
                      type: "text",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "submitButton.text", label: "Submit Button Text", type: "text" },
        {
          key: "cards",
          label: "Form Cards",
          type: "array",
          of: [
            {
              key: "id",
              label: "Card ID",
              type: "text",
            },
            {
              key: "title",
              label: "Card Title",
              type: "text",
            },
            {
              key: "description",
              label: "Card Description",
              type: "text",
            },
            {
              key: "icon",
              label: "Card Icon",
              type: "text",
            },
            {
              key: "color",
              label: "Card Color Theme",
              type: "select",
              options: [
                { value: "blue", label: "Blue" },
                { value: "green", label: "Green" },
                { value: "red", label: "Red" },
                { value: "yellow", label: "Yellow" },
                { value: "purple", label: "Purple" },
                { value: "pink", label: "Pink" },
                { value: "indigo", label: "Indigo" },
                { value: "teal", label: "Teal" },
                { value: "orange", label: "Orange" },
                { value: "cyan", label: "Cyan" },
                { value: "emerald", label: "Emerald" },
                { value: "violet", label: "Violet" },
                { value: "fuchsia", label: "Fuchsia" },
                { value: "rose", label: "Rose" },
                { value: "sky", label: "Sky" },
                { value: "lime", label: "Lime" },
                { value: "amber", label: "Amber" },
                { value: "slate", label: "Slate" },
                { value: "gray", label: "Gray" },
                { value: "zinc", label: "Zinc" },
                { value: "neutral", label: "Neutral" },
                { value: "stone", label: "Stone" },
              ],
            },
            {
              key: "customColors",
              label: "Custom Colors",
              type: "object",
              fields: [
                {
                  key: "primary",
                  label: "Primary Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Primary uses primary color
                },
                {
                  key: "secondary",
                  label: "Secondary Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "secondary", // Secondary uses secondary color
                },
                {
                  key: "hover",
                  label: "Hover Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Hover uses primary color
                },
                {
                  key: "shadow",
                  label: "Shadow Color",
                  type: "color",
                  useDefaultColor: false, // Shadow color is usually custom
                },
              ],
            },
            {
              key: "isCollapsible",
              label: "Collapsible",
              type: "boolean",
              defaultValue: false,
            },
            {
              key: "showAddButton",
              label: "Show Add Button",
              type: "boolean",
              defaultValue: false,
            },
            {
              key: "addButtonText",
              label: "Add Button Text",
              type: "text",
              defaultValue: "إضافة جديد",
            },
            {
              key: "fields",
              label: "Form Fields",
              type: "array",
              of: [
                {
                  key: "id",
                  label: "Field ID",
                  type: "text",
                },
                {
                  key: "type",
                  label: "Field Type",
                  type: "select",
                  options: [
                    { value: "text", label: "Text" },
                    { value: "email", label: "Email" },
                    { value: "password", label: "Password" },
                    { value: "number", label: "Number" },
                    { value: "date", label: "Date" },
                    { value: "select", label: "Select" },
                    { value: "textarea", label: "Textarea" },
                    { value: "currency", label: "Currency" },
                    { value: "radio", label: "Radio" },
                  ],
                },
                {
                  key: "label",
                  label: "Field Label",
                  type: "text",
                },
                {
                  key: "placeholder",
                  label: "Placeholder",
                  type: "text",
                },
                {
                  key: "required",
                  label: "Required",
                  type: "boolean",
                  defaultValue: false,
                },
                {
                  key: "description",
                  label: "Field Description",
                  type: "text",
                },
                {
                  key: "icon",
                  label: "Field Icon",
                  type: "text",
                },
                {
                  key: "options",
                  label: "Field Options (for Select/Radio)",
                  type: "array",
                  of: [
                    {
                      key: "value",
                      label: "Option Value",
                      type: "text",
                    },
                    {
                      key: "label",
                      label: "Option Label",
                      type: "text",
                    },
                  ],
                },
                {
                  key: "validation",
                  label: "Validation Rules",
                  type: "object",
                  fields: [
                    {
                      key: "min",
                      label: "Minimum Value",
                      type: "number",
                    },
                    {
                      key: "max",
                      label: "Maximum Value",
                      type: "number",
                    },
                    {
                      key: "pattern",
                      label: "Pattern (Regex)",
                      type: "text",
                    },
                    {
                      key: "message",
                      label: "Custom Error Message",
                      type: "text",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
