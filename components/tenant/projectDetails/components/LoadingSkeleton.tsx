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
        className="relative w-full overflow-hidden"
        style={{ height: heroHeight }}
      >
        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
      </section>
      <div
        className="container mx-auto px-4 pb-12"
        style={{ maxWidth }}
      >
        <div className="relative h-[600px] w-full bg-gray-200 rounded-lg animate-pulse mt-[-12rem]"></div>
      </div>
    </main>
  );
};
