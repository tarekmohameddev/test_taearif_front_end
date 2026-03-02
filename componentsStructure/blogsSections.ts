import { ComponentStructure } from "./types";

export const blogsSectionsStructure: ComponentStructure = {
  componentType: "blogsSections",
  variants: [
    {
      id: "blogsSections1",
      name: "Blogs Sections 1 - Cards Grid with Paragraphs",
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
        // CONTENT - PARAGRAPHS
        // ═══════════════════════════════════════════════════════════
        {
          key: "paragraph1",
          label: "First Paragraph",
          type: "textarea",
          placeholder: "Enter first paragraph text",
        },
        {
          key: "paragraph2",
          label: "Second Paragraph",
          type: "textarea",
          placeholder: "Enter second paragraph text",
        },

        // ═══════════════════════════════════════════════════════════
        // API SETTINGS
        // ═══════════════════════════════════════════════════════════
        {
          key: "apiSettings",
          label: "API Settings",
          type: "object",
          fields: [
            {
              key: "limit",
              label: "Posts Limit",
              type: "number",
              placeholder: "10",
            },
            {
              key: "page",
              label: "Page Number",
              type: "number",
              placeholder: "1",
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
              key: "paragraphColor",
              label: "Paragraph Text Color",
              type: "color",
            },
            {
              key: "dividerColor",
              label: "Divider Color",
              type: "color",
            },
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
        // LAYOUT
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
                { key: "top", label: "Top Padding", type: "number", placeholder: "48", unit: "px" },
                { key: "bottom", label: "Bottom Padding", type: "number", placeholder: "48", unit: "px" },
              ],
            },
            {
              key: "gap",
              label: "Gaps",
              type: "object",
              fields: [
                {
                  key: "paragraphs",
                  label: "Paragraphs Gap",
                  type: "text",
                  placeholder: "2rem",
                },
                {
                  key: "cards",
                  label: "Cards Gap",
                  type: "text",
                  placeholder: "1.5rem",
                },
              ],
            },
            {
              key: "gridColumns",
              label: "Grid Columns",
              type: "object",
              fields: [
                {
                  key: "mobile",
                  label: "Mobile Columns",
                  type: "number",
                  placeholder: "1",
                },
                {
                  key: "tablet",
                  label: "Tablet Columns",
                  type: "number",
                  placeholder: "2",
                },
                {
                  key: "desktop",
                  label: "Desktop Columns",
                  type: "number",
                  placeholder: "3",
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
        { key: "paragraph1", label: "First Paragraph", type: "textarea" },
        { key: "paragraph2", label: "Second Paragraph", type: "textarea" },
      ],
    },
  ],
};
