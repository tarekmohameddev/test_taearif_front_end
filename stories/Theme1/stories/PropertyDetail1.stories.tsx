import type { Meta, StoryObj } from "@storybook/nextjs";
import PropertyDetail1 from "@/components/tenant/propertyDetail/propertyDetail1";
import { Theme1Decorator } from "../decorators";

const meta: Meta<typeof PropertyDetail1> = {
  title: "Theme1/PropertyDetail/PropertyDetail1",
  component: PropertyDetail1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false },
};

export default meta;
type Story = StoryObj<typeof PropertyDetail1>;

export const Default: Story = {};
