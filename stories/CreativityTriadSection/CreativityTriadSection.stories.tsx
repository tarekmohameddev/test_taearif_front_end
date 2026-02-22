import type { Meta, StoryObj } from "@storybook/nextjs";
import { CreativityTriadSection } from "./CreativityTriadSection";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta = {
  title: "Theme/CreativityTriadSection",
  component: CreativityTriadSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    headingTextProps: {
      className: "font-saudi mb-4",
      color: "#B17A4B",
      fontSize: "2.25rem",
      fontWeight: 700,
    },
    introTextProps: {},
    cardTitleTextProps: {
      fontSize: "1.875rem",
      fontWeight: 700,
      color: "#fff",
    },
    cardDescriptionTextProps: {
      lineHeight: "1.75rem",
      color: "#fff",
    },
  },
} satisfies Meta<typeof CreativityTriadSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Default — Arabic RTL (ثلاثية الإبداع) */
export const Default: Story = {};

/** English */
export const English: Story = {
  args: {
    dir: "ltr",
    heading: "The Creativity Triad",
    intro:
      "We translate our philosophy through three core pillars that shape our unique imprint:",
    cards: [
      {
        title: "Spirit of Place",
        description:
          "Before we lay a single stone, we read the spirit of the place. Our projects do not impose on their surroundings; they emerge from them in harmonious dialogue, respecting their identity and becoming a natural extension.",
        imageSrc: "https://placehold.co/800x500/4c5946/fff?text=Spirit+of+Place",
        imageAlt: "Spirit of Place",
      },
      {
        title: "Purity of Design",
        description:
          "We draw from our heritage its essence, not merely its form. Luxurious simplicity and clean lines are our language, creating timeless spaces that embrace taste and elevate elegance.",
        imageSrc: "https://placehold.co/800x500/4c5946/fff?text=Design+Purity",
        imageAlt: "Purity of Design",
      },
      {
        title: "Quality of Life",
        description:
          "True luxury is the quality of daily experience. We design every detail to serve human comfort and create a balanced environment that fosters calm and inspires creativity.",
        imageSrc: "https://placehold.co/800x500/4c5946/fff?text=Quality+of+Life",
        imageAlt: "Quality of Life",
      },
    ],
  },
};
