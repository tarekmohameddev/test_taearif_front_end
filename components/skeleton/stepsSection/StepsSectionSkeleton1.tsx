"use client";

export default function StepsSectionSkeleton1() {
  return (
    <section className="w-full bg-background sm:py-16">
      <div
        className="mx-auto p-5 sm:p-18 px-20"
        dir="rtl"
        style={{
          backgroundColor: "#f9fafb", // Default background color
          paddingTop: "72px",
          paddingBottom: "72px",
        }}
      >
        {/* Header Section */}
        <header className="mb-10">
          {/* Title Skeleton */}
          <div className="mb-4">
            <div className="h-8 md:h-10 lg:h-12 bg-gray-200 rounded animate-pulse w-64 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2">
            <div className="h-5 md:h-6 bg-gray-100 rounded animate-pulse w-full max-w-2xl relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.2s" }}
              ></div>
            </div>
            <div className="h-5 md:h-6 bg-gray-100 rounded animate-pulse w-3/4 max-w-xl relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.3s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.3s" }}
              ></div>
            </div>
          </div>
        </header>

        {/* Steps Grid */}
        <div
          className="grid gap-x-10 gap-y-10 sm:gap-y-12"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)", // Default 3 columns
            gap: "40px 40px", // Default gaps
          }}
        >
          {/* Generate 6 step skeletons */}
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <StepItemSkeleton key={index} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Individual Step Item Skeleton Component
function StepItemSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div className="flex items-start gap-4">
      {/* Icon/Image Skeleton */}
      <div className="mt-1 shrink-0">
        <div className="size-10 sm:size-15 bg-gray-100 rounded animate-pulse relative overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-transparent animate-shimmer"
            style={{ animationDelay: `${delay + 0.4}s` }}
          ></div>
          <div
            className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/40 to-transparent animate-shimmer"
            style={{ animationDelay: `${delay + 1.4}s` }}
          ></div>

          {/* Icon Shape Placeholder */}
          <div className="absolute inset-2 bg-gray-200 rounded-sm animate-pulse opacity-60">
            <div className="absolute inset-1 bg-gray-300 rounded-xs animate-pulse opacity-40"></div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1">
        {/* Title Skeleton */}
        <div className="mb-2 sm:mb-3">
          <div className="h-5 sm:h-6 bg-gray-100 rounded animate-pulse w-full relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-transparent animate-shimmer"
              style={{ animationDelay: `${delay + 0.5}s` }}
            ></div>
            <div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/40 to-transparent animate-shimmer"
              style={{ animationDelay: `${delay + 1.5}s` }}
            ></div>
          </div>
        </div>

        {/* Description Skeleton (Multiple lines) */}
        <div className="space-y-2">
          <div className="h-3 sm:h-4 bg-gray-100 rounded animate-pulse w-full relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
              style={{ animationDelay: `${delay + 0.6}s` }}
            ></div>
            <div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
              style={{ animationDelay: `${delay + 1.6}s` }}
            ></div>
          </div>
          <div className="h-3 sm:h-4 bg-gray-100 rounded animate-pulse w-11/12 relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
              style={{ animationDelay: `${delay + 0.7}s` }}
            ></div>
            <div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
              style={{ animationDelay: `${delay + 1.7}s` }}
            ></div>
          </div>
          <div className="h-3 sm:h-4 bg-gray-100 rounded animate-pulse w-4/5 relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
              style={{ animationDelay: `${delay + 0.8}s` }}
            ></div>
            <div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
              style={{ animationDelay: `${delay + 1.8}s` }}
            ></div>
          </div>
          <div className="h-3 sm:h-4 bg-gray-100 rounded animate-pulse w-5/6 relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
              style={{ animationDelay: `${delay + 0.9}s` }}
            ></div>
            <div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
              style={{ animationDelay: `${delay + 1.9}s` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
