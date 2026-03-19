import type { Meta, StoryObj } from "@storybook/nextjs";
import AuthLayout from "./AuthLayout";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta = {
  title: "AuthPages/AuthLayout",
  component: AuthLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AuthLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "<div>Hello</div>",
  },
};
