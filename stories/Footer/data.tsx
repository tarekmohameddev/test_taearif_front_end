import { InstagramIcon } from "../assets/InstagramIcon";
import { LinkedInIcon } from "../assets/LinkedInIcon";
import { TikTokIcon } from "../assets/TikTokIcon";
import { XIcon } from "../assets/XIcon";
import type { SocialLink } from "./Footer.types";

export const DEFAULT_LOGO = {
  src: "https://clusters.sa/logo-v2.svg",
  alt: "logo",
  href: "/",
};

export const DEFAULT_ADDRESS = {
  label: "المركز الرئيسي:",
  value: "7361 حي النرجس، الرياض 13328",
};

export const DEFAULT_EMAIL = "info@clusters.sa";

export const DEFAULT_LINKS = [
  { label: "مشاريعنا", href: "/ar/projects" },
  { label: "من نحن", href: "/ar/about-us" },
  { label: "بوابة الموردين", href: "/ar/suppliers" },
  { label: "ارضك و إستثمارك", href: "/ar/land-and-investment" },
  { label: "سياسة الخصوصية", href: "/ar/privacy-policy" },
  { label: "المكتبة", href: "/ar/library" },
];

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "instagram",
    href: "https://www.instagram.com/Clusters_ksa",
    icon: <InstagramIcon />,
  },
  {
    platform: "linkedin",
    href: "https://www.linkedin.com/company/clusters-realestate-development-co-/",
    icon: <LinkedInIcon />,
  },
  {
    platform: "tiktok",
    href: "https://www.tiktok.com/@clusters_ksa",
    icon: <TikTokIcon />,
  },
  {
    platform: "x",
    href: "https://x.com/Clusters_KSA",
    icon: <XIcon />,
  },
];

export const DEFAULT_COPYRIGHT = "© تجمعات 2025 . كل الحقوق محفوظة";
