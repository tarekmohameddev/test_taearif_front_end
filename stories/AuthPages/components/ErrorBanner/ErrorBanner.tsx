import type { ErrorBannerProps } from "./ErrorBanner.types";

const WARNING_ICON_URL = "/assets/AuthPages/triangle-warning.svg";

export default function ErrorBanner({
  message,
  showIcon = true,
  className = "",
}: ErrorBannerProps) {
  if (!message) return null;

  return (
    <div
      className={`flex items-center gap-2 bg-red-50 border border-red-200 rounded-full h-11 px-4 py-3 ${className}`}
    >
      {showIcon && (
        <img
          src={WARNING_ICON_URL}
          alt=""
          className="w-5 h-5 shrink-0"
          aria-hidden
        />
      )}
      <span className="text-sm text-red-600">{message}</span>
    </div>
  );
}
