import type { Meta, StoryObj } from "@storybook/nextjs";
import ApplicationForm1 from "@/components/tenant/applicationForm/applicationForm1";
import { Theme1Decorator } from "../decorators";
import { getMergedDefaultDataForStory } from "../utils/defaultData";

const defaultData = (getMergedDefaultDataForStory("applicationForm1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof ApplicationForm1> = {
  title: "Theme1/ApplicationForm/ApplicationForm1",
  component: ApplicationForm1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof ApplicationForm1>;

export const Default: Story = {};
