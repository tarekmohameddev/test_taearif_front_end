import type { Meta, StoryObj } from "@storybook/nextjs";
import SideBySide2 from "@/components/tenant/sideBySide/sideBySide2";
import { Theme1Decorator } from "../decorators";
import { getDefaultDataForTheme1Component } from "../utils/defaultData";

const defaultData = (getDefaultDataForTheme1Component("sideBySide2") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof SideBySide2> = {
  title: "Theme1/SideBySide/SideBySide2",
  component: SideBySide2,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof SideBySide2>;

export const Default: Story = {};
