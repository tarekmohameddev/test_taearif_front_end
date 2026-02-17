"use client";

import type { ValuesSectionProps } from "./ValuesSection.types";
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
          <h2 className="font-saudi text-[#b28966] text-[40px] font-bold lg:text-center">
            {_heading.split("\n").map((line, index, array) => (
              <span key={index}>
                {line}
                {index < array.length - 1 && (
                  <br className="lg:hidden" />
                )}
              </span>
            ))}
          </h2>
          <p className="text-lg lg:max-w-1/2">{_description}</p>
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
              <div className="text-lg text-pretty text-white">
                <span className="block font-bold">{card.title}</span>
                <span className="block">{card.description}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
