"use client";

import type { EssenceSectionProps } from "./EssenceSection.types";
import { Text } from "../Text";
import {
  DEFAULT_HEADING,
  DEFAULT_LEAD,
  DEFAULT_BODY1,
  DEFAULT_BODY2,
} from "./data";

export const EssenceSection = ({
  heading,
  lead,
  body1,
  body2,
  headingTextProps,
  leadTextProps,
  bodyTextProps,
  dir = "rtl",
}: EssenceSectionProps) => {
  const _heading = heading ?? DEFAULT_HEADING;
  const _lead = lead ?? DEFAULT_LEAD;
  const _body1 = body1 ?? DEFAULT_BODY1;
  const _body2 = body2 ?? DEFAULT_BODY2;

  return (
    <section
      dir={dir}
      className="app py-12 text-pretty lg:flex lg:justify-between"
    >
      <Text as="h2" {...headingTextProps}>
        {_heading}
      </Text>
      <div className="lg:flex-1">
        <p className="mt-5 text-lg">
          <Text as="strong" {...leadTextProps}>
            {_lead}
          </Text>
          {_body1}
        </p>
        <Text as="p" {...bodyTextProps}>
          {_body2}
        </Text>
      </div>
    </section>
  );
};
