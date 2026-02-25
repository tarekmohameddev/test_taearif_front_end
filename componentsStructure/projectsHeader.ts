import { ComponentStructure } from "./types";

export const projectsHeaderStructure: ComponentStructure = {
  componentType: "projectsHeader",
  variants: [
    {
      id: "projectsHeader1",
      name: "Projects Header 1",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "dir", label: "Direction", type: "select", options: [{ label: "RTL", value: "rtl" }, { label: "LTR", value: "ltr" }] },
        { key: "heading", label: "Heading", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "heading", label: "Heading", type: "text" },
      ],
    },
  ],
};
