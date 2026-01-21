"use client";

export default function PropertySliderSkeleton1() {
  return (
    <section
      className="w-full bg-background py-14 sm:py-16"
      style={{
        paddingTop: "56px",
        paddingBottom: "56px",
      }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: "1600px",
        }}
      >
        {/* Header Section Skeleton */}
        <div className="mb-6 px-5" dir="rtl" style={{ marginBottom: "24px" }}>
          {/* Mobile Layout - Title and Button */}
          <div className="flex items-center justify-between md:hidden">
            {/* Mobile Title Skeleton */}
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>

            {/* Mobile View All Button Skeleton */}
            <div className="h-4 bg-gray-100 rounded animate-pulse w-16 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-transparent animate-shimmer"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/40 to-transparent animate-shimmer"
                style={{ animationDelay: "1.2s" }}
              ></div>
            </div>
          </div>

          {/* Desktop Layout - Title, Description and Button */}
          <div className="hidden md:flex items-end justify-between">
            <div>
              {/* Desktop Title Skeleton */}
              <div className="mb-2">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-64 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                    style={{ animationDelay: "1s" }}
                  ></div>
                </div>
              </div>

              {/* Desktop Description Skeleton */}
              <div className="space-y-1">
                <div className="h-5 bg-gray-100 rounded animate-pulse w-80 relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                    style={{ animationDelay: "0.3s" }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                    style={{ animationDelay: "1.3s" }}
                  ></div>
                </div>
                <div className="h-5 bg-gray-100 rounded animate-pulse w-72 relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                    style={{ animationDelay: "1.4s" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Desktop View All Button Skeleton */}
            <div className="h-4 bg-gray-100 rounded animate-pulse w-16 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-transparent animate-shimmer"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/40 to-transparent animate-shimmer"
                style={{ animationDelay: "1.5s" }}
              ></div>
            </div>
          </div>

          {/* Mobile Description Skeleton */}
          <div className="md:hidden mt-2 space-y-1">
            <div className="h-4 bg-gray-100 rounded animate-pulse w-full relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.6s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.6s" }}
              ></div>
            </div>
            <div className="h-4 bg-gray-100 rounded animate-pulse w-4/5 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.7s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.7s" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Property Slider Skeleton */}
        <div className="">
          {/* Swiper Container Skeleton */}
          <div className="overflow-hidden">
            <div className="flex gap-4 px-5">
              {/* Generate 4 property card skeletons for desktop view */}
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4"
                  style={{ height: "420px" }}
                >
                  <div className="h-full w-full">
                    {/* Property Image Skeleton */}
                    <div
                      className="relative w-full bg-gray-200 rounded-xl animate-pulse overflow-hidden"
                      style={{ aspectRatio: "16 / 10" }}
                    >
                      {/* Background Shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-shimmer"
                          style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                        ></div>
                        <div
                          className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/30 to-transparent animate-shimmer"
                          style={{ animationDelay: `${1.8 + index * 0.1}s` }}
                        ></div>
                      </div>

                      {/* Top Right Badge Skeleton (Bedrooms & Views) */}
                      <div className="absolute right-3 top-3 flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 shadow-sm">
                        {/* Bedroom Icon + Number */}
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse relative overflow-hidden">
                            <div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                              style={{
                                animationDelay: `${0.9 + index * 0.1}s`,
                              }}
                            ></div>
                          </div>
                          <div className="h-4 w-3 bg-gray-200 rounded animate-pulse relative overflow-hidden">
                            <div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                              style={{
                                animationDelay: `${1.0 + index * 0.1}s`,
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Views Number + Icon */}
                        <div className="flex items-center gap-1">
                          <div className="h-4 w-6 bg-gray-200 rounded animate-pulse relative overflow-hidden">
                            <div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                              style={{
                                animationDelay: `${1.1 + index * 0.1}s`,
                              }}
                            ></div>
                          </div>
                          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse relative overflow-hidden">
                            <div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                              style={{
                                animationDelay: `${1.2 + index * 0.1}s`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Property Content Skeleton */}
                    <div className="mt-4 space-y-3" dir="rtl">
                      {/* Property Title Skeleton */}
                      <div className="space-y-2">
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-full relative overflow-hidden">
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                            style={{ animationDelay: `${1.3 + index * 0.1}s` }}
                          ></div>
                          <div
                            className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                            style={{ animationDelay: `${2.3 + index * 0.1}s` }}
                          ></div>
                        </div>
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4 relative overflow-hidden">
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                            style={{ animationDelay: `${1.4 + index * 0.1}s` }}
                          ></div>
                          <div
                            className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                            style={{ animationDelay: `${2.4 + index * 0.1}s` }}
                          ></div>
                        </div>
                      </div>

                      {/* District Skeleton */}
                      <div className="space-y-1">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-5/6 relative overflow-hidden">
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                            style={{ animationDelay: `${1.5 + index * 0.1}s` }}
                          ></div>
                          <div
                            className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                            style={{ animationDelay: `${2.5 + index * 0.1}s` }}
                          ></div>
                        </div>
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-4/6 relative overflow-hidden">
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                            style={{ animationDelay: `${1.6 + index * 0.1}s` }}
                          ></div>
                          <div
                            className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                            style={{ animationDelay: `${2.6 + index * 0.1}s` }}
                          ></div>
                        </div>
                      </div>

                      {/* Price and Details Button Skeleton */}
                      <div className="flex items-center justify-between">
                        {/* Price Skeleton */}
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-24 relative overflow-hidden">
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                            style={{ animationDelay: `${1.7 + index * 0.1}s` }}
                          ></div>
                          <div
                            className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                            style={{ animationDelay: `${2.7 + index * 0.1}s` }}
                          ></div>
                        </div>

                        {/* Details Button Skeleton */}
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-12 relative overflow-hidden">
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-transparent animate-shimmer"
                            style={{ animationDelay: `${1.8 + index * 0.1}s` }}
                          ></div>
                          <div
                            className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/40 to-transparent animate-shimmer"
                            style={{ animationDelay: `${2.8 + index * 0.1}s` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Swiper Navigation Dots Skeleton */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full animate-pulse ${
                  index === 0 ? "bg-gray-300" : "bg-gray-300"
                }`}
                style={{ animationDelay: `${3.0 + index * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
