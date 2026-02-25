import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import { Header } from "./Header";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta = {
  title: "Theme/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    navLinkTextProps: { fontWeight: 700 },
    languageToggleTextProps: {
      fontSize: "1.25rem",
      fontWeight: 700,
      textTransform: "uppercase",
    },
    ctaTextProps: { fontSize: "0.875rem", fontWeight: 700 },
  },
  decorators: [
    (Story) => (
      <div className="relative min-h-[400px] w-full bg-[#111827]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Default — Arabic RTL with placeholder data */
export const Default: Story = {};

/** English — LTR layout with English labels */
export const English: Story = {
  args: {
    dir: "ltr",
    logo: {
      src: "https://clusters.sa/logo.svg",
      alt: "logo",
      href: "/en",
    },
    navLinks: [
      { label: "Home", href: "/en", isActive: true },
      { label: "Projects", href: "/en/projects" },
      { label: "About Us", href: "/en/about-us" },
      { label: "Suppliers", href: "/en/suppliers" },
      { label: "Land & Investment", href: "/en/land-and-investment" },
    ],
    languageToggle: { label: "ar", onClick: fn() },
    cta: { label: "Contact Us", href: "/en#contact" },
  },
};

/** Minimal — fewer navigation links */
export const Minimal: Story = {
  args: {
    navLinks: [
      { label: "الرئيسية", href: "/", isActive: true },
      { label: "من نحن", href: "/about" },
    ],
    cta: { label: "تواصل معنا", href: "#contact" },
  },
};

/** Custom branding — different logo and labels */
export const CustomBranding: Story = {
  args: {
    logo: {
      src: "https://clusters.sa/logo.svg",
      alt: "brand logo",
      href: "/",
    },
    navLinks: [
      { label: "الرئيسية", href: "/", isActive: true },
      { label: "خدماتنا", href: "/services" },
      { label: "المشاريع", href: "/projects" },
      { label: "تواصل معنا", href: "/contact" },
    ],
    languageToggle: { label: "en", onClick: fn() },
    cta: { label: "احجز الآن", href: "#booking" },
  },
};
