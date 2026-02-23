/* ------------------------------------------------------------------ */
/*  CreativityTriadSection — Type definitions (ثلاثية الإبداع)         */
/* ------------------------------------------------------------------ */

import type { TextStyleProps } from "../Text/Text.types";

export interface CreativityCard {
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** Image URL */
  imageSrc: string;
  /** Image alt text */
  imageAlt?: string;
}

export interface CreativityTriadSectionProps {
  /** Section heading */
  heading?: string;
  /** Intro paragraph */
  intro?: string;
  /** Three cards (creativity pillars) */
  cards?: [CreativityCard, CreativityCard, CreativityCard];
  /** Text direction — defaults to `"rtl"` */
  dir?: "rtl" | "ltr";
  /** Style overrides for heading */
  headingTextProps?: TextStyleProps;
  /** Style overrides for intro paragraph */
  introTextProps?: TextStyleProps;
  /** Style overrides for card titles */
  cardTitleTextProps?: TextStyleProps;
  /** Style overrides for card descriptions */
  cardDescriptionTextProps?: TextStyleProps;
}
