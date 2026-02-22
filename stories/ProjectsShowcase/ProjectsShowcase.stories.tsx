import type { Meta, StoryObj } from "@storybook/nextjs";
import { ProjectsShowcase } from "./ProjectsShowcase";
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
  args: {
    filterButtonTextProps: {
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    statusBadgeTextProps: {
      fontSize: "14px",
    },
    projectTitleTextProps: {
      className: "font-saudi",
      fontSize: "2.25rem",
      fontWeight: 700,
      lineClamp: 1,
    },
    projectDescriptionTextProps: {
      lineClamp: 2,
      className: "mt-8",
    },
    unitTypeTextProps: {
      fontSize: "0.75rem",
    },
    ctaTextProps: {
      fontSize: "0.875rem",
      fontWeight: 500,
    },
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

