import type { Meta, StoryObj } from "@storybook/nextjs";
import { PhilosophyCtaSection } from "./PhilosophyCtaSection";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta = {
  title: "Theme/PhilosophyCtaSection",
  component: PhilosophyCtaSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    headingTextProps: {
      className: "font-saudi whitespace-pre-line",
      color: "#fff",
      fontSize: "3rem",
      fontWeight: 700,
    },
    descriptionTextProps: {
      className: "mt-3.5",
      color: "#fff",
    },
    ctaTextProps: {
      fontSize: "0.875rem",
      fontWeight: 700,
      color: "#fff",
    },
  },
} satisfies Meta<typeof PhilosophyCtaSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Default — Arabic RTL (شاهد الفلسفة.. تتجسد) */
export const Default: Story = {};

/** English */
export const English: Story = {
  args: {
    dir: "ltr",
    heading: "See the Philosophy\nCome to Life",
    description:
      "Words describe the vision; projects tell the truth. We invite you now to discover how we translate these principles into a unique architectural reality in our projects.",
    ctaLabel: "Discover Our Projects",
    ctaHref: "/en/projects",
  },
};
