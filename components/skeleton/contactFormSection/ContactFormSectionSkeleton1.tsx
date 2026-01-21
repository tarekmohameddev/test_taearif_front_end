"use client";

export default function ContactFormSectionSkeleton1() {
  return (
    <section
      className="container mx-auto px-4 py-8 lg:w-full sm:max-w-[1600px] animate-pulse"
      dir="rtl"
    >
      {/* Enhanced Background Shimmer Effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
        <div
          className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent animate-shimmer"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="flex flex-col md:flex-row w-full justify-between gap-[16px] relative z-10">
          {/* Social Links Section - Left Side (35%) */}
          <div className="details w-full md:w-[35%] flex flex-col items-start justify-center gap-[16px] md:gap-[10px]">
            <div className="flex flex-col gap-[2px]">
              {/* Title Skeleton - "زوروا صفحتنا على" */}
              <div className="mb-[24px]">
                <div className="h-4 md:h-6 bg-gray-200 rounded animate-pulse w-32 md:w-40 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                    style={{ animationDelay: "1s" }}
                  ></div>
                </div>
              </div>

              {/* Social Links List */}
              <div className="flex flex-col items-start gap-[8px] md:gap-[24px]">
                {/* Social Link 1 - Facebook */}
                <div className="flex items-center gap-x-[8px]">
                  {/* Icon Skeleton */}
                  <div className="w-6 h-6 bg-gray-200 rounded animate-pulse relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.2s" }}
                    ></div>
                  </div>
                  {/* Text Skeleton */}
                  <div className="h-4 md:h-5 bg-gray-200 rounded animate-pulse w-40 md:w-48 relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                      style={{ animationDelay: "0.3s" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.3s" }}
                    ></div>
                  </div>
                </div>

                {/* Social Link 2 - X (Twitter) */}
                <div className="flex items-center gap-x-[8px]">
                  {/* Icon Skeleton */}
                  <div className="w-6 h-6 bg-gray-300 rounded animate-pulse relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/60 to-transparent animate-shimmer"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.4s" }}
                    ></div>
                  </div>
                  {/* Text Skeleton */}
                  <div className="h-4 md:h-5 bg-gray-200 rounded animate-pulse w-40 md:w-48 relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.5s" }}
                    ></div>
                  </div>
                </div>

                {/* Social Link 3 - Instagram */}
                <div className="flex items-center gap-x-[8px]">
                  {/* Icon Skeleton */}
                  <div className="w-6 h-6 bg-gray-200 rounded animate-pulse relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                      style={{ animationDelay: "0.6s" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.6s" }}
                    ></div>
                  </div>
                  {/* Text Skeleton */}
                  <div className="h-4 md:h-5 bg-gray-200 rounded animate-pulse w-40 md:w-48 relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                      style={{ animationDelay: "0.7s" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.7s" }}
                    ></div>
                  </div>
                </div>

                {/* Social Link 4 - LinkedIn */}
                <div className="flex items-center gap-x-[8px]">
                  {/* Icon Skeleton */}
                  <div className="w-6 h-6 bg-gray-300 rounded animate-pulse relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/60 to-transparent animate-shimmer"
                      style={{ animationDelay: "0.8s" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.8s" }}
                    ></div>
                  </div>
                  {/* Text Skeleton */}
                  <div className="h-4 md:h-5 bg-gray-200 rounded animate-pulse w-40 md:w-48 relative overflow-hidden">
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

                {/* Social Link 5 - WhatsApp */}
                <div className="flex items-center gap-x-[8px]">
                  {/* Icon Skeleton */}
                  <div className="w-6 h-6 bg-gray-200 rounded animate-pulse relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.0s" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                      style={{ animationDelay: "2.0s" }}
                    ></div>
                  </div>
                  {/* Text Skeleton */}
                  <div className="h-4 md:h-5 bg-gray-200 rounded animate-pulse w-40 md:w-48 relative overflow-hidden">
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
              </div>
            </div>
          </div>

          {/* Contact Form Section - Right Side (50%) */}
          <div className="w-full md:w-[50%]">
            <div className="flex flex-col gap-[12px] md:gap-[24px]">
              {/* Name Input */}
              <div
                className="border rounded-[6px] p-2 bg-gray-100 animate-pulse relative overflow-hidden"
                style={{ height: "40px" }}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.2s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                  style={{ animationDelay: "2.2s" }}
                ></div>

                {/* Placeholder Text Skeleton */}
                <div className="flex items-center h-full">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20 relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.3s" }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div
                className="border rounded-[6px] p-2 bg-gray-100 animate-pulse relative overflow-hidden"
                style={{ height: "40px" }}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.4s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                  style={{ animationDelay: "2.4s" }}
                ></div>

                {/* Placeholder Text Skeleton */}
                <div className="flex items-center h-full">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-28 relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.5s" }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Message Textarea */}
              <div
                className="border rounded p-2 mb-[12px] bg-gray-100 animate-pulse relative overflow-hidden"
                style={{ height: "80px" }}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.6s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                  style={{ animationDelay: "2.6s" }}
                ></div>

                {/* Placeholder Text Skeleton */}
                <div className="flex items-start pt-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16 relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.7s" }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-gray-200 text-white rounded-[6px] w-full py-2 md:py-1 animate-pulse relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.8s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                  style={{ animationDelay: "2.8s" }}
                ></div>

                {/* Button Text Skeleton */}
                <div className="flex items-center justify-center">
                  <div className="h-4 md:h-5 bg-gray-300 rounded animate-pulse w-12 relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/70 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.9s" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer"
                      style={{ animationDelay: "2.9s" }}
                    ></div>
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
