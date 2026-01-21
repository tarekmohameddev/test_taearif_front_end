"use client";

export default function GridSkeleton1() {
  return (
    <section className="w-full bg-background py-8">
      <div className="mx-auto max-w-[1600px] px-4">
        {/* Results Count Skeleton */}
        <div className="mb-6">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-48 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"></div>
            <div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>

        {/* Properties Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Generate 8 property card skeletons */}
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-full w-full">
              <div className="h-full w-full">
                {/* Property Image Skeleton */}
                <div
                  className="relative w-full bg-gray-200 rounded-xl animate-pulse overflow-hidden"
                  style={{ aspectRatio: "16 / 10" }}
                >
                  {/* Background Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-shimmer"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/30 to-transparent animate-shimmer"
                      style={{ animationDelay: `${1 + index * 0.1}s` }}
                    ></div>
                  </div>

                  {/* Top Right Badge Skeleton (Bedrooms & Views) */}
                  <div className="absolute right-3 top-3 flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 shadow-sm">
                    {/* Bedroom Icon + Number */}
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-gray-200 rounded animate-pulse relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                          style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                        ></div>
                      </div>
                      <div className="h-4 w-3 bg-gray-200 rounded animate-pulse relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                          style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                        ></div>
                      </div>
                    </div>

                    {/* Views Number + Icon */}
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-6 bg-gray-200 rounded animate-pulse relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                          style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                        ></div>
                      </div>
                      <div className="w-4 h-4 bg-gray-200 rounded animate-pulse relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                          style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Content Skeleton */}
                <div className="mt-4 space-y-3" dir="rtl">
                  {/* Property Title Skeleton */}
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-full relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                        style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                      ></div>
                      <div
                        className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                        style={{ animationDelay: `${1.6 + index * 0.1}s` }}
                      ></div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4 relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                        style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                      ></div>
                      <div
                        className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                        style={{ animationDelay: `${1.7 + index * 0.1}s` }}
                      ></div>
                    </div>
                  </div>

                  {/* District Skeleton */}
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-5/6 relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                        style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                      ></div>
                      <div
                        className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                        style={{ animationDelay: `${1.8 + index * 0.1}s` }}
                      ></div>
                    </div>
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-4/6 relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                        style={{ animationDelay: `${0.9 + index * 0.1}s` }}
                      ></div>
                      <div
                        className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                        style={{ animationDelay: `${1.9 + index * 0.1}s` }}
                      ></div>
                    </div>
                  </div>

                  {/* Price and Details Button Skeleton */}
                  <div className="flex items-center justify-between">
                    {/* Price Skeleton */}
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-24 relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                        style={{ animationDelay: `${1.0 + index * 0.1}s` }}
                      ></div>
                      <div
                        className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                        style={{ animationDelay: `${2.0 + index * 0.1}s` }}
                      ></div>
                    </div>

                    {/* Details Button Skeleton */}
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-12 relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-transparent animate-shimmer"
                        style={{ animationDelay: `${1.1 + index * 0.1}s` }}
                      ></div>
                      <div
                        className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/40 to-transparent animate-shimmer"
                        style={{ animationDelay: `${2.1 + index * 0.1}s` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-8">
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200"
            dir="rtl"
          >
            {/* Pagination Info Skeleton */}
            <div className="h-4 bg-gray-200 rounded animate-pulse w-48 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                style={{ animationDelay: "1.5s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                style={{ animationDelay: "2.5s" }}
              ></div>
            </div>

            {/* Pagination Controls Skeleton */}
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <div className="h-8 w-8 bg-gray-200 rounded border animate-pulse relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.6s" }}
                ></div>
              </div>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((page) => (
                  <div
                    key={page}
                    className={`h-8 w-8 rounded animate-pulse relative overflow-hidden ${
                      page === 1 ? "bg-gray-200" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-transparent to-transparent animate-shimmer ${
                        page === 1 ? "via-gray-300/60" : "via-gray-300/60"
                      }`}
                      style={{ animationDelay: `${1.7 + page * 0.1}s` }}
                    ></div>
                  </div>
                ))}
              </div>

              {/* Next Button */}
              <div className="h-8 w-8 bg-gray-200 rounded border animate-pulse relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                  style={{ animationDelay: "2.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
