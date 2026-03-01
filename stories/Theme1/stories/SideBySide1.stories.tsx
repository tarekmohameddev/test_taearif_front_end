import type { Meta, StoryObj } from "@storybook/nextjs";
import SideBySide1 from "@/components/tenant/sideBySide/sideBySide1";
import { Theme1Decorator } from "../decorators";
import { getDefaultDataForTheme1Component } from "../utils/defaultData";

const defaultData = (getDefaultDataForTheme1Component("sideBySide1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof SideBySide1> = {
  title: "Theme1/SideBySide/SideBySide1",
  component: SideBySide1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof SideBySide1>;

export const Default: Story = {};
