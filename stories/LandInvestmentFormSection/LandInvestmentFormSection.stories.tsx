import type { Meta, StoryObj } from "@storybook/nextjs";
import { LandInvestmentFormSection } from "./LandInvestmentFormSection";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta = {
  title: "Theme/LandInvestmentFormSection",
  component: LandInvestmentFormSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    headingTextProps: {
      className: "font-saudi text-4xl font-bold xl:text-5xl",
    },
    descriptionTextProps: {
      className: "text-lg",
    },
  },
} satisfies Meta<typeof LandInvestmentFormSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Default — heading + description + form + image */
export const Default: Story = {};

/** With form submit handler */
export const WithSubmitHandler: Story = {
  args: {
    onFormSubmit: (d) => console.log("Form submitted:", d),
  },
};
