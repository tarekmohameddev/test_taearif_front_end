import type { Meta, StoryObj } from "@storybook/nextjs";
import { EssenceSection } from "./EssenceSection";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta = {
  title: "Theme/EssenceSection",
  component: EssenceSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    headingTextProps: {
      className: "font-saudi whitespace-pre-line lg:flex-1",
      color: "#d09260",
      fontSize: "40px",
      fontWeight: 700,
    },
    leadTextProps: {
      className: "mb-4 block",
      fontWeight: 700,
    },
    bodyTextProps: {
      className: "mt-12 text-lg lg:mt-0",
      fontSize: "1.125rem",
    },
  },
} satisfies Meta<typeof EssenceSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Default — Arabic RTL (جوهر وجودنا) */
export const Default: Story = {};

/** English */
export const English: Story = {
  args: {
    dir: "ltr",
    heading: "The Essence of Our Being",
    lead: "In a world that rushes... we choose to take our time.",
    body1:
      "We see in every space a story yet to be told, and in every design an opportunity to redefine the relationship between inside and outside, privacy and openness, heritage and future.",
    body2:
      "We are not here to build real estate, but to craft living experiences that become part of our residents' identity. Spaces that breathe, celebrate natural light, and respect the authenticity of their surroundings—to become, in the end, a sanctuary for the soul.",
  },
};
