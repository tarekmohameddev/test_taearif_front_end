import type { Meta, StoryObj } from "@storybook/nextjs";
import PropertiesPage1 from "@/components/tenant/propertiesPage/propertiesPage1";
import { Theme1Decorator } from "../decorators";

const meta: Meta<typeof PropertiesPage1> = {
  title: "Theme1/PropertiesPage/PropertiesPage1",
  component: PropertiesPage1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, tenantId: "demo" },
};

export default meta;
type Story = StoryObj<typeof PropertiesPage1>;

export const Default: Story = {};
