import type { Meta, StoryObj } from "@storybook/nextjs";
import { FeaturesSection } from "./FeaturesSection";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta = {
  title: "Theme/FeaturesSection",
  component: FeaturesSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    headingTextProps: {
      className: "font-saudi text-4xl font-bold xl:text-5xl",
    },
    featureTitleTextProps: {
      className: "text-xl font-bold",
      color: "#383838",
    },
    featureDescriptionTextProps: {
      className: "text-sm leading-7",
      color: "#686868",
    },
  },
} satisfies Meta<typeof FeaturesSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Default — 6 features + certifications */
export const Default: Story = {};
