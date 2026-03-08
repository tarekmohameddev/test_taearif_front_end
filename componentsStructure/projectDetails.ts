import { ComponentStructure } from "./types";

export const projectDetailsStructure: ComponentStructure = {
  componentType: "projectDetails",
  variants: [
    {
      id: "projectDetails1",
      name: "Project Details 1 - Full Layout",
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
              label: "Gap Between Sections",
              type: "number",
              placeholder: "32",
              unit: "px",
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
              key: "primaryColor",
              label: "Primary Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "primary",
            },
            {
              key: "textColor",
              label: "Text Color",
              type: "color",
            },
            {
              key: "secondaryTextColor",
              label: "Secondary Text Color",
              type: "color",
            },
            {
              key: "cardBackgroundColor",
              label: "Card Background Color",
              type: "color",
            },
            {
              key: "borderColor",
              label: "Border Color",
              type: "color",
            },
            {
              key: "badgeBackgroundColor",
              label: "Badge Background Color",
              type: "color",
            },
            {
              key: "badgeTextColor",
              label: "Badge Text Color",
              type: "color",
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
              key: "badgeText",
              label: "Badge Text",
              type: "text",
              placeholder: "مشروع عقاري",
            },
            {
              key: "similarProjectsTitle",
              label: "Similar Projects Title",
              type: "text",
              placeholder: "مشاريع مشابهة",
            },
            {
              key: "floorplansTitle",
              label: "Floorplans Title",
              type: "text",
              placeholder: "مخططات الأرضية",
            },
            {
              key: "locationTitle",
              label: "Location Title",
              type: "text",
              placeholder: "موقع المشروع",
            },
            {
              key: "openInGoogleMapsText",
              label: "Open in Google Maps Text",
              type: "text",
              placeholder: "فتح في خرائط جوجل",
            },
            {
              key: "shareTitle",
              label: "Share Dialog Title",
              type: "text",
              placeholder: "مشاركة المشروع",
            },
            {
              key: "shareDescription",
              label: "Share Dialog Description",
              type: "text",
              placeholder: "شارك هذا المشروع مع أصدقائك",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // DISPLAY SETTINGS
        // ═══════════════════════════════════════════════════════════
        {
          key: "displaySettings",
          label: "Display Settings",
          type: "object",
          fields: [
            {
              key: "showAddress",
              label: "Show Address",
              type: "boolean",
            },
            {
              key: "showDeveloper",
              label: "Show Developer",
              type: "boolean",
            },
            {
              key: "showUnits",
              label: "Show Units",
              type: "boolean",
            },
            {
              key: "showCompletionDate",
              label: "Show Completion Date",
              type: "boolean",
            },
            {
              key: "showCompleteStatus",
              label: "Show Complete Status",
              type: "boolean",
            },
            {
              key: "showMinPrice",
              label: "Show Min Price",
              type: "boolean",
            },
            {
              key: "showMaxPrice",
              label: "Show Max Price",
              type: "boolean",
            },
            {
              key: "showVideoUrl",
              label: "Show Video URL",
              type: "boolean",
            },
            {
              key: "showLocation",
              label: "Show Location",
              type: "boolean",
            },
            {
              key: "showCreatedAt",
              label: "Show Created At",
              type: "boolean",
            },
            {
              key: "showUpdatedAt",
              label: "Show Updated At",
              type: "boolean",
            },
            {
              key: "showAmenities",
              label: "Show Amenities",
              type: "boolean",
            },
            {
              key: "showSpecifications",
              label: "Show Specifications",
              type: "boolean",
            },
            {
              key: "showTypes",
              label: "Show Types",
              type: "boolean",
            },
            {
              key: "showFeatures",
              label: "Show Features",
              type: "boolean",
            },
            {
              key: "showStatus",
              label: "Show Status",
              type: "boolean",
            },
            {
              key: "showFloorplans",
              label: "Show Floorplans",
              type: "boolean",
            },
            {
              key: "showMap",
              label: "Show Map",
              type: "boolean",
            },
            {
              key: "showSimilarProjects",
              label: "Show Similar Projects",
              type: "boolean",
            },
            {
              key: "showShareButton",
              label: "Show Share Button",
              type: "boolean",
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
                      type: "number",
                      unit: "px",
                      defaultValue: 14,
                    },
                    {
                      key: "tablet",
                      label: "Tablet",
                      type: "number",
                      unit: "px",
                      defaultValue: 16,
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "number",
                      unit: "px",
                      defaultValue: 18,
                    },
                  ],
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
              key: "price",
              label: "Price Typography",
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
                      defaultValue: 24,
                    },
                    {
                      key: "tablet",
                      label: "Tablet",
                      type: "number",
                      unit: "px",
                      defaultValue: 30,
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "number",
                      unit: "px",
                      defaultValue: 36,
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
        // SIMILAR PROJECTS SETTINGS
        // ═══════════════════════════════════════════════════════════
        {
          key: "similarProjects",
          label: "Similar Projects Settings",
          type: "object",
          fields: [
            {
              key: "enabled",
              label: "Enabled",
              type: "boolean",
            },
            {
              key: "limit",
              label: "Limit",
              type: "number",
              placeholder: "10",
            },
            {
              key: "showOnMobile",
              label: "Show on Mobile",
              type: "boolean",
            },
            {
              key: "showOnDesktop",
              label: "Show on Desktop",
              type: "boolean",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // GALLERY SETTINGS
        // ═══════════════════════════════════════════════════════════
        {
          key: "gallery",
          label: "Gallery Settings",
          type: "object",
          fields: [
            {
              key: "showThumbnails",
              label: "Show Thumbnails",
              type: "boolean",
            },
            {
              key: "autoplay",
              label: "Autoplay",
              type: "boolean",
            },
            {
              key: "showNavigation",
              label: "Show Navigation",
              type: "boolean",
            },
            {
              key: "thumbnailCount",
              label: "Thumbnail Count",
              type: "number",
              placeholder: "4",
            },
          ],
        },
      ],

      // ═══════════════════════════════════════════════════════════
      // SIMPLE FIELDS - For basic/simple editing mode
      // ═══════════════════════════════════════════════════════════
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "content.badgeText", label: "Badge Text", type: "text" },
        { key: "styling.primaryColor", label: "Primary Color", type: "color" },
        {
          key: "displaySettings.showSimilarProjects",
          label: "Show Similar Projects",
          type: "boolean",
        },
        {
          key: "displaySettings.showShareButton",
          label: "Show Share Button",
          type: "boolean",
        },
      ],
    },
    {
      id: "projectDetails2",
      name: "Project Details 2 - Hero Layout with Overlay",
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
              placeholder: "1280px",
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
                  placeholder: "0rem",
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
              key: "gap",
              label: "Gap Between Sections",
              type: "text",
              placeholder: "2rem",
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
              key: "primaryColor",
              label: "Primary Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "primary",
            },
            {
              key: "textAndFormColors",
              label: "Text & Form Colors",
              type: "object",
              displayAsGroup: true,
              groupFields: [
                {
                  key: "styling.textColor",
                  label: "Text Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary",
                },
                { key: "styling.secondaryTextColor", label: "Secondary Text Color", type: "color" },
                { key: "styling.formBackgroundColor", label: "Form Background Color", type: "color" },
                { key: "styling.formTextColor", label: "Form Text Color", type: "color" },
                { key: "styling.formButtonBackgroundColor", label: "Form Button Background Color", type: "color" },
                { key: "styling.formButtonTextColor", label: "Form Button Text Color", type: "color" },
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
              key: "descriptionTitle",
              label: "Description Title",
              type: "text",
              placeholder: "وصف المشروع",
            },
            {
              key: "specsTitle",
              label: "Specs Title",
              type: "text",
              placeholder: "مواصفات المشروع",
            },
            {
              key: "contactFormTitle",
              label: "Contact Form Title",
              type: "text",
              placeholder: "استفسر عن هذا المشروع",
            },
            {
              key: "contactFormDescription",
              label: "Contact Form Description",
              type: "text",
              placeholder: "استفسر عن المنزل واملأ البيانات لهذا المشروع",
            },
            {
              key: "videoTourText",
              label: "Video Tour Text",
              type: "text",
              placeholder: "جولة فيديو للمشروع",
            },
            {
              key: "submitButtonText",
              label: "Submit Button Text",
              type: "text",
              placeholder: "أرسل استفسارك",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // DISPLAY SETTINGS
        // ═══════════════════════════════════════════════════════════
        {
          key: "displaySettings",
          label: "Display Settings",
          type: "object",
          fields: [
            {
              key: "showDescription",
              label: "Show Description",
              type: "boolean",
            },
            {
              key: "showSpecs",
              label: "Show Specs",
              type: "boolean",
            },
            {
              key: "showContactForm",
              label: "Show Contact Form",
              type: "boolean",
            },
            {
              key: "showVideoUrl",
              label: "Show Video",
              type: "boolean",
            },
            {
              key: "showMap",
              label: "Show Map",
              type: "boolean",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // HERO SETTINGS
        // ═══════════════════════════════════════════════════════════
        {
          key: "hero",
          label: "Hero Section Settings",
          type: "object",
          fields: [
            {
              key: "height",
              label: "Hero Height",
              type: "number",
              placeholder: "500",
              unit: "px",
            },
            {
              key: "background",
              label: "Background",
              type: "object",
              fields: [
                {
                  key: "type",
                  label: "Background Type",
                  type: "badge-select",
                  options: [
                    {
                      label: "components_structure.basic.hero_background_color_only",
                      value: "colorOnly",
                    },
                    {
                      label: "components_structure.basic.hero_background_image_and_color",
                      value: "imageAndColor",
                    },
                    {
                      label: "components_structure.basic.hero_background_image_only",
                      value: "imageOnly",
                    },
                  ],
                  badgeConfig: {
                    mode: "single",
                    requiredAtLeastOne: true,
                    allowUnset: false,
                  },
                },
                {
                  key: "image",
                  label: "Background Image",
                  type: "image",
                  condition: { field: "type", value: "imageOnly" },
                },
                {
                  key: "image",
                  label: "Background Image",
                  type: "image",
                  condition: { field: "type", value: "imageAndColor" },
                },
                {
                  key: "color",
                  label: "Background Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary",
                  condition: { field: "type", value: "colorOnly" },
                },
                {
                  key: "overlay",
                  label: "Overlay",
                  type: "object",
                  condition: { field: "type", value: "imageAndColor" },
                  fields: [
                    {
                      key: "color",
                      label: "Overlay Color",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "primary",
                    },
                    {
                      key: "opacity",
                      label: "Overlay Opacity",
                      type: "number",
                      placeholder: "0.8",
                      min: 0,
                      max: 1,
                      step: 0.1,
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // GALLERY SETTINGS
        // ═══════════════════════════════════════════════════════════
        {
          key: "gallery",
          label: "Gallery Settings",
          type: "object",
          fields: [
            {
              key: "showThumbnails",
              label: "Show Thumbnails",
              type: "boolean",
            },
            {
              key: "thumbnailGridColumns",
              label: "Thumbnail Grid Columns",
              type: "number",
              placeholder: "4",
            },
            {
              key: "thumbnailHeight",
              label: "Thumbnail Height",
              type: "text",
              placeholder: "200px",
            },
          ],
        },
      ],

      // ═══════════════════════════════════════════════════════════
      // SIMPLE FIELDS - For basic/simple editing mode
      // ═══════════════════════════════════════════════════════════
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "styling.primaryColor", label: "Primary Color", type: "color" },
        {
          key: "displaySettings.showContactForm",
          label: "Show Contact Form",
          type: "boolean",
        },
        {
          key: "displaySettings.showDescription",
          label: "Show Description",
          type: "boolean",
        },
      ],
    },
  ],
};
