import { useState, useEffect } from "react";
import Link from "next/link";
import { useEditorT, useEditorLocale } from "@/context/editorI18nStore";
import { Page } from "../../types/types";
import { getPageTitle } from "../../utils/pageHelpers";

interface PagesDropdownProps {
  availablePages: Page[];
  basePath: string;
  currentPath: string;
  variant?: "desktop" | "mobile";
}

export function PagesDropdown({
  availablePages,
  basePath,
  currentPath,
  variant = "desktop",
}: PagesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useEditorT();
  const { locale } = useEditorLocale();

  // إغلاق الـ dropdown عند النقر خارجه
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest(".pages-dropdown-container")) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative pages-dropdown-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg
          className="w-4 h-4 ltr:mr-2 rtl:ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        {t("editor.pages")}
        <svg
          className="w-4 h-4 ltr:ml-2 rtl:mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Pages Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 ${
            variant === "mobile" ? "left-0" : ""
          }`}
        >
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {t("editor.pages")}
            </h3>
            <div className="space-y-1">
              {availablePages.map((page) => (
                <Link
                  key={page.slug || "homepage"}
                  href={`${basePath}${page.path}`}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                    currentPath === page.path
                      ? page.isStatic
                        ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                      : page.isStatic
                        ? "text-yellow-700 hover:bg-yellow-50/50"
                        : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page.isStatic ? (
                    <svg
                      className="w-4 h-4 ltr:mr-3 rtl:ml-3 flex-shrink-0 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 ltr:mr-3 rtl:ml-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  )}
                  <span className="truncate flex-1">
                    {getPageTitle(page, locale)}
                  </span>
                  {page.isStatic && (
                    <span className="ltr:ml-2 rtl:mr-2 px-1.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded">
                      🔒
                    </span>
                  )}
                  {currentPath === page.path && (
                    <svg
                      className={`w-4 h-4 ltr:ml-auto rtl:mr-auto ${
                        page.isStatic ? "text-yellow-600" : "text-blue-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
