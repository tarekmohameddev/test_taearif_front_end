import type { Meta, StoryObj } from "@storybook/nextjs";
import Grid1 from "@/components/tenant/grid/grid1";
import { Theme1Decorator } from "../decorators";
import { getDefaultDataForTheme1Component } from "../utils/defaultData";

const defaultData = (getDefaultDataForTheme1Component("grid1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof Grid1> = {
  title: "Theme1/Grid/Grid1",
  component: Grid1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof Grid1>;

export const Default: Story = {};
