import { ComponentStructure } from "./types";

export const responsiveImageStructure: ComponentStructure = {
  componentType: "responsiveImage",
  variants: [
    {
      id: "responsiveImage1",
      name: "Responsive Image 1 - متجاوب لجميع الشاشات",
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
        // IMAGE CONFIGURATION
        // ═══════════════════════════════════════════════════════════
        {
          key: "image",
          label: "Image",
          type: "object",
          fields: [
            {
              key: "src",
              label: "Image URL",
              type: "image",
            },
            {
              key: "alt",
              label: "Alt Text",
              type: "text",
              placeholder: "وصف الصورة",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // RESPONSIVE WIDTH
        // ═══════════════════════════════════════════════════════════
        {
          key: "width",
          label: "Width",
          type: "object",
          fields: [
            {
              key: "mobile",
              label: "Mobile Width",
              type: "text",
              placeholder: "100%",
            },
            {
              key: "tablet",
              label: "Tablet Width",
              type: "text",
              placeholder: "80%",
            },
            {
              key: "desktop",
              label: "Desktop Width",
              type: "text",
              placeholder: "70%",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // MAX WIDTH CONSTRAINTS
        // ═══════════════════════════════════════════════════════════
        {
          key: "maxWidth",
          label: "Max Width",
          type: "object",
          fields: [
            {
              key: "mobile",
              label: "Mobile Max Width",
              type: "text",
              placeholder: "100%",
            },
            {
              key: "tablet",
              label: "Tablet Max Width",
              type: "text",
              placeholder: "800px",
            },
            {
              key: "desktop",
              label: "Desktop Max Width",
              type: "text",
              placeholder: "1200px",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // ALIGNMENT
        // ═══════════════════════════════════════════════════════════
        {
          key: "alignment",
          label: "Alignment",
          type: "select",
          options: [
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
            { value: "right", label: "Right" },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // SPACING
        // ═══════════════════════════════════════════════════════════
        {
          key: "spacing",
          label: "Spacing",
          type: "object",
          fields: [
            {
              key: "margin",
              label: "Margin",
              type: "object",
              fields: [
                {
                  key: "top",
                  label: "Top Margin",
                  type: "text",
                  placeholder: "0",
                },
                {
                  key: "bottom",
                  label: "Bottom Margin",
                  type: "text",
                  placeholder: "0",
                },
                {
                  key: "left",
                  label: "Left Margin",
                  type: "text",
                  placeholder: "auto",
                },
                {
                  key: "right",
                  label: "Right Margin",
                  type: "text",
                  placeholder: "auto",
                },
              ],
            },
            {
              key: "padding",
              label: "Padding",
              type: "object",
              fields: [
                {
                  key: "top",
                  label: "Top Padding",
                  type: "text",
                  placeholder: "0",
                },
                {
                  key: "bottom",
                  label: "Bottom Padding",
                  type: "text",
                  placeholder: "0",
                },
                {
                  key: "left",
                  label: "Left Padding",
                  type: "text",
                  placeholder: "0",
                },
                {
                  key: "right",
                  label: "Right Padding",
                  type: "text",
                  placeholder: "0",
                },
              ],
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
              key: "borderRadius",
              label: "Border Radius",
              type: "text",
              placeholder: "0",
            },
            {
              key: "objectFit",
              label: "Object Fit",
              type: "select",
              options: [
                { value: "cover", label: "Cover" },
                { value: "contain", label: "Contain" },
                { value: "fill", label: "Fill" },
                { value: "none", label: "None" },
                { value: "scale-down", label: "Scale Down" },
              ],
            },
            {
              key: "shadow",
              label: "Shadow",
              type: "select",
              options: [
                { value: "none", label: "None" },
                { value: "sm", label: "Small" },
                { value: "md", label: "Medium" },
                { value: "lg", label: "Large" },
                { value: "xl", label: "Extra Large" },
                { value: "2xl", label: "2X Large" },
              ],
            },
            {
              key: "border",
              label: "Border",
              type: "object",
              fields: [
                {
                  key: "enabled",
                  label: "Enabled",
                  type: "boolean",
                },
                {
                  key: "width",
                  label: "Border Width",
                  type: "text",
                  placeholder: "1px",
                },
                {
                  key: "color",
                  label: "Border Color",
                  type: "color",
                },
                {
                  key: "style",
                  label: "Border Style",
                  type: "select",
                  options: [
                    { value: "solid", label: "Solid" },
                    { value: "dashed", label: "Dashed" },
                    { value: "dotted", label: "Dotted" },
                    { value: "double", label: "Double" },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // RESPONSIVE BREAKPOINTS
        // ═══════════════════════════════════════════════════════════
        {
          key: "responsive",
          label: "Responsive Breakpoints",
          type: "object",
          fields: [
            {
              key: "mobileBreakpoint",
              label: "Mobile Breakpoint",
              type: "text",
              placeholder: "640px",
            },
            {
              key: "tabletBreakpoint",
              label: "Tablet Breakpoint",
              type: "text",
              placeholder: "1024px",
            },
            {
              key: "desktopBreakpoint",
              label: "Desktop Breakpoint",
              type: "text",
              placeholder: "1280px",
            },
          ],
        },
      ],

      // ═══════════════════════════════════════════════════════════
      // SIMPLE FIELDS - For basic/simple editing mode
      // ═══════════════════════════════════════════════════════════
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "image.src", label: "Image URL", type: "image" },
        { key: "image.alt", label: "Alt Text", type: "text" },
        { key: "width.desktop", label: "Desktop Width", type: "text" },
        { key: "alignment", label: "Alignment", type: "select" },
      ],
    },
  ],
};
