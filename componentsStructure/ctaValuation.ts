import { ComponentStructure } from "./types";

export const ctaValuationStructure: ComponentStructure = {
  componentType: "ctaValuation",
  variants: [
    {
      id: "ctaValuation1",
      name: "CTA Valuation 1 - Modern Design",
      fields: [
        {
          key: "visible",
          label: "Visible",
          type: "boolean",
        },
        {
          key: "content",
          label: "Content",
          type: "object",
          fields: [
            {
              key: "description1",
              label: "title",
              type: "text",
            },
            {
              key: "description2",
              label: "Description",
              type: "text",
            },
            {
              key: "buttonText",
              label: "Button Text",
              type: "text",
            },
            {
              key: "buttonUrl",
              label: "Button URL",
              type: "text",
            },
          ],
        },
        {
          key: "image",
          label: "Image",
          type: "object",
          fields: [
            {
              key: "src",
              label: "Image Source",
              type: "image",
            },
            {
              key: "alt",
              label: "Image Alt Text",
              type: "text",
            },
            {
              key: "width",
              label: "Image Width",
              type: "number",
              unit: "px",
            },
            {
              key: "height",
              label: "Image Height",
              type: "number",
              unit: "px",
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
              useDefaultColor: true,
              globalColorType: "primary", // Background uses primary color from branding
            },
            {
              key: "textColor",
              label: "Text Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "secondary", // Text uses secondary color from branding
            },
            {
              key: "buttonBgColor",
              label: "Button Background Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "primary", // Button background uses primary color from branding
            },
            {
              key: "buttonTextColor",
              label: "Button Text Color",
              type: "color",
              useDefaultColor: true,
              globalColorType: "primary", // Button text uses primary color from branding
            },
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "content.description1", label: "title", type: "text" },
        { key: "content.description2", label: "Description", type: "text" },
        { key: "content.buttonText", label: "Button Text", type: "text" },
        { key: "content.buttonUrl", label: "Button URL", type: "text" },
        { key: "image.src", label: "Image Source", type: "image" },
        { key: "image.alt", label: "Image Alt Text", type: "text" },
      ],
    },
  ],
};
