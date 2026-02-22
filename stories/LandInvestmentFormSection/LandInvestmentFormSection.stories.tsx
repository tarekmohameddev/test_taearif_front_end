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

/** Default — heading + description + image (no form) */
export const Default: Story = {};

/** With placeholder form slot */
export const WithFormSlot: Story = {
  args: {
    children: (
      <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-6 xl:grid-cols-2 xl:gap-2.5">
          <input
            type="text"
            placeholder="الاسم الأول"
            name="firstName"
            className="h-9 w-full min-w-0 rounded-sm border-[0.6px] border-white bg-black px-2 py-1 text-base text-[var(--accent)] shadow-[var(--shadow-xs)] outline-none placeholder:opacity-50 lg:text-sm"
          />
          <input
            type="text"
            placeholder="اسم العائلة"
            name="lastName"
            className="h-9 w-full min-w-0 rounded-sm border-[0.6px] border-white bg-black px-2 py-1 text-base text-[var(--accent)] shadow-[var(--shadow-xs)] outline-none placeholder:opacity-50 lg:text-sm"
          />
        </div>
        <button
          type="submit"
          className="mt-3 flex min-h-9 w-full items-center justify-center rounded-sm bg-[#B06D37] px-10 py-2 font-bold text-white"
        >
          إرسال
        </button>
      </form>
    ),
  },
};
