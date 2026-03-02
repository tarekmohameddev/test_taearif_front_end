import type { Meta, StoryObj } from "@storybook/nextjs";
import HalfTextHalfImage2 from "@/components/tenant/halfTextHalfImage/halfTextHalfImage2";
import { Theme1Decorator } from "../decorators";
import { getMergedDefaultDataForStory } from "../utils/defaultData";

const defaultData = (getMergedDefaultDataForStory("halfTextHalfImage2") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof HalfTextHalfImage2> = {
  title: "Theme1/HalfTextHalfImage/HalfTextHalfImage2",
  component: HalfTextHalfImage2,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [Theme1Decorator],
  args: { useStore: false, ...defaultData },
};

export default meta;
type Story = StoryObj<typeof HalfTextHalfImage2>;

export const Default: Story = {
  args: {
    image: {
      "visible": true,
      "src": "https://dalel-lovat.vercel.app/images/experience-intro/CouterSectionImage.webp",
      "alt": "صورة داخلية لغرفة معيشة حديثة",
      "width": 800,
      "height": 600,

      "style": {
        "className": "w-full h-full object-cover rounded-[15px]",
        "borderRadius": "rounded-[15px]"
      },

      "background": {
        "enabled": true,
        "color": "#059669",
        "className": "bg-emerald-600 rounded-[10px]",

        "positioning": {
          "pr": "pr-[15px]",
          "pb": "pb-[15px]",
          "xlPr": "xl:pr-[21px]",
          "xlPb": "xl:pb-[21px]"
        }
      }
    }
  }
};
