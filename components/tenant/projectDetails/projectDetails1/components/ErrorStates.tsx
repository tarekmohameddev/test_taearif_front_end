import { ProjectDetailsProps } from "../types";

interface ErrorStatesProps {
  mergedData: ProjectDetailsProps;
  error?: string | null;
  onRetry?: () => void;
  type: "no-tenant" | "project-error";
}

export const ErrorStates = ({
  mergedData,
  error,
  onRetry,
  type,
}: ErrorStatesProps) => {
  if (type === "no-tenant") {
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
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-lg text-yellow-600 font-medium">
              لم يتم العثور على معرف الموقع
            </p>
          </div>
        </div>
      </section>
    );
  }

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
      </div>
    </section>
  );
};
