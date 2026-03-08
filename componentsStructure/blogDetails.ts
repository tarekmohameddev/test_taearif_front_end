import { ComponentStructure } from "./types";

export const blogDetailsStructure: ComponentStructure = {
  componentType: "blogDetails",
  variants: [
    {
      id: "blogDetails1",
      name: "Blog Details 1 - Two Column Layout",
      fields: [
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
              placeholder: "1280",
              unit: "px",
            },
            {
              key: "padding",
              label: "Section Padding",
              type: "object",
              fields: [
                { key: "top", label: "Top Padding", type: "number", placeholder: "0", unit: "px" },
                { key: "bottom", label: "Bottom Padding", type: "number", placeholder: "48", unit: "px" },
              ],
            },
            {
              key: "gap",
              label: "Gap Between Sections",
              type: "number",
              placeholder: "32",
              unit: "px",
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
              key: "primaryColor",
              label: "Primary Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "primary",
            },
            {
              key: "textColor",
              label: "Text Color",
              type: "color",
            },
            {
              key: "secondaryTextColor",
              label: "Secondary Text Color",
              type: "color",
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
              key: "descriptionTitle",
              label: "Description Title",
              type: "text",
              placeholder: "محتوى المقال",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // DISPLAY SETTINGS
        // ═══════════════════════════════════════════════════════════
        {
          key: "displaySettings",
          label: "Display Settings",
          type: "object",
          fields: [
            {
              key: "showDescription",
              label: "Show Description",
              type: "boolean",
            },
            {
              key: "showAuthor",
              label: "Show Author",
              type: "boolean",
            },
            {
              key: "showCategories",
              label: "Show Categories",
              type: "boolean",
            },
            {
              key: "showPublishedDate",
              label: "Show Published Date",
              type: "boolean",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // GALLERY SETTINGS
        // ═══════════════════════════════════════════════════════════
        {
          key: "gallery",
          label: "Gallery",
          type: "object",
          fields: [
            {
              key: "showThumbnails",
              label: "Show Thumbnails",
              type: "boolean",
            },
            {
              key: "thumbnailGridColumns",
              label: "Thumbnail Grid Columns",
              type: "number",
              placeholder: "4",
            },
            {
              key: "thumbnailHeight",
              label: "Thumbnail Height",
              type: "number",
              placeholder: "200",
              unit: "px",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // WHATSAPP SETTINGS
        // ═══════════════════════════════════════════════════════════
        {
          key: "whatsApp",
          label: "WhatsApp Settings",
          type: "object",
          fields: [
            {
              key: "showButton",
              label: "Show WhatsApp Button",
              type: "boolean",
            },
            {
              key: "buttonText",
              label: "WhatsApp Button Text",
              type: "text",
              placeholder: "استفسار عن طريق الواتساب",
            },
            {
              key: "phoneNumber",
              label: "WhatsApp Phone Number",
              type: "text",
              placeholder: "966501234567",
            },
          ],
        },
      ],

      // ═══════════════════════════════════════════════════════════
      // SIMPLE FIELDS - For basic/simple editing mode
      // ═══════════════════════════════════════════════════════════
      simpleFields: [
        {
          key: "content.descriptionTitle",
          label: "Description Title",
          type: "text",
        },
        { key: "styling.primaryColor", label: "Primary Color", type: "color" },
        {
          key: "whatsApp",
          label: "WhatsApp Settings",
          type: "object",
          fields: [
            {
              key: "showButton",
              label: "Show WhatsApp Button",
              type: "boolean",
            },
            {
              key: "buttonText",
              label: "WhatsApp Button Text",
              type: "text",
              placeholder: "استفسار عن طريق الواتساب",
            },
            {
              key: "phoneNumber",
              label: "WhatsApp Phone Number",
              type: "text",
              placeholder: "966501234567",
            },
          ],
        },
      ],
    },
    {
      id: "blogDetails2",
      name: "Blog Details 2 - Hero Layout",
      fields: [
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
              placeholder: "1280",
              unit: "px",
            },
            {
              key: "padding",
              label: "Section Padding",
              type: "object",
              fields: [
                { key: "top", label: "Top Padding", type: "number", placeholder: "0", unit: "px" },
                { key: "bottom", label: "Bottom Padding", type: "number", placeholder: "48", unit: "px" },
              ],
            },
            {
              key: "gap",
              label: "Gap Between Sections",
              type: "number",
              placeholder: "32",
              unit: "px",
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
              key: "primaryColor",
              label: "Primary Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "primary",
            },
            {
              key: "textAndFormColors",
              label: "Text & Form Colors",
              type: "object",
              displayAsGroup: true,
              groupFields: [
                {
                  key: "styling.textColor",
                  label: "Text Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary",
                },
                { key: "styling.secondaryTextColor", label: "Secondary Text Color", type: "color" },
                { key: "styling.formBackgroundColor", label: "Form Background Color", type: "color" },
                { key: "styling.formTextColor", label: "Form Text Color", type: "color" },
                { key: "styling.formButtonBackgroundColor", label: "Form Button Background Color", type: "color" },
                { key: "styling.formButtonTextColor", label: "Form Button Text Color", type: "color" },
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
              key: "descriptionTitle",
              label: "Description Title",
              type: "text",
              placeholder: "وصف المقال",
            },
            {
              key: "specsTitle",
              label: "Specs Title",
              type: "text",
              placeholder: "معلومات المقال",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // DISPLAY SETTINGS
        // ═══════════════════════════════════════════════════════════
        {
          key: "displaySettings",
          label: "Display Settings",
          type: "object",
          fields: [
            {
              key: "showDescription",
              label: "Show Description",
              type: "boolean",
            },
            {
              key: "showSpecs",
              label: "Show Specs",
              type: "boolean",
            },
            {
              key: "showVideoUrl",
              label: "Show Video",
              type: "boolean",
            },
            {
              key: "showMap",
              label: "Show Map",
              type: "boolean",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // HERO SETTINGS
        // ═══════════════════════════════════════════════════════════
        {
          key: "hero",
          label: "Hero Section",
          type: "object",
          fields: [
            {
              key: "height",
              label: "Hero Height",
              type: "number",
              placeholder: "500",
              unit: "px",
            },
            {
              key: "background",
              label: "Background",
              type: "object",
              fields: [
                {
                  key: "type",
                  label: "Background Type",
                  type: "badge-select",
                  options: [
                    {
                      label: "components_structure.basic.hero_background_color_only",
                      value: "colorOnly",
                    },
                    {
                      label: "components_structure.basic.hero_background_image_and_color",
                      value: "imageAndColor",
                    },
                    {
                      label: "components_structure.basic.hero_background_image_only",
                      value: "imageOnly",
                    },
                  ],
                  badgeConfig: {
                    mode: "single",
                    requiredAtLeastOne: true,
                    allowUnset: false,
                  },
                },
                {
                  key: "image",
                  label: "Background Image",
                  type: "image",
                  condition: { field: "type", value: "imageOnly" },
                },
                {
                  key: "image",
                  label: "Background Image",
                  type: "image",
                  condition: { field: "type", value: "imageAndColor" },
                },
                {
                  key: "color",
                  label: "Background Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary",
                  condition: { field: "type", value: "colorOnly" },
                },
                {
                  key: "overlay",
                  label: "Overlay",
                  type: "object",
                  condition: { field: "type", value: "imageAndColor" },
                  fields: [
                    {
                      key: "color",
                      label: "Overlay Color",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "primary",
                    },
                    {
                      key: "opacity",
                      label: "Overlay Opacity",
                      type: "number",
                      placeholder: "0.8",
                      min: 0,
                      max: 1,
                      step: 0.1,
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // GALLERY SETTINGS
        // ═══════════════════════════════════════════════════════════
        {
          key: "gallery",
          label: "Gallery",
          type: "object",
          fields: [
            {
              key: "showThumbnails",
              label: "Show Thumbnails",
              type: "boolean",
            },
            {
              key: "thumbnailGridColumns",
              label: "Thumbnail Grid Columns",
              type: "number",
              placeholder: "4",
            },
            {
              key: "thumbnailHeight",
              label: "Thumbnail Height",
              type: "number",
              placeholder: "200",
              unit: "px",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // WHATSAPP SETTINGS
        // ═══════════════════════════════════════════════════════════
        {
          key: "whatsApp",
          label: "WhatsApp Settings",
          type: "object",
          fields: [
            {
              key: "showButton",
              label: "Show WhatsApp Button",
              type: "boolean",
            },
            {
              key: "buttonText",
              label: "WhatsApp Button Text",
              type: "text",
              placeholder: "استفسار عن طريق الواتساب",
            },
            {
              key: "phoneNumber",
              label: "WhatsApp Phone Number",
              type: "text",
              placeholder: "966501234567",
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
                      type: "number",
                      unit: "px",
                      defaultValue: 24,
                    },
                    {
                      key: "tablet",
                      label: "Tablet",
                      type: "number",
                      unit: "px",
                      defaultValue: 30,
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "number",
                      unit: "px",
                      defaultValue: 36,
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
                      type: "number",
                      unit: "px",
                      defaultValue: 16,
                    },
                    {
                      key: "tablet",
                      label: "Tablet",
                      type: "number",
                      unit: "px",
                      defaultValue: 18,
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "number",
                      unit: "px",
                      defaultValue: 20,
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
        {
          key: "content.descriptionTitle",
          label: "Description Title",
          type: "text",
        },
        { key: "content.specsTitle", label: "Specs Title", type: "text" },
        { key: "styling.primaryColor", label: "Primary Color", type: "color" },
        {
          key: "whatsApp",
          label: "WhatsApp Settings",
          type: "object",
          fields: [
            {
              key: "showButton",
              label: "Show WhatsApp Button",
              type: "boolean",
            },
            {
              key: "buttonText",
              label: "WhatsApp Button Text",
              type: "text",
              placeholder: "استفسار عن طريق الواتساب",
            },
            {
              key: "phoneNumber",
              label: "WhatsApp Phone Number",
              type: "text",
              placeholder: "966501234567",
            },
          ],
        },
      ],
    },
  ],
};
