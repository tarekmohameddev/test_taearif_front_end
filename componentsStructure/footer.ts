import { ComponentStructure } from "./types";

export const footerStructure: ComponentStructure = {
  componentType: "footer",
  variants: [
    {
      id: "footer1",
      name: "Footer 1 - Modern Real Estate",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        {
          key: "background",
          label: "Background",
          type: "object",
          fields: [
            {
              key: "type",
              label: "Background Type",
              type: "select",
              options: [
                { label: "Image", value: "image" },
                { label: "Color", value: "color" },
                { label: "Gradient", value: "gradient" },
                { label: "None", value: "none" },
              ],
            },
            { key: "image", label: "Image URL", type: "image" },
            { key: "alt", label: "Alt Text", type: "text" },
            { key: "color", label: "Background Color", type: "color" },
            {
              key: "gradient",
              label: "Gradient",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "direction",
                  label: "Direction",
                  type: "select",
                  options: [
                    { label: "To Right", value: "to-r" },
                    { label: "To Left", value: "to-l" },
                    { label: "To Top", value: "to-t" },
                    { label: "To Bottom", value: "to-b" },
                    { label: "To Top Right", value: "to-tr" },
                    { label: "To Top Left", value: "to-tl" },
                    { label: "To Bottom Right", value: "to-br" },
                    { label: "To Bottom Left", value: "to-bl" },
                  ],
                },
                { key: "startColor", label: "Start Color", type: "color" },
                { key: "endColor", label: "End Color", type: "color" },
                {
                  key: "middleColor",
                  label: "Middle Color (Optional)",
                  type: "color",
                },
              ],
            },
            {
              key: "overlay",
              label: "Overlay",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "opacity",
                  label: "Opacity",
                  type: "text",
                  placeholder: "0.7",
                },
                { key: "color", label: "Color", type: "color" },
                {
                  key: "blendMode",
                  label: "Blend Mode",
                  type: "select",
                  options: [
                    { label: "Multiply", value: "multiply" },
                    { label: "Overlay", value: "overlay" },
                    { label: "Soft Light", value: "soft-light" },
                    { label: "Hard Light", value: "hard-light" },
                    { label: "Color Burn", value: "color-burn" },
                    { label: "Color Dodge", value: "color-dodge" },
                  ],
                },
              ],
            },
          ],
        },
        {
          key: "layout",
          label: "Layout",
          type: "object",
          fields: [
            {
              key: "columns",
              label: "Number of Columns",
              type: "select",
              options: [
                { label: "1 Column", value: "1" },
                { label: "2 Columns", value: "2" },
                { label: "3 Columns", value: "3" },
                { label: "4 Columns", value: "4" },
              ],
            },
            {
              key: "spacing",
              label: "Column Spacing",
              type: "text",
              placeholder: "8",
            },
            {
              key: "padding",
              label: "Padding",
              type: "text",
              placeholder: "16",
            },
            {
              key: "maxWidth",
              label: "Max Width",
              type: "text",
              placeholder: "7xl",
            },
          ],
        },
        {
          key: "content",
          label: "Content",
          type: "object",
          fields: [
            {
              key: "companyInfo",
              label: "Company Information",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "name", label: "Company Name", type: "text" },
                { key: "description", label: "Description", type: "text" },
                { key: "tagline", label: "Tagline", type: "text" },
                { key: "logo", label: "Logo", type: "image" },
              ],
            },
            {
              key: "quickLinks",
              label: "Quick Links",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "title", label: "Section Title", type: "text" },
                {
                  key: "links",
                  label: "Links",
                  type: "array",
                  addLabel: "Add Link",
                  itemLabel: "Link",
                  of: [
                    { key: "text", label: "Link Text", type: "text" },
                    { key: "url", label: "URL", type: "text" },
                  ],
                },
              ],
            },
            {
              key: "contactInfo",
              label: "Contact Information",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "title", label: "Section Title", type: "text" },
                { key: "address", label: "Address", type: "text" },
                { key: "phone1", label: "Phone 1", type: "text" },
                { key: "phone2", label: "Phone 2", type: "text" },
                { key: "email", label: "Email", type: "text" },
              ],
            },
            {
              key: "socialMedia",
              label: "Social Media",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "title", label: "Section Title", type: "text" },
                {
                  key: "platforms",
                  label: "Platforms",
                  type: "array",
                  addLabel: "Add Platform",
                  itemLabel: "Platform",
                  of: [
                    { key: "name", label: "Platform Name", type: "text" },
                    {
                      key: "icon",
                      label: "Icon",
                      type: "select",
                      options: [
                        { label: "واتساب", value: "FaWhatsapp" },
                        { label: "لينكد إن", value: "Linkedin" },
                        { label: "إنستغرام", value: "Instagram" },
                        { label: "تويتر", value: "Twitter" },
                        { label: "فيسبوك", value: "Facebook" },
                        { label: "سناب شات", value: "Snapchat" },
                        { label: "تيك توك", value: "Tiktok" },
                        { label: "يوتيوب", value: "Youtube" },
                      ],
                    },
                    { key: "url", label: "URL", type: "text" },
                    { key: "color", label: "Hover Color", type: "color" },
                  ],
                },
              ],
            },
          ],
        },
        {
          key: "footerBottom",
          label: "Footer Bottom",
          type: "object",
          fields: [
            { key: "enabled", label: "Enabled", type: "boolean" },
            { key: "copyright", label: "Copyright Text", type: "text" },
            {
              key: "legalLinks",
              label: "Legal Links",
              type: "array",
              addLabel: "Add Legal Link",
              itemLabel: "Legal Link",
              of: [
                { key: "text", label: "Link Text", type: "text" },
                { key: "url", label: "URL", type: "text" },
              ],
            },
          ],
        },
        {
          key: "styling",
          label: "Styling",
          type: "object",
          fields: [
            {
              key: "colors",
              label: "Colors",
              type: "object",
              fields: [
                {
                  key: "textPrimary",
                  label: "Primary Text Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "secondary", // Primary text uses secondary color
                },
                {
                  key: "textSecondary",
                  label: "Secondary Text Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "secondary", // Secondary text uses secondary color
                },
                {
                  key: "textMuted",
                  label: "Muted Text Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "secondary", // Muted text uses secondary color
                },
                {
                  key: "accent",
                  label: "Accent Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "accent", // Accent uses accent color
                },
                {
                  key: "border",
                  label: "Border Color",
                  type: "color",
                  useDefaultColor: false, // Border color is usually custom
                },
              ],
            },
            {
              key: "typography",
              label: "Typography",
              type: "object",
              fields: [
                {
                  key: "titleSize",
                  label: "Title Font Size",
                  type: "text",
                  placeholder: "xl",
                },
                {
                  key: "titleWeight",
                  label: "Title Font Weight",
                  type: "text",
                  placeholder: "bold",
                },
                {
                  key: "bodySize",
                  label: "Body Font Size",
                  type: "text",
                  placeholder: "sm",
                },
                {
                  key: "bodyWeight",
                  label: "Body Font Weight",
                  type: "text",
                  placeholder: "normal",
                },
              ],
            },
            {
              key: "spacing",
              label: "Spacing",
              type: "object",
              fields: [
                {
                  key: "sectionPadding",
                  label: "Section Padding",
                  type: "text",
                  placeholder: "16",
                },
                {
                  key: "columnGap",
                  label: "Column Gap",
                  type: "text",
                  placeholder: "8",
                },
                {
                  key: "itemGap",
                  label: "Item Gap",
                  type: "text",
                  placeholder: "3",
                },
              ],
            },
            {
              key: "effects",
              label: "Effects",
              type: "object",
              fields: [
                {
                  key: "hoverTransition",
                  label: "Hover Transition",
                  type: "text",
                  placeholder: "0.3s",
                },
                {
                  key: "shadow",
                  label: "Shadow",
                  type: "text",
                  placeholder: "none",
                },
                {
                  key: "borderRadius",
                  label: "Border Radius",
                  type: "text",
                  placeholder: "none",
                },
              ],
            },
          ],
        },
      ],
      simpleFields: [
        {
          key: "content.companyInfo.logo",
          label: "Logo",
          type: "image",
        },
        {
          key: "content.companyInfo.name",
          label: "Company Name",
          type: "text",
        },
        {
          key: "content",
          label: "Content",
          type: "object",
          fields: [
            {
              key: "companyInfo",
              label: "Company Information",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "name", label: "Company Name", type: "text" },
                { key: "description", label: "Description", type: "text" },
                { key: "tagline", label: "Tagline", type: "text" },
                { key: "logo", label: "Logo", type: "image" },
              ],
            },
            {
              key: "quickLinks",
              label: "Quick Links",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "title", label: "Section Title", type: "text" },
                {
                  key: "links",
                  label: "Links",
                  type: "array",
                  addLabel: "Add Link",
                  itemLabel: "Link",
                  of: [
                    { key: "text", label: "Link Text", type: "text" },
                    { key: "url", label: "URL", type: "text" },
                  ],
                },
              ],
            },
            {
              key: "contactInfo",
              label: "Contact Information",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "title", label: "Section Title", type: "text" },
                { key: "address", label: "Address", type: "text" },
                { key: "phone1", label: "Phone 1", type: "text" },
                { key: "phone2", label: "Phone 2", type: "text" },
                { key: "email", label: "Email", type: "text" },
              ],
            },
            {
              key: "socialMedia",
              label: "Social Media",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "title", label: "Section Title", type: "text" },
                {
                  key: "platforms",
                  label: "Platforms",
                  type: "array",
                  addLabel: "Add Platform",
                  itemLabel: "Platform",
                  of: [
                    { key: "name", label: "Platform Name", type: "text" },
                    {
                      key: "icon",
                      label: "Icon",
                      type: "select",
                      options: [
                        { label: "واتساب", value: "FaWhatsapp" },
                        { label: "لينكد إن", value: "Linkedin" },
                        { label: "إنستغرام", value: "Instagram" },
                        { label: "تويتر", value: "Twitter" },
                        { label: "فيسبوك", value: "Facebook" },
                        { label: "سناب شات", value: "Snapchat" },
                        { label: "تيك توك", value: "Tiktok" },
                        { label: "يوتيوب", value: "Youtube" },
                      ],
                    },
                    { key: "url", label: "URL", type: "text" },
                    {
                      key: "color",
                      label: "Hover Color",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "primary", // Icon hover uses primary color
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "footer2",
      name: "Footer 2 - ThemeTwo",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        {
          key: "background",
          label: "Background",
          type: "object",
          fields: [
            {
              key: "type",
              label: "Background Type",
              type: "select",
              options: [
                { label: "Image", value: "image" },
                { label: "Color", value: "color" },
                { label: "Gradient", value: "gradient" },
                { label: "None", value: "none" },
              ],
            },
            { key: "image", label: "Image URL", type: "image" },
            { key: "alt", label: "Alt Text", type: "text" },
            { key: "color", label: "Background Color", type: "color" },
            {
              key: "gradient",
              label: "Gradient",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "direction",
                  label: "Direction",
                  type: "select",
                  options: [
                    { label: "To Right", value: "to-r" },
                    { label: "To Left", value: "to-l" },
                    { label: "To Top", value: "to-t" },
                    { label: "To Bottom", value: "to-b" },
                    { label: "To Top Right", value: "to-tr" },
                    { label: "To Top Left", value: "to-tl" },
                    { label: "To Bottom Right", value: "to-br" },
                    { label: "To Bottom Left", value: "to-bl" },
                  ],
                },
                { key: "startColor", label: "Start Color", type: "color" },
                { key: "endColor", label: "End Color", type: "color" },
                {
                  key: "middleColor",
                  label: "Middle Color (Optional)",
                  type: "color",
                },
              ],
            },
            {
              key: "overlay",
              label: "Overlay",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "opacity",
                  label: "Opacity",
                  type: "text",
                  placeholder: "0.7",
                },
                { key: "color", label: "Color", type: "color" },
                {
                  key: "blendMode",
                  label: "Blend Mode",
                  type: "select",
                  options: [
                    { label: "Multiply", value: "multiply" },
                    { label: "Overlay", value: "overlay" },
                    { label: "Soft Light", value: "soft-light" },
                    { label: "Hard Light", value: "hard-light" },
                    { label: "Color Burn", value: "color-burn" },
                    { label: "Color Dodge", value: "color-dodge" },
                  ],
                },
              ],
            },
          ],
        },
        {
          key: "layout",
          label: "Layout",
          type: "object",
          fields: [
            {
              key: "columns",
              label: "Number of Columns",
              type: "select",
              options: [
                { label: "1 Column", value: "1" },
                { label: "2 Columns", value: "2" },
                { label: "3 Columns", value: "3" },
                { label: "4 Columns", value: "4" },
              ],
            },
            {
              key: "spacing",
              label: "Column Spacing",
              type: "text",
              placeholder: "8",
            },
            {
              key: "padding",
              label: "Padding",
              type: "text",
              placeholder: "16",
            },
            {
              key: "maxWidth",
              label: "Max Width",
              type: "text",
              placeholder: "6xl",
            },
          ],
        },
        {
          key: "content",
          label: "Content",
          type: "object",
          fields: [
            {
              key: "companyInfo",
              label: "Company Information",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "name", label: "Company Name", type: "text" },
                { key: "description", label: "Description", type: "text" },
                { key: "tagline", label: "Tagline", type: "text" },
                { key: "logo", label: "Logo", type: "image" },
              ],
            },
            {
              key: "newsletter",
              label: "Newsletter",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "title", label: "Title", type: "text" },
                { key: "description", label: "Description", type: "text" },
                { key: "placeholder", label: "Placeholder", type: "text" },
                { key: "buttonText", label: "Button Text", type: "text" },
              ],
            },
            {
              key: "contactInfo",
              label: "Contact Information",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "address", label: "Address", type: "text" },
                { key: "email", label: "Email", type: "text" },
                { key: "whatsapp", label: "WhatsApp", type: "text" },
              ],
            },
            {
              key: "socialMedia",
              label: "Social Media",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "platforms",
                  label: "Platforms",
                  type: "array",
                  addLabel: "Add Platform",
                  itemLabel: "Platform",
                  of: [
                    { key: "name", label: "Platform Name", type: "text" },
                    { key: "url", label: "URL", type: "text" },
                  ],
                },
              ],
            },
          ],
        },
        {
          key: "footerBottom",
          label: "Footer Bottom",
          type: "object",
          fields: [
            { key: "enabled", label: "Enabled", type: "boolean" },
            { key: "copyright", label: "Copyright Text", type: "text" },
            { key: "companyUrl", label: "Company URL", type: "text" },
            { key: "designerUrl", label: "Designer URL", type: "text" },
            {
              key: "legalLinks",
              label: "Legal Links",
              type: "array",
              addLabel: "Add Legal Link",
              itemLabel: "Legal Link",
              of: [
                { key: "text", label: "Link Text", type: "text" },
                { key: "url", label: "URL", type: "text" },
              ],
            },
          ],
        },
        {
          key: "styling",
          label: "Styling",
          type: "object",
          fields: [
            {
              key: "colors",
              label: "Colors",
              type: "object",
              fields: [
                {
                  key: "textPrimary",
                  label: "Primary Text Color",
                  type: "color",
                },
                {
                  key: "textSecondary",
                  label: "Secondary Text Color",
                  type: "color",
                },
                {
                  key: "textMuted",
                  label: "Muted Text Color",
                  type: "color",
                },
                {
                  key: "accent",
                  label: "Accent Color",
                  type: "color",
                },
                {
                  key: "border",
                  label: "Border Color",
                  type: "color",
                },
              ],
            },
            {
              key: "typography",
              label: "Typography",
              type: "object",
              fields: [
                {
                  key: "titleSize",
                  label: "Title Font Size",
                  type: "text",
                  placeholder: "xl",
                },
                {
                  key: "titleWeight",
                  label: "Title Font Weight",
                  type: "text",
                  placeholder: "bold",
                },
                {
                  key: "bodySize",
                  label: "Body Font Size",
                  type: "text",
                  placeholder: "base",
                },
                {
                  key: "bodyWeight",
                  label: "Body Font Weight",
                  type: "text",
                  placeholder: "normal",
                },
              ],
            },
            {
              key: "spacing",
              label: "Spacing",
              type: "object",
              fields: [
                {
                  key: "sectionPadding",
                  label: "Section Padding",
                  type: "text",
                  placeholder: "16",
                },
                {
                  key: "columnGap",
                  label: "Column Gap",
                  type: "text",
                  placeholder: "8",
                },
                {
                  key: "itemGap",
                  label: "Item Gap",
                  type: "text",
                  placeholder: "3",
                },
              ],
            },
            {
              key: "effects",
              label: "Effects",
              type: "object",
              fields: [
                {
                  key: "hoverTransition",
                  label: "Hover Transition",
                  type: "text",
                  placeholder: "0.3s",
                },
                {
                  key: "shadow",
                  label: "Shadow",
                  type: "text",
                  placeholder: "none",
                },
                {
                  key: "borderRadius",
                  label: "Border Radius",
                  type: "text",
                  placeholder: "lg",
                },
              ],
            },
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        {
          key: "content.companyInfo.logo",
          label: "Logo",
          type: "image",
        },
        {
          key: "content.companyInfo.name",
          label: "Company Name",
          type: "text",
        },
        {
          key: "content.newsletter.title",
          label: "Newsletter Title",
          type: "text",
        },
        { key: "content.contactInfo.address", label: "Address", type: "text" },
      ],
    },
  ],
};
