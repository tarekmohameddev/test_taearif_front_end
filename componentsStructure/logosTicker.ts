import { ComponentStructure } from "./types";

export const logosTickerStructure: ComponentStructure = {
  componentType: "logosTicker",
  variants: [
    {
      id: "logosTicker1",
      name: "Logos Ticker 1 - Scrolling Brands",
      fields: [
        // ═══════════════════════════════════════════════════════════
        // BASIC FIELDS
        // ═══════════════════════════════════════════════════════════
        {
          key: "visible",
          label: "Visible",
          type: "boolean",
        },

        // ═══════════════════════════════════════════════════════════
        // LAYOUT CONFIGURATION
        // ═══════════════════════════════════════════════════════════
        {
          key: "layout",
          label: "Layout",
          type: "object",
          fields: [
            {
              key: "maxWidth",
              label: "Max Width",
              type: "number",
              placeholder: "1600",
              unit: "px",
            },
            {
              key: "padding",
              label: "Section Padding",
              type: "object",
              fields: [
                { key: "top", label: "Top Padding", type: "number", placeholder: "64", unit: "px" },
                { key: "bottom", label: "Bottom Padding", type: "number", placeholder: "64", unit: "px" },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // CONTENT
        // ═══════════════════════════════════════════════════════════
        {
          key: "content",
          label: "Content",
          type: "object",
          fields: [
            {
              key: "title",
              label: "Section Title",
              type: "text",
              placeholder: "موثوق بنا من قبل الفرق الطموحة التي تبني المستقبل",
            },
            {
              key: "subtitle",
              label: "Section Subtitle",
              type: "text",
              placeholder: "من الشركات الناشئة إلى الشركات الكبرى...",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // LOGOS ARRAY - Dynamic Images
        // ═══════════════════════════════════════════════════════════
        {
          key: "logos",
          label: "Logos",
          type: "array",
          addLabel: "Add Logo",
          itemLabel: "Logo",
          of: [
            {
              key: "id",
              label: "Logo ID",
              type: "text",
              placeholder: "1",
            },
            {
              key: "src",
              label: "Logo Image",
              type: "image",
            },
            {
              key: "alt",
              label: "Alt Text",
              type: "text",
              placeholder: "Client Logo",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // DISPLAY MODE
        // ═══════════════════════════════════════════════════════════
        {
          key: "displayMode",
          label: "Display Mode",
          type: "select",
          options: [
            { value: "both", label: "Both (Forward & Reverse)" },
            { value: "forward", label: "Forward Only" },
            { value: "reverse", label: "Reverse Only" },
          ],
          defaultValue: "both",
        },

        // ═══════════════════════════════════════════════════════════
        // ANIMATION SETTINGS
        // ═══════════════════════════════════════════════════════════
        {
          key: "animation",
          label: "Animation",
          type: "object",
          fields: [
            {
              key: "speed",
              label: "Animation Speed (seconds)",
              type: "number",
              placeholder: "40",
            },
            {
              key: "pauseOnHover",
              label: "Pause on Hover",
              type: "boolean",
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
              key: "backgroundColor",
              label: "Background Color",
              type: "color",
            },
            {
              key: "titleColor",
              label: "Title Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "primary", // Title color uses primary color from branding
            },
            {
              key: "subtitleColor",
              label: "Subtitle Color",
              type: "color",
            },
            {
              key: "logoOpacity",
              label: "Logo Opacity",
              type: "number",
              placeholder: "0.6",
            },
            {
              key: "logoHoverOpacity",
              label: "Logo Hover Opacity",
              type: "number",
              placeholder: "1.0",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TYPOGRAPHY
        // ═══════════════════════════════════════════════════════════
        {
          key: "typography",
          label: "Typography",
          type: "object",
          fields: [
            {
              key: "title",
              label: "Title Typography",
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
                      type: "text",
                      placeholder: "xl",
                    },
                    {
                      key: "tablet",
                      label: "Tablet",
                      type: "text",
                      placeholder: "2xl",
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "text",
                      placeholder: "3xl",
                    },
                  ],
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "bold",
                },
                {
                  key: "fontFamily",
                  label: "Font Family",
                  type: "text",
                  placeholder: "Tajawal",
                },
              ],
            },
            {
              key: "subtitle",
              label: "Subtitle Typography",
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
                      type: "text",
                      placeholder: "sm",
                    },
                    {
                      key: "tablet",
                      label: "Tablet",
                      type: "text",
                      placeholder: "base",
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "text",
                      placeholder: "lg",
                    },
                  ],
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "normal",
                },
                {
                  key: "fontFamily",
                  label: "Font Family",
                  type: "text",
                  placeholder: "Tajawal",
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
        { key: "content.title", label: "Title", type: "text" },
        { key: "content.subtitle", label: "Subtitle", type: "text" },
        {
          key: "logos",
          label: "Logos",
          type: "array",
          addLabel: "Add Logo",
          itemLabel: "Logo",
          of: [
            {
              key: "id",
              label: "Logo ID",
              type: "text",
              placeholder: "1",
            },
            {
              key: "src",
              label: "Logo Image",
              type: "image",
            },
            {
              key: "alt",
              label: "Alt Text",
              type: "text",
              placeholder: "Client Logo",
            },
          ],
        },
        {
          key: "displayMode",
          label: "Display Mode",
          type: "select",
          options: [
            { value: "both", label: "Both (Forward & Reverse)" },
            { value: "forward", label: "Forward Only" },
            { value: "reverse", label: "Reverse Only" },
          ],
          defaultValue: "both",
        },
      ],
    },
  ],
};
