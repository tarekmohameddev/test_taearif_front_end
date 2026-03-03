import { ComponentStructure } from "./types";

export const propertiesShowcaseStructure: ComponentStructure = {
  componentType: "propertiesShowcase",
  variants: [
    {
      id: "propertiesShowcase1",
      name: "Properties Showcase 1 - Grid Layout",
      fields: [
        // LAYOUT CONFIGURATION
        // ═══════════════════════════════════════════════════════════
        {
          key: "layout",
          label: "Layout",
          type: "object",
          fields: [
            {
              key: "maxWidth",
              label: "Max Width",
              type: "text",
              placeholder: "7xl",
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
            {
              key: "gap",
              label: "Gap Between Cards",
              type: "text",
              placeholder: "1.5rem",
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
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // CONTENT
        // ═══════════════════════════════════════════════════════════
        {
          key: "content",
          label: "Content",
          type: "object",
          fields: [
            {
              key: "title",
              label: "Section Title",
              type: "text",
              placeholder: "المشاريع والعقارات",
            },
            {
              key: "showLoadMoreButton",
              label: "Show Load More Button",
              type: "boolean",
            },
            {
              key: "loadMoreButtonText",
              label: "Load More Button Text",
              type: "text",
              placeholder: "تحميل المزيد",
              condition: {
                field: "showLoadMoreButton",
                value: true,
              },
            },
            {
              key: "viewAllButtonText",
              label: "View All Button Text",
              type: "text",
              placeholder: "عرض الكل",
            },
            {
              key: "cardType",
              label: "Card Type",
              type: "select",
              options: [
                { value: "card1", label: "Card 1" },
                { value: "card2", label: "Card 2" },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // DATA SOURCE
        // ═══════════════════════════════════════════════════════════
        {
          key: "dataSource",
          label: "Data Source",
          type: "object",
          fields: [
            {
              key: "apiUrl",
              label: "API URL",
              type: "select",
              placeholder:
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
            },
            {
              key: "enabled",
              label: "Use API Data",
              type: "boolean",
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
              useMainBgColor: true,
              description: "لون خلفية المكون. يمكنك استخدام Main Background Color من إعدادات التاجر أو لون مخصص.",
            },
            {
              key: "titleColor",
              label: "Title Color",
              type: "color",
            },
            {
              key: "dividerColor",
              label: "Divider Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "primary",
              description: "لون الشريط تحت العنوان. يمكنك استخدام Primary/Secondary/Accent Color من إعدادات التاجر أو لون مخصص.",
            },
            {
              key: "viewAllButtonColor",
              label: "View All Button Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "primary",
              description: "لون زر 'عرض الكل'. يمكنك استخدام Primary/Secondary/Accent Color من إعدادات التاجر أو لون مخصص.",
            },
            {
              key: "viewAllButtonHoverColor",
              label: "View All Button Hover Color",
              type: "color",
            },
            {
              key: "loadMoreButtonColor",
              label: "Load More Button Border Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "primary",
              description: "لون border و text لزر 'تحميل المزيد'. يمكنك استخدام Primary/Secondary/Accent Color من إعدادات التاجر أو لون مخصص.",
            },
            {
              key: "loadMoreButtonHoverColor",
              label: "Load More Button Hover Background",
              type: "color",
            },
            {
              key: "loadMoreButtonTextColor",
              label: "Load More Button Text Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "primary",
              description: "لون نص زر 'تحميل المزيد'. يمكنك استخدام Primary/Secondary/Accent Color من إعدادات التاجر أو لون مخصص.",
            },
            {
              key: "loadMoreButtonHoverTextColor",
              label: "Load More Button Hover Text Color",
              type: "color",
            },
            {
              key: "priceBackgroundColor",
              label: "Price Background Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "primary",
              description: "خلفية السعر في البطاقات. يمكنك استخدام Primary/Secondary/Accent Color من إعدادات التاجر أو لون مخصص.",
            },
            {
              key: "iconsColor",
              label: "Icons Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "primary",
              description: "لون الأيقونات الخاصة بالخواص (المساحة، الغرف، إلخ). يمكنك استخدام Primary/Secondary/Accent Color من إعدادات التاجر أو لون مخصص.",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TYPOGRAPHY
        // ═══════════════════════════════════════════════════════════
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
                      type: "number",
                      unit: "px",
                      defaultValue: 20,
                    },
                    {
                      key: "tablet",
                      label: "Tablet",
                      type: "number",
                      unit: "px",
                      defaultValue: 24,
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "number",
                      unit: "px",
                      defaultValue: 30,
                    },
                  ],
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "bold",
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

        // ═══════════════════════════════════════════════════════════
        // RESPONSIVE
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
        { key: "content.title", label: "Title", type: "text" },
        {
          key: "dataSource",
          label: "Data Source",
          type: "object",
          fields: [
            {
              key: "apiUrl",
              label: "API URL",
              type: "select",
              placeholder:
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
            },
            {
              key: "enabled",
              label: "Use API Data",
              type: "boolean",
            },
          ],
        },

      ],
    },
  ],
};
