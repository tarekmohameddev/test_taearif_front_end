import type { Meta, StoryObj } from "@storybook/nextjs";
import PropertyFilter1 from "@/components/tenant/propertyFilter/propertyFilter1";
import { Theme1Decorator } from "../decorators";
import { getDefaultDataForTheme1Component } from "../utils/defaultData";

const defaultData = (getDefaultDataForTheme1Component("propertyFilter1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof PropertyFilter1> = {
  title: "Theme1/PropertyFilter/PropertyFilter1",
  component: PropertyFilter1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof PropertyFilter1>;

export const Default: Story = {};
