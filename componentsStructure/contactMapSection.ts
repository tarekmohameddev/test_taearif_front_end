import { ComponentStructure } from "./types";

export const contactMapSectionStructure: ComponentStructure = {
  componentType: "contactMapSection",
  variants: [
    {
      id: "contactMapSection1",
      name: "Contact Map Section 1 - Form with Map",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        {
          key: "title",
          label: "Section Title",
          type: "text",
          placeholder: "شاركنا تقييمك معنا",
        },
        {
          key: "description",
          label: "Section Description",
          type: "text",
          placeholder:
            "نحن نهتم برأيك! قم بتقييم تجربتك معنا من خلال اختيار عدد النجوم المناسب وكتابة تعليقك. تساعدنا في تحسين الخدمة وتقديم أفضل تجربة لعملائنا",
        },
        {
          key: "background",
          label: "Background",
          type: "object",
          fields: [
            { key: "color", label: "Background Color", type: "color" },
            { key: "image", label: "Background Image", type: "image" },
            { key: "alt", label: "Image Alt Text", type: "text" },
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
                  placeholder: "0.1",
                },
                { key: "color", label: "Color", type: "color" },
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
              key: "paddingY",
              label: "Vertical Padding",
              type: "number",
              placeholder: "56",
              unit: "px",
            },
            {
              key: "maxWidth",
              label: "Max Width",
              type: "number",
              placeholder: "1600",
              unit: "px",
            },
            {
              key: "paddingX",
              label: "Horizontal Padding",
              type: "number",
              placeholder: "16",
              unit: "px",
            },
            {
              key: "headerMarginBottom",
              label: "Header Margin Bottom",
              type: "number",
              placeholder: "40",
              unit: "px",
            },
            {
              key: "gridGap",
              label: "Grid Gap",
              type: "number",
              placeholder: "32",
              unit: "px",
            },
            {
              key: "formGap",
              label: "Form Elements Gap",
              type: "number",
              placeholder: "24",
              unit: "px",
            },
            {
              key: "inputGap",
              label: "Input Fields Gap",
              type: "number",
              placeholder: "16",
              unit: "px",
            },
          ],
        },
        {
          key: "header",
          label: "Header Styling",
          type: "object",
          fields: [
            {
              key: "alignment",
              label: "Text Alignment",
              type: "text",
              placeholder: "text-right",
            },
            {
              key: "title",
              label: "Title Styling",
              type: "object",
              fields: [
                {
                  key: "className",
                  label: "CSS Classes",
                  type: "text",
                  placeholder: "section-title",
                },
                { key: "color", label: "Color", type: "color" },
                {
                  key: "size",
                  label: "Font Size",
                  type: "text",
                  placeholder: "text-3xl sm:text-4xl",
                },
                {
                  key: "weight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "font-bold",
                },
              ],
            },
            {
              key: "description",
              label: "Description Styling",
              type: "object",
              fields: [
                {
                  key: "className",
                  label: "CSS Classes",
                  type: "text",
                  placeholder: "section-subtitle",
                },
                { key: "color", label: "Color", type: "color" },
                {
                  key: "size",
                  label: "Font Size",
                  type: "text",
                  placeholder: "text-lg",
                },
                {
                  key: "weight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "font-normal",
                },
                {
                  key: "maxWidth",
                  label: "Max Width",
                  type: "text",
                  placeholder: "max-w-4xl",
                },
                {
                  key: "lineHeight",
                  label: "Line Height",
                  type: "text",
                  placeholder: "leading-7",
                },
                {
                  key: "marginTop",
                  label: "Margin Top",
                  type: "number",
                  placeholder: "16",
                  unit: "px",
                },
              ],
            },
          ],
        },
        {
          key: "layout",
          label: "Layout Settings",
          type: "object",
          fields: [
            {
              key: "gridCols",
              label: "Grid Columns",
              type: "text",
              placeholder: "grid-cols-1 lg:grid-cols-2",
            },
            {
              key: "formOrder",
              label: "Form Order",
              type: "text",
              placeholder: "order-1 lg:order-1",
            },
            {
              key: "mapOrder",
              label: "Map Order",
              type: "text",
              placeholder: "order-2 lg:order-2",
            },
            {
              key: "responsiveBreakpoint",
              label: "Responsive Breakpoint",
              type: "text",
              placeholder: "lg",
            },
          ],
        },
        {
          key: "form",
          label: "Form Settings",
          type: "object",
          fields: [
            { key: "enabled", label: "Form Enabled", type: "boolean" },
            {
              key: "method",
              label: "Form Method",
              type: "text",
              placeholder: "POST",
            },
            {
              key: "action",
              label: "Form Action",
              type: "text",
              placeholder: "",
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
                    {
                      key: "label",
                      label: "Label Text",
                      type: "text",
                      placeholder: "اسمك",
                    },
                    {
                      key: "placeholder",
                      label: "Placeholder",
                      type: "text",
                      placeholder: "أدخل اسمك",
                    },
                    { key: "required", label: "Required", type: "boolean" },
                    {
                      key: "type",
                      label: "Input Type",
                      type: "text",
                      placeholder: "text",
                    },
                    {
                      key: "height",
                      label: "Input Height",
                      type: "number",
                      placeholder: "48",
                      unit: "px",
                    },
                  ],
                },
                {
                  key: "country",
                  label: "Country Field",
                  type: "object",
                  fields: [
                    { key: "enabled", label: "Enabled", type: "boolean" },
                    {
                      key: "label",
                      label: "Label Text",
                      type: "text",
                      placeholder: "بلدك",
                    },
                    {
                      key: "placeholder",
                      label: "Placeholder",
                      type: "text",
                      placeholder: "أدخل بلدك",
                    },
                    { key: "required", label: "Required", type: "boolean" },
                    {
                      key: "type",
                      label: "Input Type",
                      type: "text",
                      placeholder: "text",
                    },
                    {
                      key: "height",
                      label: "Input Height",
                      type: "number",
                      placeholder: "48",
                      unit: "px",
                    },
                  ],
                },
                {
                  key: "feedback",
                  label: "Feedback Field",
                  type: "object",
                  fields: [
                    { key: "enabled", label: "Enabled", type: "boolean" },
                    {
                      key: "label",
                      label: "Label Text",
                      type: "text",
                      placeholder: "تعليقك",
                    },
                    {
                      key: "placeholder",
                      label: "Placeholder",
                      type: "text",
                      placeholder: "أدخل تعليقك",
                    },
                    { key: "required", label: "Required", type: "boolean" },
                    {
                      key: "minHeight",
                      label: "Min Height",
                      type: "text",
                      placeholder: "min-h-[120px]",
                    },
                    {
                      key: "resize",
                      label: "Resize",
                      type: "text",
                      placeholder: "resize-none",
                    },
                  ],
                },
              ],
            },
            {
              key: "rating",
              label: "Rating System",
              type: "object",
              fields: [
                { key: "enabled", label: "Rating Enabled", type: "boolean" },
                {
                  key: "label",
                  label: "Rating Label",
                  type: "text",
                  placeholder: "التقييم",
                },
                {
                  key: "maxStars",
                  label: "Maximum Stars",
                  type: "number",
                  placeholder: "5",
                },
                {
                  key: "starSize",
                  label: "Star Size",
                  type: "text",
                  placeholder: "size-8",
                },
                {
                  key: "activeColor",
                  label: "Active Star Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Active star uses primary color
                },
                {
                  key: "inactiveColor",
                  label: "Inactive Star Color",
                  type: "color",
                  useDefaultColor: false, // Inactive color is usually custom
                },
                {
                  key: "hoverColor",
                  label: "Hover Star Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Hover star uses primary color
                },
                {
                  key: "showRatingText",
                  label: "Show Rating Text",
                  type: "boolean",
                },
                {
                  key: "ratingTextColor",
                  label: "Rating Text Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "secondary", // Rating text uses secondary color
                },
              ],
            },
            {
              key: "submitButton",
              label: "Submit Button",
              type: "object",
              fields: [
                { key: "enabled", label: "Button Enabled", type: "boolean" },
                {
                  key: "text",
                  label: "Button Text",
                  type: "text",
                  placeholder: "إرسال",
                },
                {
                  key: "type",
                  label: "Button Type",
                  type: "text",
                  placeholder: "submit",
                },
                {
                  key: "width",
                  label: "Button Width",
                  type: "number",
                  placeholder: "100",
                  unit: "%",
                },
                {
                  key: "height",
                  label: "Button Height",
                  type: "number",
                  placeholder: "48",
                  unit: "px",
                },
                {
                  key: "backgroundColor",
                  label: "Background Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Button background uses primary color
                },
                {
                  key: "hoverBackgroundColor",
                  label: "Hover Background Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "primary", // Button hover uses primary color
                },
                {
                  key: "textColor",
                  label: "Text Color",
                  type: "color",
                  useDefaultColor: true,
                  globalColorType: "secondary", // Button text uses secondary color (usually white)
                },
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
                  placeholder: "font-semibold",
                },
                {
                  key: "borderRadius",
                  label: "Border Radius",
                  type: "text",
                  placeholder: "rounded-xl",
                },
              ],
            },
          ],
        },
        {
          key: "map",
          label: "Map Settings",
          type: "object",
          fields: [
            { key: "enabled", label: "Map Enabled", type: "boolean" },
            {
              key: "title",
              label: "Map Title",
              type: "text",
              placeholder: "خريطة الرياض",
            },
            {
              key: "src",
              label: "Map Source URL",
              type: "text",
              placeholder: "https://www.google.com/maps/embed?...",
            },
            {
              key: "width",
              label: "Map Width",
              type: "number",
              placeholder: "100",
              unit: "%",
            },
            {
              key: "height",
              label: "Map Height",
              type: "number",
              placeholder: "400",
              unit: "px",
            },
            {
              key: "borderRadius",
              label: "Border Radius",
              type: "text",
              placeholder: "rounded-xl",
            },
            {
              key: "border",
              label: "Border",
              type: "text",
              placeholder: "border",
            },
            {
              key: "overflow",
              label: "Overflow",
              type: "text",
              placeholder: "overflow-hidden",
            },
            {
              key: "allowFullScreen",
              label: "Allow Full Screen",
              type: "boolean",
            },
            {
              key: "loading",
              label: "Loading",
              type: "text",
              placeholder: "lazy",
            },
            {
              key: "referrerPolicy",
              label: "Referrer Policy",
              type: "text",
              placeholder: "no-referrer-when-downgrade",
            },
          ],
        },
        {
          key: "labels",
          label: "Form Labels",
          type: "object",
          fields: [
            {
              key: "labelColor",
              label: "Label Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "secondary", // Label uses secondary color
            },
            {
              key: "labelSize",
              label: "Label Font Size",
              type: "text",
              placeholder: "text-sm",
            },
            {
              key: "labelWeight",
              label: "Label Font Weight",
              type: "text",
              placeholder: "font-medium",
            },
            {
              key: "labelMarginBottom",
              label: "Label Margin Bottom",
              type: "number",
              placeholder: "8",
              unit: "px",
            },
          ],
        },
        {
          key: "responsive",
          label: "Responsive Behavior",
          type: "object",
          fields: [
            {
              key: "mobileLayout",
              label: "Mobile Layout",
              type: "text",
              placeholder: "stacked",
            },
            {
              key: "tabletLayout",
              label: "Tablet Layout",
              type: "text",
              placeholder: "stacked",
            },
            {
              key: "desktopLayout",
              label: "Desktop Layout",
              type: "text",
              placeholder: "side-by-side",
            },
            {
              key: "mobileFormOrder",
              label: "Mobile Form Order",
              type: "text",
              placeholder: "order-1",
            },
            {
              key: "mobileMapOrder",
              label: "Mobile Map Order",
              type: "text",
              placeholder: "order-2",
            },
          ],
        },
        {
          key: "animations",
          label: "Animations",
          type: "object",
          fields: [
            {
              key: "form",
              label: "Form Animations",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "type",
                  label: "Animation Type",
                  type: "text",
                  placeholder: "fade-in",
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
                  placeholder: "100",
                },
              ],
            },
            {
              key: "map",
              label: "Map Animations",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "type",
                  label: "Animation Type",
                  type: "text",
                  placeholder: "slide-in",
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
            {
              key: "header",
              label: "Header Animations",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "type",
                  label: "Animation Type",
                  type: "text",
                  placeholder: "slide-up",
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
        { key: "title", label: "Section Title", type: "text" },
        { key: "description", label: "Section Description", type: "text" },
        {
          key: "form.fields.name.label",
          label: "Name Field Label",
          type: "text",
        },
        {
          key: "form.fields.country.label",
          label: "Country Field Label",
          type: "text",
        },
        {
          key: "form.fields.feedback.label",
          label: "Feedback Field Label",
          type: "text",
        },
        { key: "form.rating.label", label: "Rating Label", type: "text" },
        {
          key: "form.submitButton.text",
          label: "Submit Button Text",
          type: "text",
        },
        { key: "map.title", label: "Map Title", type: "text" },
        { key: "map.src", label: "Map Source URL", type: "text" },
      ],
    },
  ],
};
