import type { Meta, StoryObj } from "@storybook/nextjs";
import SideBySide3 from "@/components/tenant/sideBySide/sideBySide3";
import { Theme1Decorator } from "../decorators";
import { getMergedDefaultDataForStory } from "../utils/defaultData";

const defaultData = (getMergedDefaultDataForStory("sideBySide3") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof SideBySide3> = {
  title: "Theme1/SideBySide/SideBySide3",
  component: SideBySide3,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof SideBySide3>;

export const Default: Story = {};
