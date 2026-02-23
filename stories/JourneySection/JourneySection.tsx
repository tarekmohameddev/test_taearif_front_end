"use client";

import type { JourneySectionProps } from "./JourneySection.types";
import { Text } from "../Text";
import {
  DEFAULT_HEADING,
  DEFAULT_STEPS,
  DEFAULT_FLAG_IMAGE_SRC,
  DEFAULT_FLAG_IMAGE_ALT,
} from "./data";

export const JourneySection = ({
  heading,
  steps,
  flagImageSrc,
  flagImageAlt,
  headingTextProps,
  stepTitleTextProps,
  stepDurationTextProps,
  stepDescriptionTextProps,
  dir = "rtl",
}: JourneySectionProps) => {
  const _heading = heading ?? DEFAULT_HEADING;
  const _steps = steps ?? DEFAULT_STEPS;
  const _flagSrc = flagImageSrc ?? DEFAULT_FLAG_IMAGE_SRC;
  const _flagAlt = flagImageAlt ?? DEFAULT_FLAG_IMAGE_ALT;

  return (
    <section
      dir={dir}
      className="relative bg-[#B08968] pt-12 xl:py-12"
    >
      <div className="app space-y-12 xl:space-y-24">
        <Text
          as="h2"
          {...headingTextProps}
          className={(headingTextProps?.className ?? "") + " whitespace-pre-line text-white"}
        >
          {_heading}
        </Text>

        {/* Desktop: grid of steps */}
        <ul className="hidden grid-cols-2 gap-8 xl:grid xl:grid-cols-3 2xl:gap-12">
          {_steps.map((step) => (
            <li
              key={step.number}
              className="relative flex flex-col gap-3 text-white"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white">
                  <Text
                    as="span"
                    className="font-saudi text-4xl font-bold text-[#B08968]"
                  >
                    {step.number}
                  </Text>
                </div>
                <div className="mt-0.5 space-y-2.5">
                  <Text as="h3" {...stepTitleTextProps} className="text-xl font-bold text-white">
                    {step.title}
                  </Text>
                  <Text as="span" {...stepDurationTextProps} className="block text-white">
                    {step.duration}
                  </Text>
                  <Text as="p" {...stepDescriptionTextProps} className="font-bold text-white">
                    {step.description}
                  </Text>
                  {step.ctaLabel && step.ctaHref && (
                    <a
                      href={step.ctaHref}
                      className="mt-2 inline-flex min-h-9 w-fit items-center justify-center rounded-sm bg-[var(--muted-foreground)] px-10 py-2 font-bold text-white transition-colors hover:opacity-90"
                    >
                      {step.ctaLabel}
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Mobile: vertical list with dashed connector */}
        <div className="xl:hidden">
          <ul className="space-y-0">
            {_steps.map((step, index) => (
              <li
                key={step.number}
                className="relative flex gap-5 pb-6 last:pb-0"
              >
                {index < _steps.length - 1 && (
                  <span
                    className="absolute top-11 bottom-0 w-[3px] bg-white/60 ltr:left-5 rtl:right-5"
                    aria-hidden
                  />
                )}
                <div className="relative flex shrink-0 flex-col items-center">
                  <div className="flex size-11 items-center justify-center rounded-full bg-white">
                    <Text
                      as="span"
                      className="font-saudi text-4xl font-bold text-[#B08968]"
                    >
                      {step.number}
                    </Text>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2.5 pt-0.5 text-white">
                  <Text as="h3" {...stepTitleTextProps} className="text-xl font-bold">
                    {step.title}
                  </Text>
                  <Text as="span" {...stepDurationTextProps} className="block">
                    {step.duration}
                  </Text>
                  <Text as="p" {...stepDescriptionTextProps} className="font-bold">
                    {step.description}
                  </Text>
                  {step.ctaLabel && step.ctaHref && (
                    <a
                      href={step.ctaHref}
                      className="mt-1 inline-flex min-h-9 w-fit items-center justify-center rounded-sm bg-[var(--muted-foreground)] px-10 py-2 font-bold text-white"
                    >
                      {step.ctaLabel}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {_flagSrc && (
            <img
              alt={_flagAlt}
              loading="lazy"
              width={290}
              height={499}
              decoding="async"
              className="mx-auto h-[250px] w-auto object-contain"
              src={_flagSrc}
            />
          )}
        </div>

        {/* Desktop flag (optional, e.g. bottom center) */}
        {_flagSrc && (
          <div className="hidden justify-center xl:flex">
            <img
              alt={_flagAlt}
              loading="lazy"
              width={290}
              height={499}
              decoding="async"
              className="h-[250px] w-auto object-contain"
              src={_flagSrc}
            />
          </div>
        )}
      </div>
    </section>
  );
};
