import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import { ContactForm } from "./ContactForm";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta = {
  title: "Theme/ContactForm",
  component: ContactForm,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    headingTextProps: {
      className: "font-saudi",
      fontSize: "3rem",
      lineHeight: "131%",
      fontWeight: 700,
    },
    descriptionTextProps: {
      fontWeight: 700,
      className: "pt-11 lg:py-6",
    },
  },
} satisfies Meta<typeof ContactForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Default — Arabic RTL with all default values */
export const Default: Story = {
  args: {
    onSubmit: fn(),
  },
};

/** English — LTR layout with English content */
export const English: Story = {
  args: {
    dir: "ltr",
    heading: "Start a conversation with us.. about your investment future or dream home",
    description:
      "Whether you're looking for a unique investment opportunity or aspiring to own a home that exceeds your expectations, our specialized team is ready to answer all your inquiries",
    fields: {
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone Number",
      select: "Loading...",
      message: "Your Message (Optional)",
    },
    links: {
      investment: {
        text: "Interested in real estate investment opportunities",
        href: "land-and-investment",
      },
      suppliers: {
        text: "Interested in becoming a supplier partner",
        href: "suppliers",
      },
    },
    submitText: "Send",
    onSubmit: fn(),
  },
};

/** Custom Image — Custom image source */
export const CustomImage: Story = {
  args: {
    imageSrc: "https://placehold.co/800x800/F5EDE3/b28966?text=Contact+Image",
    imageAlt: "Contact illustration",
    onSubmit: fn(),
  },
};
