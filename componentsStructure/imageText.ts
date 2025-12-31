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
          key: "backgroundImage",
          label: "Background Image",
          type: "image",
          placeholder:
            "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80",
        },
        {
          key: "title",
          label: "Title",
          type: "text",
          placeholder: "سكن يليق بطموحك وامكاناتك",
        },
        {
          key: "paragraph",
          label: "Paragraph",
          type: "textarea",
          placeholder:
            "نحن لا نعرض عقارات فقط، بل نقدّم تجربة مبنية على الثقة...",
        },
        {
          key: "blockquote",
          label: "Blockquote",
          type: "textarea",
          placeholder: "في باهية، نؤمن أن كل شخص يستحق فرصة...",
        },
        {
          key: "overlayOpacity",
          label: "Overlay Opacity",
          type: "number",
          placeholder: "0.3",
        },
      ],

      // ═══════════════════════════════════════════════════════════
      // SIMPLE FIELDS - For basic/simple editing mode
      // ═══════════════════════════════════════════════════════════
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "backgroundImage", label: "Background Image", type: "image" },
        { key: "title", label: "Title", type: "text" },
        { key: "paragraph", label: "Paragraph", type: "textarea" },
        { key: "blockquote", label: "Blockquote", type: "textarea" },
        { key: "overlayOpacity", label: "Overlay Opacity", type: "number" },
      ],
    },
  ],
};
