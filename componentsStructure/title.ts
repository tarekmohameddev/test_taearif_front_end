import { ComponentStructure } from "./types";

export const titleStructure: ComponentStructure = {
  componentType: "title",
  variants: [
    {
      id: "title1",
      name: "Title 1 - Centered Heading",
      fields: [
        // Visibility
        {
          key: "visible",
          label: "Visible",
          type: "boolean",
        },

        // Content
        {
          key: "content",
          label: "Content",
          type: "object",
          fields: [
            {
              key: "title",
              label: "Title Text",
              type: "text",
              placeholder: "Page Title",
            },
          ],
        },

        // Styling
        {
          key: "styling",
          label: "Styling",
          type: "object",
          fields: [
            {
              key: "textAlign",
              label: "Text Align",
              type: "select",
              options: [
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
              ],
            },
            {
              key: "color",
              label: "Text Color",
              type: "color",
            },
            {
              key: "backgroundColor",
              label: "Background Color",
              type: "color",
            },
          ],
        },

        // Typography
        {
          key: "typography",
          label: "Typography",
          type: "object",
          fields: [
            {
              key: "fontSize",
              label: "Font Size",
              type: "object",
              fields: [
                {
                  key: "mobile",
                  label: "Mobile",
                  type: "number",
                  unit: "px",
                  defaultValue: 24,
                },
                {
                  key: "tablet",
                  label: "Tablet",
                  type: "number",
                  unit: "px",
                  defaultValue: 32,
                },
                {
                  key: "desktop",
                  label: "Desktop",
                  type: "number",
                  unit: "px",
                  defaultValue: 40,
                },
              ],
            },
            {
              key: "fontWeight",
              label: "Font Weight",
              type: "text",
              placeholder: "700",
            },
            {
              key: "fontFamily",
              label: "Font Family",
              type: "text",
              placeholder: "Tajawal",
            },
            {
              key: "lineHeight",
              label: "Line Height",
              type: "text",
              placeholder: "1.2",
            },
            {
              key: "letterSpacing",
              label: "Letter Spacing",
              type: "text",
              placeholder: "0px",
            },
          ],
        },

        // Spacing
        {
          key: "spacing",
          label: "Spacing",
          type: "object",
          fields: [
            {
              key: "padding",
              label: "Padding",
              type: "object",
              fields: [
                { key: "top", label: "Padding Top", type: "number", placeholder: "24", unit: "px" },
                { key: "bottom", label: "Padding Bottom", type: "number", placeholder: "24", unit: "px" },
                { key: "left", label: "Padding Left", type: "number", placeholder: "0", unit: "px" },
                { key: "right", label: "Padding Right", type: "number", placeholder: "0", unit: "px" },
              ],
            },
          ],
        },

        // Animations
        {
          key: "animations",
          label: "Animations",
          type: "object",
          fields: [
            {
              key: "enabled",
              label: "Enable Animation",
              type: "boolean",
            },
            {
              key: "type",
              label: "Animation Type",
              type: "text",
              placeholder: "fade-up",
            },
            {
              key: "duration",
              label: "Duration (ms)",
              type: "number",
              placeholder: "600",
            },
            {
              key: "delay",
              label: "Delay (ms)",
              type: "number",
              placeholder: "0",
            },
          ],
        },
      ],

      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "content.title", label: "Title Text", type: "text" },
        { key: "styling.textAlign", label: "Text Align", type: "select" },
      ],
    },
  ],
};


















