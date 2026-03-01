import type { Meta, StoryObj } from "@storybook/nextjs";
import ContactMapSection1 from "@/components/tenant/contactMapSection/contactMapSection1";
import { Theme1Decorator } from "../decorators";
import { getMergedDefaultDataForStory } from "../utils/defaultData";

const defaultData = (getMergedDefaultDataForStory("contactMapSection1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof ContactMapSection1> = {
  title: "Theme1/ContactMapSection/ContactMapSection1",
  component: ContactMapSection1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof ContactMapSection1>;

export const Default: Story = {};
