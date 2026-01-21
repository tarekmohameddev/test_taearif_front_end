"use client";

export default function HalfTextHalfImageSkeleton2() {
  return (
    <section
      className="w-full bg-background px-4 py-5 sm:px-6 sm:py-20 lg:px-8"
      style={{
        backgroundColor: "transparent",
      }}
    >
      <div
        className="mx-auto grid grid-cols-1 items-center md:grid-cols-10 gap-x-10 gap-y-16 md:gap-y-10"
        style={{
          maxWidth: "1600px",
        }}
        dir="rtl"
      >
        {/* Text Section: md:col-span-5 */}
        <div className="md:col-span-5 order-2 md:order-2">
          {/* Eyebrow Text Skeleton */}
          <div className="mb-3">
            <div className="h-6 md:h-7 bg-gray-100 rounded animate-pulse w-48 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-transparent animate-shimmer"></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/40 to-transparent animate-shimmer"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>

          {/* Title Skeleton */}
          <div className="mb-6 space-y-3">
            <div className="h-10 md:h-12 lg:h-14 bg-gray-200 rounded animate-pulse w-full relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                style={{ animationDelay: "1.2s" }}
              ></div>
            </div>
            <div className="h-10 md:h-12 lg:h-14 bg-gray-200 rounded animate-pulse w-4/5 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                style={{ animationDelay: "0.3s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                style={{ animationDelay: "1.3s" }}
              ></div>
            </div>
            <div className="h-10 md:h-12 lg:h-14 bg-gray-200 rounded animate-pulse w-3/5 relative overflow-hidden">
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

          {/* Description Skeleton */}
          <div className="mb-10 max-w-3xl space-y-2">
            <div className="h-6 md:h-7 bg-gray-100 rounded animate-pulse w-full relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.5s" }}
              ></div>
            </div>
            <div className="h-6 md:h-7 bg-gray-100 rounded animate-pulse w-11/12 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.6s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.6s" }}
              ></div>
            </div>
            <div className="h-6 md:h-7 bg-gray-100 rounded animate-pulse w-5/6 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.7s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.7s" }}
              ></div>
            </div>
            <div className="h-6 md:h-7 bg-gray-100 rounded animate-pulse w-4/5 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.8s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.8s" }}
              ></div>
            </div>
          </div>

          {/* Stats Section Skeleton */}
          <div className="grid text-center grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            {/* Stat 1: +100 عميل سعيد */}
            <div>
              <div className="h-7 md:h-8 bg-gray-100 rounded animate-pulse w-16 mx-auto relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-transparent animate-shimmer"
                  style={{ animationDelay: "0.9s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/40 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.9s" }}
                ></div>
              </div>
              <div className="mt-1">
                <div className="h-5 md:h-6 bg-gray-200 rounded animate-pulse w-20 mx-auto relative overflow-hidden">
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
            </div>

            {/* Stat 2: +50 عقار تم بيعه */}
            <div>
              <div className="h-7 md:h-8 bg-gray-100 rounded animate-pulse w-12 mx-auto relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.1s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/40 to-transparent animate-shimmer"
                  style={{ animationDelay: "2.1s" }}
                ></div>
              </div>
              <div className="mt-1">
                <div className="h-5 md:h-6 bg-gray-200 rounded animate-pulse w-24 mx-auto relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                    style={{ animationDelay: "1.2s" }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                    style={{ animationDelay: "2.2s" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Stat 3: +250 عقار تم تأجيره */}
            <div>
              <div className="h-7 md:h-8 bg-gray-100 rounded animate-pulse w-16 mx-auto relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.3s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/40 to-transparent animate-shimmer"
                  style={{ animationDelay: "2.3s" }}
                ></div>
              </div>
              <div className="mt-1">
                <div className="h-5 md:h-6 bg-gray-200 rounded animate-pulse w-28 mx-auto relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                    style={{ animationDelay: "1.4s" }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                    style={{ animationDelay: "2.4s" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Stat 4: 40 تقييمات العملاء */}
            <div>
              <div className="h-7 md:h-8 bg-gray-100 rounded animate-pulse w-8 mx-auto relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.5s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/40 to-transparent animate-shimmer"
                  style={{ animationDelay: "2.5s" }}
                ></div>
              </div>
              <div className="mt-1">
                <div className="h-5 md:h-6 bg-gray-200 rounded animate-pulse w-24 mx-auto relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                    style={{ animationDelay: "1.6s" }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                    style={{ animationDelay: "2.6s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Section: md:col-span-5 */}
        <div className="md:col-span-5 order-2 md:order-2">
          <figure className="relative flex-1 pr-[15px] xl:pr-[21px] pb-[15px] xl:pb-[21px] bg-gray-600 rounded-[10px]">
            {/* Background Shape Shimmer */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/30 to-transparent animate-shimmer rounded-[10px]"
              style={{ animationDelay: "1.7s" }}
            ></div>
            <div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-500/20 to-transparent animate-shimmer rounded-[10px]"
              style={{ animationDelay: "2.7s" }}
            ></div>

            {/* Main Image Skeleton */}
            <div
              className="w-full h-full bg-gray-200 rounded-[15px] animate-pulse relative overflow-hidden"
              style={{ aspectRatio: "800/600" }}
            >
              {/* Background Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.8s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/30 to-transparent animate-shimmer"
                  style={{ animationDelay: "2.8s" }}
                ></div>
              </div>

              {/* Image Placeholder Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-300 rounded-full animate-pulse relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/50 to-transparent animate-shimmer"
                    style={{ animationDelay: "1.9s" }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/30 to-transparent animate-shimmer"
                    style={{ animationDelay: "2.9s" }}
                  ></div>
                </div>
              </div>

              {/* Corner Decorative Elements */}
              <div className="absolute top-6 right-6 w-10 h-10 bg-gray-300 rounded-full animate-pulse opacity-30"></div>
              <div className="absolute bottom-6 left-6 w-8 h-8 bg-gray-300 rounded-full animate-pulse opacity-40"></div>
              <div className="absolute top-1/3 left-12 w-6 h-6 bg-gray-300 rounded-full animate-pulse opacity-25"></div>
              <div className="absolute bottom-1/3 right-12 w-7 h-7 bg-gray-300 rounded-full animate-pulse opacity-35"></div>

              {/* Additional decorative elements for modern look */}
              <div className="absolute top-1/2 left-6 w-4 h-4 bg-gray-300 rounded-full animate-pulse opacity-20"></div>
              <div className="absolute top-20 right-20 w-5 h-5 bg-gray-300 rounded-full animate-pulse opacity-30"></div>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
