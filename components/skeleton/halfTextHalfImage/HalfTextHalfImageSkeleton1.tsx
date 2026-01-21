"use client";

function HalfTextHalfImageSkeleton1() {
  return (
    <section
      className="mx-auto max-w-[1600px] px-4"
      style={{
        paddingTop: "48px", // 12 * 4px = 48px
        paddingBottom: "24px", // 6 * 4px = 24px
      }}
      dir="rtl"
    >
      <div className="flex flex-col md:flex-row w-full gap-x-16 md:min-h-[369px]">
        {/* Text Section: 52.8% على الديسكتوب */}
        <div className="md:py-12 relative w-full flex flex-col items-start order-2 md:order-1 md:w-[52.8%]">
          <div className="flex flex-col w-full">
            {/* Eyebrow Text Skeleton */}
            <div className="mb-2">
              <div className="h-4 md:h-5 xl:h-6 bg-gray-100 rounded animate-pulse w-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>

            {/* Title Skeleton */}
            <div className="mb-3 md:mb-6 space-y-2">
              <div className="h-8 md:h-10 lg:h-12 xl:h-14 bg-gray-200 rounded animate-pulse w-full relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.2s" }}
                ></div>
              </div>
              <div className="h-8 md:h-10 lg:h-12 xl:h-14 bg-gray-200 rounded animate-pulse w-5/6 relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                  style={{ animationDelay: "0.3s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.3s" }}
                ></div>
              </div>
              <div className="h-8 md:h-10 lg:h-12 xl:h-14 bg-gray-200 rounded animate-pulse w-4/5 relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                  style={{ animationDelay: "0.4s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.4s" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Description Skeleton */}
          <div className="mb-4 md:mb-10 md:flex-grow w-full space-y-2">
            <div className="h-4 md:h-5 xl:h-6 bg-gray-100 rounded animate-pulse w-full relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.5s" }}
              ></div>
            </div>
            <div className="h-4 md:h-5 xl:h-6 bg-gray-100 rounded animate-pulse w-11/12 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.6s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.6s" }}
              ></div>
            </div>
            <div className="h-4 md:h-5 xl:h-6 bg-gray-100 rounded animate-pulse w-full relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.7s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.7s" }}
              ></div>
            </div>
            <div className="h-4 md:h-5 xl:h-6 bg-gray-100 rounded animate-pulse w-4/5 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.8s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.8s" }}
              ></div>
            </div>
            <div className="h-4 md:h-5 xl:h-6 bg-gray-100 rounded animate-pulse w-3/4 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.9s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.9s" }}
              ></div>
            </div>
          </div>

          {/* Button Skeleton */}
          <div
            className="bg-gray-200 rounded-lg animate-pulse flex items-center justify-center relative overflow-hidden"
            style={{
              width: "119px",
              height: "46px",
              borderRadius: "10px",
            }}
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
              style={{ animationDelay: "1.0s" }}
            ></div>
            <div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
              style={{ animationDelay: "2.0s" }}
            ></div>
          </div>
        </div>

        {/* Image Section: 47.2% على الديسكتوب */}
        <div className="relative mb-10 md:mb-0 order-1 md:order-2 md:w-[47.2%]">
          {/* Background Shape Skeleton (if enabled) */}
          <div className="absolute top-0 left-0 h-full rounded-[5px] overflow-hidden z-0 w-full bg-gray-100 animate-pulse">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/40 to-transparent animate-shimmer"
              style={{ animationDelay: "1.1s" }}
            ></div>
            <div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
              style={{ animationDelay: "2.1s" }}
            ></div>
          </div>

          {/* Main Image Skeleton */}
          <figure className="relative z-10 w-full aspect-[800/500]">
            <div className="w-full h-full bg-gray-200 rounded animate-pulse relative overflow-hidden">
              {/* Background Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.2s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/30 to-transparent animate-shimmer"
                  style={{ animationDelay: "2.2s" }}
                ></div>
              </div>

              {/* Image Placeholder Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-300 rounded-full animate-pulse relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/50 to-transparent animate-shimmer"
                    style={{ animationDelay: "1.3s" }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/30 to-transparent animate-shimmer"
                    style={{ animationDelay: "2.3s" }}
                  ></div>
                </div>
              </div>

              {/* Corner Decorative Elements */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-gray-300 rounded-full animate-pulse opacity-30"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-gray-300 rounded-full animate-pulse opacity-40"></div>
              <div className="absolute top-1/3 left-8 w-4 h-4 bg-gray-300 rounded-full animate-pulse opacity-20"></div>
              <div className="absolute bottom-1/3 right-8 w-5 h-5 bg-gray-300 rounded-full animate-pulse opacity-35"></div>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}

export default HalfTextHalfImageSkeleton1;
