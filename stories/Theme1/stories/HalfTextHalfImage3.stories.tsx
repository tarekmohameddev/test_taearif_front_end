import type { Meta, StoryObj } from "@storybook/nextjs";
import HalfTextHalfImage3 from "@/components/tenant/halfTextHalfImage/halfTextHalfImage3";
import { Theme1Decorator } from "../decorators";
import { getDefaultDataForTheme1Component } from "../utils/defaultData";

const defaultData = (getDefaultDataForTheme1Component("halfTextHalfImage3") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof HalfTextHalfImage3> = {
  title: "Theme1/HalfTextHalfImage/HalfTextHalfImage3",
  component: HalfTextHalfImage3,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof HalfTextHalfImage3>;

export const Default: Story = {};
