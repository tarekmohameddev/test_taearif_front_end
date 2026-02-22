import type { Meta, StoryObj } from "@storybook/nextjs";
import { QuoteSection } from "./QuoteSection";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta = {
  title: "Theme/QuoteSection",
  component: QuoteSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    quoteTextProps: {
      className: "font-saudi grow text-2xl font-medium xl:text-3xl xl:leading-9",
    },
    nameTextProps: {
      fontWeight: 700,
      color: "#4F4F4F",
    },
    roleTextProps: {
      color: "#4F4F4F",
    },
  },
} satisfies Meta<typeof QuoteSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Default — Arabic RTL */
export const Default: Story = {};

/** English */
export const English: Story = {
  args: {
    dir: "ltr",
    quote:
      "With Clusters, your land is not just a transaction... but a real partnership in which we achieve your investment goals and turn your land into a quality project that supports the real estate and economic growth of Riyadh and builds a better future for our community.",
    name: "Eng. Mahab Bin Mohammed Saleh Bintin",
    role: "Founder & Chief Executive Officer",
  },
};
