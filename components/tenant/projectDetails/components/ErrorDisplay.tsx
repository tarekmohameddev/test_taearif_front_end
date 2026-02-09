interface ErrorDisplayProps {
  error?: string | null;
  onRetry?: () => void;
}

export const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => {
  return (
    <main className="w-full" dir="rtl">
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg text-red-600 font-medium">
          {error || "المشروع غير موجود"}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        )}
      </div>
    </main>
  );
};
