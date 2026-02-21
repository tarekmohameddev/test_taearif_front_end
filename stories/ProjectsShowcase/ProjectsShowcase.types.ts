/* ------------------------------------------------------------------ */
/*  ProjectsShowcase — Type definitions                                */
/* ------------------------------------------------------------------ */

export type FilterType = "all" | "available" | "coming-soon" | "sold";

export interface UnitType {
  /** Unit type label */
  label: string;
  /** Unit type icon URL */
  iconSrc: string;
  /** Whether to invert icon color */
  invertIcon?: boolean;
}

export interface ProjectCard {
  /** Project title */
  title: string;
  /** Project location */
  location: string;
  /** Project description */
  description: string;
  /** Project status */
  status: "available" | "coming-soon" | "sold";
  /** Status badge color */
  statusColor: string;
  /** Project logo/image URL */
  logoSrc?: string;
  /** Logo alt text */
  logoAlt?: string;
  /** Unit types available */
  unitTypes: UnitType[];
  /** CTA button text */
  ctaText: string;
  /** CTA button href */
  ctaHref: string;
  /** CTA button background color */
  ctaBgColor: string;
  /** Project image URL */
  imageSrc: string;
  /** Image alt text */
  imageAlt: string;
  /** Background pattern image URL */
  patternSrc: string;
  /** Card background color */
  backgroundColor: string;
  /** Card text color */
  textColor: string;
  /** Share button click handler */
  onShare?: () => void;
}

export interface ProjectsShowcaseProps {
  /** Filter buttons configuration */
  filters?: {
    all: string;
    available: string;
    comingSoon: string;
    sold: string;
  };
  /** Active filter */
  activeFilter?: FilterType;
  /** Filter change handler */
  onFilterChange?: (filter: FilterType) => void;
  /** Project cards array */
  projects?: ProjectCard[];
  /** Text direction — defaults to `"rtl"` */
  dir?: "rtl" | "ltr";
}
