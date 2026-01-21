"use client";

export default function ContactCardsSkeleton1() {
  return (
    <div
      className="py-[48px] md:py-[104px] px-4 sm:px-10 animate-pulse"
      dir="rtl"
    >
      {/* Enhanced Background Shimmer Effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
        <div
          className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent animate-shimmer"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] rounded-[10px] relative z-10">
          {/* Contact Card 1 - Address */}
          <div
            className="w-full flex flex-col items-center justify-center h-[182px] md:h-[210px] gap-y-[16px] bg-white rounded-lg relative overflow-hidden"
            style={{ boxShadow: "rgba(9, 46, 114, 0.32) 0px 2px 16px 0px" }}
          >
            {/* Card Background Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/40 to-transparent animate-shimmer"></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-50/20 to-transparent animate-shimmer"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center gap-y-[16px]">
              {/* Icon Skeleton */}
              <div className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] bg-gray-200 rounded-lg animate-pulse relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.2s" }}
                ></div>
              </div>

              {/* Content Container */}
              <div className="flex flex-col items-center justify-center gap-y-[8px] md:gap-y-[16px]">
                {/* Title Skeleton - "العنوان" */}
                <div className="h-4 md:h-6 bg-gray-200 rounded animate-pulse w-16 md:w-20 relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                    style={{ animationDelay: "0.3s" }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                    style={{ animationDelay: "1.3s" }}
                  ></div>
                </div>

                {/* Address Text Skeleton */}
                <div className="space-y-1 text-center">
                  <div className="h-4 md:h-5 bg-gray-100 rounded animate-pulse w-48 md:w-56 relative overflow-hidden">
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
            </div>
          </div>

          {/* Contact Card 2 - Email */}
          <div
            className="w-full flex flex-col items-center justify-center h-[182px] md:h-[210px] gap-y-[16px] bg-white rounded-lg relative overflow-hidden"
            style={{ boxShadow: "rgba(9, 46, 114, 0.32) 0px 2px 16px 0px" }}
          >
            {/* Card Background Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/40 to-transparent animate-shimmer"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-50/20 to-transparent animate-shimmer"
                style={{ animationDelay: "1.1s" }}
              ></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center gap-y-[16px]">
              {/* Icon Skeleton */}
              <div className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] bg-gray-200 rounded-lg animate-pulse relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.5s" }}
                ></div>
              </div>

              {/* Content Container */}
              <div className="flex flex-col items-center justify-center gap-y-[8px] md:gap-y-[16px]">
                {/* Title Skeleton - "الايميل" */}
                <div className="h-4 md:h-6 bg-gray-200 rounded animate-pulse w-14 md:w-18 relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                    style={{ animationDelay: "0.6s" }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                    style={{ animationDelay: "1.6s" }}
                  ></div>
                </div>

                {/* Email Link Skeleton */}
                <div className="space-y-1 text-center">
                  <div className="h-4 md:h-5 bg-gray-100 rounded animate-pulse w-44 md:w-52 relative overflow-hidden">
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
            </div>
          </div>

          {/* Contact Card 3 - Phone */}
          <div
            className="w-full flex flex-col items-center justify-center h-[182px] md:h-[210px] gap-y-[16px] bg-white rounded-lg relative overflow-hidden"
            style={{ boxShadow: "rgba(9, 46, 114, 0.32) 0px 2px 16px 0px" }}
          >
            {/* Card Background Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/40 to-transparent animate-shimmer"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-50/20 to-transparent animate-shimmer"
                style={{ animationDelay: "1.2s" }}
              ></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center gap-y-[16px]">
              {/* Icon Skeleton */}
              <div className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] bg-gray-200 rounded-lg animate-pulse relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                  style={{ animationDelay: "0.8s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.8s" }}
                ></div>
              </div>

              {/* Content Container */}
              <div className="flex flex-col items-center justify-center gap-y-[8px] md:gap-y-[16px]">
                {/* Title Skeleton - "الجوال" */}
                <div className="h-4 md:h-6 bg-gray-200 rounded animate-pulse w-12 md:w-16 relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                    style={{ animationDelay: "0.9s" }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                    style={{ animationDelay: "1.9s" }}
                  ></div>
                </div>

                {/* Phone Links Skeleton */}
                <div className="flex flex-row items-between justify-between w-full gap-x-[50px]">
                  {/* Phone Number 1 */}
                  <div className="h-4 md:h-5 bg-gray-100 rounded animate-pulse w-20 md:w-24 relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.0s" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                      style={{ animationDelay: "2.0s" }}
                    ></div>
                  </div>

                  {/* Phone Number 2 */}
                  <div className="h-4 md:h-5 bg-gray-100 rounded animate-pulse w-20 md:w-24 relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.1s" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                      style={{ animationDelay: "2.1s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
