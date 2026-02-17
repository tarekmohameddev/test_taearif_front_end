"use client";

import type { HeroBannerProps } from "./HeroBanner.types";
import { ScrollDownIcon } from "../assets/ScrollDownIcon";
import { DEFAULTS } from "./data";

export const HeroBanner = ({
  title,
  subtitle,
  description,
  primaryCta,
  secondaryCta,
  videoSrc,
  fallbackImage,
  dir = "rtl",
  showScrollIndicator = true,
  onScrollDown,
}: HeroBannerProps) => {
  const _title = title ?? DEFAULTS.title;
  const _subtitle = subtitle ?? DEFAULTS.subtitle;
  const _description = description ?? DEFAULTS.description;
  const _primary = primaryCta ?? DEFAULTS.primaryCta;
  const _secondary = secondaryCta ?? DEFAULTS.secondaryCta;
  const _video = videoSrc ?? DEFAULTS.videoSrc;

  return (
    <div
      dir={dir}
      className="relative flex h-screen flex-col justify-end pb-20"
    >
      {/* ── Background Video ──────────────────────── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute top-0 left-0 -z-10 h-full w-full object-cover"
        poster={fallbackImage}
      >
        <source src={_video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* ── Gradient Overlays ─────────────────────── */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.78)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(360deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.30)_100%)]" />

      {/* ── Content ───────────────────────────────── */}
      <div className="app z-10 flex flex-col gap-6">
        {/* Titles */}
        <div className="text-5xl font-bold">
          <h1 className="text-[#deae6d] text-7xl font-normal">{_title}</h1>
          <h2 className="text-white">{_subtitle}</h2>
        </div>

        {/* Description */}
        <p className="text-lg text-white lg:max-w-xl lg:text-2xl">
          {_description}
        </p>

        {/* CTA Buttons */}
        <div className="flex w-fit flex-col gap-4">
          <a
            className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-[#d09260]/80 px-10 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#d09260]"
            href={_primary.href}
          >
            {_primary.label}
          </a>
          <a
            className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-sm border-2 border-[#d09260] bg-transparent px-10 py-2.5 text-sm font-bold text-[#D8A77F] transition-all hover:bg-[#d09260]/10"
            href={_secondary.href}
          >
            {_secondary.label}
          </a>
        </div>
      </div>

      {/* ── Scroll Down Indicator ─────────────────── */}
      {showScrollIndicator && (
        <button
          data-slot="button"
          onClick={onScrollDown}
          className="items-center flex-col justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none hover:bg-[#e8e8e8] hover:text-[#b28966] min-h-9 p-2 px-3 w-fit absolute bottom-0 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-5 text-white lg:flex"
          aria-label="Scroll to bottom"
        >
          <ScrollDownIcon />
          <ScrollDownIcon />
        </button>
      )}
    </div>
  );
};
