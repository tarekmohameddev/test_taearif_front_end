import type { Meta, StoryObj } from "@storybook/nextjs";
import PhotosGrid2 from "@/components/tenant/photosGrid/photosGrid2";
import { Theme1Decorator } from "../decorators";
import { getDefaultDataForTheme1Component } from "../utils/defaultData";

const defaultData = (getDefaultDataForTheme1Component("photosGrid2") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof PhotosGrid2> = {
  title: "Theme1/PhotosGrid/PhotosGrid2",
  component: PhotosGrid2,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof PhotosGrid2>;

export const Default: Story = {};
