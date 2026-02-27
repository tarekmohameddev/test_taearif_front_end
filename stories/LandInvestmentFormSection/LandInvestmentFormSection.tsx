"use client";

import type { LandInvestmentFormSectionProps } from "./LandInvestmentFormSection.types";
import { cn } from "@/lib/utils";
import { Text } from "../Text";
import {
  DEFAULT_HEADING,
  DEFAULT_DESCRIPTION,
  DEFAULT_BOTTOM_IMAGE_SRC,
  DEFAULT_BOTTOM_IMAGE_ALT,
} from "./data";
import { LandInvestmentForm } from "./LandInvestmentForm";

export const LandInvestmentFormSection = ({
  id = "form-section",
  heading,
  description,
  bottomImageSrc,
  bottomImageAlt,
  headingTextProps,
  descriptionTextProps,
  onFormSubmit,
  dir = "rtl",
}: LandInvestmentFormSectionProps) => {
  const _heading = heading ?? DEFAULT_HEADING;
  const _description = description ?? DEFAULT_DESCRIPTION;
  const _imageSrc = bottomImageSrc ?? DEFAULT_BOTTOM_IMAGE_SRC;
  const _imageAlt = bottomImageAlt ?? DEFAULT_BOTTOM_IMAGE_ALT;

  return (
    <section id={id} dir={dir}>
      <div className="relative bg-[#F5EDE3] pt-12">
        <div className="app gap space-y-9 pt-8 lg:flex lg:gap-24">
          <div className="lg:flex-1">
            <Text as="h2" {...headingTextProps}>
              {_heading}
            </Text>
            <Text
              as="p"
              {...descriptionTextProps}
              className={cn("mt-4 text-lg lg:mt-0 whitespace-pre-line", descriptionTextProps?.className)}
            >
              {_description}
            </Text>
          </div>
          <div className="flex flex-1 flex-col gap-6">
            <LandInvestmentForm onSubmit={onFormSubmit} />
          </div>
        </div>
        {_imageSrc && (
          <img
            alt={_imageAlt}
            loading="lazy"
            width={2160}
            height={953}
            decoding="async"
            className="mt-24 w-full object-cover"
            src={_imageSrc}
            sizes="100vw"
          />
        )}
      </div>
    </section>
  );
};
