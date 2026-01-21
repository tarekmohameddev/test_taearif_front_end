"use client";

export default function FilterButtonsSkeleton1() {
  return (
    <div className="flex flex-col md:flex-row justify-between max-w-[1600px] mx-auto animate-pulse">
      {/* Enhanced Background Shimmer Effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
        <div
          className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent animate-shimmer"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="relative z-10 w-full">
          {/* زر طلب المعاينة - Request Preview Button Skeleton */}
          <div className="w-[80%] mb-[20px] md:w-fit md:mx-0 flex items-center justify-center mx-auto">
            <div className="w-full md:w-auto bg-gray-200 rounded-[10px] px-[20px] py-[8px] animate-pulse relative overflow-hidden">
              {/* Button Text Skeleton - "طلب معاينة" */}
              <div className="h-3 md:h-4 lg:h-5 bg-gray-300 rounded animate-pulse w-16 md:w-20 lg:w-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/70 to-transparent animate-shimmer"></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>
          </div>

          {/* أزرار الفلتر - Filter Buttons Skeleton */}
          <div className="filterButtons mb-6 flex items-center justify-center md:justify-start gap-x-[24px]">
            {/* Filter Button 1 - "الكل" (Active State) */}
            <div className="w-fit bg-gray-200 rounded-[10px] px-[20px] py-[8px] animate-pulse relative overflow-hidden">
              <div className="h-3 md:h-4 lg:h-5 bg-gray-300 rounded animate-pulse w-8 relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/70 to-transparent animate-shimmer"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.2s" }}
                ></div>
              </div>
            </div>

            {/* Filter Button 2 - "المتاحة للإيجار/البيع" (Inactive State) */}
            <div className="w-fit bg-white border border-gray-200 rounded-[10px] px-[20px] py-[8px] animate-pulse relative overflow-hidden">
              <div className="h-3 md:h-4 lg:h-5 bg-gray-200 rounded animate-pulse w-20 md:w-24 lg:w-28 relative overflow-hidden">
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

            {/* Filter Button 3 - "تم تأجيرها/بيعها" (Inactive State) */}
            <div className="w-fit bg-white border border-gray-200 rounded-[10px] px-[20px] py-[8px] animate-pulse relative overflow-hidden">
              <div className="h-3 md:h-4 lg:h-5 bg-gray-200 rounded animate-pulse w-16 md:w-20 lg:w-24 relative overflow-hidden">
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
        </div>
      </div>
    </div>
  );
}
