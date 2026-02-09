import { useEditorT } from "@/context/editorI18nStore";
import { Page } from "../../types/types";
import { BackToDashboardButton } from "./BackToDashboardButton";
import { PagesDropdown } from "./PagesDropdown";
import { MobileActions } from "./MobileActions";

interface MobileNavBarProps {
  showArrowTooltip: boolean;
  tenantId: string;
  basePath: string;
  currentPath: string;
  availablePages: Page[];
  requestSave: () => void;
  onAddPage: () => void;
  onThemeChange: () => void;
}

export function MobileNavBar({
  showArrowTooltip,
  tenantId,
  basePath,
  currentPath,
  availablePages,
  requestSave,
  onAddPage,
  onThemeChange,
}: MobileNavBarProps) {
  const t = useEditorT();

  return (
    <div className="md:hidden">
      {/* First Row - Title with Back Button */}
      <div className="flex items-center justify-between py-3 px-2">
        <BackToDashboardButton variant="mobile" />

        {/* Title - Centered */}
        <div className="flex-1 flex justify-center items-center pb-2 relative">
          <h1 className="text-sm font-bold text-gray-900">
            {t("editor.title")}
          </h1>
          <span className="ml-2 text-sm text-gray-500">({tenantId})</span>
          {/* Custom border width - يمكن تعديل العرض هنا */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[400px] h-px bg-gray-200"></div>
        </div>

        {/* Spacer to balance the back button */}
        <div className="w-9"></div>
      </div>

      {/* Second Row - Navigation and Actions */}
      <div className="flex items-center justify-between py-2">
        {/* Pages Dropdown */}
        <div className="flex items-center">
          <PagesDropdown
            availablePages={availablePages}
            basePath={basePath}
            currentPath={currentPath}
            variant="mobile"
          />
        </div>

        {/* Actions */}
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
  );
}
