"use client";

import type { CreativityTriadSectionProps } from "./CreativityTriadSection.types";
import { Text } from "../Text";
import {
  DEFAULT_HEADING,
  DEFAULT_INTRO,
  DEFAULT_CARDS,
} from "./data";

const CARD_GRADIENT =
  "linear-gradient(180deg, rgba(0,0,0,0) 58.03%, #000 94.88%)";

export const CreativityTriadSection = ({
  heading,
  intro,
  cards,
  headingTextProps,
  introTextProps,
  cardTitleTextProps,
  cardDescriptionTextProps,
  dir = "rtl",
}: CreativityTriadSectionProps) => {
  const _heading = heading ?? DEFAULT_HEADING;
  const _intro = intro ?? DEFAULT_INTRO;
  const _cards = cards ?? DEFAULT_CARDS;

  return (
    <section
      dir={dir}
      className="bg-[#F8F3ED] py-6 text-pretty"
    >
      <div className="app">
        <Text as="h2" {...headingTextProps}>
          {_heading}
        </Text>
        <Text as="p" {...introTextProps}>
          {_intro}
        </Text>
        <ul className="mt-10 flex flex-col gap-8 lg:flex-row">
          {_cards.map((card, index) => (
            <li
              key={`${card.title}-${index}`}
              className="flex-item relative flex h-[500px] items-end px-7 py-8 lg:flex-1"
            >
              <img
                alt={card.imageAlt ?? card.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 z-0 size-full rounded-2xl object-cover"
                src={card.imageSrc}
                sizes="100vw"
              />
              <div
                className="absolute inset-0 rounded-2xl"
                style={{ background: CARD_GRADIENT }}
              />
              <div className="relative flex flex-col gap-2.5 text-balance text-white">
                <Text as="span" {...cardTitleTextProps}>
                  {card.title}
                </Text>
                <Text as="p" {...cardDescriptionTextProps}>
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
