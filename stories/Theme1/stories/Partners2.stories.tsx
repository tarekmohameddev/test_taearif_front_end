import type { Meta, StoryObj } from "@storybook/nextjs";
import Partners2 from "@/components/tenant/partners/partners2";
import { Theme1Decorator } from "../decorators";
import { getDefaultDataForTheme1Component } from "../utils/defaultData";

const defaultData = (getDefaultDataForTheme1Component("partners2") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof Partners2> = {
  title: "Theme1/Partners/Partners2",
  component: Partners2,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof Partners2>;

export const Default: Story = {};
