/* ------------------------------------------------------------------ */
/*  ProjectsHeader — Type definitions                                 */
/* ------------------------------------------------------------------ */

import type { TextStyleProps } from "../Text/Text.types";

export interface ProjectsHeaderProps {
  /** Main heading */
  heading?: string;
  /** Description paragraph (can contain multiple lines) */
  description?: string | string[];
  /** Text direction — defaults to `"rtl"` */
  dir?: "rtl" | "ltr";
  /** Style overrides for heading */
  headingTextProps?: TextStyleProps;
  /** Style overrides for description */
  descriptionTextProps?: TextStyleProps;
}
