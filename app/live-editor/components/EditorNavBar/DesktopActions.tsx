import Link from "next/link";
import { useEditorT, useEditorLocale } from "@/context/editorI18nStore";
import { LanguageDropdown } from "@/components/tenant/live-editor/LanguageDropdown";
import { getTenantUrl } from "../../utils/tenantHelpers";

interface DesktopActionsProps {
  showArrowTooltip: boolean;
  tenantId: string;
  currentPath: string;
  onSave: () => void;
  onAddPage: () => void;
  onThemeChange: () => void;
}

export function DesktopActions({
  showArrowTooltip,
  tenantId,
  currentPath,
  onSave,
  onAddPage,
  onThemeChange,
}: DesktopActionsProps) {
  const t = useEditorT();
  const { locale } = useEditorLocale();

  return (
    <div className="hidden xl:flex items-center space-x-2 rtl:space-x-reverse">
      {/* Save Button - Always visible */}
      <div className="relative">
        <button
          onClick={onSave}
          className={`inline-flex items-center whitespace-nowrap px-1.5 py-1 xl:px-3 xl:py-1.5 border border-transparent text-sm xl:text-sm font-medium rounded-md text-white hover:scale-[calc(1.05)] focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-2000 focus:ring-blue-500 ${
            showArrowTooltip
              ? "bg-red-500 hover:bg-red-900 animate-pulse shadow-lg shadow-red-500/50"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {t("editor.save_changes")}
        </button>
      </div>

      {/* Add Page Button for Desktop */}
      <button
        onClick={onAddPage}
        className="inline-flex items-center whitespace-nowrap px-1.5 py-1 xl:px-3 xl:py-1.5 border border-gray-300 text-sm xl:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-2000 hover:scale-[calc(1.02)]"
      >
        {t("editor.add_page")}
      </button>

      {/* Change Theme Button for Desktop */}
      <button
        onClick={onThemeChange}
        className="inline-flex items-center whitespace-nowrap px-1.5 py-1 xl:px-3 xl:py-1.5 border border-purple-300 text-sm xl:text-sm font-medium rounded-md text-purple-700 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-2000 hover:scale-[calc(1.02)]"
      >
        {locale === "ar"
          ? "تغيير ثيم الموقع بالكامل"
          : "Change Site Theme"}
      </button>

      <Link
        href={getTenantUrl(tenantId, currentPath)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center whitespace-nowrap px-1.5 py-1 xl:px-3 xl:py-1.5 border border-gray-300 text-sm xl:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-2000 hover:scale-[calc(1.02)]"
      >
        {t("editor.preview")}
      </Link>
      <Link
        href={getTenantUrl(tenantId, "/")}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center whitespace-nowrap px-1.5 py-1 xl:px-3 xl:py-1.5 border border-gray-300 text-sm xl:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-2000 hover:scale-[calc(1.02)]"
      >
        {t("editor.live_preview")}
      </Link>

      {/* Language Dropdown */}
      <LanguageDropdown />
    </div>
  );
}
