/* ------------------------------------------------------------------ */
/*  Text — Type definitions                                           */
/* ------------------------------------------------------------------ */

import type { CSSProperties, ReactNode } from "react";

/** HTML element the Text component renders as */
export type TextTag =
  | "p"
  | "span"
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "blockquote"
  | "label"
  | "figcaption"
  | "legend"
  | "small"
  | "strong"
  | "em";

export interface TextProps {
  /** Content to render inside the text element */
  children?: ReactNode;

  /** HTML element to render — defaults to `"p"` */
  as?: TextTag;

  /* ── Typography ─────────────────────────────────────────────── */

  /** Font family (e.g. `"Inter, sans-serif"`) */
  fontFamily?: string;
  /** Font size (e.g. `"16px"`, `"1.5rem"`, `"clamp(1rem, 2vw, 2rem)"`) */
  fontSize?: string;
  /** Font weight (`100`–`900` or keyword like `"bold"`) */
  fontWeight?: CSSProperties["fontWeight"];
  /** Font style — `"normal"` | `"italic"` | `"oblique"` */
  fontStyle?: CSSProperties["fontStyle"];
  /** Line height (e.g. `"1.6"`, `"24px"`) */
  lineHeight?: string;
  /** Letter spacing (e.g. `"0.05em"`, `"1px"`) */
  letterSpacing?: string;
  /** Word spacing (e.g. `"4px"`) */
  wordSpacing?: string;

  /* ── Color & Decoration ─────────────────────────────────────── */

  /** Text color (any CSS color value) */
  color?: string;
  /** Background color behind the text */
  backgroundColor?: string;
  /** Opacity (`0` to `1`) */
  opacity?: number;
  /** Text decoration — `"none"` | `"underline"` | `"line-through"` | `"overline"` */
  textDecoration?: CSSProperties["textDecoration"];
  /** Text decoration color */
  textDecorationColor?: string;
  /** Text decoration style — `"solid"` | `"dashed"` | `"dotted"` | `"double"` | `"wavy"` */
  textDecorationStyle?: CSSProperties["textDecorationStyle"];
  /** Text decoration thickness (e.g. `"2px"`) */
  textDecorationThickness?: string;
  /** Text underline offset (e.g. `"3px"`) */
  textUnderlineOffset?: string;

  /* ── Text Layout ────────────────────────────────────────────── */

  /** Text alignment */
  textAlign?: CSSProperties["textAlign"];
  /** Text transform — `"none"` | `"uppercase"` | `"lowercase"` | `"capitalize"` */
  textTransform?: CSSProperties["textTransform"];
  /** Text indent (e.g. `"2em"`) */
  textIndent?: string;
  /** Vertical alignment */
  verticalAlign?: CSSProperties["verticalAlign"];
  /** Text direction — `"ltr"` | `"rtl"` */
  direction?: "ltr" | "rtl";
  /** White space handling */
  whiteSpace?: CSSProperties["whiteSpace"];
  /** Word break behaviour */
  wordBreak?: CSSProperties["wordBreak"];
  /** Overflow wrap */
  overflowWrap?: CSSProperties["overflowWrap"];
  /** Text overflow — `"clip"` | `"ellipsis"` */
  textOverflow?: CSSProperties["textOverflow"];

  /* ── Effects ────────────────────────────────────────────────── */

  /** Text shadow (e.g. `"2px 2px 4px rgba(0,0,0,0.3)"`) */
  textShadow?: string;
  /** CSS filter on the text element (e.g. `"blur(1px)"`) */
  filter?: string;
  /** Mix blend mode */
  mixBlendMode?: CSSProperties["mixBlendMode"];

  /* ── Spacing ────────────────────────────────────────────────── */

  /** Margin (CSS shorthand, e.g. `"16px 0"`) */
  margin?: string;
  /** Padding (CSS shorthand, e.g. `"8px 12px"`) */
  padding?: string;

  /* ── Sizing & Overflow ──────────────────────────────────────── */

  /** Max width (e.g. `"600px"`, `"80ch"`) */
  maxWidth?: string;
  /** Max number of lines before truncation (uses `-webkit-line-clamp`) */
  lineClamp?: number;
  /** Overflow — `"visible"` | `"hidden"` | `"scroll"` | `"auto"` */
  overflow?: CSSProperties["overflow"];

  /* ── Border & Background ────────────────────────────────────── */

  /** Border (CSS shorthand, e.g. `"1px solid #ccc"`) */
  border?: string;
  /** Border radius (e.g. `"4px"`) */
  borderRadius?: string;

  /* ── Cursor & Interaction ───────────────────────────────────── */

  /** Cursor style */
  cursor?: CSSProperties["cursor"];
  /** Whether text is user-selectable */
  userSelect?: CSSProperties["userSelect"];

  /* ── Escape Hatch ───────────────────────────────────────────── */

  /** Additional inline styles (overrides all above) */
  style?: CSSProperties;
  /** Additional CSS class names */
  className?: string;
}

/** Props for styling a Text slot (excludes content and tag so the component controls them) */
export type TextStyleProps = Omit<Partial<TextProps>, "children" | "as">;
