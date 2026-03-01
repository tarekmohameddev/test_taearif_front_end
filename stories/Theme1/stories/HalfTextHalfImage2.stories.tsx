import type { Meta, StoryObj } from "@storybook/nextjs";
import HalfTextHalfImage2 from "@/components/tenant/halfTextHalfImage/halfTextHalfImage2";
import { Theme1Decorator } from "../decorators";
import { getMergedDefaultDataForStory } from "../utils/defaultData";

const defaultData = (getMergedDefaultDataForStory("halfTextHalfImage2") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof HalfTextHalfImage2> = {
  title: "Theme1/HalfTextHalfImage/HalfTextHalfImage2",
  component: HalfTextHalfImage2,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof HalfTextHalfImage2>;

export const Default: Story = {};
