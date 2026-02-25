"use client";

import type { PhilosophyCtaSectionProps } from "./PhilosophyCtaSection.types";
import { Text } from "../Text";
import {
  DEFAULT_HEADING,
  DEFAULT_DESCRIPTION,
  DEFAULT_CTA_LABEL,
  DEFAULT_CTA_HREF,
} from "./data";

export const PhilosophyCtaSection = ({
  heading,
  description,
  ctaLabel,
  ctaHref,
  headingTextProps,
  descriptionTextProps,
  ctaTextProps,
  dir = "rtl",
}: PhilosophyCtaSectionProps) => {
  const _heading = heading ?? DEFAULT_HEADING;
  const _description = description ?? DEFAULT_DESCRIPTION;
  const _ctaLabel = ctaLabel ?? DEFAULT_CTA_LABEL;
  const _ctaHref = ctaHref ?? DEFAULT_CTA_HREF;

  return (
    <section
      dir={dir}
      className="mt-16 bg-black py-12 lg:text-center"
    >
      <div className="app w-fit text-white mx-auto">
        <div className="lg:w-full lg:max-w-[350px]">
          <Text as="h2" {...headingTextProps}>
            {_heading}
          </Text>
          <Text as="p" {...descriptionTextProps}>
            {_description}
          </Text>
          <a
            className="mt-16 inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-sm py-3 font-bold text-white transition-all focus-visible:ring-[3px] focus-visible:ring-[#a1a1a8]/50 outline-none"
            href={_ctaHref}
            style={{ backgroundColor: "#deae6d" }}
          >
            <Text as="span" {...ctaTextProps}>
              {_ctaLabel}
            </Text>
          </a>
        </div>
      </div>
    </section>
  );
};
