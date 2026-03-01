import type { Meta, StoryObj } from "@storybook/nextjs";
import WhyChooseUs1 from "@/components/tenant/whyChooseUs/whyChooseUs1";
import { Theme1Decorator } from "../decorators";
import { getDefaultDataForTheme1Component } from "../utils/defaultData";

const defaultData = (getDefaultDataForTheme1Component("whyChooseUs1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof WhyChooseUs1> = {
  title: "Theme1/WhyChooseUs/WhyChooseUs1",
  component: WhyChooseUs1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof WhyChooseUs1>;

export const Default: Story = {};
