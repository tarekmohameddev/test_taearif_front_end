import type { Meta, StoryObj } from "@storybook/nextjs";
import PropertySlider1 from "@/components/tenant/propertySlider/propertySlider1";
import { Theme1Decorator } from "../decorators";
import { getMergedDefaultDataForStory } from "../utils/defaultData";

const defaultData = (getMergedDefaultDataForStory("propertySlider1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof PropertySlider1> = {
  title: "Theme1/PropertySlider/PropertySlider1",
  component: PropertySlider1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof PropertySlider1>;

export const Default: Story = {};
