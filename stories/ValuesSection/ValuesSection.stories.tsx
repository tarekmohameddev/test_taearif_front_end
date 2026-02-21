import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import { ValuesSection } from "./ValuesSection";
import { Header } from "../Header";
import { HeroBanner } from "../HeroBanner";
import { ContactForm } from "../ContactForm/ContactForm";
import { Footer } from "../Footer";
import { CommunityIcon } from "../assets/CommunityIcon";
import { HeritageIcon } from "../assets/HeritageIcon";
import { QualityIcon } from "../assets/QualityIcon";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta = {
  title: "Theme/ValuesSection",
  component: ValuesSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ValuesSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Default — Arabic RTL with all default values */
export const Default: Story = {};

/** English — LTR layout with English content */
export const English: Story = {
  args: {
    dir: "ltr",
    heading: "We Don't Build\nWe Revive Places",
    description:
      "Our mission transcends the boundaries of concrete and glass. We see in every empty land a story waiting to be told, and in every design an opportunity to create a rich human experience. From carefully choosing the location, to the last touch in the finishes, we design every detail to serve one purpose: enriching your life",
    cards: [
      {
        title: "Community First",
        description: "Spaces that enhance social connection and harmony",
        icon: <CommunityIcon />,
        bgVariant: "muted-foreground",
      },
      {
        title: "Renewed Authenticity",
        description:
          "Inspired by our architectural heritage with a modern vision.",
        icon: <HeritageIcon />,
        bgVariant: "darken",
      },
      {
        title: "Quality as Standard",
        description:
          "Absolute commitment to the highest quality standards in materials and execution.",
        icon: <QualityIcon />,
        bgVariant: "black",
      },
    ],
  },
};

/** Custom — Custom heading and description */
export const Custom: Story = {
  args: {
    heading: "قيمنا الأساسية",
    description:
      "نؤمن بأن كل مشروع يجب أن يعكس قيمنا الأساسية في التميز والجودة والالتزام بالمجتمع.",
  },
};

/** Single Card — Only one value card */
export const SingleCard: Story = {
  args: {
    cards: [
      {
        title: "المجتمع أولاً",
        description: "مساحات تعزز الترابط الاجتماعي وتناغمها",
        icon: <CommunityIcon />,
        bgVariant: "muted-foreground",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Combined — Full Page (Header + HeroBanner + ValuesSection + ContactForm + Footer) */
/* ------------------------------------------------------------------ */

/** Full Page — Complete page with Header, HeroBanner, ValuesSection, ContactForm, and Footer (Arabic) */
export const FullPage: Story = {
  decorators: [
    (Story) => (
      <div className="relative">
        <Header />
        <HeroBanner />
        <Story />
        <ContactForm onSubmit={fn()} />
        <Footer />
      </div>
    ),
  ],
};

/** Full Page English — Complete page with all sections (LTR) */
export const FullPageEnglish: Story = {
  args: {
    dir: "ltr",
    heading: "We Don't Build\nWe Revive Places",
    description:
      "Our mission transcends the boundaries of concrete and glass. We see in every empty land a story waiting to be told, and in every design an opportunity to create a rich human experience. From carefully choosing the location, to the last touch in the finishes, we design every detail to serve one purpose: enriching your life",
    cards: [
      {
        title: "Community First",
        description: "Spaces that enhance social connection and harmony",
        icon: <CommunityIcon />,
        bgVariant: "muted-foreground",
      },
      {
        title: "Renewed Authenticity",
        description:
          "Inspired by our architectural heritage with a modern vision.",
        icon: <HeritageIcon />,
        bgVariant: "darken",
      },
      {
        title: "Quality as Standard",
        description:
          "Absolute commitment to the highest quality standards in materials and execution.",
        icon: <QualityIcon />,
        bgVariant: "black",
      },
    ],
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
          cta={{ label: "Contact Us", href: "/en#call-us" }}
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
        <ContactForm
          dir="ltr"
          heading="Start a conversation with us.. about your investment future or dream home"
          description="Whether you're looking for a unique investment opportunity or aspiring to own a home that exceeds your expectations, our specialized team is ready to answer all your inquiries"
          onSubmit={fn()}
        />
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
