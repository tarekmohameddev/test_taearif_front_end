import type { Meta, StoryObj } from "@storybook/nextjs";
import ContactFormSection1 from "@/components/tenant/contactFormSection/contactFormSection1";
import { Theme1Decorator } from "../decorators";
import { getDefaultDataForTheme1Component } from "../utils/defaultData";

const defaultData = (getDefaultDataForTheme1Component("contactFormSection1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof ContactFormSection1> = {
  title: "Theme1/ContactFormSection/ContactFormSection1",
  component: ContactFormSection1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof ContactFormSection1>;

export const Default: Story = {};
