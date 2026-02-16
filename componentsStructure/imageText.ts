import { ComponentStructure } from "./types";

export const imageTextStructure: ComponentStructure = {
  componentType: "imageText",
  variants: [
    {
      id: "imageText1",
      name: "Image Text 1 - Background Image with Text",
      fields: [
        // ═══════════════════════════════════════════════════════════
        // BASIC FIELDS
        // ═══════════════════════════════════════════════════════════
        {
          key: "visible",
          label: "Visible",
          type: "boolean",
        }, // ═══════════════════════════════════════════════════════════
        // CONTENT
        // ═══════════════════════════════════════════════════════════
        {
          key: "backgroundGroup",
          label: "Background",
          type: "image",
          displayAsGroup: true,
          groupFields: [
            {
              key: "background.type",
              label: "نوع الخلفية",
              type: "select",
              options: [
                { label: "صورة", value: "image" },
                { label: "لون", value: "color" },
              ],
              defaultValue: "image",
            },
            {
              key: "backgroundImage",
              label: "Background Image",
              type: "image",
              placeholder:
                "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80",
              condition: {
                field: "background.type",
                value: "image",
              },
            },
            {
              key: "background.color",
              label: "Background Color",
              type: "color",
              useDefaultColor: false,
              globalColorType: "primary",
              description: "لون الخلفية. يمكنك استخدام Primary Color من إعدادات التاجر أو لون مخصص. اتركه فارغاً للشفافية.",
              condition: {
                field: "background.type",
                value: "color",
              },
            },
            {
              key: "background.opacity",
              label: "Background Opacity (0-1)",
              type: "number",
              placeholder: "1",
              min: 0,
              max: 1,
              condition: {
                field: "background.type",
                value: "color",
              },
            },
          ],
        },
        {
          key: "texts",
          label: "Texts",
          type: "array",
          addLabel: "Add Text Block",
          itemLabel: "Text Block",
          of: [
            {
              key: "type",
              label: "Type",
              type: "select",
              options: [
                { label: "Heading", value: "heading" },
                { label: "Paragraph", value: "paragraph" },
                { label: "Blockquote", value: "blockquote" },
                { label: "ميزة", value: "feature" },
              ],
              defaultValue: "paragraph",
            },
            {
              key: "text",
              label: "Content",
              type: "textarea",
              placeholder: "Enter text content here...",
            },
            {
              key: "shapeType",
              label: "نوع الشكل",
              type: "select",
              options: [
                { label: "نص عادي", value: "plain" },
                { label: "مربع", value: "badge" },
              ],
              defaultValue: "plain",
              condition: {
                field: "type",
                value: "feature",
              },
            },
            {
              key: "fontSize",
              label: "حجم الخط (px)",
              type: "number",
              placeholder: "مثال: 24",
            },
            {
              key: "color",
              label: "لون النص",
              type: "color",
            },
          ],
        },
        {
          key: "overlayOpacity",
          label: "Overlay Opacity",
          type: "number",
          placeholder: "0.3",
        },
        {
          key: "styling",
          label: "Styling",
          type: "object",
          fields: [
            {
              key: "height",
              label: "Height (px)",
              type: "number",
              placeholder: "500",
            },
          ],
        },
      ],

      // ═══════════════════════════════════════════════════════════
      // SIMPLE FIELDS - For basic/simple editing mode
      // ═══════════════════════════════════════════════════════════
      simpleFields: [
        {
          key: "texts",
          label: "Texts",
          type: "array",
          addLabel: "Add Text Block",
          itemLabel: "Text Block",
          of: [
            {
              key: "type",
              label: "Type",
              type: "select",
              options: [
                { label: "Heading", value: "heading" },
                { label: "Paragraph", value: "paragraph" },
                { label: "Blockquote", value: "blockquote" },
                { label: "ميزة", value: "feature" },
              ],
              defaultValue: "paragraph",
            },
            {
              key: "text",
              label: "Content",
              type: "textarea",
              placeholder: "Enter text content here...",
            },
            {
              key: "shapeType",
              label: "نوع الشكل",
              type: "select",
              options: [
                { label: "نص عادي", value: "plain" },
                { label: "مربع", value: "badge" },
              ],
              defaultValue: "plain",
              condition: {
                field: "type",
                value: "feature",
              },
            },
            {
              key: "fontSize",
              label: "حجم الخط (px)",
              type: "number",
              placeholder: "مثال: 24",
            },
            {
              key: "color",
              label: "لون النص",
              type: "color",
            },
          ],
        },
      ],
    },
  ],
};
