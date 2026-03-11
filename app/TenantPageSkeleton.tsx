"use client";
/**
 * Loading skeleton for tenant pages. Loaded on demand so TenantPageWrapper
 * doesn’t pull heavy skeleton deps in its initial chunk.
 */
import { SkeletonLoader } from "@/components/skeleton";
import {
  StaticHeaderSkeleton1,
  HeroSkeleton1,
  HeroSkeleton2,
  FilterButtonsSkeleton1,
  GridSkeleton1,
  HalfTextHalfImageSkeleton1,
  ContactCardsSkeleton1,
} from "@/components/skeleton";

export default function TenantPageSkeleton({ slug }: { slug: string }) {
  const renderSkeletonContent = () => {
    switch (slug) {
      case "for-rent":
      case "for-sale":
        return (
          <main className="flex-1">
            <FilterButtonsSkeleton1 />
            <GridSkeleton1 />
          </main>
        );
      case "about-us":
        return (
          <main className="flex-1">
            <HeroSkeleton2 />
            <HalfTextHalfImageSkeleton1 />
          </main>
        );
      case "contact-us":
        return (
          <main className="flex-1">
            <HeroSkeleton2 />
            <ContactCardsSkeleton1 />
          </main>
        );
      case "property-requests/create":
        return (
          <main className="flex-1">
            <HeroSkeleton2 />
            <div className="max-w-4xl mx-auto p-6">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        );
      default:
        return (
          <main className="flex-1">
            <HeroSkeleton1 />
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <StaticHeaderSkeleton1 />
      {renderSkeletonContent()}
      <SkeletonLoader componentName="footer" />
    </div>
  );
}
