import type { Meta, StoryObj } from "@storybook/nextjs";
import Card3 from "@/components/tenant/cards/card3";
import { Theme1Decorator } from "../decorators";

const meta: Meta<typeof Card3> = {
  title: "Theme1/Card/Card3",
  component: Card3,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false },
};

export default meta;
type Story = StoryObj<typeof Card3>;

export const Default: Story = {};
