import type { Meta, StoryObj } from "@storybook/nextjs";
import BlogCard1 from "@/components/tenant/blogCard/blogCard1";
import { Theme1Decorator } from "../decorators";
import { getDefaultDataForTheme1Component } from "../utils/defaultData";

const defaultData = (getDefaultDataForTheme1Component("blogCard1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof BlogCard1> = {
  title: "Theme1/BlogCard/BlogCard1",
  component: BlogCard1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof BlogCard1>;

export const Default: Story = {};
