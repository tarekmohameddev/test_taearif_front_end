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
              key: "loadMoreButtonText",
              label: "Load More Button Text",
              type: "text",
              placeholder: "تحميل المزيد",
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
        // PROPERTIES - ARRAY OF OBJECTS
        // ═══════════════════════════════════════════════════════════
        {
          key: "properties",
          label: "Properties",
          type: "array",
          addLabel: "Add Property",
          itemLabel: "Property",
          of: [
            {
              key: "id",
              label: "Property ID",
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
              label: "Property Title",
              type: "text",
              placeholder: "مشروع سكني فاخر",
            },
            {
              key: "city",
              label: "City",
              type: "text",
              placeholder: "الرياض",
            },
            {
              key: "district",
              label: "District",
              type: "text",
              placeholder: "حي النرجس",
            },
            {
              key: "status",
              label: "Status",
              type: "text",
              placeholder: "للبيع",
            },
            {
              key: "area",
              label: "Area",
              type: "object",
              fields: [
                {
                  key: "min",
                  label: "Min Area",
                  type: "number",
                  placeholder: "150",
                },
                {
                  key: "max",
                  label: "Max Area",
                  type: "number",
                  placeholder: "300",
                },
              ],
            },
            {
              key: "rooms",
              label: "Rooms",
              type: "object",
              fields: [
                {
                  key: "min",
                  label: "Min Rooms",
                  type: "number",
                  placeholder: "3",
                },
                {
                  key: "max",
                  label: "Max Rooms",
                  type: "number",
                  placeholder: "5",
                },
              ],
            },
            {
              key: "units",
              label: "Units",
              type: "number",
              placeholder: "50",
            },
            {
              key: "floors",
              label: "Floors",
              type: "object",
              fields: [
                {
                  key: "min",
                  label: "Min Floors",
                  type: "number",
                  placeholder: "3",
                },
                {
                  key: "max",
                  label: "Max Floors",
                  type: "number",
                  placeholder: "5",
                },
              ],
            },
            {
              key: "price",
              label: "Price",
              type: "object",
              fields: [
                {
                  key: "min",
                  label: "Min Price",
                  type: "number",
                  placeholder: "500000",
                },
                {
                  key: "max",
                  label: "Max Price",
                  type: "number",
                  placeholder: "1500000",
                },
              ],
            },
            {
              key: "bathrooms",
              label: "Bathrooms",
              type: "object",
              fields: [
                {
                  key: "min",
                  label: "Min Bathrooms",
                  type: "number",
                  placeholder: "2",
                },
                {
                  key: "max",
                  label: "Max Bathrooms",
                  type: "number",
                  placeholder: "4",
                },
              ],
            },
            {
              key: "featured",
              label: "Featured",
              type: "boolean",
            },
            {
              key: "url",
              label: "URL",
              type: "text",
              placeholder: "#",
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
              key: "titleColor",
              label: "Title Color",
              type: "color",
            },
            {
              key: "dividerColor",
              label: "Divider Color",
              type: "color",
            },
            {
              key: "viewAllButtonColor",
              label: "View All Button Color",
              type: "color",
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
            },
            {
              key: "loadMoreButtonHoverTextColor",
              label: "Load More Button Hover Text Color",
              type: "color",
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
                      type: "text",
                      placeholder: "xl",
                    },
                    {
                      key: "tablet",
                      label: "Tablet",
                      type: "text",
                      placeholder: "2xl",
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "text",
                      placeholder: "3xl",
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
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "content.title", label: "Title", type: "text" },
        { key: "properties", label: "Properties", type: "array" },
      ],
    },
  ],
};
