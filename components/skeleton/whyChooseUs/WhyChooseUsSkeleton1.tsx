"use client";

export default function WhyChooseUsSkeleton1() {
  return (
    <section
      className="w-full bg-background"
      style={{
        backgroundColor: "#ffffff", // Default background
        paddingTop: "py-14",
        paddingBottom: "sm:py-16",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: "1600px" }} dir="rtl">
        {/* Header Section */}
        <header className="mb-10 text-right px-5">
          {/* Title Skeleton */}
          <div className="mb-4">
            <div className="h-8 md:h-10 lg:h-12 bg-gray-200 rounded animate-pulse w-40 relative overflow-hidden">
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
            <div className="h-5 md:h-6 bg-gray-100 rounded animate-pulse w-4/5 max-w-xl relative overflow-hidden">
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

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 px-4">
          {/* Generate 6 feature skeletons */}
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <FeatureCardSkeleton key={index} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Individual Feature Card Skeleton Component
function FeatureCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <article className="rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-gray-50">
      {/* Icon Container Skeleton */}
      <div className="mx-auto flex size-20 items-center justify-center mb-6">
        <div className="h-[7rem] w-[7rem] bg-gray-50 rounded-2xl animate-pulse relative overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/60 to-transparent animate-shimmer"
            style={{ animationDelay: `${delay + 0.4}s` }}
          ></div>
          <div
            className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-50/40 to-transparent animate-shimmer"
            style={{ animationDelay: `${delay + 1.4}s` }}
          ></div>

          {/* Icon Shape Placeholder */}
          <div className="absolute inset-4 bg-gray-100 rounded-xl animate-pulse opacity-60">
            <div className="absolute inset-2 bg-gray-200 rounded-lg animate-pulse opacity-50">
              <div className="absolute inset-1 bg-gray-300 rounded animate-pulse opacity-40"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Title Skeleton */}
      <div className="text-center mb-3">
        <div className="h-5 md:h-6 bg-gray-100 rounded animate-pulse w-32 mx-auto relative overflow-hidden">
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
      <div className="text-center space-y-2">
        <div className="h-4 md:h-5 bg-gray-100 rounded animate-pulse w-full relative overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
            style={{ animationDelay: `${delay + 0.6}s` }}
          ></div>
          <div
            className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
            style={{ animationDelay: `${delay + 1.6}s` }}
          ></div>
        </div>
        <div className="h-4 md:h-5 bg-gray-100 rounded animate-pulse w-11/12 mx-auto relative overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
            style={{ animationDelay: `${delay + 0.7}s` }}
          ></div>
          <div
            className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
            style={{ animationDelay: `${delay + 1.7}s` }}
          ></div>
        </div>
        <div className="h-4 md:h-5 bg-gray-100 rounded animate-pulse w-4/5 mx-auto relative overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
            style={{ animationDelay: `${delay + 0.8}s` }}
          ></div>
          <div
            className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
            style={{ animationDelay: `${delay + 1.8}s` }}
          ></div>
        </div>
        <div className="h-4 md:h-5 bg-gray-100 rounded animate-pulse w-5/6 mx-auto relative overflow-hidden">
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
    </article>
  );
}
