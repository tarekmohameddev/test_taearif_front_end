import type { Meta, StoryObj } from "@storybook/nextjs";
import Footer1 from "@/components/tenant/footer/footer1";
import { Theme1Decorator } from "../decorators";
import { getMergedDefaultDataForStory } from "../utils/defaultData";

const defaultData = (getMergedDefaultDataForStory("footer1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof Footer1> = {
  title: "Theme1/Footer/Footer1",
  component: Footer1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: {
    useStore: false,
    overrideData: defaultData,
  },
};

export default meta;
type Story = StoryObj<typeof Footer1>;

export const Default: Story = {};

export const WithOverride: Story = {
  args: {
    useStore: false,
    overrideData: {
      ...defaultData,
      visible: true,
    },
  },
};
