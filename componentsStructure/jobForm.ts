import { ComponentStructure } from "./types";

export const jobFormStructure: ComponentStructure = {
  componentType: "jobForm",
  variants: [
    {
      id: "jobForm1",
      name: "Job Form 1 - Job Application Form",
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
              type: "text",
              defaultValue: "800px",
            },
            {
              key: "padding",
              label: "Padding",
              type: "object",
              fields: [
                {
                  key: "top",
                  label: "Top Padding",
                  type: "text",
                  defaultValue: "4rem",
                },
                {
                  key: "bottom",
                  label: "Bottom Padding",
                  type: "text",
                  defaultValue: "4rem",
                },
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
              defaultValue: "نموذج التقديم للوظيفة",
            },
            {
              key: "description",
              label: "Description",
              type: "textarea",
              defaultValue: "املأ النموذج أدناه لتقديم طلبك للوظيفة",
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
              type: "text",
              defaultValue: "mb-8",
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
                      defaultValue: "الاسم الكامل",
                    },
                    {
                      key: "placeholder",
                      label: "Placeholder",
                      type: "text",
                      defaultValue: "أدخل الاسم الكامل",
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
                        "w-full px-5 py-4 text-right rounded-3xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-200 bg-gray-50 hover:border-gray-300 focus:bg-white",
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
                      defaultValue: "05xxxxxxxx",
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
                        "w-full px-5 py-4 text-right rounded-3xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-200 bg-gray-50 hover:border-gray-300 focus:bg-white",
                    },
                  ],
                },
                {
                  key: "email",
                  label: "Email Field",
                  type: "object",
                  fields: [
                    {
                      key: "label",
                      label: "Label",
                      type: "text",
                      defaultValue: "البريد الإلكتروني",
                    },
                    {
                      key: "placeholder",
                      label: "Placeholder",
                      type: "text",
                      defaultValue: "example@email.com",
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
                      defaultValue: "email",
                    },
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      defaultValue:
                        "w-full px-5 py-4 text-right rounded-3xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-200 bg-gray-50 hover:border-gray-300 focus:bg-white",
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
                      defaultValue: "الوصف / الرسالة",
                    },
                    {
                      key: "placeholder",
                      label: "Placeholder",
                      type: "text",
                      defaultValue: "اكتب رسالة أو وصف عن نفسك وخبراتك...",
                    },
                    {
                      key: "required",
                      label: "Required",
                      type: "boolean",
                      defaultValue: false,
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
                        "w-full px-5 py-4 text-right rounded-3xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none border-gray-200 bg-gray-50 hover:border-gray-300 focus:bg-white",
                    },
                    {
                      key: "rows",
                      label: "Rows",
                      type: "number",
                      defaultValue: 6,
                    },
                  ],
                },
                {
                  key: "pdf",
                  label: "PDF Upload Field",
                  type: "object",
                  fields: [
                    {
                      key: "label",
                      label: "Label",
                      type: "text",
                      defaultValue: "السيرة الذاتية (PDF)",
                    },
                    {
                      key: "placeholder",
                      label: "Placeholder",
                      type: "text",
                      defaultValue: "اختر ملف PDF",
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
                      defaultValue: "file",
                    },
                    {
                      key: "accept",
                      label: "Accept File Types",
                      type: "text",
                      defaultValue: ".pdf,application/pdf",
                    },
                    {
                      key: "maxSize",
                      label: "Max Size (bytes)",
                      type: "number",
                      defaultValue: 5242880,
                    },
                    {
                      key: "className",
                      label: "CSS Classes",
                      type: "text",
                      defaultValue: "hidden",
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
                  defaultValue: "إرسال الطلب",
                },
                {
                  key: "className",
                  label: "CSS Classes",
                  type: "text",
                  defaultValue:
                    "w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group",
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
              key: "backgroundColor",
              label: "Background Color",
              type: "color",
              defaultValue: "#ffffff",
            },
            {
              key: "textColor",
              label: "Text Color",
              type: "color",
              defaultValue: "#1f2937",
            },
            {
              key: "borderColor",
              label: "Border Color",
              type: "color",
              defaultValue: "#e5e7eb",
            },
            {
              key: "focusColor",
              label: "Focus Color",
              type: "color",
              defaultValue: "#3b82f6",
            },
            {
              key: "errorColor",
              label: "Error Color",
              type: "color",
              defaultValue: "#ef4444",
            },
            {
              key: "successColor",
              label: "Success Color",
              type: "color",
              defaultValue: "#10b981",
            },
          ],
        },
        {
          key: "api",
          label: "API Settings",
          type: "object",
          fields: [
            {
              key: "endpoint",
              label: "API Endpoint",
              type: "text",
              defaultValue: "/api/v1/tenant-website",
            },
            {
              key: "tenantId",
              label: "Tenant ID",
              type: "text",
              defaultValue: "",
              placeholder: "Leave empty to use tenant from store",
            },
            {
              key: "useTenantStore",
              label: "Use Tenant from Store",
              type: "boolean",
              defaultValue: true,
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
          key: "form.fields.name.required",
          label: "Name Required",
          type: "boolean",
        },
        {
          key: "form.fields.phone.label",
          label: "Phone Field Label",
          type: "text",
        },
        {
          key: "form.fields.phone.required",
          label: "Phone Required",
          type: "boolean",
        },
        {
          key: "form.fields.email.label",
          label: "Email Field Label",
          type: "text",
        },
        {
          key: "form.fields.email.required",
          label: "Email Required",
          type: "boolean",
        },
        {
          key: "form.fields.description.label",
          label: "Description Field Label",
          type: "text",
        },
        {
          key: "form.fields.description.required",
          label: "Description Required",
          type: "boolean",
        },
        {
          key: "form.fields.pdf.label",
          label: "PDF Field Label",
          type: "text",
        },
        {
          key: "form.fields.pdf.required",
          label: "PDF Required",
          type: "boolean",
        },
        {
          key: "form.submitButton.text",
          label: "Submit Button Text",
          type: "text",
        },
        {
          key: "api.tenantId",
          label: "Tenant ID",
          type: "text",
        },
      ],
    },
  ],
};
