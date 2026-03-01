import type { Meta, StoryObj } from "@storybook/nextjs";
import ContactCards1 from "@/components/tenant/contactCards/contactCards1";
import { Theme1Decorator } from "../decorators";
import { getDefaultDataForTheme1Component } from "../utils/defaultData";

const defaultData = (getDefaultDataForTheme1Component("contactCards1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof ContactCards1> = {
  title: "Theme1/ContactCards/ContactCards1",
  component: ContactCards1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof ContactCards1>;

export const Default: Story = {};
