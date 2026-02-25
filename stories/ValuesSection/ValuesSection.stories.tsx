import type { Meta, StoryObj } from "@storybook/nextjs";
import { ValuesSection } from "./ValuesSection";
import { CommunityIcon } from "../assets/CommunityIcon";
import { HeritageIcon } from "../assets/HeritageIcon";
import { QualityIcon } from "../assets/QualityIcon";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta = {
  title: "Theme/ValuesSection",
  component: ValuesSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    headingTextProps: {
      className: "font-saudi lg:text-center",
      color: "#b28966",
      fontSize: "40px",
      fontWeight: 700,
    },
    descriptionTextProps: {
      fontSize: "1.125rem",
      maxWidth: "50%",
    },
    cardTitleTextProps: { fontSize: "1.125rem", fontWeight: 700, color: "#fff" },
    cardDescriptionTextProps: { fontSize: "1.125rem", color: "#fff" },
  },
} satisfies Meta<typeof ValuesSection>;

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
    heading: "We Don't Build\nWe Revive Places",
    description:
      "Our mission transcends the boundaries of concrete and glass. We see in every empty land a story waiting to be told, and in every design an opportunity to create a rich human experience. From carefully choosing the location, to the last touch in the finishes, we design every detail to serve one purpose: enriching your life",
    cards: [
      {
        title: "Community First",
        description: "Spaces that enhance social connection and harmony",
        icon: <CommunityIcon />,
        bgVariant: "muted-foreground",
      },
      {
        title: "Renewed Authenticity",
        description:
          "Inspired by our architectural heritage with a modern vision.",
        icon: <HeritageIcon />,
        bgVariant: "darken",
      },
      {
        title: "Quality as Standard",
        description:
          "Absolute commitment to the highest quality standards in materials and execution.",
        icon: <QualityIcon />,
        bgVariant: "black",
      },
    ],
  },
};

/** Custom — Custom heading and description */
export const Custom: Story = {
  args: {
    heading: "قيمنا الأساسية",
    description:
      "نؤمن بأن كل مشروع يجب أن يعكس قيمنا الأساسية في التميز والجودة والالتزام بالمجتمع.",
  },
};

/** Single Card — Only one value card */
export const SingleCard: Story = {
  args: {
    cards: [
      {
        title: "المجتمع أولاً",
        description: "مساحات تعزز الترابط الاجتماعي وتناغمها",
        icon: <CommunityIcon />,
        bgVariant: "muted-foreground",
      },
    ],
  },
};

