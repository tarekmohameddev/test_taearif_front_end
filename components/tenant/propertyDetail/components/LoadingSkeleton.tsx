interface LoadingSkeletonProps {
  heroHeight?: string;
  maxWidth?: string;
}

export const LoadingSkeleton = ({
  heroHeight = "500px",
  maxWidth,
}: LoadingSkeletonProps) => {
  return (
    <main className="w-full" dir="rtl">
      <section
        className="relative w-full overflow-hidden animate-pulse"
        style={{ height: heroHeight }}
      >
        <div className="w-full h-full bg-gray-200" />
      </section>
      <div className="container mx-auto px-4 py-12" style={{ maxWidth }}>
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    </main>
  );
};
