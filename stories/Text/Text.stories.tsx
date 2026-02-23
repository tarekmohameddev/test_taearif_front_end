import type { Meta, StoryObj } from "@storybook/nextjs";
import { Text } from "./Text";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta = {
  title: "Theme/Text",
  component: Text,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    /* ── Element ─────────────────────────────────── */
    as: {
      control: "select",
      options: [
        "p",
        "span",
        "div",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "blockquote",
        "label",
        "figcaption",
        "legend",
        "small",
        "strong",
        "em",
      ],
    },

    /* ── Typography ──────────────────────────────── */
    fontFamily: { control: "text" },
    fontSize: { control: "text" },
    fontWeight: {
      control: "select",
      options: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
    fontStyle: {
      control: "select",
      options: ["normal", "italic", "oblique"],
    },
    lineHeight: { control: "text" },
    letterSpacing: { control: "text" },
    wordSpacing: { control: "text" },

    /* ── Color & Decoration ──────────────────────── */
    color: { control: "color" },
    backgroundColor: { control: "color" },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    textDecoration: {
      control: "select",
      options: ["none", "underline", "line-through", "overline"],
    },
    textDecorationColor: { control: "color" },
    textDecorationStyle: {
      control: "select",
      options: ["solid", "dashed", "dotted", "double", "wavy"],
    },
    textDecorationThickness: { control: "text" },
    textUnderlineOffset: { control: "text" },

    /* ── Text Layout ─────────────────────────────── */
    textAlign: {
      control: "select",
      options: ["left", "center", "right", "justify", "start", "end"],
    },
    textTransform: {
      control: "select",
      options: ["none", "uppercase", "lowercase", "capitalize"],
    },
    textIndent: { control: "text" },
    verticalAlign: {
      control: "select",
      options: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom"],
    },
    direction: { control: "select", options: ["ltr", "rtl"] },
    whiteSpace: {
      control: "select",
      options: ["normal", "nowrap", "pre", "pre-wrap", "pre-line", "break-spaces"],
    },
    wordBreak: {
      control: "select",
      options: ["normal", "break-all", "keep-all", "break-word"],
    },
    overflowWrap: {
      control: "select",
      options: ["normal", "break-word", "anywhere"],
    },
    textOverflow: {
      control: "select",
      options: ["clip", "ellipsis"],
    },

    /* ── Effects ──────────────────────────────────── */
    textShadow: { control: "text" },
    filter: { control: "text" },
    mixBlendMode: {
      control: "select",
      options: [
        "normal",
        "multiply",
        "screen",
        "overlay",
        "darken",
        "lighten",
        "color-dodge",
        "color-burn",
        "hard-light",
        "soft-light",
        "difference",
        "exclusion",
      ],
    },

    /* ── Spacing ──────────────────────────────────── */
    margin: { control: "text" },
    padding: { control: "text" },

    /* ── Sizing & Overflow ────────────────────────── */
    maxWidth: { control: "text" },
    lineClamp: { control: { type: "number", min: 1, max: 20 } },
    overflow: {
      control: "select",
      options: ["visible", "hidden", "scroll", "auto"],
    },

    /* ── Border & Background ──────────────────────── */
    border: { control: "text" },
    borderRadius: { control: "text" },

    /* ── Cursor & Interaction ─────────────────────── */
    cursor: {
      control: "select",
      options: ["auto", "default", "pointer", "text", "not-allowed", "grab"],
    },
    userSelect: {
      control: "select",
      options: ["auto", "none", "text", "all"],
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Default — Arabic paragraph with default styling */
export const Default: Story = {};

/** Heading H1 — Large bold heading */
export const HeadingH1: Story = {
  args: {
    as: "h1",
    children: "Welcome to Clusters",
    fontSize: "48px",
    fontWeight: 700,
    color: "#1a1a2e",
    lineHeight: "1.2",
  },
};

/** Heading H2 — Section heading */
export const HeadingH2: Story = {
  args: {
    as: "h2",
    children: "Our Projects",
    fontSize: "36px",
    fontWeight: 600,
    color: "#b28966",
    lineHeight: "1.3",
    letterSpacing: "0.02em",
  },
};

/** Body Text — Standard paragraph */
export const BodyText: Story = {
  args: {
    children:
      "At Clusters, we design a unique human-centered environment that breathes authenticity, and pulses with creativity, to embrace your exceptional life chapters.",
    fontSize: "16px",
    fontWeight: 400,
    color: "#333",
    lineHeight: "1.7",
    maxWidth: "65ch",
  },
};

/** Small Caption — Fine print style */
export const Caption: Story = {
  args: {
    as: "small",
    children: "© Clusters 2025. All rights reserved.",
    fontSize: "12px",
    fontWeight: 400,
    color: "#888",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
};

/** Decorated — Underline with custom color */
export const Decorated: Story = {
  args: {
    children: "Highlighted text with decoration",
    fontSize: "20px",
    fontWeight: 500,
    color: "#1a1a2e",
    textDecoration: "underline",
    textDecorationColor: "#d09260",
    textDecorationStyle: "wavy",
    textDecorationThickness: "2px",
    textUnderlineOffset: "4px",
  },
};

/** Uppercase Bold — Call to action style */
export const UppercaseBold: Story = {
  args: {
    as: "span",
    children: "Explore our projects",
    fontSize: "14px",
    fontWeight: 700,
    color: "#d09260",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
  },
};

/** Blockquote — Styled quote */
export const Blockquote: Story = {
  args: {
    as: "blockquote",
    children:
      '"We see in every empty land a story waiting to be told, and in every design an opportunity to create a rich human experience."',
    fontSize: "22px",
    fontWeight: 300,
    fontStyle: "italic",
    color: "#4c5946",
    lineHeight: "1.8",
    padding: "16px 24px",
    border: "none",
    maxWidth: "600px",
    style: { borderLeft: "4px solid #d09260" },
  },
};

/** With Shadow — Glowing text effect */
export const WithShadow: Story = {
  args: {
    as: "h1",
    children: "Glow Effect",
    fontSize: "56px",
    fontWeight: 800,
    color: "#deae6d",
    textShadow: "0 0 20px rgba(222, 174, 109, 0.5)",
    textAlign: "center",
  },
};

/** Truncated — Line clamp demonstration */
export const Truncated: Story = {
  args: {
    children:
      "This is a long paragraph that demonstrates text truncation using line-clamp. In a Webflow-like builder, users may want to limit how many lines of text are visible before the content is cut off with an ellipsis. This is especially useful for card descriptions, preview sections, or any area where space is limited and content needs to be contained within a fixed number of lines.",
    fontSize: "16px",
    color: "#333",
    lineHeight: "1.6",
    maxWidth: "400px",
    lineClamp: 3,
  },
};

/** RTL Arabic — Right-to-left styled text */
export const ArabicStyled: Story = {
  args: {
    as: "h2",
    children: "لا نبني، بل نُحيي الأماكن",
    fontSize: "40px",
    fontWeight: 700,
    color: "#b28966",
    direction: "rtl",
    textAlign: "right",
    lineHeight: "1.4",
  },
};

/** Colored Background — Text with background highlight */
export const HighlightedText: Story = {
  args: {
    as: "span",
    children: "Highlighted text with background",
    fontSize: "18px",
    fontWeight: 500,
    color: "#fff",
    backgroundColor: "#d09260",
    padding: "4px 12px",
    borderRadius: "4px",
  },
};

/** Strikethrough — Discount / old price style */
export const Strikethrough: Story = {
  args: {
    as: "span",
    children: "SAR 1,500,000",
    fontSize: "18px",
    fontWeight: 400,
    color: "#999",
    textDecoration: "line-through",
    textDecorationThickness: "2px",
  },
};
