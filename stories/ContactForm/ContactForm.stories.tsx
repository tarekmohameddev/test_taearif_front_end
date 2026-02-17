import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import { ContactForm } from "./ContactForm";
import { Header } from "../Header";
import { HeroBanner } from "../HeroBanner";
import { ValuesSection } from "../ValuesSection/ValuesSection";
import { Footer } from "../Footer";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta = {
  title: "Theme/ContactForm",
  component: ContactForm,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ContactForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Default — Arabic RTL with all default values */
export const Default: Story = {
  args: {
    onSubmit: fn(),
  },
};

/** English — LTR layout with English content */
export const English: Story = {
  args: {
    dir: "ltr",
    heading: "Start a conversation with us.. about your investment future or dream home",
    description:
      "Whether you're looking for a unique investment opportunity or aspiring to own a home that exceeds your expectations, our specialized team is ready to answer all your inquiries",
    fields: {
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone Number",
      select: "Loading...",
      message: "Your Message (Optional)",
    },
    links: {
      investment: {
        text: "Interested in real estate investment opportunities",
        href: "land-and-investment",
      },
      suppliers: {
        text: "Interested in becoming a supplier partner",
        href: "suppliers",
      },
    },
    submitText: "Send",
    onSubmit: fn(),
  },
};

/** Custom Image — Custom image source */
export const CustomImage: Story = {
  args: {
    imageSrc: "https://placehold.co/800x800/F5EDE3/b28966?text=Contact+Image",
    imageAlt: "Contact illustration",
    onSubmit: fn(),
  },
};

/* ------------------------------------------------------------------ */
/*  Combined — Full Page (Header + HeroBanner + ValuesSection + ContactForm + Footer) */
/* ------------------------------------------------------------------ */

/** Full Page — Complete page with all sections (Arabic) */
export const FullPage: Story = {
  args: {
    onSubmit: fn(),
  },
  decorators: [
    (Story) => (
      <div className="relative">
        <Header />
        <HeroBanner />
        <ValuesSection />
        <Story />
        <Footer />
      </div>
    ),
  ],
};

/** Full Page English — Complete page with all sections (LTR) */
export const FullPageEnglish: Story = {
  args: {
    dir: "ltr",
    heading: "Start a conversation with us.. about your investment future or dream home",
    description:
      "Whether you're looking for a unique investment opportunity or aspiring to own a home that exceeds your expectations, our specialized team is ready to answer all your inquiries",
    fields: {
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone Number",
      select: "Loading...",
      message: "Your Message (Optional)",
    },
    links: {
      investment: {
        text: "Interested in real estate investment opportunities",
        href: "land-and-investment",
      },
      suppliers: {
        text: "Interested in becoming a supplier partner",
        href: "suppliers",
      },
    },
    submitText: "Send",
    onSubmit: fn(),
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
        <ValuesSection
          dir="ltr"
          heading="We Don't Build\nWe Revive Places"
          description="Our mission transcends the boundaries of concrete and glass. We see in every empty land a story waiting to be told, and in every design an opportunity to create a rich human experience. From carefully choosing the location, to the last touch in the finishes, we design every detail to serve one purpose: enriching your life"
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
