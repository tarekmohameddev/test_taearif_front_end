import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import { FullPage } from "./FullPage";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta = {
  title: "Theme/FullPage",
  component: FullPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof FullPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Full Page — All sections with design default text styles (Arabic RTL) */
export const Default: Story = {
  args: {
    onContactSubmit: fn(),
  },
};

/** Full Page English — LTR with English content */
export const English: Story = {
  args: {
    dir: "ltr",
    onContactSubmit: fn(),
  },
};
