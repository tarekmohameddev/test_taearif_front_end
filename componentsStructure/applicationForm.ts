import { ComponentStructure } from "./types";

export const applicationFormStructure: ComponentStructure = {
  componentType: "applicationForm",
  variants: [
    {
      id: "applicationForm1",
      name: "Application Form 1 - Property Inspection Request",
      fields: [
        {
          key: "visible",
          label: "Visible",
          type: "boolean",
          defaultValue: true,
        },
        {
          key: "layout",
          label: "Layout Settings",
          type: "object",
          fields: [
            {
              key: "direction",
              label: "Direction",
              type: "select",
              options: [
                { value: "rtl", label: "Right to Left" },
                { value: "ltr", label: "Left to Right" },
              ],
              defaultValue: "rtl",
            },
            {
              key: "maxWidth",
              label: "Max Width",
              type: "number",
              defaultValue: 800,
              unit: "px",
            },
            {
              key: "padding",
              label: "Padding",
              type: "object",
              fields: [
                { key: "y", label: "Vertical Padding", type: "number", defaultValue: 32, unit: "px" },
                { key: "smY", label: "Small Vertical Padding", type: "number", defaultValue: 48, unit: "px" },
              ],
            },
          ],
        },
        {
          key: "header",
          label: "Header Settings",
          type: "object",
          fields: [
            {
              key: "title",
              label: "Title",
              type: "text",
              defaultValue: "نموذج طلب معاينة",
            },
            {
              key: "description",
              label: "Description",
              type: "textarea",
              defaultValue:
                "املأ البيانات المطلوبة لتقديم طلب المعاينة. سيتم التواصل معك قريبًا لترتيب موعد لزيارة العقار ومعاينته بشكل دقيق.",
            },
            {
              key: "textAlign",
              label: "Text Alignment",
              type: "select",
              options: [
                { value: "text-left", label: "Left" },
                { value: "text-center", label: "Center" },
                { value: "text-right", label: "Right" },
              ],
              defaultValue: "text-center",
            },
            {
              key: "marginBottom",
              label: "Margin Bottom",
              type: "number",
              defaultValue: 32,
              unit: "px",
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
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      defaultValue:
                        "font-bold text-[20px] text-emerald-600 md:text-[32px] leading-[22.32px] md:leading-[35.71px]",
                    },
                    {
                      key: "fontSize",
                      label: "Font Size",
                      type: "text",
                      defaultValue: "text-[20px] md:text-[32px]",
                    },
                    {
                      key: "fontWeight",
                      label: "Font Weight",
                      type: "text",
                      defaultValue: "font-bold",
                    },
                    {
                      key: "color",
                      label: "Color",
                      type: "text",
                      defaultValue: "text-emerald-600",
                    },
                  ],
                },
                {
                  key: "description",
                  label: "Description Typography",
                  type: "object",
                  fields: [
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      defaultValue:
                        "font-normal text-[16px] leading-[17.86px] text-gray-600 md:text-[20px] md:leading-[22.32px]",
                    },
                    {
                      key: "fontSize",
                      label: "Font Size",
                      type: "text",
                      defaultValue: "text-[16px] md:text-[20px]",
                    },
                    {
                      key: "fontWeight",
                      label: "Font Weight",
                      type: "text",
                      defaultValue: "font-normal",
                    },
                    {
                      key: "color",
                      label: "Color",
                      type: "text",
                      defaultValue: "text-gray-600",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          key: "form",
          label: "Form Settings",
          type: "object",
          fields: [
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
                    {
                      key: "label",
                      label: "Label",
                      type: "text",
                      defaultValue: "الاسم",
                    },
                    {
                      key: "placeholder",
                      label: "Placeholder",
                      type: "text",
                      defaultValue: "ادخل الاسم",
                    },
                    {
                      key: "required",
                      label: "Required",
                      type: "boolean",
                      defaultValue: true,
                    },
                    {
                      key: "type",
                      label: "Input Type",
                      type: "text",
                      defaultValue: "text",
                    },
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      defaultValue:
                        "text-[16px] font-medium text-gray-600 rounded-md border border-gray-300 p-2 outline-none focus:border-emerald-600",
                    },
                  ],
                },
                {
                  key: "phone",
                  label: "Phone Field",
                  type: "object",
                  fields: [
                    {
                      key: "label",
                      label: "Label",
                      type: "text",
                      defaultValue: "رقم الهاتف",
                    },
                    {
                      key: "placeholder",
                      label: "Placeholder",
                      type: "text",
                      defaultValue: "ادخل رقم الهاتف",
                    },
                    {
                      key: "required",
                      label: "Required",
                      type: "boolean",
                      defaultValue: true,
                    },
                    {
                      key: "type",
                      label: "Input Type",
                      type: "text",
                      defaultValue: "tel",
                    },
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      defaultValue:
                        "text-[16px] placeholder:text-end font-medium text-gray-600 rounded-md border border-gray-300 p-2 outline-none focus:border-emerald-600",
                    },
                  ],
                },
                {
                  key: "address",
                  label: "Address Field",
                  type: "object",
                  fields: [
                    {
                      key: "label",
                      label: "Label",
                      type: "text",
                      defaultValue: "العنوان",
                    },
                    {
                      key: "placeholder",
                      label: "Placeholder",
                      type: "text",
                      defaultValue: "ادخل العنوان",
                    },
                    {
                      key: "required",
                      label: "Required",
                      type: "boolean",
                      defaultValue: true,
                    },
                    {
                      key: "type",
                      label: "Input Type",
                      type: "text",
                      defaultValue: "text",
                    },
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      defaultValue:
                        "text-[16px] font-medium text-gray-600 rounded-md border border-gray-300 p-2 outline-none focus:border-emerald-600",
                    },
                  ],
                },
                {
                  key: "requester_type",
                  label: "Requester Type Field",
                  type: "object",
                  fields: [
                    {
                      key: "label",
                      label: "Label",
                      type: "text",
                      defaultValue: "الملكية",
                    },
                    {
                      key: "placeholder",
                      label: "Placeholder",
                      type: "text",
                      defaultValue: "ادخل الملكية",
                    },
                    {
                      key: "required",
                      label: "Required",
                      type: "boolean",
                      defaultValue: true,
                    },
                    {
                      key: "type",
                      label: "Input Type",
                      type: "text",
                      defaultValue: "text",
                    },
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      defaultValue:
                        "text-[16px] font-medium text-gray-600 rounded-md border border-gray-300 p-2 outline-none focus:border-emerald-600",
                    },
                  ],
                },
                {
                  key: "date",
                  label: "Date Field",
                  type: "object",
                  fields: [
                    {
                      key: "label",
                      label: "Label",
                      type: "text",
                      defaultValue: "التاريخ",
                    },
                    {
                      key: "placeholder",
                      label: "Placeholder",
                      type: "text",
                      defaultValue: "من فضلك اختر التاريخ اولا لاظهار الوقت",
                    },
                    {
                      key: "required",
                      label: "Required",
                      type: "boolean",
                      defaultValue: true,
                    },
                    {
                      key: "type",
                      label: "Input Type",
                      type: "text",
                      defaultValue: "date",
                    },
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      defaultValue:
                        "w-full justify-start text-right font-normal cursor-pointer text-[16px] font-medium text-gray-600 rounded-md border border-gray-300 p-2 outline-none focus:border-emerald-600",
                    },
                  ],
                },
                {
                  key: "time",
                  label: "Time Field",
                  type: "object",
                  fields: [
                    {
                      key: "label",
                      label: "Label",
                      type: "text",
                      defaultValue: "الوقت",
                    },
                    {
                      key: "placeholder",
                      label: "Placeholder",
                      type: "text",
                      defaultValue: "اختر الوقت",
                    },
                    {
                      key: "required",
                      label: "Required",
                      type: "boolean",
                      defaultValue: true,
                    },
                    {
                      key: "type",
                      label: "Input Type",
                      type: "text",
                      defaultValue: "time",
                    },
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      defaultValue:
                        "order-1 w-full font-medium text-gray-600 rounded-md border border-gray-300 p-2 outline-none pr-10 focus:border-emerald-600",
                    },
                    {
                      key: "disabled",
                      label: "Disabled",
                      type: "boolean",
                      defaultValue: true,
                    },
                  ],
                },
                {
                  key: "offer_type",
                  label: "Offer Type Field",
                  type: "object",
                  fields: [
                    {
                      key: "label",
                      label: "Label",
                      type: "text",
                      defaultValue: "نوع العرض",
                    },
                    {
                      key: "options",
                      label: "Options",
                      type: "array",
                      defaultValue: [
                        { value: "sale", label: "للبيع" },
                        { value: "rent", label: "للإيجار" },
                      ],
                    },
                    {
                      key: "required",
                      label: "Required",
                      type: "boolean",
                      defaultValue: true,
                    },
                    {
                      key: "type",
                      label: "Input Type",
                      type: "text",
                      defaultValue: "radio",
                    },
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      defaultValue:
                        "appearance-none border-2 border-emerald-600 rounded-full w-4 h-4 checked:bg-emerald-600 checked:border-emerald-600 focus:outline-none",
                    },
                  ],
                },
                {
                  key: "description",
                  label: "Description Field",
                  type: "object",
                  fields: [
                    {
                      key: "label",
                      label: "Label",
                      type: "text",
                      defaultValue: "الوصف",
                    },
                    {
                      key: "placeholder",
                      label: "Placeholder",
                      type: "textarea",
                      defaultValue:
                        "يرجى تقديم وصف دقيق للعقار يشمل نوعه (شقة، فيلا، مكتب)، المساحة، الحالة (جديد/مستعمل)، وأي مميزات إضافية (مثل وجود حديقة، مسبح، أو قربه من الخدمات)",
                    },
                    {
                      key: "required",
                      label: "Required",
                      type: "boolean",
                      defaultValue: true,
                    },
                    {
                      key: "type",
                      label: "Input Type",
                      type: "text",
                      defaultValue: "textarea",
                    },
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      defaultValue:
                        "h-48 resize-none text-[16px] font-medium text-gray-600 rounded-md border border-gray-300 p-2 outline-none focus:border-emerald-600",
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
                {
                  key: "text",
                  label: "Button Text",
                  type: "text",
                  defaultValue: "رفع المعاينة",
                },
                {
                  key: "className",
                  label: "CSS Classes",
                  type: "text",
                  defaultValue:
                    "rounded-md bg-emerald-600 text-white font-semibold text-[16px] py-2 w-full md:w-[400px] mx-auto mb-10 hover:bg-emerald-700 transition-colors",
                },
              ],
            },
            {
              key: "imageUpload",
              label: "Image Upload",
              type: "object",
              fields: [
                {
                  key: "label",
                  label: "Label",
                  type: "text",
                  defaultValue: "تحميل صور العقار",
                },
                {
                  key: "description",
                  label: "Description",
                  type: "textarea",
                  defaultValue:
                    "يرجى تحميل 3 صور واضحة للعقار، بما في ذلك واجهته الداخلية والخارجية. يُفضل أن تكون الصور بأعلى جودة لتسهيل عملية المعاينة",
                },
                {
                  key: "maxImages",
                  label: "Max Images",
                  type: "number",
                  defaultValue: 3,
                },
                {
                  key: "className",
                  label: "CSS Classes",
                  type: "text",
                  defaultValue:
                    "relative bg-gray-100 w-[300px] h-64 flex flex-col items-center justify-center rounded-md mx-auto",
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
              key: "bgColor",
              label: "Background Color",
              type: "color",
              defaultValue: "#ffffff",
            },
            {
              key: "textColor",
              label: "Text Color",
              type: "color",
              defaultValue: "#059669",
              useDefaultColor: true,
              globalColorType: "secondary", // Text uses secondary color
            },
            {
              key: "borderColor",
              label: "Border Color",
              type: "color",
              defaultValue: "#d1d5db",
              useDefaultColor: false, // Border color is usually custom
            },
            {
              key: "focusColor",
              label: "Focus Color",
              type: "color",
              defaultValue: "#059669",
              useDefaultColor: true,
              globalColorType: "primary", // Focus uses primary color
            },
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "header.title", label: "Form Title", type: "text" },
        {
          key: "header.description",
          label: "Form Description",
          type: "textarea",
        },
        {
          key: "form.fields.name.label",
          label: "Name Field Label",
          type: "text",
        },
        {
          key: "form.fields.phone.label",
          label: "Phone Field Label",
          type: "text",
        },
        {
          key: "form.fields.address.label",
          label: "Address Field Label",
          type: "text",
        },
        {
          key: "form.fields.requester_type.label",
          label: "Requester Type Label",
          type: "text",
        },
        {
          key: "form.fields.date.label",
          label: "Date Field Label",
          type: "text",
        },
        {
          key: "form.fields.time.label",
          label: "Time Field Label",
          type: "text",
        },
        {
          key: "form.fields.offer_type.label",
          label: "Offer Type Label",
          type: "text",
        },
        {
          key: "form.fields.description.label",
          label: "Description Field Label",
          type: "text",
        },
        {
          key: "form.submitButton.text",
          label: "Submit Button Text",
          type: "text",
        },
        {
          key: "form.imageUpload.label",
          label: "Image Upload Label",
          type: "text",
        },
        {
          key: "form.imageUpload.description",
          label: "Image Upload Description",
          type: "textarea",
        },
      ],
    },
  ],
};
