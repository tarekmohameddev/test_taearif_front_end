import { ComponentStructure } from "./types";

export const contactFormStructure: ComponentStructure = {
  componentType: "contactForm",
  variants: [
    {
      id: "contactForm1",
      name: "Contact Form 1",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        {
          key: "dir",
          label: "Direction",
          type: "select",
          options: [
            { label: "RTL", value: "rtl" },
            { label: "LTR", value: "ltr" },
          ],
        },
        { key: "heading", label: "Heading", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        {
          key: "fields",
          label: "Field Labels",
          type: "object",
          fields: [
            { key: "firstName", label: "First Name", type: "text" },
            { key: "lastName", label: "Last Name", type: "text" },
            { key: "phone", label: "Phone", type: "text" },
            { key: "select", label: "Select Placeholder", type: "text" },
            { key: "message", label: "Message", type: "text" },
          ],
        },
        {
          key: "links",
          label: "Links",
          type: "object",
          fields: [
            {
              key: "investment",
              label: "Investment Link",
              type: "object",
              fields: [
                { key: "text", label: "Text", type: "text" },
                { key: "href", label: "URL", type: "text" },
              ],
            },
            {
              key: "suppliers",
              label: "Suppliers Link",
              type: "object",
              fields: [
                { key: "text", label: "Text", type: "text" },
                { key: "href", label: "URL", type: "text" },
              ],
            },
          ],
        },
        { key: "submitText", label: "Submit Button Text", type: "text" },
        { key: "imageSrc", label: "Image URL", type: "text" },
        { key: "imageAlt", label: "Image Alt", type: "text" },
        { key: "shapeSrc", label: "Shape Image URL", type: "text" },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "heading", label: "Heading", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "submitText", label: "Submit Text", type: "text" },
      ],
    },
  ],
};
