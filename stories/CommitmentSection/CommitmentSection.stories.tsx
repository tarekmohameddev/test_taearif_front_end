import type { Meta, StoryObj } from "@storybook/nextjs";
import { CommitmentSection } from "./CommitmentSection";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta = {
  title: "Theme/CommitmentSection",
  component: CommitmentSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    roleLabelTextProps: {
      className: "block text-sm",
      fontSize: "0.875rem",
      color: "#fff",
    },
    nameTextProps: {
      className: "block text-sm",
      fontSize: "0.875rem",
      fontWeight: 700,
      color: "#fff",
    },
    headingTextProps: {
      className: "font-saudi",
      color: "#d09260",
      fontSize: "40px",
      fontWeight: 700,
    },
    quoteTextProps: {
      className: "quote mt-5 block text-lg",
      fontSize: "1.125rem",
      fontStyle: "italic",
    },
  },
} satisfies Meta<typeof CommitmentSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Default — Arabic RTL (عهد وإلتزام) */
export const Default: Story = {};

/** English */
export const English: Story = {
  args: {
    dir: "ltr",
    roleLabel: "Chief Executive Officer",
    name: "Eng. Mahab Bintin",
    heading: "A Pledge and Commitment",
    quote:
      "Our projects are messages we send to the future. Every project is a pledge of quality, of beauty, and of respect for our clients and the land we build on. We do not seek fleeting success—we seek to build lasting value and a heritage to be proud of.",
  },
};
