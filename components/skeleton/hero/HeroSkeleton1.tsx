"use client";

export default function HeroSkeleton1() {
  return (
    <section
      className="relative w-full overflow-hidden max-h-[95dvh]"
      style={{
        height: "90vh",
        minHeight: "520px",
      }}
    >
      {/* Background Image Placeholder with Ultra Smooth Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-gentle-fade">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-ultra"></div>
        <div
          className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent animate-shimmer-slow"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Lighter Overlay Placeholder */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col items-center px-4 text-center text-white">
        {/* Desktop/Tablet Layout */}
        <div className="hidden md:block" style={{ paddingTop: "200px" }}>
          {/* Title Skeleton with Enhanced Shimmer */}
          <div className="mx-auto max-w-5xl space-y-4">
            <div className="h-12 lg:h-16 bg-white/25 rounded-lg animate-breathing mx-auto w-4/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-ultra"></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-white/30 to-transparent animate-shimmer-slow"
                style={{ animationDelay: "2.5s" }}
              ></div>
            </div>
            <div className="h-12 lg:h-16 bg-white/25 rounded-lg animate-gentle-fade mx-auto w-full relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-slow"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-white/30 to-transparent animate-shimmer-ultra"
                style={{ animationDelay: "3s" }}
              ></div>
            </div>
            <div className="h-12 lg:h-16 bg-white/25 rounded-lg animate-breathing mx-auto w-3/5 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-ultra"
                style={{ animationDelay: "1.5s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-white/30 to-transparent animate-shimmer-slow"
                style={{ animationDelay: "3.5s" }}
              ></div>
            </div>
          </div>

          {/* Subtitle Skeleton with Ultra Smooth Shimmer */}
          <div className="mt-4 space-y-2">
            <div className="h-6 lg:h-8 bg-white/20 rounded-lg animate-gentle-fade mx-auto w-3/4 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer-slow"
                style={{ animationDelay: "2s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-white/25 to-transparent animate-shimmer-ultra"
                style={{ animationDelay: "4s" }}
              ></div>
            </div>
            <div className="h-6 lg:h-8 bg-white/20 rounded-lg animate-breathing mx-auto w-2/3 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer-ultra"
                style={{ animationDelay: "2.5s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-white/25 to-transparent animate-shimmer-slow"
                style={{ animationDelay: "4.5s" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col items-center justify-center h-full w-full">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            {/* Mobile Title Skeleton with Enhanced Shimmer */}
            <div className="mx-auto max-w-sm space-y-3 mb-4">
              <div className="h-8 bg-white/25 rounded-lg animate-pulse w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-white/30 to-transparent animate-shimmer"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
              <div className="h-8 bg-white/25 rounded-lg animate-pulse w-4/5 mx-auto relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-white/30 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.2s" }}
                ></div>
              </div>
              <div className="h-8 bg-white/25 rounded-lg animate-pulse w-3/5 mx-auto relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"
                  style={{ animationDelay: "0.4s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-white/30 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.4s" }}
                ></div>
              </div>
            </div>

            {/* Mobile Subtitle Skeleton with Enhanced Shimmer */}
            <div className="mb-8 space-y-2 max-w-xs">
              <div className="h-5 bg-white/20 rounded-lg animate-pulse w-full relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"
                  style={{ animationDelay: "0.6s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-white/25 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.6s" }}
                ></div>
              </div>
              <div className="h-5 bg-white/20 rounded-lg animate-pulse w-4/5 mx-auto relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"
                  style={{ animationDelay: "0.8s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-white/25 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.8s" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Mobile Search Form Skeleton */}
          <div className="w-full max-w-md px-4 pb-8">
            <div className="w-full rounded-lg bg-white p-3 shadow-2xl ring-1 ring-black/5 space-y-4">
              {/* Purpose Toggle Skeleton with Enhanced Shimmer */}
              <div className="flex justify-center">
                <div className="inline-flex overflow-hidden rounded-xl border bg-gray-50 p-1 gap-1">
                  <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/70 to-transparent animate-shimmer"></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer"
                      style={{ animationDelay: "1s" }}
                    ></div>
                  </div>
                  <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/70 to-transparent animate-shimmer"
                      style={{ animationDelay: "0.3s" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.3s" }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Mobile Form Fields with Enhanced Shimmer */}
              <div className="space-y-3">
                <div className="h-12 bg-gray-100 rounded-lg animate-pulse relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/70 to-transparent animate-shimmer"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer"
                    style={{ animationDelay: "1.1s" }}
                  ></div>
                </div>
                <div className="h-12 bg-gray-100 rounded-lg animate-pulse relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/70 to-transparent animate-shimmer"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer"
                    style={{ animationDelay: "1.2s" }}
                  ></div>
                </div>
                <div className="h-12 bg-gray-100 rounded-lg animate-pulse relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/70 to-transparent animate-shimmer"
                    style={{ animationDelay: "0.3s" }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer"
                    style={{ animationDelay: "1.3s" }}
                  ></div>
                </div>
                <div className="h-12 bg-gray-100 rounded-lg animate-pulse relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/70 to-transparent animate-shimmer"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer"
                    style={{ animationDelay: "1.4s" }}
                  ></div>
                </div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/70 to-transparent animate-shimmer"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer"
                    style={{ animationDelay: "1.5s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Search Form Skeleton */}
      <div className="pointer-events-auto absolute inset-x-0 z-10 mx-auto px-4 sm:px-6 lg:px-8 bottom-32 max-w-[1600px] hidden md:block">
        <div className="w-full rounded-lg bg-white p-2 sm:p-3 lg:p-4 shadow-2xl ring-1 ring-black/5">
          {/* Desktop Large: All in one row */}
          <div className="hidden xl:flex items-stretch gap-2">
            {/* Purpose Toggle */}
            <div className="flex items-center">
              <div className="inline-flex overflow-hidden rounded-xl border bg-gray-100 p-1">
                <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="h-12 flex-1 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-12 flex-1 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-12 flex-1 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-12 flex-1 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-12 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Desktop Medium: Two rows */}
          <div className="hidden md:block xl:hidden space-y-3">
            {/* First Row */}
            <div className="flex items-center gap-2">
              <div className="inline-flex overflow-hidden rounded-xl border bg-gray-100 p-1">
                <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="h-12 flex-1 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 flex-1 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            {/* Second Row */}
            <div className="flex items-center gap-2">
              <div className="h-12 flex-1 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 flex-1 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Tablet/Small Desktop: Stacked */}
          <div className="block md:hidden space-y-3">
            {/* Purpose Toggle */}
            <div className="flex justify-center">
              <div className="inline-flex overflow-hidden rounded-xl border bg-gray-100 p-1">
                <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
