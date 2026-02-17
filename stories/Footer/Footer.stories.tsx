import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import { Footer } from "./Footer";
import { Header } from "../Header";
import { HeroBanner } from "../HeroBanner";

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

/* ------------------------------------------------------------------ */
/*  Combined — Full Page (Header + HeroBanner + Footer)                */
/* ------------------------------------------------------------------ */

/** Full Page — Header, HeroBanner, ValuesSection, ContactForm, and Footer combined (Arabic) */
export const FullPage: Story = {
  decorators: [
    (Story) => (
      <div className="relative">
        <Header />
        <HeroBanner />
        <Story />
      </div>
    ),
  ],
};

/** Full Page English — Header, HeroBanner, and Footer combined (LTR) */
export const FullPageEnglish: Story = {
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
  decorators: [
    (Story) => (
      <div className="relative">
        <Header
          dir="ltr"
          logo={{
            src: "https://clusters.sa/logo.svg",
            alt: "logo",
            href: "/en",
          }}
          navLinks={[
            { label: "Home", href: "/en", isActive: true },
            { label: "Projects", href: "/en/projects" },
            { label: "About Us", href: "/en/about-us" },
            { label: "Suppliers", href: "/en/suppliers" },
            { label: "Land & Investment", href: "/en/land-and-investment" },
          ]}
          languageToggle={{ label: "ar", onClick: fn() }}
          cta={{ label: "Contact Us", href: "/en#contact" }}
        />
        <HeroBanner
          dir="ltr"
          title="Clusters"
          subtitle="A Lifestyle"
          description="At Clusters, we design a unique human-centered environment that breathes authenticity, and pulses with creativity, to embrace your exceptional life chapters."
          primaryCta={{ label: "Explore Our Projects", href: "/en/projects" }}
          secondaryCta={{
            label: "Start a conversation..",
            href: "#call-us",
          }}
        />
        <Story />
      </div>
    ),
  ],
};
