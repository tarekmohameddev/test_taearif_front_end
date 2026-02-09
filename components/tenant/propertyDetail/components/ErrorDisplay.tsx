interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => {
  return (
    <main className="w-full" dir="rtl">
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-lg text-red-600 font-medium">{error}</p>
            <p className="text-sm text-gray-500 mt-2">
              {onRetry ? "تأكد من صحة رابط العقار" : ""}
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                إعادة المحاولة
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};
