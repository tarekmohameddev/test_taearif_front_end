"use client";

export default function TestimonialsSkeleton1() {
  return (
    <section className="w-full bg-background py-14 sm:py-16">
      <div className="w-full" dir="rtl">
        {/* Header Section */}
        <header className="mb-8 text-center md:text-right mx-auto px-5 sm:px-26">
          {/* Title Skeleton */}
          <div className="mb-4">
            <div className="h-8 md:h-10 lg:h-12 bg-gray-200 rounded animate-pulse w-40 mx-auto md:mx-0 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2">
            <div className="h-5 md:h-6 bg-gray-100 rounded animate-pulse w-full max-w-2xl mx-auto md:mx-0 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.2s" }}
              ></div>
            </div>
            <div className="h-5 md:h-6 bg-gray-100 rounded animate-pulse w-4/5 max-w-xl mx-auto md:mx-0 relative overflow-hidden">
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

        {/* Testimonials Carousel Skeleton */}
        <div className="testimonials-swiper">
          {/* Desktop View: 3 Cards */}
          <div className="hidden md:grid md:grid-cols-3 gap-5 px-4">
            {[1, 2, 3].map((index) => (
              <div key={index} className="h-[240px] lg:h-[260px] w-full">
                <TestimonialCardSkeleton delay={index * 0.2} />
              </div>
            ))}
          </div>

          {/* Mobile/Tablet View: Single Card with Carousel Indicators */}
          <div className="block md:hidden px-4">
            <div className="h-[260px] sm:h-[220px] w-full mb-12">
              <TestimonialCardSkeleton delay={0} />
            </div>

            {/* Pagination Dots Skeleton */}
            <div className="flex justify-center items-center gap-2 mt-8">
              <div className="w-8 h-3 bg-gray-200 rounded-md animate-pulse relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.5s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                  style={{ animationDelay: "2.5s" }}
                ></div>
              </div>
              <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.6s" }}
                ></div>
              </div>
              <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.7s" }}
                ></div>
              </div>
              <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.8s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Individual Testimonial Card Skeleton Component
function TestimonialCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      {/* Card Container */}
      <div className="relative flex w-full max-w-xl flex-col rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-black/5 h-[200px]">
        {/* Quote Icon Skeleton */}
        <div className="absolute h-[27px] w-[34px] z-20 top-[-15px] left-0 flex justify-center items-center bg-gray-100 rounded animate-pulse relative overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-transparent animate-shimmer"
            style={{ animationDelay: `${delay + 0.4}s` }}
          ></div>
          <div
            className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/40 to-transparent animate-shimmer"
            style={{ animationDelay: `${delay + 1.4}s` }}
          ></div>
        </div>

        {/* Quote Text Skeleton (3 lines max) */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-100 rounded animate-pulse w-full relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
              style={{ animationDelay: `${delay + 0.5}s` }}
            ></div>
            <div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
              style={{ animationDelay: `${delay + 1.5}s` }}
            ></div>
          </div>
          <div className="h-4 bg-gray-100 rounded animate-pulse w-11/12 relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
              style={{ animationDelay: `${delay + 0.6}s` }}
            ></div>
            <div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
              style={{ animationDelay: `${delay + 1.6}s` }}
            ></div>
          </div>
          <div className="h-4 bg-gray-100 rounded animate-pulse w-4/5 relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
              style={{ animationDelay: `${delay + 0.7}s` }}
            ></div>
            <div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
              style={{ animationDelay: `${delay + 1.7}s` }}
            ></div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-auto flex items-center justify-between pt-3">
          {/* Customer Info Skeleton */}
          <div className="text-end space-y-1">
            {/* Name */}
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                style={{ animationDelay: `${delay + 0.8}s` }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                style={{ animationDelay: `${delay + 1.8}s` }}
              ></div>
            </div>
            {/* Location */}
            <div className="h-3 bg-gray-100 rounded animate-pulse w-16 relative overflow-hidden">
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

          {/* Rating Stars Skeleton */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className={`w-3 h-3 rounded-sm animate-pulse relative overflow-hidden ${
                  star <= 4 ? "bg-gray-200" : "bg-gray-200"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-transparent to-transparent animate-shimmer ${
                    star <= 4 ? "via-gray-300/60" : "via-gray-300/50"
                  }`}
                  style={{ animationDelay: `${delay + 1.0 + star * 0.1}s` }}
                ></div>
                <div
                  className={`absolute inset-0 bg-gradient-to-l from-transparent to-transparent animate-shimmer ${
                    star <= 4 ? "via-gray-200/40" : "via-gray-200/30"
                  }`}
                  style={{ animationDelay: `${delay + 2.0 + star * 0.1}s` }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
