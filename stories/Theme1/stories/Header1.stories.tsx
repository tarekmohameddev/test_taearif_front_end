import type { Meta, StoryObj } from "@storybook/nextjs";
import Header1 from "@/components/tenant/header/header1";
import { Theme1Decorator } from "../decorators";
import { getMergedDefaultDataForStory } from "../utils/defaultData";

const defaultData = (getMergedDefaultDataForStory("header1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof Header1> = {
  title: "Theme1/Header/Header1",
  component: Header1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: {
    useStore: false,
    overrideData: defaultData,
  },
};

export default meta;
type Story = StoryObj<typeof Header1>;

export const Default: Story = {};

export const WithOverrideTitle: Story = {
  args: {
    useStore: false,
    overrideData: {
      ...defaultData,
      logo: {
        ...(defaultData.logo as object),
        text: "قصة Header1",
      },
    },
  },
};
