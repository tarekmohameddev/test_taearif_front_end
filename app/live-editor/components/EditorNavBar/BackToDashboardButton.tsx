import Link from "next/link";
import { useEditorT } from "@/context/editorI18nStore";

interface BackToDashboardButtonProps {
  variant?: "desktop" | "mobile";
}

export function BackToDashboardButton({
  variant = "desktop",
}: BackToDashboardButtonProps) {
  const t = useEditorT();

  if (variant === "mobile") {
    return (
      <Link
        href="/dashboard"
        className="flex items-center px-2 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
      >
        <span className="ml-2 font-medium text-xs">
          {t("editor.back_to_dashboard")}
        </span>
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </Link>
    );
  }

  return (
    <Link
      href="/dashboard"
      className="flex-shrink-0 flex items-center px-1 py-2 ltr:mr-1 rtl:ml-1 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
    >
      <svg
        className="w-5 h-5 group-hover:transform rtl:-scale-x-100 ltr:group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      <span className="mx-2 font-medium text-xs">
        {t("editor.dashboard")}
      </span>
    </Link>
  );
}
