import type { Meta, StoryObj } from "@storybook/nextjs";
import StepsSection1 from "@/components/tenant/stepsSection/stepsSection1";
import { Theme1Decorator } from "../decorators";
import { getDefaultDataForTheme1Component } from "../utils/defaultData";

const defaultData = (getDefaultDataForTheme1Component("stepsSection1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof StepsSection1> = {
  title: "Theme1/StepsSection/StepsSection1",
  component: StepsSection1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof StepsSection1>;

export const Default: Story = {};
