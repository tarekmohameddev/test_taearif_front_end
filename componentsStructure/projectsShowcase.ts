import { ComponentStructure } from "./types";

export const projectsShowcaseStructure: ComponentStructure = {
  componentType: "projectsShowcase",
  variants: [
    {
      id: "projectsShowcase1",
      name: "Projects Showcase 1",
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
        {
          key: "filters",
          label: "Filter Labels",
          type: "object",
          fields: [
            { key: "all", label: "All", type: "text" },
            { key: "available", label: "Available", type: "text" },
            { key: "comingSoon", label: "Coming Soon", type: "text" },
            { key: "sold", label: "Sold", type: "text" },
          ],
        },
        {
          key: "projects",
          label: "Projects",
          type: "array",
          addLabel: "Add Project",
          itemLabel: "Project",
          of: [
            { key: "title", label: "Title", type: "text" },
            { key: "location", label: "Location", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
            {
              key: "status",
              label: "Status",
              type: "select",
              options: [
                { label: "Available", value: "available" },
                { label: "Coming Soon", value: "coming-soon" },
                { label: "Sold", value: "sold" },
              ],
            },
            { key: "statusColor", label: "Status Color", type: "color" },
            { key: "ctaText", label: "CTA Text", type: "text" },
            { key: "ctaHref", label: "CTA URL", type: "text" },
            { key: "ctaBgColor", label: "CTA Background", type: "color" },
            { key: "imageSrc", label: "Image URL", type: "text" },
            { key: "imageAlt", label: "Image Alt", type: "text" },
            { key: "patternSrc", label: "Pattern URL", type: "text" },
            { key: "backgroundColor", label: "Background Color", type: "color" },
            { key: "textColor", label: "Text Color", type: "color" },
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "filters.all", label: "All Filter", type: "text" },
        { key: "projects", label: "Projects", type: "array" },
      ],
    },
  ],
};
