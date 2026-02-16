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
              key: "backgroundImage",
              label: "Background Image",
              type: "image",
              placeholder:
                "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80",
            },
            {
              key: "background.color",
              label: "Background Color",
              type: "color",
              useDefaultColor: false,
              globalColorType: "primary",
              description: "لون الخلفية. يمكنك استخدام Primary Color من إعدادات التاجر أو لون مخصص. اتركه فارغاً للشفافية.",
            },
            {
              key: "background.opacity",
              label: "Background Opacity (0-1)",
              type: "number",
              placeholder: "1",
              min: 0,
              max: 1,
            },
          ],
        },
        {
          key: "titleGroup",
          label: "Title",
          type: "text",
          displayAsGroup: true,
          groupFields: [
            {
              key: "showTitle",
              label: "إظهار العنوان",
              type: "boolean",
              defaultValue: true,
            },
            {
              key: "title",
              label: "Title",
              type: "text",
              placeholder: "سكن يليق بطموحك وامكاناتك",
            },
          ],
        },
        {
          key: "paragraphGroup",
          label: "Paragraph",
          type: "textarea",
          displayAsGroup: true,
          groupFields: [
            {
              key: "showParagraph",
              label: "إظهار الفقرة",
              type: "boolean",
              defaultValue: true,
            },
            {
              key: "paragraph",
              label: "Paragraph",
              type: "textarea",
              placeholder:
                "نحن لا نعرض عقارات فقط، بل نقدّم تجربة مبنية على الثقة...",
            },
          ],
        },
        {
          key: "blockquoteGroup",
          label: "Blockquote",
          type: "textarea",
          displayAsGroup: true,
          groupFields: [
            {
              key: "showBlockquote",
              label: "إظهار الاقتباس",
              type: "boolean",
              defaultValue: true,
            },
            {
              key: "blockquote",
              label: "Blockquote",
              type: "textarea",
              placeholder: "في باهية، نؤمن أن كل شخص يستحق فرصة...",
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
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "backgroundImage", label: "Background Image", type: "image" },
        { key: "background.color", label: "Background Color", type: "color" },
        { key: "background.opacity", label: "Background Opacity", type: "number" },
        { key: "showTitle", label: "إظهار العنوان", type: "boolean" },
        { key: "title", label: "Title", type: "text" },
        { key: "showParagraph", label: "إظهار الفقرة", type: "boolean" },
        { key: "paragraph", label: "Paragraph", type: "textarea" },
        { key: "showBlockquote", label: "إظهار الاقتباس", type: "boolean" },
        { key: "blockquote", label: "Blockquote", type: "textarea" },
        { key: "overlayOpacity", label: "Overlay Opacity", type: "number" },
        { key: "styling.height", label: "Height (px)", type: "number" },
      ],
    },
  ],
};
