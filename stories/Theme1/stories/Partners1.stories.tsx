import type { Meta, StoryObj } from "@storybook/nextjs";
import Partners1 from "@/components/tenant/partners/partners1";
import { Theme1Decorator } from "../decorators";
import { getMergedDefaultDataForStory } from "../utils/defaultData";

const defaultData = (getMergedDefaultDataForStory("partners1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof Partners1> = {
  title: "Theme1/Partners/Partners1",
  component: Partners1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof Partners1>;

export const Default: Story = {};
