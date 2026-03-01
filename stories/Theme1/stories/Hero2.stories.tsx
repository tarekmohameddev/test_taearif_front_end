import type { Meta, StoryObj } from "@storybook/nextjs";
import Hero2 from "@/components/tenant/hero/hero2";
import { Theme1Decorator } from "../decorators";
import { getDefaultHero2Data } from "../utils/defaultData";

const defaultData = getDefaultHero2Data() as Record<string, unknown>;

const meta: Meta<typeof Hero2> = {
  title: "Theme1/Hero/Hero2",
  component: Hero2,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof Hero2>;

export const Default: Story = {};
