"use client";

export default function CtaValuationSkeleton1() {
  return (
    <section className="w-full bg-background py-14 sm:py-16 animate-pulse">
      {/* Enhanced Background Shimmer Effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
        <div
          className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent animate-shimmer"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="mx-auto w-full max-w-9xl px-4 relative z-10">
          {/* المستطيل الأخضر داخل القسم - Green Rectangle Container */}
          <div className="mx-auto max-w-7xl rounded-2xl px-6 py-10 shadow-md sm:px-10 sm:py-12 bg-gray-200 relative overflow-hidden">
            {/* Enhanced Gray Background Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-shimmer"></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>

            <div
              className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 relative z-10"
              dir="rtl"
            >
              {/* الصورة - Image Section (Left on Desktop, Order 1) */}
              <div className="order-1 mx-auto md:order-1 md:col-span-5 md:justify-self-start w-32 md:w-[20rem] lg:w-[20rem]">
                {/* Image Container Skeleton */}
                <div
                  className="w-full bg-white/20 rounded-lg animate-pulse relative overflow-hidden"
                  style={{ aspectRatio: "2/1" }}
                >
                  {/* Image Background Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/20">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.2s" }}
                    ></div>
                  </div>

                  {/* House Icon Simulation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white/30 rounded-lg animate-pulse relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* النص والزر - Text and Button Section (Right on Desktop, Order 2) */}
              <div className="order-2 text-center md:order-2 md:col-span-7 md:text-center">
                {/* Title Skeleton - "تقييم عقارك" */}
                <div className="mb-4">
                  <div className="h-6 md:h-8 bg-white/25 rounded animate-pulse mx-auto w-32 md:w-40 relative overflow-hidden">
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

                {/* Description 1 Skeleton - Long description text */}
                <div className="mb-2 space-y-2">
                  {/* First line of description */}
                  <div className="h-5 md:h-6 bg-white/20 rounded animate-pulse mx-auto w-full max-w-md relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-white/25 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.5s" }}
                    ></div>
                  </div>

                  {/* Second line of description */}
                  <div className="h-5 md:h-6 bg-white/20 rounded animate-pulse mx-auto w-4/5 max-w-sm relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"
                      style={{ animationDelay: "0.6s" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-white/25 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.6s" }}
                    ></div>
                  </div>
                </div>

                {/* Description 2 Skeleton - "بأفضل طريقة" */}
                <div className="mb-6">
                  <div className="h-5 md:h-6 bg-white/20 rounded animate-pulse mx-auto w-24 md:w-32 relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"
                      style={{ animationDelay: "0.7s" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-white/25 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.7s" }}
                    ></div>
                  </div>
                </div>

                {/* Button Skeleton - "طلب معاينة" */}
                <div className="mt-6">
                  <div className="inline-block bg-white/90 rounded-xl px-6 py-5 animate-pulse relative overflow-hidden">
                    {/* Button Background Shimmer */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"
                      style={{ animationDelay: "0.8s" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.8s" }}
                    ></div>

                    {/* Button Text Skeleton */}
                    <div className="h-4 md:h-5 bg-gray-200 rounded animate-pulse w-20 md:w-24 relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                        style={{ animationDelay: "0.9s" }}
                      ></div>
                      <div
                        className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                        style={{ animationDelay: "1.9s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
