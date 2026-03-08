import type { Meta, StoryObj } from "@storybook/nextjs";
import Hero1 from "@/components/tenant/hero/hero1";
import { Theme1Decorator } from "../decorators";
import { getMergedDefaultDataForStory } from "../utils/defaultData";

const defaultData = (getMergedDefaultDataForStory("hero1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof Hero1> = {
  title: "Theme1/Hero/Hero1",
  component: Hero1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: {
    useStore: false,
    ...defaultData,
  },
};

export default meta;
type Story = StoryObj<typeof Hero1>;

export const Default: Story = {};

export const WithOverrideTitle: Story = {
  args: {
    useStore: false,
    ...defaultData,
    content: {
      ...(defaultData.content as object),
      title: "عنوان مخصص للقصة",
    },
  },
};
