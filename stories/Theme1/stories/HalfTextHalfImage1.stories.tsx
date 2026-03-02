import type { Meta, StoryObj } from "@storybook/nextjs";
import HalfTextHalfImage1 from "@/components/tenant/halfTextHalfImage/halfTextHalfImage1";
import { Theme1Decorator } from "../decorators";
import { getMergedDefaultDataForStory } from "../utils/defaultData";

const defaultData = (getMergedDefaultDataForStory("halfTextHalfImage1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof HalfTextHalfImage1> = {
  title: "Theme1/HalfTextHalfImage/HalfTextHalfImage1",
  component: HalfTextHalfImage1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof HalfTextHalfImage1>;

export const Default: Story = {
  args: {
    image: {
      "visible": true,
      "src": "https://dalel-lovat.vercel.app/images/trusted-partner-section/house.webp",
      "alt": "صورة شريك موثوق",

      "style": {
        "aspectRatio": "800/500",
        "objectFit": "contain",
        "borderRadius": "0"
      },

      "background": {
        "enabled": true,
        "color": "#059669",
        "width": 54,
        "borderRadius": "5px"
      }
    }
  }
};
