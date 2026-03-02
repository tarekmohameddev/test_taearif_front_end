import { ComponentStructure } from "./types";

export const propertySliderStructure: ComponentStructure = {
  componentType: "propertySlider",
  name: "Property Slider",
  variants: [
    {
      id: "propertySlider1",
      name: "Property Slider 1 - Modern Carousel",
      description: "Modern property slider with carousel functionality",
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
          key: "layout",
          label: "Layout",
          type: "object",
          fields: [
            {
              key: "maxWidth",
              label: "Max Width",
              type: "text",
              defaultValue: "1600px",
              description: "Maximum width of the section",
            },
            {
              key: "padding",
              label: "Padding",
              type: "object",
              fields: [
                {
                  key: "top",
                  label: "Top",
                  type: "text",
                  defaultValue: "56px",
                  description: "Top padding",
                },
                {
                  key: "bottom",
                  label: "Bottom",
                  type: "text",
                  defaultValue: "56px",
                  description: "Bottom padding",
                },
              ],
            },
          ],
        },
        {
          key: "spacing",
          label: "Spacing",
          type: "object",
          fields: [
            {
              key: "titleBottom",
              label: "Title Bottom Margin",
              type: "text",
              defaultValue: "24px",
              description: "Margin below the title section",
            },
            {
              key: "slideGap",
              label: "Slide Gap",
              type: "text",
              defaultValue: "16px",
              description: "Gap between slides",
            },
          ],
        },
        {
          key: "content",
          label: "Content",
          type: "object",
          fields: [
            {
              key: "titleGroup",
              label: "Title",
              type: "text",
              displayAsGroup: true,
              groupFields: [
                {
                  key: "content.showTitle",
                  label: "إظهار العنوان",
                  type: "boolean",
                  defaultValue: true,
                },
                {
                  key: "content.title",
                  label: "Title",
                  type: "text",
                  defaultValue: "أحدث العقارات للإيجار",
                  description: "Main section title",
                },
                {
                  key: "typography.title.color",
                  label: "Color",
                  type: "color",
                  defaultValue: "#1f2937",
                  useDefaultColor: true,
                  globalColorType: "secondary",
                },
                {
                  key: "typography.title.fontSize",
                  label: "Font Size",
                  type: "object",
                  fields: [
                    { key: "desktop", label: "Desktop", type: "number", unit: "px", defaultValue: 24 },
                    { key: "tablet", label: "Tablet", type: "number", unit: "px", defaultValue: 20 },
                    { key: "mobile", label: "Mobile", type: "number", unit: "px", defaultValue: 18 },
                  ],
                },
                {
                  key: "typography.title.extraSettings",
                  label: "إعدادات إضافية",
                  type: "object",
                  fields: [
                    { key: "fontWeight", label: "Font Weight", type: "text", defaultValue: "extrabold" },
                    { key: "letterSpacing", label: "Letter Spacing", type: "text", defaultValue: "0" },
                    { key: "marginBottom", label: "Margin Bottom", type: "number", defaultValue: 8, unit: "px" },
                  ],
                },
              ],
            },
            {
              key: "subtitleGroup",
              label: "Subtitle",
              type: "text",
              displayAsGroup: true,
              groupFields: [
                {
                  key: "content.showDescription",
                  label: "إظهار الوصف",
                  type: "boolean",
                  defaultValue: true,
                },
                {
                  key: "content.description",
                  label: "Description",
                  type: "text",
                  defaultValue:
                    "اكتشف أفضل العقارات المتاحة للإيجار في أفضل المواقع",
                  description: "Section description text",
                },
                {
                  key: "typography.subtitle.color",
                  label: "Color",
                  type: "color",
                  defaultValue: "#6b7280",
                  useDefaultColor: true,
                  globalColorType: "secondary",
                },
                {
                  key: "typography.subtitle.fontSize",
                  label: "Font Size",
                  type: "object",
                  fields: [
                    { key: "desktop", label: "Desktop", type: "number", unit: "px", defaultValue: 18 },
                    { key: "tablet", label: "Tablet", type: "number", unit: "px", defaultValue: 16 },
                    { key: "mobile", label: "Mobile", type: "number", unit: "px", defaultValue: 14 },
                  ],
                },
                {
                  key: "typography.subtitle.extraSettings",
                  label: "إعدادات إضافية",
                  type: "object",
                  fields: [
                    { key: "fontWeight", label: "Font Weight", type: "text", defaultValue: "normal" },
                    { key: "letterSpacing", label: "Letter Spacing", type: "text", defaultValue: "0" },
                    { key: "marginTop", label: "Margin Top", type: "number", defaultValue: 0, unit: "px" },
                    { key: "marginBottom", label: "Margin Bottom", type: "number", defaultValue: 0, unit: "px" },
                  ],
                },
              ],
            },
            {
              key: "showTitle",
              label: "Show Title",
              type: "boolean",
              defaultValue: true,
              description: "Whether to show the section title",
            },
            {
              key: "showDescription",
              label: "Show Description",
              type: "boolean",
              defaultValue: true,
              description: "Whether to show the section description",
            },
            {
              key: "title",
              label: "Title",
              type: "text",
              defaultValue: "أحدث العقارات للإيجار",
              description: "Main section title",
            },
            {
              key: "description",
              label: "Description",
              type: "text",
              defaultValue:
                "اكتشف أفضل العقارات المتاحة للإيجار في أفضل المواقع",
              description: "Section description text",
            },
            {
              key: "viewAllText",
              label: "View All Text",
              type: "text",
              defaultValue: "عرض الكل",
              description: "Text for view all link",
            },
            {
              key: "viewAllUrl",
              label: "View All URL",
              type: "text",
              defaultValue: "#",
              description: "URL for view all link",
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
              defaultValue:
                "/v1/tenant-website/{tenantId}/properties?purpose=rent&latest=1&limit=10",
              options: [
                {
                  value:
                    "/v1/tenant-website/{tenantId}/properties?purpose=rent&latest=1&limit=10",
                  label: "Latest Rentals",
                },
                {
                  value:
                    "/v1/tenant-website/{tenantId}/properties?purpose=sale&latest=1&limit=10",
                  label: "Latest Sales",
                },
                {
                  value:
                    "/v1/tenant-website/{tenantId}/projects?featured=1&limit=10",
                  label: "Latest Projects",
                },
              ],
              description: "API endpoint to fetch properties data",
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
                    { key: "desktop", label: "Desktop", type: "number", unit: "px", defaultValue: 24, description: "Desktop font size (px)" },
                    { key: "tablet", label: "Tablet", type: "number", unit: "px", defaultValue: 20, description: "Tablet font size (px)" },
                    { key: "mobile", label: "Mobile", type: "number", unit: "px", defaultValue: 18, description: "Mobile font size (px)" },
                  ],
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
                {
                  key: "extraSettings",
                  label: "إعدادات إضافية",
                  type: "object",
                  fields: [
                    { key: "fontWeight", label: "Font Weight", type: "text", defaultValue: "extrabold", description: "Font weight for title" },
                    { key: "letterSpacing", label: "Letter Spacing", type: "text", defaultValue: "0", description: "Letter spacing for title" },
                    { key: "marginBottom", label: "Margin Bottom", type: "number", defaultValue: 8, unit: "px", description: "Margin below title" },
                  ],
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
                    { key: "desktop", label: "Desktop", type: "number", unit: "px", defaultValue: 18, description: "Desktop font size (px)" },
                    { key: "tablet", label: "Tablet", type: "number", unit: "px", defaultValue: 16, description: "Tablet font size (px)" },
                    { key: "mobile", label: "Mobile", type: "number", unit: "px", defaultValue: 14, description: "Mobile font size (px)" },
                  ],
                },
                {
                  key: "color",
                  label: "Color",
                  type: "color",
                  defaultValue: "#6b7280",
                  description: "Subtitle color",
                  useDefaultColor: true,
                  globalColorType: "secondary", // Subtitle uses secondary color
                },
                {
                  key: "extraSettings",
                  label: "إعدادات إضافية",
                  type: "object",
                  fields: [
                    { key: "fontWeight", label: "Font Weight", type: "text", defaultValue: "normal", description: "Font weight for subtitle" },
                    { key: "letterSpacing", label: "Letter Spacing", type: "text", defaultValue: "0", description: "Letter spacing for subtitle" },
                    { key: "marginTop", label: "Margin Top", type: "number", defaultValue: 0, unit: "px", description: "Margin above subtitle" },
                    { key: "marginBottom", label: "Margin Bottom", type: "number", defaultValue: 0, unit: "px", description: "Margin below subtitle" },
                  ],
                },
              ],
            },
            {
              key: "link",
              label: "Link Typography",
              type: "object",
              fields: [
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "text",
                  defaultValue: "sm",
                  description: "Font size for link",
                },
                {
                  key: "color",
                  label: "Color",
                  type: "color",
                  defaultValue: "#059669",
                  description: "Link color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Link uses primary color
                },
                {
                  key: "hoverColor",
                  label: "Hover Color",
                  type: "color",
                  defaultValue: "#047857",
                  description: "Link hover color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Link hover uses primary color
                },
              ],
            },
          ],
        },
        {
          key: "carousel",
          label: "Carousel Settings",
          type: "object",
          fields: [
            {
              key: "desktopCount",
              label: "Desktop Slides Count",
              type: "number",
              defaultValue: 4,
              description: "Number of slides visible on desktop",
            },
            {
              key: "tabletCount",
              label: "Tablet Slides Count",
              type: "number",
              defaultValue: 3,
              description: "Number of slides visible on tablet",
            },
            {
              key: "mobileCount",
              label: "Mobile Slides Count",
              type: "number",
              defaultValue: 2,
              description: "Number of slides visible on mobile",
            },
            {
              key: "slideHeight",
              label: "Slide Height",
              type: "object",
              fields: [
                {
                  key: "desktop",
                  label: "Desktop",
                  type: "text",
                  defaultValue: "420px",
                  description: "Slide height on desktop",
                },
                {
                  key: "tablet",
                  label: "Tablet",
                  type: "text",
                  defaultValue: "400px",
                  description: "Slide height on tablet",
                },
                {
                  key: "mobile",
                  label: "Mobile",
                  type: "text",
                  defaultValue: "360px",
                  description: "Slide height on mobile",
                },
              ],
            },
            {
              key: "autoplay",
              label: "Autoplay",
              type: "boolean",
              defaultValue: true,
              description: "Whether carousel autoplays",
            },
            {
              key: "loop",
              label: "Loop",
              type: "boolean",
              defaultValue: true,
              description: "Whether carousel loops",
            },
            {
              key: "speed",
              label: "Speed",
              type: "number",
              defaultValue: 3000,
              description: "Autoplay speed in milliseconds",
            },
          ],
        },
        {
          key: "background",
          label: "Background",
          type: "object",
          fields: [
            {
              key: "color",
              label: "Color",
              type: "text",
              defaultValue: "transparent",
              description: "Background color",
            },
            {
              key: "image",
              label: "Image",
              type: "text",
              defaultValue: "",
              description: "Background image URL",
            },
            {
              key: "overlay",
              label: "Overlay",
              type: "object",
              fields: [
                {
                  key: "enabled",
                  label: "Enabled",
                  type: "boolean",
                  defaultValue: false,
                  description: "Whether overlay is enabled",
                },
                {
                  key: "color",
                  label: "Color",
                  type: "text",
                  defaultValue: "rgba(0, 0, 0, 0.5)",
                  description: "Overlay color",
                },
                {
                  key: "opacity",
                  label: "Opacity",
                  type: "text",
                  defaultValue: "0.5",
                  description: "Overlay opacity",
                },
              ],
            },
          ],
        },
        {
          key: "responsive",
          label: "Responsive",
          type: "object",
          fields: [
            {
              key: "mobile",
              label: "Mobile",
              type: "object",
              fields: [
                {
                  key: "titleButtonLayout",
                  label: "Title Button Layout",
                  type: "text",
                  defaultValue: "side-by-side",
                  description: "Layout of title and button on mobile",
                },
                {
                  key: "descriptionPosition",
                  label: "Description Position",
                  type: "text",
                  defaultValue: "below",
                  description: "Position of description on mobile",
                },
              ],
            },
            {
              key: "tablet",
              label: "Tablet",
              type: "object",
              fields: [
                {
                  key: "titleButtonLayout",
                  label: "Title Button Layout",
                  type: "text",
                  defaultValue: "stacked",
                  description: "Layout of title and button on tablet",
                },
              ],
            },
            {
              key: "desktop",
              label: "Desktop",
              type: "object",
              fields: [
                {
                  key: "titleButtonLayout",
                  label: "Title Button Layout",
                  type: "text",
                  defaultValue: "stacked",
                  description: "Layout of title and button on desktop",
                },
              ],
            },
          ],
        },
        {
          key: "animations",
          label: "Animations",
          type: "object",
          fields: [
            {
              key: "carousel",
              label: "Carousel Animation",
              type: "object",
              fields: [
                {
                  key: "enabled",
                  label: "Enabled",
                  type: "boolean",
                  defaultValue: true,
                  description: "Whether carousel animation is enabled",
                },
                {
                  key: "type",
                  label: "Type",
                  type: "text",
                  defaultValue: "slide",
                  description: "Animation type for carousel",
                },
                {
                  key: "duration",
                  label: "Duration",
                  type: "number",
                  defaultValue: 500,
                  description: "Animation duration in milliseconds",
                },
                {
                  key: "easing",
                  label: "Easing",
                  type: "text",
                  defaultValue: "ease-in-out",
                  description: "Animation easing function",
                },
              ],
            },
          ],
        },
      ],
      simpleFields: [
        {
          key: "visible",
          label: "Visible",
          type: "boolean",
          defaultValue: true,
          description: "Whether the component is visible",
        },
        {
          key: "content.showTitle",
          label: "Show Title",
          type: "boolean",
          defaultValue: true,
          description: "Whether to show the section title",
        },
        {
          key: "content.showDescription",
          label: "Show Description",
          type: "boolean",
          defaultValue: true,
          description: "Whether to show the section description",
        },
        {
          key: "content.title",
          label: "Title",
          type: "text",
          defaultValue: "أحدث العقارات للإيجار",
          description: "Main section title",
        },
        {
          key: "content.description",
          label: "Description",
          type: "text",
          defaultValue: "اكتشف أفضل العقارات المتاحة للإيجار في أفضل المواقع",
          description: "Section description text",
        },
        {
          key: "content.viewAllText",
          label: "View All Text",
          type: "text",
          defaultValue: "عرض الكل",
          description: "Text for view all link",
        },
        {
          key: "content.viewAllUrl",
          label: "View All URL",
          type: "text",
          defaultValue: "#",
          description: "URL for view all link",
        },
      ],
    },
  ],
};
