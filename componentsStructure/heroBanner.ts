import { ComponentStructure } from "./types";
import { sharedTextStyleFields } from "./sharedTextStyleFields";

export const heroBannerStructure: ComponentStructure = {
  componentType: "heroBanner",
  variants: [
    {
      id: "heroBanner1",
      name: "Hero Banner 1 - Video Background",
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
        { key: "title", label: "Title", type: "text" },
        { key: "subtitle", label: "Subtitle", type: "text" },
        { key: "description", label: "Description", type: "text" },
        {
          key: "titleTextProps",
          label: "Title Style",
          type: "object",
          fields: sharedTextStyleFields,
        },
        {
          key: "subtitleTextProps",
          label: "Subtitle Style",
          type: "object",
          fields: sharedTextStyleFields,
        },
        {
          key: "descriptionTextProps",
          label: "Description Style",
          type: "object",
          fields: sharedTextStyleFields,
        },
        {
          key: "primaryCta",
          label: "Primary CTA",
          type: "object",
          fields: [
            { key: "label", label: "Button Text", type: "text" },
            { key: "href", label: "URL", type: "text" },
          ],
        },
        {
          key: "secondaryCta",
          label: "Secondary CTA",
          type: "object",
          fields: [
            { key: "label", label: "Button Text", type: "text" },
            { key: "href", label: "URL", type: "text" },
          ],
        },
        { key: "videoSrc", label: "Video URL", type: "text" },
        {
          key: "fallbackImage",
          label: "Fallback Image (Poster)",
          type: "image",
        },
        {
          key: "showScrollIndicator",
          label: "Show Scroll Indicator",
          type: "boolean",
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "title", label: "Title", type: "text" },
        { key: "subtitle", label: "Subtitle", type: "text" },
        { key: "description", label: "Description", type: "text" },
        { key: "titleTextProps.fontSize", label: "Title Font Size", type: "text" },
        { key: "titleTextProps.color", label: "Title Color", type: "color" },
        { key: "subtitleTextProps.fontSize", label: "Subtitle Font Size", type: "text" },
        { key: "subtitleTextProps.color", label: "Subtitle Color", type: "color" },
        { key: "descriptionTextProps.fontSize", label: "Description Font Size", type: "text" },
        { key: "descriptionTextProps.color", label: "Description Color", type: "color" },
        { key: "primaryCta.label", label: "Primary CTA Text", type: "text" },
        { key: "primaryCta.href", label: "Primary CTA URL", type: "text" },
        { key: "secondaryCta.label", label: "Secondary CTA Text", type: "text" },
        { key: "secondaryCta.href", label: "Secondary CTA URL", type: "text" },
        { key: "videoSrc", label: "Video URL", type: "text" },
        { key: "showScrollIndicator", label: "Scroll Indicator", type: "boolean" },
      ],
    },
  ],
};
