"use client";

import type { FeaturesSectionProps } from "./FeaturesSection.types";
import { Text } from "../Text";
import { ShieldCheckIcon } from "./ShieldCheckIcon";
import {
  DEFAULT_HEADING,
  DEFAULT_FEATURES,
  DEFAULT_CERTIFICATIONS,
} from "./data";

export const FeaturesSection = ({
  heading,
  features,
  certifications,
  headingTextProps,
  featureTitleTextProps,
  featureDescriptionTextProps,
  certificationTextProps,
  dir = "rtl",
}: FeaturesSectionProps) => {
  const _heading = heading ?? DEFAULT_HEADING;
  const _features = features ?? DEFAULT_FEATURES;
  const _certs = certifications ?? DEFAULT_CERTIFICATIONS;

  return (
    <section dir={dir} className="bg-[#F5EDE3] py-12">
      <div className="app space-y-12">
        <Text
          as="h2"
          {...headingTextProps}
          className={(headingTextProps?.className ?? "") + " text-center"}
        >
          {_heading}
        </Text>
        <ul className="grid auto-rows-fr gap-8 md:grid-cols-2 xl:grid-cols-3">
          {_features.map((item, index) => (
            <li
              key={`${item.title}-${index}`}
              className="space-y-4 rounded-sm bg-white p-5 shadow-md"
            >
              <div className="flex items-center gap-2">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#CE905E] text-white">
                  {item.icon ?? <ShieldCheckIcon />}
                </div>
                <Text as="span" {...featureTitleTextProps}>
                  {item.title}
                </Text>
              </div>
              <Text as="p" {...featureDescriptionTextProps}>
                {item.description}
              </Text>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-x-4 gap-y-8 lg:flex-row lg:justify-between">
          {_certs.map((cert, index) => (
            <div
              key={`${cert.imageAlt}-${index}`}
              className="flex flex-1 flex-col items-center gap-6 text-center md:flex-row"
            >
              <img
                alt={cert.imageAlt}
                loading="lazy"
                width={200}
                height={200}
                decoding="async"
                className="shrink-0"
                src={cert.imageSrc}
              />
              <Text as="span" {...certificationTextProps} className="basis-full">
                {cert.text}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
