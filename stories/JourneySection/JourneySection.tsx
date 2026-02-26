"use client";

import type { JourneySectionProps, JourneyStep } from "./JourneySection.types";
import { Text } from "../Text";
import {
  DEFAULT_HEADING,
  DEFAULT_JOURNEY_LABEL,
  DEFAULT_STEPS,
  DEFAULT_FLAG_IMAGE_SRC,
  DEFAULT_FLAG_IMAGE_ALT,
} from "./data";

const STEP_CONNECTOR_CLASS =
  "relative flex w-fit flex-col items-center gap-[5px] before:absolute before:bottom-[-9px] before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#d9d9d9] before:content-[''] after:block after:h-10 after:w-px after:border after:border-dashed after:border-white after:content-[''] max-xl:before:absolute max-xl:before:top-0 max-xl:before:left-0 max-xl:before:z-10 max-xl:before:h-1.5 max-xl:before:w-1.5 max-xl:before:translate-x-[-35px] max-xl:before:translate-y-[18px] max-xl:before:rounded-full max-xl:before:bg-[#d9d9d9] max-xl:before:content-[''] max-xl:after:absolute max-xl:after:top-0 max-xl:after:left-0 max-xl:after:h-px max-xl:after:w-10 max-xl:after:translate-x-[-80%] max-xl:after:translate-y-5 max-xl:after:border max-xl:after:border-dashed max-xl:after:border-white ltr:max-xl:before:right-0 ltr:max-xl:before:left-auto ltr:max-xl:before:translate-x-[35px] ltr:max-xl:after:right-0 ltr:max-xl:after:left-auto ltr:max-xl:after:translate-x-[80%]";

const MOBILE_STEP_WRAPPER_CLASS =
  "relative pb-6 max-xl:not-last:before:absolute max-xl:not-last:before:block max-xl:not-last:before:h-full max-xl:not-last:before:w-[3px] max-xl:not-last:before:bg-white max-xl:not-last:before:opacity-60 max-xl:not-last:before:content-[''] ltr:max-xl:not-last:before:translate-x-5 rtl:max-xl:not-last:before:-translate-x-5";

function StepCard({
  step,
  stepTitleTextProps,
  stepDurationTextProps,
  stepDescriptionTextProps,
}: {
  step: JourneyStep;
  stepTitleTextProps?: JourneySectionProps["stepTitleTextProps"];
  stepDurationTextProps?: JourneySectionProps["stepDurationTextProps"];
  stepDescriptionTextProps?: JourneySectionProps["stepDescriptionTextProps"];
}) {
  return (
    <div className="relative flex flex-1 flex-row gap-6 text-white xl:flex-col xl:gap-3">
      <div className={STEP_CONNECTOR_CLASS}>
        <div className="flex size-11 items-center justify-center rounded-full bg-white">
          <Text
            as="span"
            className="font-saudi text-4xl font-bold text-[#B08968]"
          >
            {step.number}
          </Text>
        </div>
      </div>
      <div className="mt-2 space-y-2.5 xl:mt-0 ltr:ml-5 rtl:mr-5">
        <Text
          as="h2"
          {...stepTitleTextProps}
          className="text-xl font-bold text-white"
        >
          {step.title}
        </Text>
        <Text
          as="span"
          {...stepDurationTextProps}
          className="block text-white"
        >
          {step.duration}
        </Text>
        <Text
          as="p"
          {...stepDescriptionTextProps}
          className="font-bold text-white"
        >
          {step.description}
        </Text>
        {step.ctaLabel && step.ctaHref && (
          <a
            href={step.ctaHref}
            className="inline-flex min-h-9 w-fit items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-[var(--muted-foreground)] px-10 py-2 font-bold text-white transition-colors"
          >
            {step.ctaLabel}
          </a>
        )}
      </div>
    </div>
  );
}

export const JourneySection = ({
  heading,
  journeyLabel,
  steps,
  flagImageSrc,
  flagImageAlt,
  headingTextProps,
  journeyLabelTextProps,
  stepTitleTextProps,
  stepDurationTextProps,
  stepDescriptionTextProps,
  dir = "rtl",
}: JourneySectionProps) => {
  const _heading = heading ?? DEFAULT_HEADING;
  const _journeyLabel = journeyLabel ?? DEFAULT_JOURNEY_LABEL;
  const _steps = steps ?? DEFAULT_STEPS;
  const _flagSrc = flagImageSrc ?? DEFAULT_FLAG_IMAGE_SRC;
  const _flagAlt = flagImageAlt ?? DEFAULT_FLAG_IMAGE_ALT;

  const steps1to3 = _steps.slice(0, 3);
  const steps4to6 = _steps.slice(3, 6);

  return (
    <section dir={dir} className="relative bg-[#B08968] pt-12 xl:py-12">
      <div className="app space-y-12 xl:space-y-24">
        <Text
          as="h2"
          {...headingTextProps}
          className={
            (headingTextProps?.className ?? "") +
            " font-saudi text-4xl font-bold whitespace-pre-line text-white xl:text-5xl"
          }
        >
          {_heading}
        </Text>

        {/* Desktop: curved path + 2 rows of steps with flag */}
        <div className="hidden flex-col xl:flex" style={{ gap: 45 }}>
          <svg
            className="absolute w-[99%] translate-y-5 xl:w-[98%] 2xl:w-[90%] ltr:left-0 ltr:-scale-x-100 rtl:right-0"
            style={{ height: 366 }}
            preserveAspectRatio="none"
            viewBox="0 0 1330 305"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              opacity="0.6"
              d="M981.968 6.93188H133.023C-35.7701 6.93188 -48.2408 297.533 133.023 302.932H1348.71"
              stroke="white"
              strokeWidth="3.41994"
            />
            <circle
              cx="985.074"
              cy="7.01436"
              r="7.01436"
              fill="#F5F5F5"
            />
          </svg>
          <Text
            as="span"
            {...journeyLabelTextProps}
            className={
              (journeyLabelTextProps?.className ?? "") +
              " absolute mt-2 text-2xl font-bold text-nowrap text-white ltr:left-[14%] rtl:right-[10%]"
            }
          >
            {_journeyLabel}
          </Text>

          {/* Row 1: Steps 1–3 */}
          <div className="flex gap-36 ltr:ml-[309px] rtl:mr-[370px]">
            {steps1to3.map((step) => (
              <StepCard
                key={step.number}
                step={step}
                stepTitleTextProps={stepTitleTextProps}
                stepDurationTextProps={stepDurationTextProps}
                stepDescriptionTextProps={stepDescriptionTextProps}
              />
            ))}
          </div>

          {/* Row 2: Flag + Steps 4–6 */}
          <div className="relative ltr:ml-36 rtl:mr-36">
            {_flagSrc && (
              <div className="absolute -translate-y-[95%] ltr:-translate-x-[5%] rtl:translate-x-[67%]">
                <img
                  alt={_flagAlt}
                  loading="lazy"
                  width={290}
                  height={499}
                  decoding="async"
                  className="h-[250px] w-full object-contain"
                  src={_flagSrc}
                />
              </div>
            )}
            <div className="flex flex-row-reverse gap-12">
              {steps4to6.map((step) => (
                <StepCard
                  key={step.number}
                  step={step}
                  stepTitleTextProps={stepTitleTextProps}
                  stepDurationTextProps={stepDurationTextProps}
                  stepDescriptionTextProps={stepDescriptionTextProps}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: vertical list with dashed connector + flag at bottom */}
        <div className="xl:hidden">
          <div>
            {_steps.map((step, index) => (
              <div key={step.number} className={MOBILE_STEP_WRAPPER_CLASS}>
                <StepCard
                  step={step}
                  stepTitleTextProps={stepTitleTextProps}
                  stepDurationTextProps={stepDurationTextProps}
                  stepDescriptionTextProps={stepDescriptionTextProps}
                />
              </div>
            ))}
          </div>
          {_flagSrc && (
            <img
              alt={_flagAlt}
              loading="lazy"
              width={290}
              height={499}
              decoding="async"
              className="mx-auto"
              src={_flagSrc}
            />
          )}
        </div>
      </div>
    </section>
  );
};
