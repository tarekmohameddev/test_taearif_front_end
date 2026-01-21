"use client";

export default function HalfTextHalfImageSkeleton3() {
  return (
    <div
      className="py-[24px] lg:py-[52px] max-w-[1600px] mx-auto px-4 sm:px-0"
      dir="rtl"
    >
      <div className="flex flex-col gap-[12px] md:gap-x-[30px] lg:gap-x-[74px] md:flex-row-reverse">
        {/* Text Section: md:flex-[.6] xl:flex-[.72] */}
        <div className="md:flex-[.6] xl:flex-[.72] flex flex-col justify-center order-2 md:order-1">
          {/* Title Skeleton */}
          <div className="relative w-fit mb-4">
            <div className="h-10 md:h-12 lg:h-14 xl:h-16 bg-gray-200 rounded animate-pulse w-32 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>

          {/* Description Skeleton */}
          <div className="mb-4 md:mb-10 md:flex-grow space-y-3">
            <div className="h-4 md:h-5 xl:h-6 bg-gray-100 rounded animate-pulse w-full relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.2s" }}
              ></div>
            </div>
            <div className="h-4 md:h-5 xl:h-6 bg-gray-100 rounded animate-pulse w-11/12 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.3s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.3s" }}
              ></div>
            </div>
            <div className="h-4 md:h-5 xl:h-6 bg-gray-100 rounded animate-pulse w-full relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.4s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.4s" }}
              ></div>
            </div>
            <div className="h-4 md:h-5 xl:h-6 bg-gray-100 rounded animate-pulse w-5/6 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.5s" }}
              ></div>
            </div>
            <div className="h-4 md:h-5 xl:h-6 bg-gray-100 rounded animate-pulse w-4/5 relative overflow-hidden">
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
            <div className="h-4 md:h-5 xl:h-6 bg-gray-100 rounded animate-pulse w-3/4 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.8s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.8s" }}
              ></div>
            </div>
            <div className="h-4 md:h-5 xl:h-6 bg-gray-100 rounded animate-pulse w-5/6 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.9s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.9s" }}
              ></div>
            </div>
            <div className="h-4 md:h-5 xl:h-6 bg-gray-100 rounded animate-pulse w-4/5 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                style={{ animationDelay: "1.0s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                style={{ animationDelay: "2.0s" }}
              ></div>
            </div>
          </div>

          {/* Button Skeleton (Optional - shown as enabled) */}
          <div className="transition-colors duration-300 flex items-center justify-center w-[119px] md:w-[148px] h-[46px] md:h-[52px] rounded-[10px] bg-gray-200 animate-pulse relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
              style={{ animationDelay: "1.1s" }}
            ></div>
            <div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
              style={{ animationDelay: "2.1s" }}
            ></div>
          </div>
        </div>

        {/* Image Section: md:flex-[.4] xl:flex-[.28] */}
        <figure
          dir="rtl"
          className="w-full sm:w-[50%] mx-auto order-1 md:order-2 mb-[12px] md:mb-[0] md:flex-[.4] xl:flex-[.28] relative md:w-full h-[207px] md:h-[246px]"
        >
          {/* Background Shape Skeleton */}
          <div className="absolute top-0 left-0 h-full overflow-hidden z-0 rounded-[5px] w-[54%] md:w-1/2 bg-gray-600 animate-pulse">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/30 to-transparent animate-shimmer"
              style={{ animationDelay: "1.2s" }}
            ></div>
            <div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-500/20 to-transparent animate-shimmer"
              style={{ animationDelay: "2.2s" }}
            ></div>
          </div>

          {/* Main Image Skeleton */}
          <div className="w-full h-full bg-gray-200 rounded-[5px] animate-pulse relative overflow-hidden">
            {/* Background Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-shimmer"
                style={{ animationDelay: "1.3s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/30 to-transparent animate-shimmer"
                style={{ animationDelay: "2.3s" }}
              ></div>
            </div>

            {/* Image Placeholder Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-300 rounded-full animate-pulse relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/50 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.4s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/30 to-transparent animate-shimmer"
                  style={{ animationDelay: "2.4s" }}
                ></div>
              </div>
            </div>

            {/* Corner Decorative Elements */}
            <div className="absolute top-4 right-4 w-6 h-6 bg-gray-300 rounded-full animate-pulse opacity-30"></div>
            <div className="absolute bottom-4 left-4 w-5 h-5 bg-gray-300 rounded-full animate-pulse opacity-40"></div>
            <div className="absolute top-1/3 left-6 w-4 h-4 bg-gray-300 rounded-full animate-pulse opacity-25"></div>
            <div className="absolute bottom-1/3 right-6 w-7 h-7 bg-gray-300 rounded-full animate-pulse opacity-35"></div>

            {/* Additional subtle elements */}
            <div className="absolute top-1/2 left-4 w-3 h-3 bg-gray-300 rounded-full animate-pulse opacity-20"></div>
            <div className="absolute top-16 right-12 w-4 h-4 bg-gray-300 rounded-full animate-pulse opacity-30"></div>
          </div>

          {/* Overlay Skeleton */}
          <div className="absolute inset-0 bg-black opacity-20 rounded-[5px]"></div>
        </figure>
      </div>
    </div>
  );
}
