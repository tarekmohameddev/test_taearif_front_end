"use client";

export default function PropertyFilterSkeleton1() {
  return (
    <div className="mb-6 md:mb-18 max-w-[1600px] mx-auto animate-pulse">
      {/* Enhanced Background Shimmer Effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
        <div
          className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent animate-shimmer"
          style={{ animationDelay: "1s" }}
        ></div>

        <form className="grid grid-cols-1 xs:grid-cols-2 md:flex flex-col md:flex-row mt-4 bg-white rounded-[10px] gap-x-5 md:gap-x-5 gap-y-4 p-4 relative z-10">
          {/* البحث عن المدينة - City Search Skeleton */}
          <div className="py-2 w-full md:w-[32.32%] relative flex items-center justify-center border border-gray-200 h-12 md:h-14 rounded-[10px] bg-white overflow-hidden">
            {/* Input Field Skeleton */}
            <div className="w-full h-full flex items-center px-2">
              <div className="h-4 md:h-5 bg-gray-200 rounded animate-pulse w-4/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>
          </div>

          {/* نوع العقار - Property Type Skeleton */}
          <div className="h-full relative w-full md:w-[23.86%]">
            <div className="w-full h-full relative">
              <div className="relative">
                {/* Input Field with Dropdown Icon Skeleton */}
                <div className="w-full h-12 md:h-14 border border-gray-200 rounded-[10px] bg-white flex items-center px-2 pr-10 relative overflow-hidden">
                  {/* Input Text Skeleton */}
                  <div className="h-4 md:h-5 bg-gray-200 rounded animate-pulse w-3/5 relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.2s" }}
                    ></div>
                  </div>

                  {/* Dropdown Arrow Skeleton */}
                  <div className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-5 bg-gray-300 rounded animate-pulse relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/60 to-transparent animate-shimmer"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                      <div
                        className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer"
                        style={{ animationDelay: "1.3s" }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Dropdown Menu Skeleton (Optional - showing as if opened) */}
                <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-[10px] mt-1 shadow-lg opacity-30">
                  {/* Dropdown Items Skeleton */}
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div
                        className={`h-4 bg-gray-200 rounded animate-pulse relative overflow-hidden ${
                          index === 0
                            ? "w-16" // مزرعة
                            : index === 1
                              ? "w-12" // دور
                              : index === 2
                                ? "w-20" // ارض سكن
                                : "w-14" // بيت
                        }`}
                      >
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                          style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                        ></div>
                        <div
                          className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                          style={{ animationDelay: `${1.4 + index * 0.1}s` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* السعر - Price Skeleton */}
          <div className="w-full md:w-[23.86%] h-12 relative flex items-center justify-center py-2 border border-gray-200 md:h-14 rounded-[10px] bg-white overflow-hidden">
            {/* Price Input Skeleton */}
            <div className="w-full h-full flex items-center px-2">
              <div className="h-4 md:h-5 bg-gray-200 rounded animate-pulse w-2/5 relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                  style={{ animationDelay: "0.8s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.8s" }}
                ></div>
              </div>
            </div>
          </div>

          {/* زر البحث - Search Button Skeleton */}
          <div className="w-full md:w-[15.18%] h-full relative">
            <div className="flex items-center justify-center w-full h-12 md:h-14 bg-gray-200 rounded-[10px] animate-pulse relative overflow-hidden">
              {/* Button Text Skeleton */}
              <div className="h-4 md:h-5 bg-gray-300 rounded animate-pulse w-8 relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/70 to-transparent animate-shimmer"
                  style={{ animationDelay: "0.9s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.9s" }}
                ></div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
