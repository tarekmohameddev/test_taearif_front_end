import { LanguageDropdown } from "@/components/tenant/live-editor/LanguageDropdown";
import { useEditorT } from "@/context/editorI18nStore";
import { ActionsDropdown } from "./ActionsDropdown";

interface MobileActionsProps {
  showArrowTooltip: boolean;
  tenantId: string;
  currentPath: string;
  onSave: () => void;
  onAddPage: () => void;
  onThemeChange: () => void;
}

export function MobileActions({
  showArrowTooltip,
  tenantId,
  currentPath,
  onSave,
  onAddPage,
  onThemeChange,
}: MobileActionsProps) {
  const t = useEditorT();

  return (
    <div className="flex items-center space-x-1">
      {/* Save Button */}
      <div className="relative">
        <button
          onClick={onSave}
          className={`inline-flex items-center whitespace-nowrap px-1.5 py-0.5 border border-transparent text-sm font-medium rounded-md text-white hover:scale-[calc(1.05)] focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-1000 focus:ring-blue-500 ${
            showArrowTooltip
              ? "bg-red-700 hover:bg-red-700 animate-pulse shadow-lg shadow-red-500/50"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          <span className="inline">{t("editor.save_changes")}</span>
        </button>
      </div>

      <LanguageDropdown />

      {/* Actions Dropdown */}
      <ActionsDropdown
        tenantId={tenantId}
        currentPath={currentPath}
        onAddPageClick={onAddPage}
        onThemeChangeClick={onThemeChange}
      />
    </div>
  );
}
