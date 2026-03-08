import { ComponentStructure } from "./types";

export const cardStructure: ComponentStructure = {
  componentType: "card",
  variants: [
    {
      id: "card4",
      name: "Card 4 - Property Card",
      fields: [
        // ═══════════════════════════════════════════════════════════
        // BASIC FIELDS
        // ═══════════════════════════════════════════════════════════
        {
          key: "visible",
          label: "Visible",
          type: "boolean",
        }, // ═══════════════════════════════════════════════════════════
        // PROPERTY DATA
        // ═══════════════════════════════════════════════════════════
        {
          key: "property",
          label: "Property",
          type: "object",
          fields: [
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
              label: "Area (m²)",
              type: "object",
              fields: [
                {
                  key: "min",
                  label: "Min",
                  type: "number",
                  placeholder: "150",
                },
                {
                  key: "max",
                  label: "Max",
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
                  label: "Min",
                  type: "number",
                  placeholder: "3",
                },
                {
                  key: "max",
                  label: "Max",
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
                  label: "Min",
                  type: "number",
                  placeholder: "3",
                },
                {
                  key: "max",
                  label: "Max",
                  type: "number",
                  placeholder: "5",
                },
              ],
            },
            {
              key: "price",
              label: "Price (SAR)",
              type: "object",
              fields: [
                {
                  key: "min",
                  label: "Min",
                  type: "number",
                  placeholder: "500000",
                },
                {
                  key: "max",
                  label: "Max",
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
                  label: "Min",
                  type: "number",
                  placeholder: "2",
                },
                {
                  key: "max",
                  label: "Max",
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
              key: "cardBackgroundColor",
              label: "Card Background Color",
              type: "color",
            },
            {
              key: "cardBorderRadius",
              label: "Card Border Radius",
              type: "text",
              placeholder: "20px",
            },
            {
              key: "cardShadow",
              label: "Card Shadow",
              type: "text",
              placeholder: "sm",
            },
            {
              key: "cardHoverShadow",
              label: "Card Hover Shadow",
              type: "text",
              placeholder: "md",
            },
            {
              key: "featuredBadgeBackground",
              label: "Featured Badge Background",
              type: "color",
            },
            {
              key: "featuredBadgeTextColor",
              label: "Featured Badge Text Color",
              type: "color",
            },
            {
              key: "titleColor",
              label: "Title Color",
              type: "color",
            },
            {
              key: "cityDistrictColor",
              label: "City/District Color",
              type: "color",
            },
            {
              key: "statusColor",
              label: "Status Color",
              type: "color",
            },
            {
              key: "dividerColor",
              label: "Divider Color",
              type: "color",
            },
            {
              key: "areaIconColor",
              label: "Area Icon Color",
              type: "color",
            },
            {
              key: "areaTextColor",
              label: "Area Text Color",
              type: "color",
            },
            {
              key: "areaLabelColor",
              label: "Area Label Color",
              type: "color",
            },
            {
              key: "roomsIconColor",
              label: "Rooms Icon Color",
              type: "color",
            },
            {
              key: "roomsTextColor",
              label: "Rooms Text Color",
              type: "color",
            },
            {
              key: "roomsLabelColor",
              label: "Rooms Label Color",
              type: "color",
            },
            {
              key: "unitsIconColor",
              label: "Units Icon Color",
              type: "color",
            },
            {
              key: "unitsTextColor",
              label: "Units Text Color",
              type: "color",
            },
            {
              key: "unitsLabelColor",
              label: "Units Label Color",
              type: "color",
            },
            {
              key: "floorsIconColor",
              label: "Floors Icon Color",
              type: "color",
            },
            {
              key: "floorsTextColor",
              label: "Floors Text Color",
              type: "color",
            },
            {
              key: "floorsLabelColor",
              label: "Floors Label Color",
              type: "color",
            },
            {
              key: "priceBackgroundColor",
              label: "Price Background Color",
              type: "color",
            },
            {
              key: "priceTextColor",
              label: "Price Text Color",
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
                  type: "number",
                  unit: "px",
                  defaultValue: 20,
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
            {
              key: "cityDistrict",
              label: "City/District Typography",
              type: "object",
              fields: [
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "number",
                  unit: "px",
                  defaultValue: 14,
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "normal",
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
              key: "status",
              label: "Status Typography",
              type: "object",
              fields: [
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "number",
                  unit: "px",
                  defaultValue: 18,
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "semibold",
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
              key: "detailLabel",
              label: "Detail Label Typography",
              type: "object",
              fields: [
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "number",
                  unit: "px",
                  defaultValue: 12,
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "normal",
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
              key: "detailValue",
              label: "Detail Value Typography",
              type: "object",
              fields: [
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "number",
                  unit: "px",
                  defaultValue: 14,
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "medium",
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
              key: "price",
              label: "Price Typography",
              type: "object",
              fields: [
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "number",
                  unit: "px",
                  defaultValue: 16,
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "medium",
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
                  type: "number",
                  placeholder: "250",
                  unit: "px",
                },
                {
                  key: "tablet",
                  label: "Tablet",
                  type: "number",
                  placeholder: "300",
                  unit: "px",
                },
                {
                  key: "desktop",
                  label: "Desktop",
                  type: "number",
                  placeholder: "337",
                  unit: "px",
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
        { key: "property.title", label: "Property Title", type: "text" },
        { key: "property.city", label: "City", type: "text" },
        { key: "property.district", label: "District", type: "text" },
        { key: "property.status", label: "Status", type: "text" },
        { key: "property.price", label: "Price", type: "object" },
      ],
    },
    {
      id: "card5",
      name: "Card 5 - Project Card with WhatsApp",
      fields: [
        // ═══════════════════════════════════════════════════════════
        // BASIC FIELDS
        // ═══════════════════════════════════════════════════════════
        {
          key: "visible",
          label: "Visible",
          type: "boolean",
        }, // ═══════════════════════════════════════════════════════════
        // PROPERTY DATA
        // ═══════════════════════════════════════════════════════════
        {
          key: "property",
          label: "Property",
          type: "object",
          fields: [
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
              label: "Area (m²)",
              type: "object",
              fields: [
                {
                  key: "min",
                  label: "Min",
                  type: "number",
                  placeholder: "150",
                },
                {
                  key: "max",
                  label: "Max",
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
                  label: "Min",
                  type: "number",
                  placeholder: "3",
                },
                {
                  key: "max",
                  label: "Max",
                  type: "number",
                  placeholder: "5",
                },
              ],
            },
            {
              key: "floors",
              label: "Floors",
              type: "object",
              fields: [
                {
                  key: "min",
                  label: "Min",
                  type: "number",
                  placeholder: "3",
                },
                {
                  key: "max",
                  label: "Max",
                  type: "number",
                  placeholder: "5",
                },
              ],
            },
            {
              key: "price",
              label: "Price (SAR)",
              type: "object",
              fields: [
                {
                  key: "min",
                  label: "Min",
                  type: "number",
                  placeholder: "500000",
                },
                {
                  key: "max",
                  label: "Max",
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
                  label: "Min",
                  type: "number",
                  placeholder: "2",
                },
                {
                  key: "max",
                  label: "Max",
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
              key: "cardBackgroundColor",
              label: "Card Background Color",
              type: "color",
            },
            {
              key: "cardBorderRadius",
              label: "Card Border Radius",
              type: "text",
              placeholder: "20px",
            },
            {
              key: "cardShadow",
              label: "Card Shadow",
              type: "text",
              placeholder: "sm",
            },
            {
              key: "cardHoverShadow",
              label: "Card Hover Shadow",
              type: "text",
              placeholder: "md",
            },
            {
              key: "featuredBadgeBackground",
              label: "Featured Badge Background",
              type: "color",
            },
            {
              key: "featuredBadgeTextColor",
              label: "Featured Badge Text Color",
              type: "color",
            },
            {
              key: "titleColor",
              label: "Title Color",
              type: "color",
            },
            {
              key: "cityDistrictColor",
              label: "City/District Color",
              type: "color",
            },
            {
              key: "statusColor",
              label: "Status Color",
              type: "color",
            },
            {
              key: "dividerColor",
              label: "Divider Color",
              type: "color",
            },
            {
              key: "areaIconColor",
              label: "Area Icon Color",
              type: "color",
            },
            {
              key: "areaTextColor",
              label: "Area Text Color",
              type: "color",
            },
            {
              key: "areaLabelColor",
              label: "Area Label Color",
              type: "color",
            },
            {
              key: "roomsIconColor",
              label: "Rooms Icon Color",
              type: "color",
            },
            {
              key: "roomsTextColor",
              label: "Rooms Text Color",
              type: "color",
            },
            {
              key: "roomsLabelColor",
              label: "Rooms Label Color",
              type: "color",
            },
            {
              key: "floorsIconColor",
              label: "Floors Icon Color",
              type: "color",
            },
            {
              key: "floorsTextColor",
              label: "Floors Text Color",
              type: "color",
            },
            {
              key: "floorsLabelColor",
              label: "Floors Label Color",
              type: "color",
            },
            {
              key: "bathroomsIconColor",
              label: "Bathrooms Icon Color",
              type: "color",
            },
            {
              key: "bathroomsTextColor",
              label: "Bathrooms Text Color",
              type: "color",
            },
            {
              key: "bathroomsLabelColor",
              label: "Bathrooms Label Color",
              type: "color",
            },
            {
              key: "priceTextColor",
              label: "Price Text Color",
              type: "color",
            },
            {
              key: "whatsappButtonBackground",
              label: "WhatsApp Button Background",
              type: "color",
            },
            {
              key: "whatsappButtonHoverBackground",
              label: "WhatsApp Button Hover Background",
              type: "color",
            },
            {
              key: "whatsappButtonTextColor",
              label: "WhatsApp Button Text Color",
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
                  type: "number",
                  unit: "px",
                  defaultValue: 20,
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
            {
              key: "cityDistrict",
              label: "City/District Typography",
              type: "object",
              fields: [
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "number",
                  unit: "px",
                  defaultValue: 14,
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "normal",
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
              key: "status",
              label: "Status Typography",
              type: "object",
              fields: [
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "number",
                  unit: "px",
                  defaultValue: 18,
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "semibold",
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
              key: "detailLabel",
              label: "Detail Label Typography",
              type: "object",
              fields: [
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "number",
                  unit: "px",
                  defaultValue: 12,
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "normal",
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
              key: "detailValue",
              label: "Detail Value Typography",
              type: "object",
              fields: [
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "number",
                  unit: "px",
                  defaultValue: 14,
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "medium",
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
              key: "price",
              label: "Price Typography",
              type: "object",
              fields: [
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "number",
                  unit: "px",
                  defaultValue: 16,
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
            {
              key: "whatsappButton",
              label: "WhatsApp Button Typography",
              type: "object",
              fields: [
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "number",
                  unit: "px",
                  defaultValue: 16,
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "semibold",
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
                  type: "number",
                  placeholder: "250",
                  unit: "px",
                },
                {
                  key: "tablet",
                  label: "Tablet",
                  type: "number",
                  placeholder: "300",
                  unit: "px",
                },
                {
                  key: "desktop",
                  label: "Desktop",
                  type: "number",
                  placeholder: "337",
                  unit: "px",
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
        { key: "property.title", label: "Property Title", type: "text" },
        { key: "property.city", label: "City", type: "text" },
        { key: "property.district", label: "District", type: "text" },
        { key: "property.status", label: "Status", type: "text" },
        { key: "property.price", label: "Price", type: "object" },
      ],
    },
  ],
};
