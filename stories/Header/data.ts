import { NavLink } from "./Header.types";

export const DEFAULT_LOGO = {
  src: "https://clusters.sa/logo.svg",
  alt: "logo",
  href: "/ar",
};

export const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: "الرئيسية", href: "/ar", isActive: true },
  { label: "مشاريعنا", href: "/ar/projects" },
  { label: "من نحن", href: "/ar/about-us" },
  { label: "بوابة الموردين", href: "/ar/suppliers" },
  { label: "ارضك و إستثمارك", href: "/ar/land-and-investment" },
];

export const DEFAULT_LANGUAGE: { label: string; onClick?: () => void } = {
  label: "en",
};

export const DEFAULT_CTA = { label: "اتصل بنا", href: "/ar#call-us" };
