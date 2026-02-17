"use client";

import type { ProjectsHeaderProps } from "./ProjectsHeader.types";
import { DEFAULT_HEADING, DEFAULT_DESCRIPTION } from "./data";

export const ProjectsHeader = ({
  heading,
  description,
  dir = "rtl",
}: ProjectsHeaderProps) => {
  const _heading = heading ?? DEFAULT_HEADING;
  const _description = description ?? DEFAULT_DESCRIPTION;
  const _descriptionArray = Array.isArray(_description)
    ? _description
    : [_description];

  return (
    <section dir={dir} className="app my-9 lg:flex lg:items-center lg:gap-12">
      <h2 className="font-saudi text-[#d09260] text-[40px] leading-11 font-bold">
        {_heading.split("\n").map((line, index, array) => (
          <span key={index}>
            {line}
            {index < array.length - 1 && <br />}
          </span>
        ))}
      </h2>
      <p className="mt-5 text-lg">
        {_descriptionArray.map((line, index) => (
          <span key={index}>
            {line}
            {index < _descriptionArray.length - 1 && <br />}
          </span>
        ))}
      </p>
    </section>
  );
};
