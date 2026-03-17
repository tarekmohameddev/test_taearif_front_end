import type { FieldDefinition } from "./types";

/**
 * Shared text style fields for any component that uses the stories/Text component
 * via *TextProps (e.g. headingTextProps, descriptionTextProps). Reused in heroBanner,
 * essenceSection, commitmentSection, and other theme3 components.
 */
export const sharedTextStyleFields: FieldDefinition[] = [
  { key: "fontFamily", label: "Font Family", type: "text", placeholder: "e.g. Inter, sans-serif" },
  { key: "fontSize", label: "Font Size", type: "text", placeholder: "e.g. 4.5rem, 16px" },
  { key: "fontWeight", label: "Font Weight", type: "text", placeholder: "e.g. 400, bold" },
  {
    key: "fontStyle",
    label: "Font Style",
    type: "select",
    options: [
      { label: "Normal", value: "normal" },
      { label: "Italic", value: "italic" },
      { label: "Oblique", value: "oblique" },
    ],
  },
  { key: "lineHeight", label: "Line Height", type: "text", placeholder: "e.g. 1.6, 24px" },
  { key: "letterSpacing", label: "Letter Spacing", type: "text", placeholder: "e.g. 0.05em" },
  { key: "wordSpacing", label: "Word Spacing", type: "text", placeholder: "e.g. 4px" },
  { key: "color", label: "Color", type: "color" },
  { key: "backgroundColor", label: "Background Color", type: "color" },
  {
    key: "opacity",
    label: "Opacity",
    type: "number",
    placeholder: "1",
    min: 0,
    max: 1,
    step: 0.1,
  },
  {
    key: "textDecoration",
    label: "Text Decoration",
    type: "select",
    options: [
      { label: "None", value: "none" },
      { label: "Underline", value: "underline" },
      { label: "Line Through", value: "line-through" },
      { label: "Overline", value: "overline" },
    ],
  },
  { key: "textDecorationColor", label: "Decoration Color", type: "color" },
  {
    key: "textAlign",
    label: "Text Align",
    type: "select",
    options: [
      { label: "Left", value: "left" },
      { label: "Center", value: "center" },
      { label: "Right", value: "right" },
      { label: "Justify", value: "justify" },
    ],
  },
  {
    key: "textTransform",
    label: "Text Transform",
    type: "select",
    options: [
      { label: "None", value: "none" },
      { label: "Uppercase", value: "uppercase" },
      { label: "Lowercase", value: "lowercase" },
      { label: "Capitalize", value: "capitalize" },
    ],
  },
  { key: "margin", label: "Margin", type: "text", placeholder: "e.g. 16px 0" },
  { key: "padding", label: "Padding", type: "text", placeholder: "e.g. 8px 12px" },
  { key: "maxWidth", label: "Max Width", type: "text", placeholder: "e.g. 36rem, 600px" },
  { key: "textShadow", label: "Text Shadow", type: "text", placeholder: "e.g. 2px 2px 4px rgba(0,0,0,0.3)" },
  { key: "border", label: "Border", type: "text", placeholder: "e.g. 1px solid #ccc" },
  { key: "borderRadius", label: "Border Radius", type: "text", placeholder: "e.g. 4px" },
  {
    key: "direction",
    label: "Direction",
    type: "select",
    options: [
      { label: "LTR", value: "ltr" },
      { label: "RTL", value: "rtl" },
    ],
  },
  {
    key: "whiteSpace",
    label: "White Space",
    type: "select",
    options: [
      { label: "Normal", value: "normal" },
      { label: "Nowrap", value: "nowrap" },
      { label: "Pre", value: "pre" },
      { label: "Pre-wrap", value: "pre-wrap" },
    ],
  },
  {
    key: "wordBreak",
    label: "Word Break",
    type: "select",
    options: [
      { label: "Normal", value: "normal" },
      { label: "Break All", value: "break-all" },
      { label: "Keep All", value: "keep-all" },
    ],
  },
  { key: "lineClamp", label: "Line Clamp", type: "number", placeholder: "e.g. 3" },
];
