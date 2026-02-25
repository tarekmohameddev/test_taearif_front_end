/* ------------------------------------------------------------------ */
/*  ProjectsShowcase — Type definitions                                */
/* ------------------------------------------------------------------ */

import type { TextStyleProps } from "../Text/Text.types";

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
  /** Style overrides for filter button labels */
  filterButtonTextProps?: TextStyleProps;
  /** Style overrides for status badge text */
  statusBadgeTextProps?: TextStyleProps;
  /** Style overrides for project card title */
  projectTitleTextProps?: TextStyleProps;
  /** Style overrides for project location */
  projectLocationTextProps?: TextStyleProps;
  /** Style overrides for project description */
  projectDescriptionTextProps?: TextStyleProps;
  /** Style overrides for unit type labels */
  unitTypeTextProps?: TextStyleProps;
  /** Style overrides for card CTA button text */
  ctaTextProps?: TextStyleProps;
  // TODO: Add visible prop
  visible?: boolean;
}
