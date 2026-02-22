import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import { HeroBanner } from "./HeroBanner";
import { Header } from "../Header";
import { Footer } from "../Footer";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta = {
  title: "Theme/HeroBanner",
  component: HeroBanner,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    titleTextProps: {
      color: "#deae6d",
      fontSize: "4.5rem",
      fontWeight: 400,
    },
    subtitleTextProps: {
      color: "#fff",
      fontSize: "3rem",
      fontWeight: 700,
    },
    descriptionTextProps: {
      color: "#fff",
      fontSize: "1.125rem",
      lineHeight: "1.6",
      maxWidth: "36rem",
    },
  },
} satisfies Meta<typeof HeroBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Default — Arabic RTL with video background and placeholder content */
export const Default: Story = {};

/** English — LTR layout with English labels */
export const English: Story = {
  args: {
    dir: "ltr",
    title: "Clusters",
    subtitle: "A Lifestyle",
    description:
      "At Clusters, we design a unique human-centered environment that breathes authenticity, and pulses with creativity, to embrace your exceptional life chapters.",
    primaryCta: { label: "Explore Our Projects", href: "/en/projects" },
    secondaryCta: { label: "Start a conversation..", href: "#call-us" },
  },
};

/** No Video — fallback with image poster */
export const WithFallbackImage: Story = {
  args: {
    videoSrc: "",
    fallbackImage:
      "https://placehold.co/1920x1080/1a1a2e/deae6d?text=Hero+Banner",
  },
};

/** No Scroll Indicator */
export const NoScrollIndicator: Story = {
  args: {
    showScrollIndicator: false,
  },
};

/* ------------------------------------------------------------------ */
/*  Combined — Header + HeroBanner                                     */
/* ------------------------------------------------------------------ */

/** Full Hero Section — Header overlaid on top of the HeroBanner */
export const WithHeader: Story = {
  decorators: [
    (Story) => (
      <div className="relative">
        <Header />
        <Story />
      </div>
    ),
  ],
};

/** Full Hero Section (English) — LTR Header + HeroBanner */
export const WithHeaderEnglish: Story = {
  args: {
    dir: "ltr",
    title: "Clusters",
    subtitle: "A Lifestyle",
    description:
      "At Clusters, we design a unique human-centered environment that breathes authenticity, and pulses with creativity, to embrace your exceptional life chapters.",
    primaryCta: { label: "Explore Our Projects", href: "/en/projects" },
    secondaryCta: { label: "Start a conversation..", href: "#call-us" },
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
        <Story />
        <Footer
          dir="ltr"
          logo={{
            src: "https://clusters.sa/logo-v2.svg",
            alt: "logo",
            href: "/en",
          }}
          address={{
            label: "Head Office:",
            value: "7361 Al Narjis, Riyadh 13328",
          }}
          email="info@clusters.sa"
          linksHeading="Links"
          links={[
            { label: "Projects", href: "/en/projects" },
            { label: "About Us", href: "/en/about-us" },
            { label: "Suppliers", href: "/en/suppliers" },
            { label: "Land & Investment", href: "/en/land-and-investment" },
            { label: "Privacy Policy", href: "/en/privacy-policy" },
            { label: "Library", href: "/en/library" },
          ]}
          socialHeading="Follow Us"
          copyright="© Clusters 2025. All rights reserved"
        />
      </div>
    ),
  ],
};
