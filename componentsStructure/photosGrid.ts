import { ComponentStructure } from "./types";

export const photosGridStructure: ComponentStructure = {
  componentType: "photosGrid",
  variants: [
    {
      id: "photosGrid1",
      name: "Photos Grid 1 - Responsive gallery",
      fields: [
        // BASIC FIELDS
        {
          key: "visible",
          label: "Visible",
          type: "boolean",
        },

        // LAYOUT CONFIGURATION
        {
          key: "layout",
          label: "Layout",
          type: "object",
          fields: [
            {
              key: "maxWidth",
              label: "Max Width",
              type: "text",
              placeholder: "1400px",
            },
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
                  placeholder: "4",
                },
              ],
            },
            {
              key: "gap",
              label: "Gap Between Photos",
              type: "text",
              placeholder: "1.25rem",
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
                  placeholder: "3rem",
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
              key: "aspectRatio",
              label: "Image Aspect Ratio",
              type: "text",
              placeholder: "4 / 3",
            },
          ],
        },

        // CONTENT
        {
          key: "content",
          label: "Content",
          type: "object",
          fields: [
            {
              key: "eyebrow",
              label: "Eyebrow Text",
              type: "text",
              placeholder: "Gallery",
            },
            {
              key: "title",
              label: "Section Title",
              type: "text",
              placeholder: "Explore Our Photo Grid",
            },
            {
              key: "subtitle",
              label: "Section Subtitle",
              type: "text",
              placeholder: "A curated collection of visuals",
            },
            {
              key: "description",
              label: "Description",
              type: "text",
              placeholder:
                "Discover highlights from recent projects and campaigns.",
            },
          ],
        },

        // PHOTOS ARRAY
        {
          key: "photos",
          label: "Photos",
          type: "array",
          addLabel: "Add Photo",
          itemLabel: "Photo",
          of: [
            {
              key: "id",
              label: "Photo ID",
              type: "text",
              placeholder: "photo-1",
            },
            {
              key: "src",
              label: "Image Source",
              type: "text",
              placeholder:
                "/images/placeholders/responsiveImage/responsiveImage.jpg",
            },
            {
              key: "alt",
              label: "Alt Text",
              type: "text",
              placeholder: "Gallery photo",
            },
            {
              key: "caption",
              label: "Caption",
              type: "text",
              placeholder: "Photo caption",
            },
            {
              key: "tag",
              label: "Tag / Category",
              type: "text",
              placeholder: "category",
            },
          ],
        },

        // STYLING
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
              key: "titleColor",
              label: "Title Color",
              type: "color",
            },
            {
              key: "subtitleColor",
              label: "Subtitle Color",
              type: "color",
            },
            {
              key: "descriptionColor",
              label: "Description Color",
              type: "color",
            },
            {
              key: "captionColor",
              label: "Caption Color",
              type: "color",
            },
            {
              key: "tagColor",
              label: "Tag Color",
              type: "color",
            },
            {
              key: "overlayColor",
              label: "Overlay Color",
              type: "color",
            },
            {
              key: "borderRadius",
              label: "Card Border Radius",
              type: "text",
              placeholder: "16px",
            },
            {
              key: "imageBorderRadius",
              label: "Image Border Radius",
              type: "text",
              placeholder: "12px",
            },
            {
              key: "cardShadow",
              label: "Card Shadow",
              type: "text",
              placeholder: "0 10px 30px rgba(0,0,0,0.06)",
            },
            {
              key: "hoverScale",
              label: "Hover Scale",
              type: "text",
              placeholder: "1.02",
            },
          ],
        },

        // TYPOGRAPHY
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
                  placeholder: "700",
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
                      placeholder: "lg",
                    },
                    {
                      key: "tablet",
                      label: "Tablet",
                      type: "text",
                      placeholder: "xl",
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "text",
                      placeholder: "2xl",
                    },
                  ],
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "500",
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
              key: "caption",
              label: "Caption Typography",
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
                      placeholder: "sm",
                    },
                    {
                      key: "tablet",
                      label: "Tablet",
                      type: "text",
                      placeholder: "sm",
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "text",
                      placeholder: "base",
                    },
                  ],
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "500",
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

        // RESPONSIVE
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

        // ANIMATIONS
        {
          key: "animations",
          label: "Animations",
          type: "object",
          fields: [
            {
              key: "header",
              label: "Header Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
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
                  placeholder: "600",
                },
                {
                  key: "delay",
                  label: "Delay (ms)",
                  type: "number",
                  placeholder: "120",
                },
              ],
            },
            {
              key: "cards",
              label: "Cards Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
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
                  placeholder: "600",
                },
                {
                  key: "delay",
                  label: "Delay (ms)",
                  type: "number",
                  placeholder: "180",
                },
                {
                  key: "stagger",
                  label: "Stagger (ms)",
                  type: "number",
                  placeholder: "100",
                },
              ],
            },
          ],
        },
      ],

      // SIMPLE FIELDS
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "content.title", label: "Title", type: "text" },
        { key: "content.subtitle", label: "Subtitle", type: "text" },
        { key: "photos", label: "Photos", type: "array" },
      ],
    },
    {
      id: "photosGrid2",
      name: "Photos Grid 2 - Images only (no card)",
      fields: [
        // BASIC FIELDS
        {
          key: "visible",
          label: "Visible",
          type: "boolean",
        },

        // LAYOUT CONFIGURATION
        {
          key: "layout",
          label: "Layout",
          type: "object",
          fields: [
            {
              key: "maxWidth",
              label: "Max Width",
              type: "text",
              placeholder: "1400px",
            },
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
                  placeholder: "4",
                },
              ],
            },
            {
              key: "gap",
              label: "Gap Between Photos",
              type: "text",
              placeholder: "0.5rem",
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
                  placeholder: "3rem",
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
              key: "aspectRatio",
              label: "Image Aspect Ratio",
              type: "text",
              placeholder: "4 / 3",
            },
          ],
        },

        // CONTENT
        {
          key: "content",
          label: "Content",
          type: "object",
          fields: [
            {
              key: "eyebrow",
              label: "Eyebrow Text",
              type: "text",
              placeholder: "Gallery",
            },
            {
              key: "title",
              label: "Section Title",
              type: "text",
              placeholder: "Explore Our Photo Grid",
            },
            {
              key: "subtitle",
              label: "Section Subtitle",
              type: "text",
              placeholder: "A curated collection of visuals",
            },
            {
              key: "description",
              label: "Description",
              type: "text",
              placeholder:
                "Discover highlights from recent projects and campaigns.",
            },
          ],
        },

        // PHOTOS ARRAY
        {
          key: "photos",
          label: "Photos",
          type: "array",
          addLabel: "Add Photo",
          itemLabel: "Photo",
          of: [
            {
              key: "id",
              label: "Photo ID",
              type: "text",
              placeholder: "photo-1",
            },
            {
              key: "src",
              label: "Image Source",
              type: "text",
              placeholder:
                "/images/placeholders/responsiveImage/responsiveImage.jpg",
            },
            {
              key: "alt",
              label: "Alt Text",
              type: "text",
              placeholder: "Gallery photo",
            },
            {
              key: "caption",
              label: "Caption",
              type: "text",
              placeholder: "Photo caption",
            },
            {
              key: "tag",
              label: "Tag / Category",
              type: "text",
              placeholder: "category",
            },
          ],
        },

        // STYLING
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
              key: "titleColor",
              label: "Title Color",
              type: "color",
            },
            {
              key: "subtitleColor",
              label: "Subtitle Color",
              type: "color",
            },
            {
              key: "descriptionColor",
              label: "Description Color",
              type: "color",
            },
            {
              key: "overlayColor",
              label: "Overlay Color",
              type: "color",
            },
            {
              key: "borderRadius",
              label: "Image Border Radius",
              type: "text",
              placeholder: "12px",
            },
            {
              key: "imageBorderRadius",
              label: "Image Border Radius",
              type: "text",
              placeholder: "12px",
            },
            {
              key: "hoverScale",
              label: "Hover Scale",
              type: "text",
              placeholder: "1.05",
            },
          ],
        },

        // TYPOGRAPHY
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
                  placeholder: "700",
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
                      placeholder: "lg",
                    },
                    {
                      key: "tablet",
                      label: "Tablet",
                      type: "text",
                      placeholder: "xl",
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "text",
                      placeholder: "2xl",
                    },
                  ],
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "500",
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
              key: "caption",
              label: "Caption Typography",
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
                      placeholder: "sm",
                    },
                    {
                      key: "tablet",
                      label: "Tablet",
                      type: "text",
                      placeholder: "sm",
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "text",
                      placeholder: "base",
                    },
                  ],
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "500",
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

        // RESPONSIVE
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

        // ANIMATIONS
        {
          key: "animations",
          label: "Animations",
          type: "object",
          fields: [
            {
              key: "header",
              label: "Header Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
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
                  placeholder: "600",
                },
                {
                  key: "delay",
                  label: "Delay (ms)",
                  type: "number",
                  placeholder: "120",
                },
              ],
            },
            {
              key: "cards",
              label: "Images Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
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
                  placeholder: "600",
                },
                {
                  key: "delay",
                  label: "Delay (ms)",
                  type: "number",
                  placeholder: "180",
                },
                {
                  key: "stagger",
                  label: "Stagger (ms)",
                  type: "number",
                  placeholder: "100",
                },
              ],
            },
          ],
        },
      ],

      // SIMPLE FIELDS
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "content.title", label: "Title", type: "text" },
        { key: "content.subtitle", label: "Subtitle", type: "text" },
        { key: "photos", label: "Photos", type: "array" },
      ],
    },
  ],
};
