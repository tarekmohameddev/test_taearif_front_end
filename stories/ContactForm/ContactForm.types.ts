/* ------------------------------------------------------------------ */
/*  ContactForm — Type definitions                                    */
/* ------------------------------------------------------------------ */

import type { TextStyleProps } from "../Text/Text.types";

export interface ContactFormProps {
  /** Main heading */
  heading?: string;
  /** Description paragraph */
  description?: string;
  /** Style overrides for heading */
  headingTextProps?: TextStyleProps;
  /** Style overrides for description */
  descriptionTextProps?: TextStyleProps;
  /** Form field labels */
  fields?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    select?: string;
    message?: string;
  };
  /** Links section */
  links?: {
    investment?: {
      text: string;
      href: string;
    };
    suppliers?: {
      text: string;
      href: string;
    };
  };
  /** Submit button text */
  submitText?: string;
  /** Image source URL */
  imageSrc?: string;
  /** Image alt text */
  imageAlt?: string;
  /** Shape decoration images */
  shapeSrc?: string;
  /** Form submission handler */
  onSubmit?: (data: FormData) => void;
  /** Text direction — defaults to `"rtl"` */
  dir?: "rtl" | "ltr";
  // TODO: Add visible prop
  visible?: boolean;
}
