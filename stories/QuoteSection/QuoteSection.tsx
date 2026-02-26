"use client";

import type { QuoteSectionProps } from "./QuoteSection.types";
import { Text } from "../Text";
import { QuoteIcon } from "./QuoteIcon";
import {
  DEFAULT_QUOTE,
  DEFAULT_IMAGE_SRC,
  DEFAULT_IMAGE_ALT,
  DEFAULT_NAME,
  DEFAULT_ROLE,
} from "./data";

export const QuoteSection = ({
  quote,
  imageSrc,
  imageAlt,
  name,
  role,
  quoteTextProps,
  nameTextProps,
  roleTextProps,
  dir = "rtl",
}: QuoteSectionProps) => {
  const _quote = quote ?? DEFAULT_QUOTE;
  const _imageSrc = imageSrc ?? DEFAULT_IMAGE_SRC;
  const _imageAlt = imageAlt ?? DEFAULT_IMAGE_ALT;
  const _name = name ?? DEFAULT_NAME;
  const _role = role ?? DEFAULT_ROLE;

  return (
    <section
      dir={dir}
      className="app flex flex-col gap-10 py-24"
    >
      <blockquote className="relative before:absolute lg:max-w-10/12">
        <QuoteIcon className="absolute -top-8 size-11 opacity-20 xl:-top-7" />
        <Text as="p" {...quoteTextProps}>
          {_quote}
        </Text>
      </blockquote>
      <div className="flex w-full max-w-96 gap-5 rounded-3xl bg-[#ECE3DB]/35 p-4">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-black/20">
          <img
            alt={_imageAlt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
            src={_imageSrc}
            sizes="100px"
          />
        </div>
        <div className="flex flex-col justify-center text-[#4F4F4F]">
          <Text as="span" {...nameTextProps}>
            {_name}
          </Text>
          <Text as="span" {...roleTextProps}>
            {_role}
          </Text>
        </div>
      </div>
    </section>
  );
};
