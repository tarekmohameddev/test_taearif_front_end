import { ComponentStructure } from "./types";

export const heroStructure: ComponentStructure = {
  componentType: "hero",
  variants: [
    {
      id: "hero1",
      name: "Hero 1 - Modern Search",
      fields: [
        {
          key: "height",
          label: "Height",
          type: "object",
          fields: [
            {
              key: "desktop",
              label: "Desktop",
              type: "text",
              placeholder: "90vh",
            },
            {
              key: "tablet",
              label: "Tablet",
              type: "text",
              placeholder: "80vh",
            },
            {
              key: "mobile",
              label: "Mobile",
              type: "text",
              placeholder: "70vh",
            },
          ],
        },
        {
          key: "background",
          label: "Background",
          type: "object",
          fields: [
            { key: "image", label: "Image URL", type: "image" },
            { key: "alt", label: "Alt Text", type: "text" },
            {
              key: "overlay",
              label: "Overlay",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "opacity",
                  label: "Opacity",
                  type: "text",
                  placeholder: "0.45",
                },
                { key: "color", label: "Color", type: "color" },
              ],
            },
          ],
        },
        {
          key: "content",
          label: "Content",
          type: "object",
          fields: [
            { key: "title", label: "Title", type: "text" },
            { key: "subtitle", label: "Subtitle", type: "text" },
            { key: "paddingTop", label: "Padding Top", type: "text" },
            {
              key: "font",
              label: "Font Settings",
              type: "object",
              fields: [
                {
                  key: "title",
                  label: "Title Font",
                  type: "object",
                  fields: [
                    { key: "family", label: "Family", type: "text" },
                    {
                      key: "size",
                      label: "Size",
                      type: "object",
                      fields: [
                        { key: "desktop", label: "Desktop", type: "text" },
                        { key: "tablet", label: "Tablet", type: "text" },
                        { key: "mobile", label: "Mobile", type: "text" },
                      ],
                    },
                    { key: "weight", label: "Weight", type: "text" },
                    {
                      key: "color",
                      label: "Color",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "secondary", // Title uses secondary color
                    },
                    { key: "lineHeight", label: "Line Height", type: "text" },
                  ],
                },
                {
                  key: "subtitle",
                  label: "Subtitle Font",
                  type: "object",
                  fields: [
                    { key: "family", label: "Family", type: "text" },
                    {
                      key: "size",
                      label: "Size",
                      type: "object",
                      fields: [
                        { key: "desktop", label: "Desktop", type: "text" },
                        { key: "tablet", label: "Tablet", type: "text" },
                        { key: "mobile", label: "Mobile", type: "text" },
                      ],
                    },
                    { key: "weight", label: "Weight", type: "text" },
                    {
                      key: "color",
                      label: "Color",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "secondary", // Subtitle uses secondary color
                    },
                  ],
                },
              ],
            },
            { key: "alignment", label: "Alignment", type: "text" },
            { key: "maxWidth", label: "Max Width", type: "text" },
          ],
        },
        {
          key: "searchForm",
          label: "Search Form",
          type: "object",
          fields: [
            { key: "enabled", label: "Enabled", type: "boolean" },
            { key: "position", label: "Position", type: "text" },
            { key: "offset", label: "Offset", type: "text" },
            {
              key: "background",
              label: "Form Background",
              type: "object",
              fields: [
                { key: "color", label: "Color", type: "color" },
                { key: "opacity", label: "Opacity", type: "text" },
                { key: "shadow", label: "Shadow", type: "text" },
                { key: "border", label: "Border", type: "text" },
                { key: "borderRadius", label: "Border Radius", type: "text" },
              ],
            },
            {
              key: "fields",
              label: "Form Fields",
              type: "object",
              fields: [
                {
                  key: "purpose",
                  label: "Purpose Field",
                  type: "object",
                  fields: [
                    { key: "enabled", label: "Enabled", type: "boolean" },
                    {
                      key: "options",
                      label: "Options",
                      type: "array",
                      addLabel: "Add Option",
                      itemLabel: "Option",
                      of: [
                        { key: "value", label: "Value", type: "text" },
                        { key: "label", label: "Label", type: "text" },
                      ],
                    },
                    { key: "default", label: "Default", type: "text" },
                  ],
                },
                {
                  key: "city",
                  label: "City Field",
                  type: "object",
                  fields: [
                    { key: "enabled", label: "Enabled", type: "boolean" },
                    { key: "placeholder", label: "Placeholder", type: "text" },
                    { key: "icon", label: "Icon", type: "text" },
                  ],
                },
                {
                  key: "type",
                  label: "Type Field",
                  type: "object",
                  fields: [
                    { key: "enabled", label: "Enabled", type: "boolean" },
                    { key: "placeholder", label: "Placeholder", type: "text" },
                    { key: "icon", label: "Icon", type: "text" },
                    {
                      key: "options",
                      label: "Options",
                      type: "array",
                      addLabel: "Add Option",
                      itemLabel: "Option",
                      of: [{ key: "value", label: "Value", type: "text" }],
                    },
                  ],
                },
                {
                  key: "price",
                  label: "Price Field",
                  type: "object",
                  fields: [
                    { key: "enabled", label: "Enabled", type: "boolean" },
                    { key: "placeholder", label: "Placeholder", type: "text" },
                    { key: "icon", label: "Icon", type: "text" },
                    {
                      key: "options",
                      label: "Options",
                      type: "array",
                      addLabel: "Add Option",
                      itemLabel: "Option",
                      of: [
                        { key: "id", label: "ID", type: "text" },
                        { key: "label", label: "Label", type: "text" },
                      ],
                    },
                  ],
                },
                {
                  key: "keywords",
                  label: "Keywords Field",
                  type: "object",
                  fields: [
                    { key: "enabled", label: "Enabled", type: "boolean" },
                    { key: "placeholder", label: "Placeholder", type: "text" },
                  ],
                },
              ],
            },
            {
              key: "responsive",
              label: "Responsive Layout",
              type: "object",
              fields: [
                { key: "desktop", label: "Desktop", type: "text" },
                { key: "tablet", label: "Tablet", type: "text" },
                { key: "mobile", label: "Mobile", type: "text" },
              ],
            },
          ],
        },
        {
          key: "styling",
          label: "Styling",
          type: "object",
          fields: [
            {
              key: "searchFormButtonBgColor",
              label: "Search Form Button Background Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "primary", // Button background uses primary color from branding
            },
            {
              key: "searchFormButtonTextColor",
              label: "Search Form Button Text Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "secondary", // Button text uses secondary color from branding
            },
            {
              key: "searchFormButtonHoverColor",
              label: "Search Form Button Hover Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "primary", // Button hover uses primary color from branding
            },
            {
              key: "purposeToggleActiveBgColor",
              label: "Purpose Toggle Active Background Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "primary", // Active toggle uses primary color from branding
            },
            {
              key: "purposeToggleActiveTextColor",
              label: "Purpose Toggle Active Text Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "secondary", // Active toggle text uses secondary color from branding
            },
            {
              key: "dropdownHoverColor",
              label: "Dropdown Hover Background Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "primary", // Dropdown hover uses primary color from branding
            },
          ],
        },
        {
          key: "animations",
          label: "Animations",
          type: "object",
          fields: [
            {
              key: "title",
              label: "Title Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "type", label: "Type", type: "text" },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "delay", label: "Delay (ms)", type: "number" },
              ],
            },
            {
              key: "subtitle",
              label: "Subtitle Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "type", label: "Type", type: "text" },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "delay", label: "Delay (ms)", type: "number" },
              ],
            },
            {
              key: "searchForm",
              label: "Search Form Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "type", label: "Type", type: "text" },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "delay", label: "Delay (ms)", type: "number" },
              ],
            },
          ],
        },
      ],
      simpleFields: [
        { key: "background.image", label: "Background Image", type: "image" },
        { key: "content.title", label: "Title", type: "text" },
        { key: "content.subtitle", label: "Subtitle", type: "text" },
      ],
    },
    {
      id: "hero2",
      name: "Hero 2 - Simple Image",
      fields: [
        {
          key: "height",
          label: "Height",
          type: "object",
          fields: [
            {
              key: "desktop",
              label: "Desktop",
              type: "text",
              placeholder: "229px",
            },
            {
              key: "tablet",
              label: "Tablet",
              type: "text",
              placeholder: "229px",
            },
            {
              key: "mobile",
              label: "Mobile",
              type: "text",
              placeholder: "229px",
            },
          ],
        },
        {
          key: "minHeight",
          label: "Minimum Height",
          type: "object",
          fields: [
            {
              key: "desktop",
              label: "Desktop",
              type: "text",
              placeholder: "229px",
            },
            {
              key: "tablet",
              label: "Tablet",
              type: "text",
              placeholder: "229px",
            },
            {
              key: "mobile",
              label: "Mobile",
              type: "text",
              placeholder: "229px",
            },
          ],
        },
        {
          key: "background",
          label: "Background",
          type: "object",
          fields: [
            { key: "image", label: "Image URL", type: "image" },
            { key: "alt", label: "Alt Text", type: "text" },
            {
              key: "overlay",
              label: "Overlay",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "opacity",
                  label: "Opacity",
                  type: "text",
                  placeholder: "0.6",
                },
                { key: "color", label: "Color", type: "color" },
              ],
            },
          ],
        },
        {
          key: "content",
          label: "Content",
          type: "object",
          fields: [
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "text" },
            { key: "alignment", label: "Alignment", type: "text" },
            { key: "maxWidth", label: "Max Width", type: "text" },
            {
              key: "font",
              label: "Font Settings",
              type: "object",
              fields: [
                {
                  key: "title",
                  label: "Title Font",
                  type: "object",
                  fields: [
                    { key: "family", label: "Family", type: "text" },
                    {
                      key: "size",
                      label: "Size",
                      type: "object",
                      fields: [
                        {
                          key: "desktop",
                          label: "Desktop",
                          type: "text",
                          placeholder: "36px",
                        },
                        {
                          key: "tablet",
                          label: "Tablet",
                          type: "text",
                          placeholder: "36px",
                        },
                        {
                          key: "mobile",
                          label: "Mobile",
                          type: "text",
                          placeholder: "36px",
                        },
                      ],
                    },
                    { key: "weight", label: "Weight", type: "text" },
                    {
                      key: "color",
                      label: "Color",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "secondary", // Title uses secondary color
                    },
                    { key: "lineHeight", label: "Line Height", type: "text" },
                  ],
                },
                {
                  key: "description",
                  label: "Description Font",
                  type: "object",
                  fields: [
                    { key: "family", label: "Family", type: "text" },
                    {
                      key: "size",
                      label: "Size",
                      type: "object",
                      fields: [
                        {
                          key: "desktop",
                          label: "Desktop",
                          type: "text",
                          placeholder: "15px",
                        },
                        {
                          key: "tablet",
                          label: "Tablet",
                          type: "text",
                          placeholder: "15px",
                        },
                        {
                          key: "mobile",
                          label: "Mobile",
                          type: "text",
                          placeholder: "15px",
                        },
                      ],
                    },
                    { key: "weight", label: "Weight", type: "text" },
                    {
                      key: "color",
                      label: "Color",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "secondary", // Description uses secondary color
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          key: "styling",
          label: "Styling",
          type: "object",
          fields: [
            {
              key: "overlayColor",
              label: "Overlay Background Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "primary", // Overlay uses primary color from branding
            },
          ],
        },
        {
          key: "animations",
          label: "Animations",
          type: "object",
          fields: [
            {
              key: "title",
              label: "Title Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "type", label: "Type", type: "text" },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "delay", label: "Delay (ms)", type: "number" },
              ],
            },
            {
              key: "description",
              label: "Description Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "type", label: "Type", type: "text" },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "delay", label: "Delay (ms)", type: "number" },
              ],
            },
          ],
        },
      ],
      simpleFields: [
        { key: "background.image", label: "Background Image", type: "image" },
        { key: "content.title", label: "Title", type: "text" },
        { key: "content.description", label: "Description", type: "text" },
      ],
    },
    {
      id: "hero3",
      name: "Hero 3 - Video Background with Search",
      fields: [
        {
          key: "height",
          label: "Height",
          type: "object",
          fields: [
            {
              key: "desktop",
              label: "Desktop",
              type: "text",
              placeholder: "90vh",
            },
            {
              key: "tablet",
              label: "Tablet",
              type: "text",
              placeholder: "80vh",
            },
            {
              key: "mobile",
              label: "Mobile",
              type: "text",
              placeholder: "70vh",
            },
          ],
        },
        {
          key: "background",
          label: "Background",
          type: "object",
          fields: [
            { key: "image", label: "Image URL", type: "image" },
            { key: "video", label: "Video URL (YouTube)", type: "text" },
            {
              key: "videoStart",
              label: "Video Start (seconds)",
              type: "number",
            },
            { key: "playOnMobile", label: "Play on Mobile", type: "boolean" },
            { key: "privacyMode", label: "Privacy Mode", type: "boolean" },
            { key: "alt", label: "Alt Text", type: "text" },
            {
              key: "overlay",
              label: "Overlay",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "opacity",
                  label: "Opacity",
                  type: "text",
                  placeholder: "0.45",
                },
                { key: "color", label: "Color", type: "color" },
              ],
            },
          ],
        },
        {
          key: "content",
          label: "Content",
          type: "object",
          fields: [
            { key: "title", label: "Title", type: "text" },
            { key: "subtitle", label: "Subtitle", type: "text" },
            { key: "paddingTop", label: "Padding Top", type: "text" },
            {
              key: "font",
              label: "Font Settings",
              type: "object",
              fields: [
                {
                  key: "title",
                  label: "Title Font",
                  type: "object",
                  fields: [
                    { key: "family", label: "Family", type: "text" },
                    {
                      key: "size",
                      label: "Size",
                      type: "object",
                      fields: [
                        { key: "desktop", label: "Desktop", type: "text" },
                        { key: "tablet", label: "Tablet", type: "text" },
                        { key: "mobile", label: "Mobile", type: "text" },
                      ],
                    },
                    { key: "weight", label: "Weight", type: "text" },
                    {
                      key: "color",
                      label: "Color",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "secondary",
                    },
                    { key: "lineHeight", label: "Line Height", type: "text" },
                  ],
                },
                {
                  key: "subtitle",
                  label: "Subtitle Font",
                  type: "object",
                  fields: [
                    { key: "family", label: "Family", type: "text" },
                    {
                      key: "size",
                      label: "Size",
                      type: "object",
                      fields: [
                        { key: "desktop", label: "Desktop", type: "text" },
                        { key: "tablet", label: "Tablet", type: "text" },
                        { key: "mobile", label: "Mobile", type: "text" },
                      ],
                    },
                    { key: "weight", label: "Weight", type: "text" },
                    {
                      key: "color",
                      label: "Color",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "secondary",
                    },
                  ],
                },
              ],
            },
            { key: "alignment", label: "Alignment", type: "text" },
            { key: "maxWidth", label: "Max Width", type: "text" },
          ],
        },
        {
          key: "searchForm",
          label: "Search Form",
          type: "object",
          fields: [
            { key: "enabled", label: "Enabled", type: "boolean" },
            { key: "position", label: "Position", type: "text" },
            { key: "offset", label: "Offset", type: "text" },
            {
              key: "background",
              label: "Form Background",
              type: "object",
              fields: [
                { key: "color", label: "Color", type: "color" },
                { key: "opacity", label: "Opacity", type: "text" },
                { key: "shadow", label: "Shadow", type: "text" },
                { key: "border", label: "Border", type: "text" },
                { key: "borderRadius", label: "Border Radius", type: "text" },
              ],
            },
            {
              key: "fields",
              label: "Form Fields",
              type: "object",
              fields: [
                {
                  key: "type",
                  label: "Type Field",
                  type: "object",
                  fields: [
                    { key: "enabled", label: "Enabled", type: "boolean" },
                    { key: "placeholder", label: "Placeholder", type: "text" },
                    { key: "icon", label: "Icon", type: "text" },
                    {
                      key: "options",
                      label: "Options",
                      type: "array",
                      addLabel: "Add Option",
                      itemLabel: "Option",
                      of: [{ key: "value", label: "Value", type: "text" }],
                    },
                  ],
                },
                {
                  key: "city",
                  label: "City Field",
                  type: "object",
                  fields: [
                    { key: "enabled", label: "Enabled", type: "boolean" },
                    { key: "placeholder", label: "Placeholder", type: "text" },
                    { key: "icon", label: "Icon", type: "text" },
                    {
                      key: "options",
                      label: "Options",
                      type: "array",
                      addLabel: "Add Option",
                      itemLabel: "Option",
                      of: [{ key: "value", label: "Value", type: "text" }],
                    },
                  ],
                },
                {
                  key: "status",
                  label: "Status Field",
                  type: "object",
                  fields: [
                    { key: "enabled", label: "Enabled", type: "boolean" },
                    { key: "placeholder", label: "Placeholder", type: "text" },
                    { key: "icon", label: "Icon", type: "text" },
                    {
                      key: "options",
                      label: "Options",
                      type: "array",
                      addLabel: "Add Option",
                      itemLabel: "Option",
                      of: [{ key: "value", label: "Value", type: "text" }],
                    },
                  ],
                },
              ],
            },
            {
              key: "responsive",
              label: "Responsive Layout",
              type: "object",
              fields: [
                { key: "desktop", label: "Desktop", type: "text" },
                { key: "tablet", label: "Tablet", type: "text" },
                { key: "mobile", label: "Mobile", type: "text" },
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
              key: "title",
              label: "Title Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "type", label: "Type", type: "text" },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "delay", label: "Delay (ms)", type: "number" },
              ],
            },
            {
              key: "subtitle",
              label: "Subtitle Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "type", label: "Type", type: "text" },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "delay", label: "Delay (ms)", type: "number" },
              ],
            },
            {
              key: "searchForm",
              label: "Search Form Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "type", label: "Type", type: "text" },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "delay", label: "Delay (ms)", type: "number" },
              ],
            },
          ],
        },
      ],
      simpleFields: [
        { key: "background.video", label: "Background Video", type: "text" },
        { key: "background.image", label: "Background Image", type: "image" },
        { key: "content.title", label: "Title", type: "text" },
        { key: "content.subtitle", label: "Subtitle", type: "text" },
      ],
    },
    {
      id: "hero4",
      name: "Hero 4 - Contact Form Hero",
      fields: [
        {
          key: "title",
          label: "Title",
          type: "text",
          placeholder: "عن تعاريفالعقارية",
        },
        {
          key: "backgroundImage",
          label: "Background Image",
          type: "image",
        },
        {
          key: "barType",
          label: "Floating Bar Type",
          type: "select",
          options: [
            { label: "Default Bar (هل لديك استفسار)", value: "default" },
            { label: "Contact Form", value: "contact" },
            { label: "Property Filter", value: "propertyFilter" },
          ],
          defaultValue: "default",
        },
        {
          key: "propertyFilterConfig",
          label: "Property Filter Configuration",
          type: "object",
          fields: [
            {
              key: "propertyTypesSource",
              label: "Property Types Source",
              type: "select",
              options: [
                { label: "Static List", value: "static" },
                { label: "Dynamic API", value: "dynamic" },
              ],
              defaultValue: "dynamic",
            },
            {
              key: "propertyTypes",
              label: "Property Types List",
              type: "array",
              of: [
                {
                  key: "value",
                  label: "Property Type",
                  type: "text",
                },
              ],
              condition: {
                field: "propertyFilterConfig.propertyTypesSource",
                value: "static",
              },
            },
            {
              key: "propertyTypesApiUrl",
              label: "Property Types API URL",
              type: "text",
              placeholder:
                "https://api.taearif.com/api/v1/tenant-website/{tenantId}/properties/categories/direct",
              condition: {
                field: "propertyFilterConfig.propertyTypesSource",
                value: "dynamic",
              },
            },
            {
              key: "searchPlaceholder",
              label: "Search Input Placeholder",
              type: "text",
              placeholder: "أدخل المدينة أو المنطقة",
            },
            {
              key: "propertyTypePlaceholder",
              label: "Property Type Placeholder",
              type: "text",
              placeholder: "نوع العقار",
            },
            {
              key: "pricePlaceholder",
              label: "Price Input Placeholder",
              type: "text",
              placeholder: "السعر",
            },
            {
              key: "searchButtonText",
              label: "Search Button Text",
              type: "text",
              placeholder: "بحث",
            },
          ],
          condition: {
            field: "barType",
            value: "propertyFilter",
          },
        },
        {
          key: "background",
          label: "Background",
          type: "object",
          fields: [
            { key: "image", label: "Image URL", type: "image" },
            { key: "alt", label: "Alt Text", type: "text" },
            {
              key: "overlay",
              label: "Overlay",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "opacity",
                  label: "Opacity",
                  type: "text",
                  placeholder: "0.3",
                },
                { key: "color", label: "Color", type: "color" },
              ],
            },
          ],
        },
        {
          key: "content",
          label: "Content",
          type: "object",
          fields: [
            { key: "title", label: "Title", type: "text" },
            { key: "alignment", label: "Alignment", type: "text" },
            { key: "maxWidth", label: "Max Width", type: "text" },
            {
              key: "font",
              label: "Font Settings",
              type: "object",
              fields: [
                {
                  key: "title",
                  label: "Title Font",
                  type: "object",
                  fields: [
                    { key: "family", label: "Family", type: "text" },
                    {
                      key: "size",
                      label: "Size",
                      type: "object",
                      fields: [
                        { key: "desktop", label: "Desktop", type: "text" },
                        { key: "tablet", label: "Tablet", type: "text" },
                        { key: "mobile", label: "Mobile", type: "text" },
                      ],
                    },
                    { key: "weight", label: "Weight", type: "text" },
                    {
                      key: "color",
                      label: "Color",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "secondary",
                    },
                    { key: "lineHeight", label: "Line Height", type: "text" },
                  ],
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
              key: "title",
              label: "Title Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                { key: "type", label: "Type", type: "text" },
                { key: "duration", label: "Duration (ms)", type: "number" },
                { key: "delay", label: "Delay (ms)", type: "number" },
              ],
            },
          ],
        },
      ],
      simpleFields: [
        { key: "backgroundImage", label: "Background Image", type: "image" },
        { key: "title", label: "Title", type: "text" },
        {
          key: "barType",
          label: "Floating Bar Type",
          type: "select",
          options: [
            { label: "Default Bar (هل لديك استفسار)", value: "default" },
            { label: "Contact Form", value: "contact" },
            { label: "Property Filter", value: "propertyFilter" },
          ],
          defaultValue: "default",
        },
      ],
    },
  ],
};
