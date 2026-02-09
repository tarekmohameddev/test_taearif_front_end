"use client";

interface SkeletonLoaderProps {
  primaryColor: string;
  primaryColorLight: string;
}

export function SkeletonLoader({
  primaryColor,
  primaryColorLight,
}: SkeletonLoaderProps) {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 md:mb-20 flex flex-col md:flex-row gap-x-6 gap-y-8">
          {/* المحتوى الرئيسي - Skeleton */}
          <div className="md:w-1/2 order-2 md:order-1 mb-12 md:mb-0">
            <div className="flex flex-col gap-y-8 lg:gap-y-10">
              {/* العنوان ونوع العرض - Skeleton */}
              <div className="flex flex-row items-center justify-between">
                <div
                  className="h-8 w-20 rounded-md animate-pulse md:w-28 md:h-11"
                  style={{
                    backgroundColor: primaryColorLight || `${primaryColor}33`,
                  }}
                ></div>
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* تفاصيل العقار - Skeleton */}
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 md:h-6"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2 md:h-10"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                </div>
              </div>

              {/* تفاصيل العقار في شبكة - Skeleton */}
              <div className="grid grid-cols-2 gap-y-6 lg:gap-y-10">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="flex flex-row gap-x-2 md:gap-x-6 items-center"
                  >
                    <div className="flex flex-row gap-x-2 items-center">
                      <div
                        className="w-4 h-4 rounded animate-pulse"
                        style={{
                          backgroundColor: primaryColorLight || `${primaryColor}33`,
                        }}
                      ></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* معرض الصور - Skeleton */}
          <div className="md:w-1/2 order-1 md:order-2">
            <div className="gallery w-full mx-auto px-4 md:px-6 order-1 md:order-2 relative">
              {/* الصورة الأساسية - Skeleton */}
              <div className="relative h-80 md:h-80 xl:h-96 mb-6 bg-gray-200 rounded-lg animate-pulse">
                <div className="absolute bottom-2 right-2 opacity-50">
                  <div className="w-12 h-12 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Carousel للصور المصغرة - Skeleton */}
              <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="relative h-24 w-24 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"
                  >
                    <div className="absolute bottom-1 right-1 opacity-50">
                      <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* القسم السفلي - Skeleton */}
        <div className="flex flex-col md:flex-row gap-x-6 gap-y-8">
          {/* وصف العقار ونموذج الحجز - Skeleton */}
          <div className="flex-1">
            <div className="mb-8 md:mb-18">
              <div className="flex flex-col justify-center items-start gap-y-6 md:gap-y-8">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-32 lg:h-7"></div>
                <div className="space-y-2 w-full">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/5"></div>
                </div>
              </div>
            </div>

            {/* نموذج الحجز - Skeleton */}
            <div className="flex flex-col gap-y-6">
              <div
                className="h-10 rounded-md animate-pulse w-full"
                style={{
                  backgroundColor: primaryColorLight || `${primaryColor}33`,
                }}
              ></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>

              <div className="flex flex-col gap-y-6 md:gap-y-8">
                <div className="flex flex-row gap-x-4">
                  <div className="flex flex-col gap-y-6 flex-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                    <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-full"></div>
                  </div>
                  <div className="flex flex-col gap-y-6 flex-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-full"></div>
                  </div>
                </div>

                <div className="flex flex-row gap-x-4">
                  <div className="flex-1 flex flex-col gap-y-6">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                    <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-full"></div>
                  </div>
                  <div className="flex-1 flex flex-col gap-y-6">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                    <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-full"></div>
                  </div>
                </div>

                <div
                  className="h-12 rounded-md animate-pulse w-[200px] mx-auto"
                  style={{
                    backgroundColor: primaryColorLight || `${primaryColor}33`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* العقارات المشابهة - Skeleton */}
          <div className="flex-1">
            <div
              className="h-10 rounded-md animate-pulse w-full mb-8 md:h-13"
              style={{
                backgroundColor: primaryColorLight || `${primaryColor}33`,
              }}
            ></div>

            {/* عرض العقارات المشابهة للديسكتوب - Skeleton */}
            <div className="hidden md:block space-y-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex mb-8 gap-x-6 h-48 w-full rounded-xl px-4 border border-gray-200 shadow-lg"
                >
                  <div className="flex-[48.6%] py-8 flex flex-col gap-y-4 justify-center">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    <div className="flex flex-row items-center justify-between">
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3"></div>
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                  </div>
                  <div className="flex-[42.4%] py-4 rounded-lg overflow-hidden w-full h-full">
                    <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* عرض العقارات المشابهة للموبايل - Skeleton */}
            <div className="block md:hidden">
              <div className="flex gap-4 overflow-x-auto">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="relative h-88 md:h-91 flex flex-col justify-center min-w-[280px]"
                  >
                    <div className="relative w-full h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mt-4"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mt-2"></div>
                    <div className="flex flex-row items-center justify-between pt-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
