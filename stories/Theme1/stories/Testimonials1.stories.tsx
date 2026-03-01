import type { Meta, StoryObj } from "@storybook/nextjs";
import Testimonials1 from "@/components/tenant/testimonials/testimonials1";
import { Theme1Decorator } from "../decorators";
import { getMergedDefaultDataForStory } from "../utils/defaultData";

const defaultData = (getMergedDefaultDataForStory("testimonials1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof Testimonials1> = {
  title: "Theme1/Testimonials/Testimonials1",
  component: Testimonials1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof Testimonials1>;

export const Default: Story = {};
