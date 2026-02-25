import type { Meta, StoryObj } from "@storybook/nextjs";
import { ProjectsHeader } from "./ProjectsHeader";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta = {
  title: "Theme/ProjectsHeader",
  component: ProjectsHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    headingTextProps: {
      className: "font-saudi",
      color: "#d09260",
      fontSize: "40px",
      lineHeight: "2.75rem",
      fontWeight: 700,
    },
    descriptionTextProps: {
      fontSize: "1.125rem",
      color: "#1a1a2e",
      className: "mt-5",
    },
  },
} satisfies Meta<typeof ProjectsHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Default — Arabic RTL with all default values */
export const Default: Story = {};

/** English — LTR layout with English content */
export const English: Story = {
  args: {
    dir: "ltr",
    heading: "Clusters\nA Lifestyle That Reflects Your Authenticity",
    description: [
      "We design high-quality residential communities to be the perfect incubator for luxury living and unforgettable moments.",
      "Here, quality and authenticity come together in every detail to create your next home",
    ],
  },
};

/** Custom — Custom heading and description */
export const Custom: Story = {
  args: {
    heading: "مشاريعنا المميزة",
    description: "اكتشف مجموعة من أفضل المشاريع السكنية في المملكة",
  },
};
