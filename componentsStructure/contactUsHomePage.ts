import { ComponentStructure } from "./types";

export const contactUsHomePageStructure: ComponentStructure = {
  componentType: "contactUsHomePage",
  variants: [
    {
      id: "contactUsHomePage1",
      name: "Contact Us Home Page 1 - Form with Background",
      fields: [
        // ═══════════════════════════════════════════════════════════
        // BASIC FIELDS
        // ═══════════════════════════════════════════════════════════
        {
          key: "visible",
          label: "Visible",
          type: "boolean",
        }, // ═══════════════════════════════════════════════════════════
        // BACKGROUND CONFIGURATION
        // ═══════════════════════════════════════════════════════════
        {
          key: "background",
          label: "Background",
          type: "object",
          fields: [
            {
              key: "image",
              label: "Background Image",
              type: "image",
              placeholder: "https://example.com/image.jpg",
            },
            {
              key: "alt",
              label: "Alt Text",
              type: "text",
              placeholder: "خلفية",
            },
            {
              key: "overlay",
              label: "الطبقة البنية (Overlay)",
              type: "object",
              fields: [
                {
                  key: "enabled",
                  label: "تفعيل الطبقة",
                  type: "boolean",
                },
                {
                  key: "color",
                  label: "لون الطبقة البنية",
                  type: "color",
                  placeholder: "rgb(139, 95, 70)",
                },
                {
                  key: "opacity",
                  label: "نسبة الشفافية (0-1)",
                  type: "number",
                  placeholder: "0.8",
                  min: 0,
                  max: 1,
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // HEADER TEXT
        // ═══════════════════════════════════════════════════════════
        {
          key: "header",
          label: "Header Text",
          type: "object",
          fields: [
            {
              key: "text",
              label: "Header Text",
              type: "textarea",
              placeholder: "سنعثر لك على مستأجر موثوق...",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // FORM CONFIGURATION
        // ═══════════════════════════════════════════════════════════
        {
          key: "form",
          label: "Form Configuration",
          type: "object",
          fields: [
            {
              key: "submitButton",
              label: "Submit Button",
              type: "object",
              fields: [
                {
                  key: "text",
                  label: "Button Text",
                  type: "text",
                  placeholder: "اشترك الآن",
                },
                {
                  key: "loadingText",
                  label: "Loading Text",
                  type: "text",
                  placeholder: "جاري الإرسال...",
                },
                {
                  key: "backgroundColor",
                  label: "Background Color",
                  type: "color",
                  placeholder: "#c9a882",
                },
                {
                  key: "hoverColor",
                  label: "Hover Color",
                  type: "color",
                  placeholder: "#b8966f",
                },
                {
                  key: "textColor",
                  label: "Text Color",
                  type: "color",
                  placeholder: "#ffffff",
                },
              ],
            },
            {
              key: "fields",
              label: "Form Fields",
              type: "object",
              fields: [
                {
                  key: "fullName",
                  label: "Full Name Field",
                  type: "object",
                  fields: [
                    { key: "label", label: "Label", type: "text" },
                    { key: "placeholder", label: "Placeholder", type: "text" },
                    { key: "required", label: "Required", type: "boolean" },
                    { key: "type", label: "Type", type: "text" },
                  ],
                },
                {
                  key: "whatsappNumber",
                  label: "WhatsApp Number Field",
                  type: "object",
                  fields: [
                    { key: "label", label: "Label", type: "text" },
                    { key: "placeholder", label: "Placeholder", type: "text" },
                    { key: "required", label: "Required", type: "boolean" },
                    { key: "type", label: "Type", type: "text" },
                  ],
                },
                {
                  key: "email",
                  label: "Email Field",
                  type: "object",
                  fields: [
                    { key: "label", label: "Label", type: "text" },
                    { key: "placeholder", label: "Placeholder", type: "text" },
                    { key: "required", label: "Required", type: "boolean" },
                    { key: "type", label: "Type", type: "text" },
                  ],
                },
                {
                  key: "paymentMethod",
                  label: "Payment Method Field",
                  type: "object",
                  fields: [
                    { key: "label", label: "Label", type: "text" },
                    { key: "placeholder", label: "Placeholder", type: "text" },
                    { key: "required", label: "Required", type: "boolean" },
                    { key: "type", label: "Type", type: "text" },
                    {
                      key: "options",
                      label: "Options",
                      type: "array",
                      addLabel: "Add Option",
                      itemLabel: "Option",
                      of: [
                        { key: "value", label: "Value", type: "text" },
                        { key: "label", label: "Label", type: "text" },
                      ],
                    },
                  ],
                },
                {
                  key: "city",
                  label: "City Field",
                  type: "object",
                  fields: [
                    { key: "label", label: "Label", type: "text" },
                    { key: "placeholder", label: "Placeholder", type: "text" },
                    { key: "required", label: "Required", type: "boolean" },
                    { key: "type", label: "Type", type: "text" },
                    {
                      key: "options",
                      label: "Options",
                      type: "array",
                      addLabel: "Add Option",
                      itemLabel: "Option",
                      of: [
                        { key: "value", label: "Value", type: "text" },
                        { key: "label", label: "Label", type: "text" },
                      ],
                    },
                  ],
                },
                {
                  key: "unitType",
                  label: "Unit Type Field",
                  type: "object",
                  fields: [
                    { key: "label", label: "Label", type: "text" },
                    { key: "placeholder", label: "Placeholder", type: "text" },
                    { key: "required", label: "Required", type: "boolean" },
                    { key: "type", label: "Type", type: "text" },
                    {
                      key: "options",
                      label: "Options",
                      type: "array",
                      addLabel: "Add Option",
                      itemLabel: "Option",
                      of: [
                        { key: "value", label: "Value", type: "text" },
                        { key: "label", label: "Label", type: "text" },
                      ],
                    },
                  ],
                },
                {
                  key: "budget",
                  label: "Budget Field",
                  type: "object",
                  fields: [
                    { key: "label", label: "Label", type: "text" },
                    { key: "placeholder", label: "Placeholder", type: "text" },
                    { key: "required", label: "Required", type: "boolean" },
                    { key: "type", label: "Type", type: "text" },
                  ],
                },
                {
                  key: "message",
                  label: "Message Field",
                  type: "object",
                  fields: [
                    { key: "label", label: "Label", type: "text" },
                    { key: "placeholder", label: "Placeholder", type: "text" },
                    { key: "required", label: "Required", type: "boolean" },
                    { key: "type", label: "Type", type: "text" },
                    { key: "rows", label: "Rows", type: "number" },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // STYLING
        // ═══════════════════════════════════════════════════════════
        {
          key: "styling",
          label: "Styling",
          type: "object",
          fields: [
            {
              key: "inputBackground",
              label: "Input Background Color",
              type: "color",
              placeholder: "#f5f0e8",
            },
            {
              key: "inputBorder",
              label: "Input Border Color",
              type: "color",
              placeholder: "#c4b5a0",
            },
            {
              key: "inputText",
              label: "Input Text Color",
              type: "color",
              placeholder: "#ffffff",
            },
            {
              key: "inputPlaceholder",
              label: "Input Placeholder Color",
              type: "color",
              placeholder: "#8b7a6a",
            },
            {
              key: "inputFocus",
              label: "Input Focus Color",
              type: "color",
              placeholder: "#8b5f46",
            },
            {
              key: "labelColor",
              label: "Label Color",
              type: "color",
              placeholder: "#ffffff",
            },
            {
              key: "errorColor",
              label: "Error Color",
              type: "color",
              placeholder: "#ef4444",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // LAYOUT
        // ═══════════════════════════════════════════════════════════
        {
          key: "layout",
          label: "Layout",
          type: "object",
          fields: [
            {
              key: "maxWidth",
              label: "Max Width",
              type: "text",
              placeholder: "4xl",
            },
            {
              key: "padding",
              label: "Padding",
              type: "object",
              fields: [
                {
                  key: "mobile",
                  label: "Mobile Padding",
                  type: "text",
                  placeholder: "1rem",
                },
                {
                  key: "tablet",
                  label: "Tablet Padding",
                  type: "text",
                  placeholder: "2rem",
                },
                {
                  key: "desktop",
                  label: "Desktop Padding",
                  type: "text",
                  placeholder: "3rem",
                },
              ],
            },
            {
              key: "gap",
              label: "Gap",
              type: "object",
              fields: [
                {
                  key: "mobile",
                  label: "Mobile Gap",
                  type: "text",
                  placeholder: "1rem",
                },
                {
                  key: "tablet",
                  label: "Tablet Gap",
                  type: "text",
                  placeholder: "1.5rem",
                },
                {
                  key: "desktop",
                  label: "Desktop Gap",
                  type: "text",
                  placeholder: "1.5rem",
                },
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
        { key: "header.text", label: "Header Text", type: "textarea" },
        {
          key: "form.submitButton.text",
          label: "Submit Button Text",
          type: "text",
        },
        { key: "background.image", label: "Background Image", type: "image" },
      ],
    },
  ],
};
