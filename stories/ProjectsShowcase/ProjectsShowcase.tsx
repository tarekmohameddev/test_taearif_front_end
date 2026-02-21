"use client";

import { useState } from "react";
import type {
  ProjectsShowcaseProps,
  FilterType,
} from "./ProjectsShowcase.types";
import { DEFAULT_FILTERS, DEFAULT_PROJECTS } from "./data";
import { ShareIcon } from "../assets/ShareIcon";
import { ArrowIcon } from "../assets/ArrowIcon";

const getStatusLabel = (
  status: "available" | "coming-soon" | "sold",
  filters: typeof DEFAULT_FILTERS
): string => {
  switch (status) {
    case "available":
      return filters.available;
    case "coming-soon":
      return filters.comingSoon;
    case "sold":
      return filters.sold;
    default:
      return filters.available;
  }
};

export const ProjectsShowcase = ({
  filters,
  activeFilter: controlledFilter,
  onFilterChange,
  projects,
  dir = "rtl",
}: ProjectsShowcaseProps) => {
  const _filters = filters ?? DEFAULT_FILTERS;
  const _projects = projects ?? DEFAULT_PROJECTS;
  const [internalFilter, setInternalFilter] = useState<FilterType>("all");
  const currentFilter = controlledFilter ?? internalFilter;

  const handleFilterChange = (filter: FilterType) => {
    if (controlledFilter === undefined) {
      setInternalFilter(filter);
    }
    onFilterChange?.(filter);
  };

  const filteredProjects =
    currentFilter === "all"
      ? _projects
      : _projects.filter((project) => {
          if (currentFilter === "available")
            return project.status === "available";
          if (currentFilter === "coming-soon")
            return project.status === "coming-soon";
          if (currentFilter === "sold") return project.status === "sold";
          return true;
        });

  return (
    <section dir={dir} className="app mb-9">
      <div>
        {/* ── Filter Buttons ───────────────────────────── */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex gap-2 lg:w-fit w-full">
            <button
              data-slot="button"
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium shadow-xs min-h-9 p-2 w-fit shrink-0 grow px-0 lg:shrink-0 lg:grow-0 lg:px-10 transition-all outline-none focus-visible:ring-[3px] ${
                currentFilter === "all"
                  ? "text-white hover:bg-unset hover:text-unset"
                  : "bg-[#E8E8E8] text-[#868686] hover:bg-[#dbc7ae]/80"
              }`}
              style={
                currentFilter === "all"
                  ? { backgroundColor: "rgb(222, 173, 107)" }
                  : undefined
              }
              onClick={() => handleFilterChange("all")}
            >
              {_filters.all}
            </button>
            <button
              data-slot="button"
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium shadow-xs min-h-9 p-2 w-fit shrink-0 grow px-0 lg:shrink-0 lg:grow-0 lg:px-10 transition-all outline-none focus-visible:ring-[3px] ${
                currentFilter === "available"
                  ? "text-white hover:bg-unset hover:text-unset"
                  : "bg-[#E8E8E8] text-[#868686] hover:bg-[#dbc7ae]/80"
              }`}
              style={
                currentFilter === "available"
                  ? { backgroundColor: "rgb(222, 173, 107)" }
                  : undefined
              }
              onClick={() => handleFilterChange("available")}
            >
              {_filters.available}
            </button>
            <button
              data-slot="button"
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium shadow-xs min-h-9 p-2 w-fit shrink-0 grow px-0 lg:shrink-0 lg:grow-0 lg:px-10 transition-all outline-none focus-visible:ring-[3px] ${
                currentFilter === "coming-soon"
                  ? "text-white hover:bg-unset hover:text-unset"
                  : "bg-[#E8E8E8] text-[#868686] hover:bg-[#dbc7ae]/80"
              }`}
              style={
                currentFilter === "coming-soon"
                  ? { backgroundColor: "rgb(222, 173, 107)" }
                  : undefined
              }
              onClick={() => handleFilterChange("coming-soon")}
            >
              {_filters.comingSoon}
            </button>
            <button
              data-slot="button"
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium shadow-xs min-h-9 p-2 w-fit shrink-0 grow px-0 lg:shrink-0 lg:grow-0 lg:px-10 transition-all outline-none focus-visible:ring-[3px] ${
                currentFilter === "sold"
                  ? "text-white hover:bg-unset hover:text-unset"
                  : "bg-[#E8E8E8] text-[#868686] hover:bg-[#dbc7ae]/80"
              }`}
              style={
                currentFilter === "sold"
                  ? { backgroundColor: "rgb(222, 173, 107)" }
                  : undefined
              }
              onClick={() => handleFilterChange("sold")}
            >
              {_filters.sold}
            </button>
          </div>
        </div>

        {/* ── Projects Grid ───────────────────────────── */}
        <ul className="mt-11 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <li
              key={`${project.title}-${index}`}
              className="relative z-[1] flex flex-col rounded-2xl pt-16 before:bg-contain before:absolute before:top-0 before:left-0 before:-z-[1] before:h-full before:w-full before:bg-[image:var(--shape)] before:bg-no-repeat before:content-['']"
              style={
                {
                  backgroundColor: project.backgroundColor,
                  color: project.textColor,
                  "--shape": `url(${project.patternSrc})`,
                } as React.CSSProperties & { "--shape": string }
              }
            >
              {/* Status Badge */}
              <div
                className="absolute top-0 ltr:left-0 rtl:right-0 z-30 flex justify-center items-center text-[14px] w-[55px] h-[55px] rounded-full rtl:translate-x-[10px] -translate-y-[15px] ltr:-translate-x-[10px] border-[3px] border-white ltr:text-xs text-white"
                style={{ backgroundColor: project.statusColor }}
              >
                {getStatusLabel(project.status, _filters)}
              </div>

              {/* Content */}
              <div className="px-6">
                {/* Logo */}
                {project.logoSrc && (
                  <img
                    alt={project.logoAlt ?? project.title}
                    loading="lazy"
                    width="80"
                    height="50"
                    decoding="async"
                    className="h-[50px]"
                    src={project.logoSrc}
                  />
                )}
                {!project.logoSrc && (
                  <div className="h-[50px] w-20 opacity-0" aria-hidden="true" />
                )}

                {/* Title */}
                <h2 className="font-saudi line-clamp-1 text-4xl font-bold mt-0">
                  {project.title}
                </h2>

                {/* Location */}
                <span>{project.location}</span>

                {/* Description */}
                <p className="mt-8 line-clamp-2">{project.description}</p>

                {/* Unit Types */}
                <ul className="mt-5 flex gap-2">
                  {project.unitTypes.map((unit, unitIndex) => (
                    <li
                      key={`${unit.label}-${unitIndex}`}
                      className="flex items-center gap-1.5"
                    >
                      <div
                        className="relative size-5"
                        style={{
                          filter: unit.invertIcon ? "invert(1)" : "invert(0)",
                        }}
                      >
                        <img
                          alt="unit icon"
                          loading="lazy"
                          decoding="async"
                          className="object-cover mix-blend-luminosity absolute inset-0 h-full w-full"
                          src={unit.iconSrc}
                        />
                      </div>
                      <span className="text-xs">{unit.label}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <a
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all text-white min-h-9 p-2 w-fit px-10 mt-5 outline-none focus-visible:ring-[3px]"
                  href={project.ctaHref}
                  style={{ backgroundColor: project.ctaBgColor }}
                >
                  {project.ctaText}
                  <ArrowIcon />
                </a>
              </div>

              {/* Image */}
              <div className="relative mt-auto h-[300px] w-full">
                <img
                  alt={project.imageAlt}
                  loading="lazy"
                  decoding="async"
                  className="rounded-b-2xl object-cover object-top absolute inset-0 h-full w-full"
                  src={project.imageSrc}
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>

              {/* Share Button */}
              <button
                aria-label="Share"
                data-prevent-progress="true"
                className="rounded-full border p-[9px] absolute top-0 z-20 translate-y-10 border-transparent bg-white ltr:right-0 ltr:-translate-x-5 rtl:left-0 rtl:translate-x-5 [&>svg]:fill-black [&>svg]:stroke-black"
                type="button"
                onClick={() => project.onShare?.()}
              >
                <ShareIcon />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
