import type { Meta, StoryObj } from "@storybook/nextjs";
import FilterButtons1 from "@/components/tenant/filterButtons/filterButtons1";
import { Theme1Decorator } from "../decorators";
import { getMergedDefaultDataForStory } from "../utils/defaultData";

const defaultData = (getMergedDefaultDataForStory("filterButtons1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof FilterButtons1> = {
  title: "Theme1/FilterButtons/FilterButtons1",
  component: FilterButtons1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof FilterButtons1>;

export const Default: Story = {};
