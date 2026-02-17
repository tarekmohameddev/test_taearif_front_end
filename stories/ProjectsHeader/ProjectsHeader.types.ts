/* ------------------------------------------------------------------ */
/*  ProjectsHeader — Type definitions                                 */
/* ------------------------------------------------------------------ */

export interface ProjectsHeaderProps {
  /** Main heading */
  heading?: string;
  /** Description paragraph (can contain multiple lines) */
  description?: string | string[];
  /** Text direction — defaults to `"rtl"` */
  dir?: "rtl" | "ltr";
}
