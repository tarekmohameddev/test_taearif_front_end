import type { Meta, StoryObj } from "@storybook/nextjs";
import BlogsSections1 from "@/components/tenant/blogsSections/blogsSections1";
import { Theme1Decorator } from "../decorators";
import { getMergedDefaultDataForStory } from "../utils/defaultData";

const defaultData = (getMergedDefaultDataForStory("blogsSections1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof BlogsSections1> = {
  title: "Theme1/BlogsSections/BlogsSections1",
  component: BlogsSections1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof BlogsSections1>;

export const Default: Story = {};
