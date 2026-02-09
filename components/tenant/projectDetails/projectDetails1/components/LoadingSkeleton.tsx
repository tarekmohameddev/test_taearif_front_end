import { ProjectDetailsProps } from "../types";

interface LoadingSkeletonProps {
  mergedData: ProjectDetailsProps;
}

export const LoadingSkeleton = ({ mergedData }: LoadingSkeletonProps) => {
  return (
    <section
      className="py-12"
      style={{
        backgroundColor: mergedData.styling?.backgroundColor,
        paddingTop: mergedData.layout?.padding?.top,
        paddingBottom: mergedData.layout?.padding?.bottom,
      }}
    >
      <div
        className="max-w-7xl mx-auto px-4"
        style={{ maxWidth: mergedData.layout?.maxWidth }}
      >
        <div className="mb-12 md:mb-20 flex flex-col md:flex-row gap-x-6 gap-y-8">
          <div className="md:w-1/2 order-2 md:order-1 mb-12 md:mb-0">
            <div className="flex flex-col gap-y-8 lg:gap-y-10">
              <div className="flex flex-row items-center justify-between">
                <div className="h-8 w-20 bg-emerald-200 rounded-md animate-pulse md:w-28 md:h-11"></div>
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 md:h-6"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2 md:h-10"></div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 order-1 md:order-2">
            <div className="relative h-80 md:h-80 xl:h-96 mb-6 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
