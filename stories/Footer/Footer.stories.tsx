import type { Meta, StoryObj } from "@storybook/nextjs";
import { Footer } from "./Footer";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta = {
  title: "Theme/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    addressLabelTextProps: { fontWeight: 700 },
    addressValueTextProps: { lineHeight: "1.25rem" },
    linksHeadingTextProps: { fontWeight: 700 },
    socialHeadingTextProps: { fontWeight: 700 },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Default — Arabic RTL with all placeholder data */
export const Default: Story = {};

/** English — LTR layout with English labels */
export const English: Story = {
  args: {
    dir: "ltr",
    logo: {
      src: "https://clusters.sa/logo-v2.svg",
      alt: "logo",
      href: "/en",
    },
    address: {
      label: "Head Office:",
      value: "7361 Al Narjis, Riyadh 13328",
    },
    email: "info@clusters.sa",
    linksHeading: "Links",
    links: [
      { label: "Projects", href: "/en/projects" },
      { label: "About Us", href: "/en/about-us" },
      { label: "Suppliers", href: "/en/suppliers" },
      { label: "Land & Investment", href: "/en/land-and-investment" },
      { label: "Privacy Policy", href: "/en/privacy-policy" },
      { label: "Library", href: "/en/library" },
    ],
    socialHeading: "Follow Us",
    copyright: "© Clusters 2025. All rights reserved",
  },
};

/** Minimal — fewer links, no social */
export const Minimal: Story = {
  args: {
    links: [
      { label: "مشاريعنا", href: "/ar/projects" },
      { label: "من نحن", href: "/ar/about-us" },
    ],
    socialLinks: [],
  },
};

