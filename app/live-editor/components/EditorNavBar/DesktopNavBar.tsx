import Link from "next/link";
import { useEditorT, useEditorLocale } from "@/context/editorI18nStore";
import { Page } from "../../types/types";
import { getPageTitle } from "../../utils/pageHelpers";
import { BackToDashboardButton } from "./BackToDashboardButton";
import { PagesDropdown } from "./PagesDropdown";
import { DesktopActions } from "./DesktopActions";
import { MobileActions } from "./MobileActions";

interface DesktopNavBarProps {
  showArrowTooltip: boolean;
  tenantId: string;
  basePath: string;
  currentPath: string;
  availablePages: Page[];
  requestSave: () => void;
  onAddPage: () => void;
  onThemeChange: () => void;
}

export function DesktopNavBar({
  showArrowTooltip,
  tenantId,
  basePath,
  currentPath,
  availablePages,
  requestSave,
  onAddPage,
  onThemeChange,
}: DesktopNavBarProps) {
  const t = useEditorT();
  const { locale } = useEditorLocale();

  return (
    <div className="hidden md:flex items-center justify-between h-16">
      <div className="flex items-center">
        <BackToDashboardButton variant="desktop" />

        <div className="flex-shrink-0 flex items-center">
          <h1 className="text-base font-bold text-gray-900">
            {t("editor.title")}
          </h1>
          <span className="ltr:ml-2 rtl:mr-2 text-sm text-gray-500">
            ({tenantId})
          </span>
        </div>

        {/* Desktop Pages Navigation - Show as links if less than 5 pages, otherwise show dropdown */}
        {availablePages.length < 5 ? (
          <div className="hidden xl:ml-6 xl:flex xl:space-x-8 rtl:space-x-reverse">
            {availablePages.map((page) => (
              <Link
                key={page.slug || "homepage"}
                href={`${basePath}${page.path}`}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentPath === page.path
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {getPageTitle(page, locale)}
              </Link>
            ))}
          </div>
        ) : (
          <div className="hidden xl:ml-6 xl:flex items-center">
            <PagesDropdown
              availablePages={availablePages}
              basePath={basePath}
              currentPath={currentPath}
              variant="desktop"
            />
          </div>
        )}

        {/* Mobile Pages Dropdown - Visible on screens < 1100px */}
        <div className="xl:hidden flex items-center ltr:mx-2 rtl:mx-2">
          <PagesDropdown
            availablePages={availablePages}
            basePath={basePath}
            currentPath={currentPath}
            variant="mobile"
          />
        </div>
      </div>

      {/* Right Side: Actions */}
      <div className="flex items-center">
        {/* Desktop Actions - Hidden on screens <= 1400px */}
        <DesktopActions
          showArrowTooltip={showArrowTooltip}
          tenantId={tenantId}
          currentPath={currentPath}
          onSave={requestSave}
          onAddPage={onAddPage}
          onThemeChange={onThemeChange}
        />

        {/* Mobile/Tablet Actions Dropdown - Visible on screens <= 1400px */}
        <div className="xl:hidden flex items-center space-x-1 rtl:space-x-reverse">
          <MobileActions
            showArrowTooltip={showArrowTooltip}
            tenantId={tenantId}
            currentPath={currentPath}
            onSave={requestSave}
            onAddPage={onAddPage}
            onThemeChange={onThemeChange}
          />
        </div>
      </div>
    </div>
  );
}
