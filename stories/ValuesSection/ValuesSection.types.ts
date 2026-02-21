/* ------------------------------------------------------------------ */
/*  ValuesSection — Type definitions                                  */
/* ------------------------------------------------------------------ */

export interface ValueCard {
  /** Card title (bold text) */
  title: string;
  /** Card description */
  description: string;
  /** Icon SVG as React node */
  icon: React.ReactNode;
  /** Background color variant */
  bgVariant: "muted-foreground" | "darken" | "black";
}

export interface ValuesSectionProps {
  /** Main heading */
  heading?: string;
  /** Description paragraph */
  description?: string;
  /** Value cards array */
  cards?: ValueCard[];
  /** Text direction — defaults to `"rtl"` */
  dir?: "rtl" | "ltr";
}
