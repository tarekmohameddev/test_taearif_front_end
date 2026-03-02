import { ComponentStructure } from "./types";

export const partnersStructure: ComponentStructure = {
  componentType: "partners",
  variants: [
    {
      id: "partners1",
      name: "Partners 1 - Trusted Partners Grid",
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
                { key: "top", label: "Top Padding", type: "number", placeholder: "80", unit: "px" },
                { key: "bottom", label: "Bottom Padding", type: "number", placeholder: "80", unit: "px" },
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
              placeholder: "موثوق من خبراء العقار. في جميع أنحاء المملكة.",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // PARTNERS ARRAY - Dynamic Images
        // ═══════════════════════════════════════════════════════════
        {
          key: "partners",
          label: "Partners",
          type: "array",
          addLabel: "Add Partner",
          itemLabel: "Partner",
          of: [
            {
              key: "src",
              label: "Partner Logo",
              type: "image",
            },
            {
              key: "alt",
              label: "Alt Text",
              type: "text",
              placeholder: "Partner Logo",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // GRID CONFIGURATION
        // ═══════════════════════════════════════════════════════════
        {
          key: "grid",
          label: "Grid Settings",
          type: "object",
          fields: [
            {
              key: "columns",
              label: "Grid Columns",
              type: "object",
              fields: [
                {
                  key: "mobile",
                  label: "Mobile Columns",
                  type: "number",
                  placeholder: "2",
                },
                {
                  key: "tablet",
                  label: "Tablet Columns",
                  type: "number",
                  placeholder: "3",
                },
                {
                  key: "desktop",
                  label: "Desktop Columns",
                  type: "number",
                  placeholder: "6",
                },
              ],
            },
            {
              key: "gap",
              label: "Gap Between Cards",
              type: "text",
              placeholder: "2rem",
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
              defaultValue: "transparent",
            },
            {
              key: "titleColor",
              label: "Title Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "primary", // Title color uses primary color from branding
            },
            {
              key: "descriptionColor",
              label: "Description Color",
              type: "color",
            },
            {
              key: "cardBackgroundColor",
              label: "Card Background Color",
              type: "color",
            },
            {
              key: "cardHoverBackgroundColor",
              label: "Card Hover Background Color",
              type: "color",
            },
            {
              key: "logoOpacity",
              label: "Logo Opacity",
              type: "number",
              placeholder: "0.7",
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
                      placeholder: "2xl",
                    },
                    {
                      key: "tablet",
                      label: "Tablet",
                      type: "text",
                      placeholder: "4xl",
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "text",
                      placeholder: "6xl",
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
                {
                  key: "lineHeight",
                  label: "Line Height",
                  type: "text",
                  placeholder: "tight",
                },
              ],
            },
            {
              key: "description",
              label: "Description Typography",
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
                      placeholder: "base",
                    },
                    {
                      key: "tablet",
                      label: "Tablet",
                      type: "text",
                      placeholder: "lg",
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "text",
                      placeholder: "xl",
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
                {
                  key: "lineHeight",
                  label: "Line Height",
                  type: "text",
                  placeholder: "relaxed",
                },
              ],
            },
          ],
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
              placeholder: "1000",
            },
            {
              key: "threshold",
              label: "Intersection Threshold",
              type: "number",
              placeholder: "0.1",
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
        {
          key: "partners",
          label: "Partners",
          type: "array",
          addLabel: "Add Partner",
          itemLabel: "Partner",
          of: [
            {
              key: "src",
              label: "Partner Logo",
              type: "image",
            },
            {
              key: "alt",
              label: "Alt Text",
              type: "text",
              placeholder: "Partner Logo",
            },
          ],
        },
      ],
    },
    {
      id: "partners2",
      name: "Partners 2 - Slider/Carousel",
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
                { key: "top", label: "Top Padding", type: "number", placeholder: "80", unit: "px" },
                { key: "bottom", label: "Bottom Padding", type: "number", placeholder: "80", unit: "px" },
              ],
            },
            {
              key: "columns",
              label: "Grid Columns",
              type: "number",
              placeholder: "4",
            },
            {
              key: "rows",
              label: "Grid Rows",
              type: "number",
              placeholder: "4",
            },
            {
              key: "gap",
              label: "Gap",
              type: "number",
              placeholder: "32",
              unit: "px",
            },
            {
              key: "cardsPerSlide",
              label: "Cards Per Slide",
              type: "number",
              placeholder: "16",
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
              placeholder: "عملاءنا",
            },
            {
              key: "subtitle",
              label: "Subtitle",
              type: "text",
              placeholder: "تنال خدماتنا ثقة الـمؤسسات...",
            },
            {
              key: "badge",
              label: "Badge Text",
              type: "text",
              placeholder: "— عملاءنا —",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // PARTNERS ARRAY - Dynamic Images
        // ═══════════════════════════════════════════════════════════
        {
          key: "partners",
          label: "Partners",
          type: "array",
          addLabel: "Add Partner",
          itemLabel: "Partner",
          of: [
            {
              key: "src",
              label: "Partner Logo",
              type: "image",
            },
            {
              key: "alt",
              label: "Alt Text",
              type: "text",
              placeholder: "Partner Logo",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // SETTINGS
        // ═══════════════════════════════════════════════════════════
        {
          key: "settings",
          label: "Slider Settings",
          type: "object",
          fields: [
            {
              key: "autoplay",
              label: "Autoplay",
              type: "boolean",
            },
            {
              key: "intervalMs",
              label: "Interval (ms)",
              type: "number",
              placeholder: "5000",
            },
            {
              key: "showBadge",
              label: "Show Badge",
              type: "boolean",
            },
            {
              key: "animation",
              label: "Enable Animation",
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
              defaultValue: "transparent",
            },
            {
              key: "titleColor",
              label: "Title Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "primary",
            },
            {
              key: "subtitleColor",
              label: "Subtitle Color",
              type: "color",
            },
            {
              key: "badgeColor",
              label: "Badge Color",
              type: "color",
            },
            {
              key: "paginationActive",
              label: "Pagination Active Color",
              type: "color",
            },
            {
              key: "paginationInactive",
              label: "Pagination Inactive Color",
              type: "color",
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
                      placeholder: "2xl",
                    },
                    {
                      key: "tablet",
                      label: "Tablet",
                      type: "text",
                      placeholder: "3xl",
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
                {
                  key: "lineHeight",
                  label: "Line Height",
                  type: "text",
                  placeholder: "tight",
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
                      placeholder: "base",
                    },
                    {
                      key: "tablet",
                      label: "Tablet",
                      type: "text",
                      placeholder: "lg",
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
                {
                  key: "lineHeight",
                  label: "Line Height",
                  type: "text",
                  placeholder: "relaxed",
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
        { key: "content.badge", label: "Badge", type: "text" },
        {
          key: "partners",
          label: "Partners",
          type: "array",
          addLabel: "Add Partner",
          itemLabel: "Partner",
          of: [
            {
              key: "src",
              label: "Partner Logo",
              type: "image",
            },
            {
              key: "alt",
              label: "Alt Text",
              type: "text",
              placeholder: "Partner Logo",
            },
          ],
        },
      ],
    },
  ],
};
