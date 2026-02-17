/* ------------------------------------------------------------------ */
/*  ContactForm — Type definitions                                    */
/* ------------------------------------------------------------------ */

export interface ContactFormProps {
  /** Main heading */
  heading?: string;
  /** Description paragraph */
  description?: string;
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
}
