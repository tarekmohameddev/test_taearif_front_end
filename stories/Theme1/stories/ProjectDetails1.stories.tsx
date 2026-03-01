import type { Meta, StoryObj } from "@storybook/nextjs";
import ProjectDetails1 from "@/components/tenant/projectDetails/projectDetails1";
import { Theme1Decorator } from "../decorators";
import { getMergedDefaultDataForStory } from "../utils/defaultData";

const defaultData = (getMergedDefaultDataForStory("projectDetails1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof ProjectDetails1> = {
  title: "Theme1/ProjectDetails/ProjectDetails1",
  component: ProjectDetails1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof ProjectDetails1>;

export const Default: Story = {};
