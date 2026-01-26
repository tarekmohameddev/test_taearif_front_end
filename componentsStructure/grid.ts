import { ComponentStructure } from "./types";

export const gridStructure: ComponentStructure = {
  componentType: "grid",
  variants: [
    {
      id: "grid1",
      name: "Property Grid 1 - Standard Layout",
      fields: [
        {
          key: "visible",
          label: "Visible",
          type: "boolean",
        },
        {
          key: "cardSettings",
          label: "تحديد شكل الكارت",
          type: "object",
          fields: [
            {
              key: "theme",
              label: "Card Theme",
              type: "select",
              defaultValue: "card1",
              options: [
                {
                  value: "card1",
                  label: "Card 1 - Classic",
                },
                {
                  value: "card2",
                  label: "Card 2 - Modern",
                },
                {
                  value: "card3",
                  label: "Card 3 - Vertical Overlay",
                },
                {
                  value: "card4",
                  label: "Card 4",
                },
                {
                  value: "card5",
                  label: "Card 5",
                },
              ],
              description: "Choose the card theme/design",
            },
            {
              key: "showImage",
              label: "Show Image",
              type: "boolean",
              defaultValue: true,
              description: "Whether to show property image",
            },
            {
              key: "showPrice",
              label: "Show Price",
              type: "boolean",
              defaultValue: true,
              description: "Whether to show property price",
            },
            {
              key: "showDetails",
              label: "Show Details",
              type: "boolean",
              defaultValue: true,
              description:
                "Whether to show property details (bedrooms, bathrooms, area)",
            },
            {
              key: "showViews",
              label: "Show Views",
              type: "boolean",
              defaultValue: true,
              description: "Whether to show views counter",
            },
            {
              key: "showStatus",
              label: "Show Status",
              type: "boolean",
              defaultValue: true,
              description: "Whether to show property status badge",
            },
          ],
        },
        {
          key: "content",
          label: "Content",
          type: "object",
          fields: [
            {
              key: "title",
              label: "Section Title",
              type: "text",
            },
            {
              key: "subtitle",
              label: "Section Subtitle",
              type: "text",
            },
            {
              key: "emptyMessage",
              label: "Empty State Message",
              type: "text",
            },
          ],
        },
        {
          key: "styling",
          label: "Styling",
          type: "object",
          fields: [
            {
              key: "bgColor",
              label: "Background Color",
              type: "text", // Keep as text for transparent/white backgrounds
            },
            {
              key: "textColor",
              label: "Text Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "secondary", // Text uses secondary color
            },
            {
              key: "titleColor",
              label: "Title Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "secondary", // Title uses secondary color
            },
            {
              key: "subtitleColor",
              label: "Subtitle Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "secondary", // Subtitle uses secondary color
            },
            {
              key: "gridGap",
              label: "Grid Gap",
              type: "text",
            },
            {
              key: "maxWidth",
              label: "Max Width",
              type: "text",
            },
          ],
        },
        {
          key: "dataSource",
          label: "Data Source",
          type: "object",
          fields: [
            {
              key: "apiUrl",
              label: "API URL",
              type: "select",
              defaultValue: "/v1/tenant-website/{{tenantID}}/properties",
              options: [
                {
                  value: "/v1/tenant-website/{{tenantID}}/properties",
                  label: "All Properties",
                },
                {
                  value: "/v1/tenant-website/{{tenantID}}/projects",
                  label: "Projects",
                },
                {
                  value: "/api/posts",
                  label: "Blogs",
                },
                {
                  value:
                    "/v1/tenant-website/{{tenantID}}/properties?purpose=sale&latest=1",
                  label: "Latest Sales",
                },
                {
                  value:
                    "/v1/tenant-website/{{tenantID}}/properties?purpose=rent",
                  label: "Rentals",
                },
              ],
              description: "API endpoint to fetch data",
            },
            {
              key: "enabled",
              label: "Use API Data",
              type: "boolean",
              defaultValue: true,
              description: "Whether to fetch data from API or use static data",
            },
          ],
        },
        {
          key: "layout",
          label: "Layout Settings",
          type: "object",
          fields: [
            {
              key: "columns",
              label: "Grid Columns",
              type: "object",
              fields: [
                {
                  key: "mobile",
                  label: "Mobile Columns",
                  type: "number",
                },
                {
                  key: "tablet",
                  label: "Tablet Columns",
                  type: "number",
                },
                {
                  key: "desktop",
                  label: "Desktop Columns",
                  type: "number",
                },
                {
                  key: "large",
                  label: "Large Desktop Columns",
                  type: "number",
                },
              ],
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
                },
                {
                  key: "bottom",
                  label: "Bottom Padding",
                  type: "text",
                },
                {
                  key: "horizontal",
                  label: "Horizontal Padding",
                  type: "text",
                },
              ],
            },
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "content.title", label: "Section Title", type: "text" },
        { key: "content.subtitle", label: "Section Subtitle", type: "text" },
        {
          key: "content.emptyMessage",
          label: "Empty State Message",
          type: "text",
        },
        {
          key: "dataSource.apiUrl",
          label: "API URL",
          type: "select",
          defaultValue: "/v1/tenant-website/{{tenantID}}/properties",
          options: [
            {
              value: "/v1/tenant-website/{{tenantID}}/properties",
              label: "All Properties",
            },
            {
              value: "/v1/tenant-website/{{tenantID}}/projects",
              label: "Projects",
            },
            {
              value: "/api/posts",
              label: "Blogs",
            },
            {
              value:
                "/v1/tenant-website/{{tenantID}}/properties?purpose=sale&latest=1",
              label: "Latest Sales",
            },
            {
              value: "/v1/tenant-website/{{tenantID}}/properties?purpose=rent",
              label: "Rentals",
            },
          ],
          description: "API endpoint to fetch data",
        },
        {
          key: "dataSource.enabled",
          label: "Use API Data",
          type: "boolean",
          defaultValue: true,
          description: "Whether to fetch data from API or use static data",
        },
      ],
    },
    {
      id: "grid1Advanced",
      name: "Property Grid 1 - Advanced Settings",
      description:
        "Advanced property grid with comprehensive card customization",
      fields: [
        {
          key: "visible",
          label: "Visible",
          type: "boolean",
          defaultValue: true,
          description: "Whether the component is visible",
        },
        {
          key: "cardSettings",
          label: "تحديد شكل الكارت",
          type: "object",
          fields: [
            {
              key: "theme",
              label: "Card Theme",
              type: "select",
              defaultValue: "card1",
              options: [
                {
                  value: "card1",
                  label: "Card 1 - Classic",
                },
                {
                  value: "card2",
                  label: "Card 2 - Modern",
                },
                {
                  value: "card3",
                  label: "Card 3 - Vertical Overlay",
                },
                {
                  value: "card4",
                  label: "Card 4",
                },
                {
                  value: "card5",
                  label: "Card 5",
                },
              ],
              description: "Choose the card theme/design",
            },
            {
              key: "showImage",
              label: "Show Image",
              type: "boolean",
              defaultValue: true,
              description: "Whether to show property image",
            },
            {
              key: "showPrice",
              label: "Show Price",
              type: "boolean",
              defaultValue: true,
              description: "Whether to show property price",
            },
            {
              key: "showDetails",
              label: "Show Details",
              type: "boolean",
              defaultValue: true,
              description:
                "Whether to show property details (bedrooms, bathrooms, area)",
            },
            {
              key: "showViews",
              label: "Show Views",
              type: "boolean",
              defaultValue: true,
              description: "Whether to show views counter",
            },
            {
              key: "showStatus",
              label: "Show Status",
              type: "boolean",
              defaultValue: true,
              description: "Whether to show property status badge",
            },
            {
              key: "cardStyle",
              label: "Card Style",
              type: "object",
              fields: [
                {
                  key: "borderRadius",
                  label: "Border Radius",
                  type: "text",
                  defaultValue: "rounded-xl",
                  description: "Border radius for the card",
                },
                {
                  key: "shadow",
                  label: "Shadow",
                  type: "select",
                  defaultValue: "lg",
                  options: [
                    { value: "none", label: "No Shadow" },
                    { value: "sm", label: "Small Shadow" },
                    { value: "md", label: "Medium Shadow" },
                    { value: "lg", label: "Large Shadow" },
                    { value: "xl", label: "Extra Large Shadow" },
                  ],
                  description: "Shadow intensity for the card",
                },
                {
                  key: "hoverEffect",
                  label: "Hover Effect",
                  type: "select",
                  defaultValue: "scale",
                  options: [
                    { value: "none", label: "No Effect" },
                    { value: "scale", label: "Scale Up" },
                    { value: "lift", label: "Lift Up" },
                    { value: "glow", label: "Glow Effect" },
                  ],
                  description: "Hover effect for the card",
                },
              ],
            },
            {
              key: "imageSettings",
              label: "Image Settings",
              type: "object",
              fields: [
                {
                  key: "aspectRatio",
                  label: "Aspect Ratio",
                  type: "select",
                  defaultValue: "16/10",
                  options: [
                    { value: "1/1", label: "Square (1:1)" },
                    { value: "4/3", label: "Standard (4:3)" },
                    { value: "16/10", label: "Widescreen (16:10)" },
                    { value: "16/9", label: "HD (16:9)" },
                    { value: "21/9", label: "Ultrawide (21:9)" },
                  ],
                  description: "Aspect ratio for property images",
                },
                {
                  key: "objectFit",
                  label: "Object Fit",
                  type: "select",
                  defaultValue: "cover",
                  options: [
                    { value: "cover", label: "Cover" },
                    { value: "contain", label: "Contain" },
                    { value: "fill", label: "Fill" },
                    { value: "scale-down", label: "Scale Down" },
                  ],
                  description: "How the image should fit in the container",
                },
              ],
            },
            {
              key: "contentSettings",
              label: "Content Settings",
              type: "object",
              fields: [
                {
                  key: "titleStyle",
                  label: "Title Style",
                  type: "object",
                  fields: [
                    {
                      key: "fontSize",
                      label: "Font Size",
                      type: "select",
                      defaultValue: "lg",
                      options: [
                        { value: "sm", label: "Small" },
                        { value: "base", label: "Base" },
                        { value: "lg", label: "Large" },
                        { value: "xl", label: "Extra Large" },
                        { value: "2xl", label: "2X Large" },
                      ],
                      description: "Font size for the title",
                    },
                    {
                      key: "fontWeight",
                      label: "Font Weight",
                      type: "select",
                      defaultValue: "bold",
                      options: [
                        { value: "normal", label: "Normal" },
                        { value: "medium", label: "Medium" },
                        { value: "semibold", label: "Semi Bold" },
                        { value: "bold", label: "Bold" },
                        { value: "extrabold", label: "Extra Bold" },
                      ],
                      description: "Font weight for the title",
                    },
                    {
                      key: "color",
                      label: "Color",
                      type: "color",
                      defaultValue: "#1f2937",
                      description: "Title color",
                      useDefaultColor: true,
                      globalColorType: "secondary", // Title uses secondary color
                    },
                  ],
                },
                {
                  key: "priceStyle",
                  label: "Price Style",
                  type: "object",
                  fields: [
                    {
                      key: "fontSize",
                      label: "Font Size",
                      type: "select",
                      defaultValue: "xl",
                      options: [
                        { value: "sm", label: "Small" },
                        { value: "base", label: "Base" },
                        { value: "lg", label: "Large" },
                        { value: "xl", label: "Extra Large" },
                        { value: "2xl", label: "2X Large" },
                      ],
                      description: "Font size for the price",
                    },
                    {
                      key: "color",
                      label: "Color",
                      type: "color",
                      defaultValue: "#059669",
                      description: "Price color",
                      useDefaultColor: true,
                      globalColorType: "primary", // Price uses primary color
                    },
                    {
                      key: "currency",
                      label: "Currency Symbol",
                      type: "text",
                      defaultValue: "ريال",
                      description: "Currency symbol to display",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          key: "dataSource",
          label: "Data Source",
          type: "object",
          fields: [
            {
              key: "apiUrl",
              label: "API URL",
              type: "select",
              defaultValue: "/v1/tenant-website/{{tenantID}}/properties",
              options: [
                {
                  value: "/v1/tenant-website/{{tenantID}}/properties",
                  label: "All Properties",
                },
                {
                  value: "/v1/tenant-website/{{tenantID}}/projects",
                  label: "Projects",
                },
                {
                  value: "/api/posts",
                  label: "Blogs",
                },
                {
                  value:
                    "/v1/tenant-website/{{tenantID}}/properties?purpose=sale&latest=1",
                  label: "Latest Sales",
                },
                {
                  value:
                    "/v1/tenant-website/{{tenantID}}/properties?purpose=rent",
                  label: "Rentals",
                },
              ],
              description: "API endpoint to fetch data",
            },
            {
              key: "enabled",
              label: "Use API Data",
              type: "boolean",
              defaultValue: true,
              description: "Whether to fetch data from API or use static data",
            },
            {
              key: "cache",
              label: "Cache Settings",
              type: "object",
              fields: [
                {
                  key: "enabled",
                  label: "Enable Cache",
                  type: "boolean",
                  defaultValue: true,
                  description: "Whether to cache API responses",
                },
                {
                  key: "duration",
                  label: "Cache Duration (minutes)",
                  type: "number",
                  defaultValue: 30,
                  description: "How long to cache the data in minutes",
                },
              ],
            },
          ],
        },
        {
          key: "content",
          label: "Content Settings",
          type: "object",
          fields: [
            {
              key: "title",
              label: "Section Title",
              type: "text",
              defaultValue: "العقارات المتاحة",
              description: "Main section title",
            },
            {
              key: "subtitle",
              label: "Section Subtitle",
              type: "text",
              defaultValue: "اكتشف أفضل العقارات المتاحة",
              description: "Section subtitle",
            },
            {
              key: "emptyMessage",
              label: "Empty State Message",
              type: "text",
              defaultValue: "لم يتم العثور على نتائج.",
              description: "Message to show when no properties are found",
            },
          ],
        },
        {
          key: "layout",
          label: "Layout Settings",
          type: "object",
          fields: [
            {
              key: "gridColumns",
              label: "Grid Columns",
              type: "object",
              fields: [
                {
                  key: "desktop",
                  label: "Desktop",
                  type: "number",
                  defaultValue: 4,
                  description: "Number of columns on desktop",
                },
                {
                  key: "tablet",
                  label: "Tablet",
                  type: "number",
                  defaultValue: 3,
                  description: "Number of columns on tablet",
                },
                {
                  key: "mobile",
                  label: "Mobile",
                  type: "number",
                  defaultValue: 2,
                  description: "Number of columns on mobile",
                },
              ],
            },
            {
              key: "gap",
              label: "Grid Gap",
              type: "text",
              defaultValue: "24px",
              description: "Gap between grid items",
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
                  defaultValue: "56px",
                  description: "Top padding for the section",
                },
                {
                  key: "bottom",
                  label: "Bottom Padding",
                  type: "text",
                  defaultValue: "56px",
                  description: "Bottom padding for the section",
                },
                {
                  key: "horizontal",
                  label: "Horizontal Padding",
                  type: "text",
                  defaultValue: "24px",
                  description: "Horizontal padding for the section",
                },
              ],
            },
          ],
        },
        {
          key: "pagination",
          label: "Pagination Settings",
          type: "object",
          fields: [
            {
              key: "enabled",
              label: "Enable Pagination",
              type: "boolean",
              defaultValue: true,
              description: "Whether to show pagination",
            },
            {
              key: "itemsPerPage",
              label: "Items Per Page",
              type: "number",
              defaultValue: 12,
              description: "Number of items per page",
            },
            {
              key: "showPageNumbers",
              label: "Show Page Numbers",
              type: "boolean",
              defaultValue: true,
              description: "Whether to show page numbers",
            },
          ],
        },
        {
          key: "background",
          label: "Background Settings",
          type: "object",
          fields: [
            {
              key: "color",
              label: "Background Color",
              type: "text",
              defaultValue: "transparent",
              description: "Background color for the section",
            },
            {
              key: "gradient",
              label: "Gradient Background",
              type: "object",
              fields: [
                {
                  key: "enabled",
                  label: "Enabled",
                  type: "boolean",
                  defaultValue: false,
                  description: "Whether to use gradient background",
                },
                {
                  key: "from",
                  label: "From Color",
                  type: "text",
                  defaultValue: "#ffffff",
                  description: "Gradient start color",
                },
                {
                  key: "to",
                  label: "To Color",
                  type: "text",
                  defaultValue: "#f3f4f6",
                  description: "Gradient end color",
                },
                {
                  key: "direction",
                  label: "Direction",
                  type: "select",
                  defaultValue: "to-br",
                  options: [
                    { value: "to-r", label: "To Right" },
                    { value: "to-l", label: "To Left" },
                    { value: "to-t", label: "To Top" },
                    { value: "to-b", label: "To Bottom" },
                    { value: "to-tr", label: "To Top Right" },
                    { value: "to-tl", label: "To Top Left" },
                    { value: "to-br", label: "To Bottom Right" },
                    { value: "to-bl", label: "To Bottom Left" },
                  ],
                  description: "Gradient direction",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
