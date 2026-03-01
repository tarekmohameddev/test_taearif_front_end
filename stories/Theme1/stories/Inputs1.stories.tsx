import type { Meta, StoryObj } from "@storybook/nextjs";
import Inputs1 from "@/components/tenant/inputs/inputs1";
import { Theme1Decorator } from "../decorators";
import { getDefaultDataForTheme1Component } from "../utils/defaultData";

const defaultData = (getDefaultDataForTheme1Component("inputs1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof Inputs1> = {
  title: "Theme1/Inputs/Inputs1",
  component: Inputs1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof Inputs1>;

export const Default: Story = {};
