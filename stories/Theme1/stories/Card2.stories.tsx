import type { Meta, StoryObj } from "@storybook/nextjs";
import Card2 from "@/components/tenant/cards/card2";
import { Theme1Decorator } from "../decorators";

const meta: Meta<typeof Card2> = {
  title: "Theme1/Card/Card2",
  component: Card2,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false },
};

export default meta;
type Story = StoryObj<typeof Card2>;

export const Default: Story = {};
