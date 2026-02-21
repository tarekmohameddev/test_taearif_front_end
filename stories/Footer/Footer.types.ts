export interface FooterLink {
  /** Display label */
  label: string;
  /** Link URL */
  href: string;
}

export interface SocialLink {
  /** Platform name (used for aria-label) */
  platform: string;
  /** Profile URL */
  href: string;
  /** SVG icon as React node */
  icon: React.ReactNode;
}

export interface FooterProps {
  /** Footer logo — image source, alt text, and link href */
  logo?: {
    src: string;
    alt: string;
    href: string;
  };
  /** Office address block */
  address?: {
    label: string;
    value: string;
  };
  /** Contact email */
  email?: string;
  /** Navigation links */
  links?: FooterLink[];
  /** Links section heading */
  linksHeading?: string;
  /** Social media links */
  socialLinks?: SocialLink[];
  /** Social section heading */
  socialHeading?: string;
  /** Copyright text */
  copyright?: string;
  /** Text direction — defaults to `"rtl"` */
  dir?: "rtl" | "ltr";
}
