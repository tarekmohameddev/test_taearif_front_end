import type { Meta, StoryObj } from "@storybook/nextjs";
import { JourneySection } from "./JourneySection";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta = {
  title: "Theme/JourneySection",
  component: JourneySection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    headingTextProps: {
      className: "font-saudi text-4xl font-bold xl:text-5xl",
    },
  },
} satisfies Meta<typeof JourneySection>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Default — 6 stages */
export const Default: Story = {};
