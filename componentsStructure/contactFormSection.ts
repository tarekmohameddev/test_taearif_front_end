import { ComponentStructure } from "./types";

export const contactFormSectionStructure: ComponentStructure = {
  componentType: "contactFormSection",
  variants: [
    {
      id: "contactFormSection1",
      name: "Contact Form Section 1 - Social Links & Form",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        {
          key: "layout",
          label: "Layout",
          type: "object",
          fields: [
            {
              key: "container",
              label: "Container",
              type: "object",
              fields: [
                {
                  key: "maxWidth",
                  label: "Max Width",
                  type: "text",
                  placeholder: "1600px",
                },
                {
                  key: "padding",
                  label: "Padding",
                  type: "text",
                  placeholder: "px-4 py-8",
                },
              ],
            },
            {
              key: "grid",
              label: "Grid Layout",
              type: "object",
              fields: [
                {
                  key: "desktop",
                  label: "Desktop",
                  type: "text",
                  placeholder: "md:flex-row",
                },
                {
                  key: "tablet",
                  label: "Tablet",
                  type: "text",
                  placeholder: "md:flex-row",
                },
                {
                  key: "mobile",
                  label: "Mobile",
                  type: "text",
                  placeholder: "flex-col",
                },
              ],
            },
            {
              key: "gap",
              label: "Gap",
              type: "object",
              fields: [
                {
                  key: "desktop",
                  label: "Desktop",
                  type: "text",
                  placeholder: "gap-[16px]",
                },
                {
                  key: "tablet",
                  label: "Tablet",
                  type: "text",
                  placeholder: "gap-[16px]",
                },
                {
                  key: "mobile",
                  label: "Mobile",
                  type: "text",
                  placeholder: "gap-[16px]",
                },
              ],
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
              label: "Title",
              type: "object",
              fields: [
                { key: "text", label: "Text", type: "text" },
                {
                  key: "style",
                  label: "Style",
                  type: "object",
                  fields: [
                    {
                      key: "size",
                      label: "Size",
                      type: "text",
                      placeholder: "text-[15px] md:text-[24px]",
                    },
                    {
                      key: "color",
                      label: "Color",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "secondary", // Title uses secondary color
                    },
                    {
                      key: "weight",
                      label: "Weight",
                      type: "text",
                      placeholder: "font-normal",
                    },
                    {
                      key: "margin",
                      label: "Margin",
                      type: "text",
                      placeholder: "mb-[24px]",
                    },
                  ],
                },
              ],
            },
            {
              key: "socialLinksEnabled",
              label: "إظهار روابط التواصل الاجتماعي",
              type: "boolean",
              defaultValue: true,
            },
            {
              key: "socialLinks",
              label: "Social Links",
              type: "array",
              addLabel: "Add Social Link",
              itemLabel: "Social Link",
              of: [
                { key: "href", label: "URL", type: "text" },
                {
                  key: "alt",
                  label: "Platform",
                  type: "select",
                  options: [
                    { value: "facebook", label: "Facebook" },
                    { value: "x", label: "X (Twitter)" },
                    { value: "instagram", label: "Instagram" },
                    { value: "linkedin", label: "LinkedIn" },
                    { value: "whatsapp", label: "WhatsApp" },
                  ],
                },
                { key: "text", label: "Display Text", type: "text" },
                {
                  key: "icon",
                  label: "Icon Settings",
                  type: "object",
                  fields: [
                    {
                      key: "size",
                      label: "Size",
                      type: "text",
                      placeholder: "24",
                    },
                    {
                      key: "color",
                      label: "Color",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "primary", // Icon uses primary color
                    },
                  ],
                },
                {
                  key: "textStyle",
                  label: "Text Style",
                  type: "object",
                  fields: [
                    {
                      key: "size",
                      label: "Size",
                      type: "text",
                      placeholder: "text-[14px] md:text-[16px]",
                    },
                    {
                      key: "color",
                      label: "Color",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "secondary", // Text uses secondary color
                    },
                    { key: "weight", label: "Weight", type: "text" },
                  ],
                },
              ],
            },
          ],
        },
        {
          key: "form",
          label: "Contact Form",
          type: "object",
          fields: [
            {
              key: "layout",
              label: "Form Layout",
              type: "object",
              fields: [
                {
                  key: "width",
                  label: "Width",
                  type: "text",
                  placeholder: "w-full md:w-[50%]",
                },
                {
                  key: "gap",
                  label: "Gap",
                  type: "text",
                  placeholder: "gap-[12px] md:gap-[24px]",
                },
              ],
            },
            {
              key: "fields",
              label: "Form Fields",
              type: "object",
              fields: [
                {
                  key: "name",
                  label: "Name Field",
                  type: "object",
                  fields: [
                    { key: "enabled", label: "Enabled", type: "boolean" },
                    { key: "placeholder", label: "Placeholder", type: "text" },
                    { key: "required", label: "Required", type: "boolean" },
                    {
                      key: "style",
                      label: "Style",
                      type: "object",
                      fields: [
                        {
                          key: "border",
                          label: "Border",
                          type: "text",
                          placeholder: "border rounded-[6px]",
                        },
                        {
                          key: "padding",
                          label: "Padding",
                          type: "text",
                          placeholder: "p-2",
                        },
                        {
                          key: "outline",
                          label: "Outline",
                          type: "text",
                          placeholder: "outline-custom-secondarycolor",
                        },
                      ],
                    },
                  ],
                },
                {
                  key: "email",
                  label: "Email Field",
                  type: "object",
                  fields: [
                    { key: "enabled", label: "Enabled", type: "boolean" },
                    { key: "placeholder", label: "Placeholder", type: "text" },
                    { key: "required", label: "Required", type: "boolean" },
                    {
                      key: "style",
                      label: "Style",
                      type: "object",
                      fields: [
                        {
                          key: "border",
                          label: "Border",
                          type: "text",
                          placeholder: "border rounded-[6px]",
                        },
                        {
                          key: "padding",
                          label: "Padding",
                          type: "text",
                          placeholder: "p-2",
                        },
                        {
                          key: "outline",
                          label: "Outline",
                          type: "text",
                          placeholder: "outline-custom-secondarycolor",
                        },
                      ],
                    },
                  ],
                },
                {
                  key: "message",
                  label: "Message Field",
                  type: "object",
                  fields: [
                    { key: "enabled", label: "Enabled", type: "boolean" },
                    { key: "placeholder", label: "Placeholder", type: "text" },
                    { key: "required", label: "Required", type: "boolean" },
                    {
                      key: "rows",
                      label: "Rows",
                      type: "number",
                      placeholder: "2",
                    },
                    {
                      key: "style",
                      label: "Style",
                      type: "object",
                      fields: [
                        {
                          key: "border",
                          label: "Border",
                          type: "text",
                          placeholder: "border rounded",
                        },
                        {
                          key: "padding",
                          label: "Padding",
                          type: "text",
                          placeholder: "p-2",
                        },
                        {
                          key: "margin",
                          label: "Margin",
                          type: "text",
                          placeholder: "mb-[12px]",
                        },
                        {
                          key: "outline",
                          label: "Outline",
                          type: "text",
                          placeholder: "outline-custom-secondarycolor",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              key: "submitButton",
              label: "Submit Button",
              type: "object",
              fields: [
                { key: "text", label: "Text", type: "text" },
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "style",
                  label: "Style",
                  type: "object",
                  fields: [
                    {
                      key: "background",
                      label: "Background",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "primary", // Button background uses primary color
                    },
                    {
                      key: "textColor",
                      label: "Text Color",
                      type: "color",
                      useDefaultColor: true,
                      globalColorType: "secondary", // Button text uses secondary color (usually white)
                    },
                    {
                      key: "borderRadius",
                      label: "Border Radius",
                      type: "text",
                      placeholder: "rounded-[6px]",
                    },
                    {
                      key: "width",
                      label: "Width",
                      type: "text",
                      placeholder: "w-full",
                    },
                    {
                      key: "padding",
                      label: "Padding",
                      type: "text",
                      placeholder: "py-2 md:py-1",
                    },
                    {
                      key: "fontSize",
                      label: "Font Size",
                      type: "text",
                      placeholder: "text-[14px] md:text-[20px]",
                    },
                    {
                      key: "hover",
                      label: "Hover Effect",
                      type: "text",
                      placeholder: "hover:scale-105 transition duration-300",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          key: "responsive",
          label: "Responsive Settings",
          type: "object",
          fields: [
            {
              key: "breakpoints",
              label: "Breakpoints",
              type: "object",
              fields: [
                {
                  key: "mobile",
                  label: "Mobile",
                  type: "text",
                  placeholder: "768px",
                },
                {
                  key: "tablet",
                  label: "Tablet",
                  type: "text",
                  placeholder: "1024px",
                },
                {
                  key: "desktop",
                  label: "Desktop",
                  type: "text",
                  placeholder: "1280px",
                },
              ],
            },
            {
              key: "layout",
              label: "Responsive Layout",
              type: "object",
              fields: [
                {
                  key: "socialSection",
                  label: "Social Section",
                  type: "object",
                  fields: [
                    {
                      key: "mobile",
                      label: "Mobile Width",
                      type: "text",
                      placeholder: "w-full",
                    },
                    {
                      key: "tablet",
                      label: "Tablet Width",
                      type: "text",
                      placeholder: "w-full md:w-[35%]",
                    },
                    {
                      key: "desktop",
                      label: "Desktop Width",
                      type: "text",
                      placeholder: "w-full md:w-[35%]",
                    },
                  ],
                },
                {
                  key: "formSection",
                  label: "Form Section",
                  type: "object",
                  fields: [
                    {
                      key: "mobile",
                      label: "Mobile Width",
                      type: "text",
                      placeholder: "w-full",
                    },
                    {
                      key: "tablet",
                      label: "Tablet Width",
                      type: "text",
                      placeholder: "w-full md:w-[50%]",
                    },
                    {
                      key: "desktop",
                      label: "Desktop Width",
                      type: "text",
                      placeholder: "w-full md:w-[50%]",
                    },
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
                {
                  key: "type",
                  label: "Type",
                  type: "text",
                  placeholder: "fadeIn",
                },
                {
                  key: "duration",
                  label: "Duration (ms)",
                  type: "number",
                  placeholder: "500",
                },
                {
                  key: "delay",
                  label: "Delay (ms)",
                  type: "number",
                  placeholder: "0",
                },
              ],
            },
            {
              key: "socialLinks",
              label: "Social Links Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "type",
                  label: "Type",
                  type: "text",
                  placeholder: "fadeInUp",
                },
                {
                  key: "duration",
                  label: "Duration (ms)",
                  type: "number",
                  placeholder: "400",
                },
                {
                  key: "delay",
                  label: "Delay (ms)",
                  type: "number",
                  placeholder: "100",
                },
                {
                  key: "stagger",
                  label: "Stagger (ms)",
                  type: "number",
                  placeholder: "50",
                },
              ],
            },
            {
              key: "form",
              label: "Form Animation",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "type",
                  label: "Type",
                  type: "text",
                  placeholder: "fadeInUp",
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
                  placeholder: "200",
                },
              ],
            },
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "content.title.text", label: "Title", type: "text" },
        {
          key: "socialLinks",
          label: "Social Links",
          type: "array",
          addLabel: "Add Social Link",
          itemLabel: "Social Link",
          of: [
            { key: "href", label: "URL", type: "text" },
            {
              key: "alt",
              label: "Platform",
              type: "select",
              options: [
                { value: "facebook", label: "Facebook" },
                { value: "x", label: "X (Twitter)" },
                { value: "instagram", label: "Instagram" },
                { value: "linkedin", label: "LinkedIn" },
                { value: "whatsapp", label: "WhatsApp" },
              ],
            },
            { key: "text", label: "Display Text", type: "text" },
            {
              key: "icon",
              label: "Icon Settings",
              type: "object",
              fields: [
                {
                  key: "size",
                  label: "Size",
                  type: "text",
                  placeholder: "24",
                },
                {
                  key: "color",
                  label: "Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Icon uses primary color
                },
              ],
            },
            {
              key: "textStyle",
              label: "Text Style",
              type: "object",
              fields: [
                {
                  key: "size",
                  label: "Size",
                  type: "text",
                  placeholder: "text-[14px] md:text-[16px]",
                },
                {
                  key: "color",
                  label: "Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "secondary", // Text uses secondary color
                },
                { key: "weight", label: "Weight", type: "text" },
              ],
            },
          ],
        },
        {
          key: "form.fields.name.placeholder",
          label: "Name Field Placeholder",
          type: "text",
        },
        {
          key: "form.fields.email.placeholder",
          label: "Email Field Placeholder",
          type: "text",
        },
        {
          key: "form.fields.message.placeholder",
          label: "Message Field Placeholder",
          type: "text",
        },
        {
          key: "form.submitButton.text",
          label: "Submit Button Text",
          type: "text",
        },
      ],
    },
  ],
};
