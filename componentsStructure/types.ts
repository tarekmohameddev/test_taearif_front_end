export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "color"
  | "image"
  | "select"
  | "array"
  | "object";

export interface FieldDefinitionBase {
  key: string; // dot path, e.g. "texts.title" or "slides[0].title" (0 for template)
  label: string;
  type: FieldType;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number; // for number fields (e.g. 1)
  unit?: string; // for number fields (e.g. "px") - shown next to value in editor
  options?: {
    label: string;
    value: string;
    iconLibrary?: "lucide" | "react-icons";
  }[]; // for select
  showIcons?: boolean; // for select fields: show icons in dropdown
  defaultValue?: any; // default value for the field
  description?: string; // description for the field
  condition?: {
    field: string; // path to the field to check
    value: any; // value that should match for the field to be shown
  };
  // For color fields: use default branding colors or custom color
  useDefaultColor?: boolean; // default: true - use branding colors from WebsiteLayout
  globalColorType?: "primary" | "secondary" | "accent"; // which branding color to use (primary, secondary, or accent)
  // For background color fields: use mainBgColor from branding or custom color
  useMainBgColor?: boolean; // default: true - use mainBgColor from WebsiteLayout.branding.mainBgColor
  // For displaying fields as collapsible group (flat data structure, not nested object)
  displayAsGroup?: boolean; // if true, display fields in groupFields as collapsible group
  groupFields?: FieldDefinition[]; // fields to display in the collapsible group
  // For displaying fields as object wrapper (flat data structure, not nested object)
  displayAsObject?: boolean; // if true, display fields in wrappedFields as object wrapper
  wrappedFields?: FieldDefinition[]; // fields to display in the object wrapper
}

export interface ObjectFieldDefinition extends FieldDefinitionBase {
  type: "object";
  fields: FieldDefinition[];
}

export interface ArrayFieldDefinition extends FieldDefinitionBase {
  type: "array";
  of: FieldDefinition[]; // fields for each item
  minItems?: number;
  maxItems?: number;
  addLabel?: string;
  itemLabel?: string;
}

export type FieldDefinition =
  | FieldDefinitionBase
  | ObjectFieldDefinition
  | ArrayFieldDefinition;

export interface VariantDefinition {
  id: string; // hero1, hero2, hero3 ...
  name: string;
  description?: string; // description for the variant
  componentPath?: string; // path to the component file
  fields: FieldDefinition[];
  simpleFields?: FieldDefinition[];
}

export interface ComponentStructure {
  componentType: string; // hero
  name?: string; // display name for the component
  variants: VariantDefinition[];
}
