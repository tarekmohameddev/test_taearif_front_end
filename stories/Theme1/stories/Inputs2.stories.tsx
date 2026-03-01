import type { Meta, StoryObj } from "@storybook/nextjs";
import Inputs2 from "@/components/tenant/inputs/inputs2";
import { Theme1Decorator } from "../decorators";
import { getMergedDefaultDataForStory } from "../utils/defaultData";

const defaultData = (getMergedDefaultDataForStory("inputs2") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof Inputs2> = {
  title: "Theme1/Inputs2/Inputs2",
  component: Inputs2,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof Inputs2>;

export const Default: Story = {};
