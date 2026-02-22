"use client";

import type { CommitmentSectionProps } from "./CommitmentSection.types";
import { Text } from "../Text";
import {
  DEFAULT_IMAGE_SRC,
  DEFAULT_IMAGE_ALT,
  DEFAULT_BACKGROUND_IMAGE_SRC,
  DEFAULT_ROLE_LABEL,
  DEFAULT_NAME,
  DEFAULT_HEADING,
  DEFAULT_QUOTE,
} from "./data";

export const CommitmentSection = ({
  imageSrc,
  imageAlt,
  backgroundImageSrc,
  roleLabel,
  name,
  heading,
  quote,
  roleLabelTextProps,
  nameTextProps,
  headingTextProps,
  quoteTextProps,
  dir = "rtl",
}: CommitmentSectionProps) => {
  const _imageSrc = imageSrc ?? DEFAULT_IMAGE_SRC;
  const _imageAlt = imageAlt ?? DEFAULT_IMAGE_ALT;
  const _bgImageSrc = backgroundImageSrc ?? DEFAULT_BACKGROUND_IMAGE_SRC;
  const _roleLabel = roleLabel ?? DEFAULT_ROLE_LABEL;
  const _name = name ?? DEFAULT_NAME;
  const _heading = heading ?? DEFAULT_HEADING;
  const _quote = quote ?? DEFAULT_QUOTE;

  return (
    <section
      dir={dir}
      className="app flex flex-col items-center gap-10 pt-12 lg:flex-row lg:gap-36"
    >
      <div className="flex w-full flex-col md:w-1/2 lg:w-full">
        {/* CEO card: background image (frame) + CEO photo, then label strip */}
        <div
          className="relative aspect-square overflow-hidden rounded-t-2xl"
          style={{
            backgroundImage: `url(${_bgImageSrc})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <img
            alt={_imageAlt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
            src={_imageSrc}
            sizes="100vw"
          />
        </div>
        <div
          className="flex flex-1 flex-col rounded-b-2xl px-6 pb-6"
          style={{ backgroundColor: "#d0925f", color: "#ffffff" }}
        >
          <div className="pt-4 text-center">
            <Text as="span" {...roleLabelTextProps}>
              {_roleLabel}
            </Text>
            <Text as="strong" {...nameTextProps}>
              {_name}
            </Text>
          </div>
        </div>
      </div>
      <div className="text-center lg:grow lg:text-start">
        <Text as="h2" {...headingTextProps}>
          {_heading}
        </Text>
        <Text as="blockquote" {...quoteTextProps}>
          {_quote}
        </Text>
      </div>
    </section>
  );
};
