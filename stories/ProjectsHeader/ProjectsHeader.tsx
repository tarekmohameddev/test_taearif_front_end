"use client";

import type { ProjectsHeaderProps } from "./ProjectsHeader.types";
import { Text } from "../Text";
import { DEFAULT_HEADING, DEFAULT_DESCRIPTION } from "./data";

export const ProjectsHeader = ({
  heading,
  description,
  headingTextProps,
  descriptionTextProps,
  dir = "rtl",
}: ProjectsHeaderProps) => {
  const _heading = heading ?? DEFAULT_HEADING;
  const _description = description ?? DEFAULT_DESCRIPTION;
  const _descriptionArray = Array.isArray(_description)
    ? _description
    : [_description];

  return (
    <section dir={dir} className="app my-9 lg:flex lg:items-center lg:gap-12">
      <Text as="h2" {...headingTextProps}>
        {_heading.split("\n").map((line, index, array) => (
          <span key={index}>
            {line}
            {index < array.length - 1 && <br />}
          </span>
        ))}
      </Text>
      <Text as="p" {...descriptionTextProps}>
        {_descriptionArray.map((line, index) => (
          <span key={index}>
            {line}
            {index < _descriptionArray.length - 1 && <br />}
          </span>
        ))}
      </Text>
    </section>
  );
};
