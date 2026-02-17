import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import { ProjectsShowcase } from "./ProjectsShowcase";
import { Header } from "../Header";
import { HeroBanner } from "../HeroBanner";
import { ValuesSection } from "../ValuesSection/ValuesSection";
import { ContactForm } from "../ContactForm/ContactForm";
import { Footer } from "../Footer";
import { ProjectsHeader } from "../ProjectsHeader/ProjectsHeader";
import { CommunityIcon } from "../assets/CommunityIcon";
import { HeritageIcon } from "../assets/HeritageIcon";
import { QualityIcon } from "../assets/QualityIcon";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta = {
  title: "Theme/ProjectsShowcase",
  component: ProjectsShowcase,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ProjectsShowcase>;

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
    filters: {
      all: "All",
      available: "Available",
      comingSoon: "Coming Soon",
      sold: "Sold",
    },
    projects: [
      {
        title: "JX Clusters",
        location: "Diriyah - JX District",
        description:
          "Where art shines with luxury architecture in the heart of the vibrant JX district",
        status: "available",
        statusColor: "#44580e",
        logoSrc: "/jx.png",
        logoAlt: "jx",
        unitTypes: [
          {
            label: "Luxury Apartments",
            iconSrc:
              "https://admin.clusters.sa/wp-content/uploads/2025/08/Appartment-b.svg",
            invertIcon: true,
          },
        ],
        ctaText: "Discover the Masterpiece",
        ctaHref: "/en/projects/jx-homes-1-diriyah",
        ctaBgColor: "rgb(222, 173, 107)",
        imageSrc:
          "https://admin.clusters.sa/wp-content/uploads/2025/08/06-cut-out-1.png",
        imageAlt: "resident footer",
        patternSrc:
          "https://admin.clusters.sa/wp-content/uploads/2025/08/JX-Pattern-02.svg",
        backgroundColor: "rgb(76, 89, 70)",
        textColor: "rgb(255, 255, 255)",
      },
      {
        title: "Al Narjis Clusters",
        location: "Riyadh - Al Narjis District (South of King Salman Road)",
        description:
          "Luxury townhouses and penthouses in the heart of Al Narjis, blending Najdi authenticity with modernity and private entrances",
        status: "available",
        statusColor: "#44580e",
        unitTypes: [
          {
            label: "Penthouse",
            iconSrc:
              "https://admin.clusters.sa/wp-content/uploads/2025/08/Penthouse-b.svg",
            invertIcon: false,
          },
          {
            label: "Townhouse",
            iconSrc:
              "https://admin.clusters.sa/wp-content/uploads/2025/08/Townhouse-b.svg",
            invertIcon: false,
          },
        ],
        ctaText: "Discover Your Home",
        ctaHref: "/en/projects/alnarjis-clusters",
        ctaBgColor: "rgb(222, 173, 107)",
        imageSrc:
          "https://admin.clusters.sa/wp-content/uploads/2025/08/4e607e282096633744890f948c4bdd6f5bb576fe-1-scaled.png",
        imageAlt: "resident footer",
        patternSrc:
          "https://admin.clusters.sa/wp-content/uploads/2025/08/Group-1000011980.png",
        backgroundColor: "rgb(232, 220, 211)",
        textColor: "rgb(0, 0, 0)",
      },
    ],
  },
};

/** Available Only — Filtered to show only available projects */
export const AvailableOnly: Story = {
  args: {
    activeFilter: "available",
  },
};

/** Custom Projects — Custom project cards */
export const CustomProjects: Story = {
  args: {
    projects: [
      {
        title: "تجمعات تجريبية",
        location: "الرياض - حي تجريبي",
        description: "مشروع تجريبي لعرض المكونات",
        status: "coming-soon",
        statusColor: "#44580e",
        unitTypes: [
          {
            label: "شقق",
            iconSrc:
              "https://admin.clusters.sa/wp-content/uploads/2025/08/Appartment-b.svg",
            invertIcon: false,
          },
        ],
        ctaText: "اكتشف المزيد",
        ctaHref: "/ar/projects/test",
        ctaBgColor: "rgb(222, 173, 107)",
        imageSrc:
          "https://admin.clusters.sa/wp-content/uploads/2025/08/06-cut-out-1.png",
        imageAlt: "test project",
        patternSrc:
          "https://admin.clusters.sa/wp-content/uploads/2025/08/JX-Pattern-02.svg",
        backgroundColor: "rgb(76, 89, 70)",
        textColor: "rgb(255, 255, 255)",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Combined — Full Page (Header + HeroBanner + ProjectsHeader + ProjectsShowcase + ValuesSection + ContactForm + Footer) */
/* ------------------------------------------------------------------ */

/** Full Page — Complete page with all sections (Arabic) */
export const FullPage: Story = {
  decorators: [
    (Story) => (
      <div className="relative">
        <Header />
        <HeroBanner />
        <ProjectsHeader />
        <Story />
        <ValuesSection />
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
    filters: {
      all: "All",
      available: "Available",
      comingSoon: "Coming Soon",
      sold: "Sold",
    },
    projects: [
      {
        title: "JX Clusters",
        location: "Diriyah - JX District",
        description:
          "Where art shines with luxury architecture in the heart of the vibrant JX district",
        status: "available",
        statusColor: "#44580e",
        logoSrc: "/jx.png",
        logoAlt: "jx",
        unitTypes: [
          {
            label: "Luxury Apartments",
            iconSrc:
              "https://admin.clusters.sa/wp-content/uploads/2025/08/Appartment-b.svg",
            invertIcon: true,
          },
        ],
        ctaText: "Discover the Masterpiece",
        ctaHref: "/en/projects/jx-homes-1-diriyah",
        ctaBgColor: "rgb(222, 173, 107)",
        imageSrc:
          "https://admin.clusters.sa/wp-content/uploads/2025/08/06-cut-out-1.png",
        imageAlt: "resident footer",
        patternSrc:
          "https://admin.clusters.sa/wp-content/uploads/2025/08/JX-Pattern-02.svg",
        backgroundColor: "rgb(76, 89, 70)",
        textColor: "rgb(255, 255, 255)",
      },
      {
        title: "Al Narjis Clusters",
        location: "Riyadh - Al Narjis District (South of King Salman Road)",
        description:
          "Luxury townhouses and penthouses in the heart of Al Narjis, blending Najdi authenticity with modernity and private entrances",
        status: "available",
        statusColor: "#44580e",
        unitTypes: [
          {
            label: "Penthouse",
            iconSrc:
              "https://admin.clusters.sa/wp-content/uploads/2025/08/Penthouse-b.svg",
            invertIcon: false,
          },
          {
            label: "Townhouse",
            iconSrc:
              "https://admin.clusters.sa/wp-content/uploads/2025/08/Townhouse-b.svg",
            invertIcon: false,
          },
        ],
        ctaText: "Discover Your Home",
        ctaHref: "/en/projects/alnarjis-clusters",
        ctaBgColor: "rgb(222, 173, 107)",
        imageSrc:
          "https://admin.clusters.sa/wp-content/uploads/2025/08/4e607e282096633744890f948c4bdd6f5bb576fe-1-scaled.png",
        imageAlt: "resident footer",
        patternSrc:
          "https://admin.clusters.sa/wp-content/uploads/2025/08/Group-1000011980.png",
        backgroundColor: "rgb(232, 220, 211)",
        textColor: "rgb(0, 0, 0)",
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
        <ProjectsHeader
          dir="ltr"
          heading="Clusters\nA Lifestyle That Reflects Your Authenticity"
          description={[
            "We design high-quality residential communities to be the perfect incubator for luxury living and unforgettable moments.",
            "Here, quality and authenticity come together in every detail to create your next home",
          ]}
        />
        <Story />
        <ValuesSection
          dir="ltr"
          heading="We Don't Build\nWe Revive Places"
          description="Our mission transcends the boundaries of concrete and glass. We see in every empty land a story waiting to be told, and in every design an opportunity to create a rich human experience. From carefully choosing the location, to the last touch in the finishes, we design every detail to serve one purpose: enriching your life"
          cards={[
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
          ]}
        />
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
