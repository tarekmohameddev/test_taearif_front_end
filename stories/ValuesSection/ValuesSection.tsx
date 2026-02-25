"use client";

import type { ValuesSectionProps } from "./ValuesSection.types";
import { Text } from "../Text";
import {
  DEFAULT_HEADING,
  DEFAULT_DESCRIPTION,
  DEFAULT_CARDS,
} from "./data";

const getBgStyle = (variant: "muted-foreground" | "darken" | "black") => {
  switch (variant) {
    case "muted-foreground":
      return { backgroundColor: "#d09260" }; // --muted-foreground
    case "darken":
      return { backgroundColor: "#4c5946" }; // --darken
    case "black":
      return { backgroundColor: "#000" };
    default:
      return { backgroundColor: "#000" };
  }
};

export const ValuesSection = ({
  heading,
  description,
  cards,
  headingTextProps,
  descriptionTextProps,
  cardTitleTextProps,
  cardDescriptionTextProps,
  dir = "rtl",
}: ValuesSectionProps) => {
  const _heading = heading ?? DEFAULT_HEADING;
  const _description = description ?? DEFAULT_DESCRIPTION;
  const _cards = cards ?? DEFAULT_CARDS;

  return (
    <section dir={dir} className="bg-[#F9F1E8]">
      <div className="app flex flex-col gap-12 py-12">
        {/* ── Header Section ───────────────────────────── */}
        <div className="items-center gap-28 lg:flex">
          <Text as="h2" {...headingTextProps}>
            {_heading.split("\n").map((line, index, array) => (
              <span key={index}>
                {line}
                {index < array.length - 1 && (
                  <br className="lg:hidden" />
                )}
              </span>
            ))}
          </Text>
          <Text as="p" {...descriptionTextProps}>
            {_description}
          </Text>
        </div>

        {/* ── Value Cards ───────────────────────────── */}
        <ul className="flex flex-col gap-11 lg:flex-row">
          {_cards.map((card, index) => (
            <li
              key={`${card.title}-${index}`}
              className="flex w-full items-center gap-6 rounded-[10px] p-3.5"
              style={{
                ...getBgStyle(card.bgVariant),
                backgroundImage: `linear-gradient(
                  256deg,
                  rgba(0, 0, 0, 0) 13.86%,
                  rgba(0, 0, 0, 0.2) 105.93%
                )`,
              }}
            >
              {/* Icon */}
              <div className="shrink-0">{card.icon}</div>

              {/* Text Content */}
              <div className="text-lg text-pretty text-white flex flex-col">
                <Text as="span" {...cardTitleTextProps}>
                  {card.title}
                </Text>
                <Text as="span" {...cardDescriptionTextProps}>
                  {card.description}
                </Text>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
