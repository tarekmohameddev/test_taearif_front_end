import type { Meta, StoryObj } from "@storybook/nextjs";
import JobForm1 from "@/components/tenant/jobForm/jobForm1";
import { Theme1Decorator } from "../decorators";
import { getMergedDefaultDataForStory } from "../utils/defaultData";

const defaultData = (getMergedDefaultDataForStory("jobForm1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof JobForm1> = {
  title: "Theme1/JobForm/JobForm1",
  component: JobForm1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof JobForm1>;

export const Default: Story = {};
