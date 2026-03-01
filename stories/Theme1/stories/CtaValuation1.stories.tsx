import type { Meta, StoryObj } from "@storybook/nextjs";
import CtaValuation1 from "@/components/tenant/ctaValuation/ctaValuation1";
import { Theme1Decorator } from "../decorators";
import { getMergedDefaultDataForStory } from "../utils/defaultData";

const defaultData = (getMergedDefaultDataForStory("ctaValuation1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof CtaValuation1> = {
  title: "Theme1/CtaValuation/CtaValuation1",
  component: CtaValuation1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof CtaValuation1>;

export const Default: Story = {};
