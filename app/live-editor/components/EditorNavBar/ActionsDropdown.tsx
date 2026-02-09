import { useState, useEffect } from "react";
import Link from "next/link";
import { useEditorT, useEditorLocale } from "@/context/editorI18nStore";
import { getTenantUrl } from "../../utils/tenantHelpers";

interface ActionsDropdownProps {
  tenantId: string;
  currentPath: string;
  onAddPageClick: () => void;
  onThemeChangeClick: () => void;
}

export function ActionsDropdown({
  tenantId,
  currentPath,
  onAddPageClick,
  onThemeChangeClick,
}: ActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useEditorT();
  const { locale } = useEditorLocale();

  // إغلاق الـ dropdown عند النقر خارجه
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest(".dropdown-container")) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleAddPage = () => {
    onAddPageClick();
    setIsOpen(false);
  };

  const handleThemeChange = () => {
    onThemeChangeClick();
    setIsOpen(false);
  };

  return (
    <div className="relative dropdown-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          {/* Add Page Button */}
          <button
            onClick={handleAddPage}
            className="w-full flex items-center whitespace-nowrap px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            {t("editor.add_page")}
          </button>

          {/* Change Theme Button */}
          <button
            onClick={handleThemeChange}
            className="w-full flex items-center whitespace-nowrap px-3 py-2 text-sm text-purple-700 hover:bg-purple-50 transition-colors duration-200"
          >
            {locale === "ar"
              ? "تغيير ثيم الموقع بالكامل"
              : "Change Site Theme"}
          </button>

          {/* Divider */}
          <div className="border-t border-gray-100 my-1"></div>

          {/* Preview Button */}
          <Link
            href={getTenantUrl(tenantId, currentPath)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center whitespace-nowrap px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            {t("editor.preview")}
          </Link>

          {/* Live Preview Button */}
          <Link
            href={getTenantUrl(tenantId, "/")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center whitespace-nowrap px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            {t("editor.live_preview")}
          </Link>
        </div>
      )}
    </div>
  );
}
