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
              type: "text",
              placeholder: "1280px",
            },
            {
              key: "padding",
              label: "Section Padding",
              type: "object",
              fields: [
                {
                  key: "top",
                  label: "Top Padding",
                  type: "text",
                  placeholder: "0rem",
                },
                {
                  key: "bottom",
                  label: "Bottom Padding",
                  type: "text",
                  placeholder: "3rem",
                },
              ],
            },
            {
              key: "gap",
              label: "Gap Between Sections",
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
              type: "text",
              placeholder: "200px",
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
              type: "text",
              placeholder: "1280px",
            },
            {
              key: "padding",
              label: "Section Padding",
              type: "object",
              fields: [
                {
                  key: "top",
                  label: "Top Padding",
                  type: "text",
                  placeholder: "0rem",
                },
                {
                  key: "bottom",
                  label: "Bottom Padding",
                  type: "text",
                  placeholder: "3rem",
                },
              ],
            },
            {
              key: "gap",
              label: "Gap Between Sections",
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
            {
              key: "formBackgroundColor",
              label: "Form Background Color",
              type: "color",
            },
            {
              key: "formTextColor",
              label: "Form Text Color",
              type: "color",
            },
            {
              key: "formButtonBackgroundColor",
              label: "Form Button Background Color",
              type: "color",
            },
            {
              key: "formButtonTextColor",
              label: "Form Button Text Color",
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
              type: "text",
              placeholder: "500px",
            },
            {
              key: "overlayOpacity",
              label: "Overlay Opacity",
              type: "number",
              placeholder: "0.4",
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
              type: "text",
              placeholder: "200px",
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
                      placeholder: "4xl",
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
