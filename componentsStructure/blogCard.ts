import { ComponentStructure } from "./types";

export const blogCardStructure: ComponentStructure = {
  componentType: "blogCard",
  variants: [
    {
      id: "blogCard1",
      name: "Blog Card 1 - Blog Post Card",
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
        // BLOG DATA
        // ═══════════════════════════════════════════════════════════
        {
          key: "blog",
          label: "Blog",
          type: "object",
          fields: [
            {
              key: "id",
              label: "Blog ID",
              type: "text",
              placeholder: "1",
            },
            {
              key: "image",
              label: "Image URL",
              type: "image",
            },
            {
              key: "title",
              label: "Blog Title",
              type: "text",
              placeholder: "مقال تجريبي",
            },
            {
              key: "description",
              label: "Description",
              type: "textarea",
              placeholder: "هذا مقال تجريبي للمحرر المباشر",
            },
            {
              key: "readMoreUrl",
              label: "Read More URL",
              type: "text",
              placeholder: "/blog/test-1",
            },
            {
              key: "date",
              label: "Date",
              type: "text",
              placeholder: "1 يناير 2024",
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
              key: "cardBackgroundColor",
              label: "Card Background Color",
              type: "color",
            },
            {
              key: "cardTitleColor",
              label: "Card Title Color",
              type: "color",
            },
            {
              key: "cardTitleHoverColor",
              label: "Card Title Hover Color",
              type: "color",
            },
            {
              key: "cardDescriptionColor",
              label: "Card Description Color",
              type: "color",
            },
            {
              key: "readMoreColor",
              label: "Read More Link Color",
              type: "color",
            },
            {
              key: "readMoreHoverColor",
              label: "Read More Hover Color",
              type: "color",
            },
            {
              key: "dateColor",
              label: "Date Color",
              type: "color",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // RESPONSIVE
        // ═══════════════════════════════════════════════════════════
        {
          key: "responsive",
          label: "Responsive",
          type: "object",
          fields: [
            {
              key: "imageHeight",
              label: "Image Height",
              type: "object",
              fields: [
                {
                  key: "mobile",
                  label: "Mobile",
                  type: "text",
                  placeholder: "250px",
                },
                {
                  key: "desktop",
                  label: "Desktop",
                  type: "text",
                  placeholder: "280px",
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
        { key: "blog.title", label: "Blog Title", type: "text" },
        { key: "blog.description", label: "Description", type: "textarea" },
        { key: "blog.readMoreUrl", label: "Read More URL", type: "text" },
        { key: "blog.date", label: "Date", type: "text" },
      ],
    },
  ],
};
