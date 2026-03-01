import type { Meta, StoryObj } from "@storybook/nextjs";
import ContactUsHomePage1 from "@/components/tenant/contactUsHomePage/contactUsHomePage1";
import { Theme1Decorator } from "../decorators";
import { getMergedDefaultDataForStory } from "../utils/defaultData";

const defaultData = (getMergedDefaultDataForStory("contactUsHomePage1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof ContactUsHomePage1> = {
  title: "Theme1/ContactUsHomePage/ContactUsHomePage1",
  component: ContactUsHomePage1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof ContactUsHomePage1>;

export const Default: Story = {};
