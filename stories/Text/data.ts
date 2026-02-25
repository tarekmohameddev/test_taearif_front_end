import type { TextProps } from "./Text.types";

export const DEFAULTS: Pick<
  TextProps,
  "children" | "as" | "fontSize" | "fontWeight" | "color" | "lineHeight"
> = {
  children:
    "في تجمعات، نصمم بيئة فريدة تتمحور حول الانسان تتنفس الأصالة، وتنبض بالإبداع، لتحتضن فصول حياتك الاستثنائية",
  as: "p",
  fontSize: "16px",
  fontWeight: 400,
  color: "#1a1a2e",
  lineHeight: "1.6",
};
