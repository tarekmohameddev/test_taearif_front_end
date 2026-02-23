"use client";

import { createElement, type CSSProperties } from "react";
import type { TextProps } from "./Text.types";
import { DEFAULTS } from "./data";

export const Text = ({
  children,
  as,
  fontFamily,
  fontSize,
  fontWeight,
  fontStyle,
  lineHeight,
  letterSpacing,
  wordSpacing,
  color,
  backgroundColor,
  opacity,
  textDecoration,
  textDecorationColor,
  textDecorationStyle,
  textDecorationThickness,
  textUnderlineOffset,
  textAlign,
  textTransform,
  textIndent,
  verticalAlign,
  direction,
  whiteSpace,
  wordBreak,
  overflowWrap,
  textOverflow,
  textShadow,
  filter,
  mixBlendMode,
  margin,
  padding,
  maxWidth,
  lineClamp,
  overflow,
  border,
  borderRadius,
  cursor,
  userSelect,
  style,
  className,
}: TextProps) => {
  const tag = as ?? DEFAULTS.as ?? "p";
  const content = children ?? DEFAULTS.children;

  const computedStyle: CSSProperties = {
    fontFamily,
    fontSize: fontSize ?? DEFAULTS.fontSize,
    fontWeight: fontWeight ?? DEFAULTS.fontWeight,
    fontStyle,
    lineHeight: lineHeight ?? DEFAULTS.lineHeight,
    letterSpacing,
    wordSpacing,
    ...(color !== undefined && { color }),
    backgroundColor,
    opacity,
    textDecoration,
    textDecorationColor,
    textDecorationStyle,
    textDecorationThickness,
    textUnderlineOffset,
    textAlign,
    textTransform,
    textIndent,
    verticalAlign,
    direction,
    whiteSpace,
    wordBreak,
    overflowWrap,
    textOverflow,
    textShadow,
    filter,
    mixBlendMode,
    margin,
    padding,
    maxWidth,
    overflow: lineClamp ? "hidden" : overflow,
    border,
    borderRadius,
    cursor,
    userSelect,
    ...(lineClamp
      ? {
          display: "-webkit-box",
          WebkitLineClamp: lineClamp,
          WebkitBoxOrient: "vertical" as const,
        }
      : {}),
    ...style,
  };

  return createElement(tag, { className, style: computedStyle }, content);
};
