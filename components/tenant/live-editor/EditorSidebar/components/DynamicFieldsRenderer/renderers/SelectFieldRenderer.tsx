import React from "react";
import { FieldDefinition } from "@/componentsStructure/types";
import { useEditorT } from "@/context-liveeditor/editorI18nStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check } from "lucide-react";

interface SelectFieldRendererProps {
  def: FieldDefinition;
  normalizedPath: string;
  value: any;
  updateValue: (path: string, value: any) => void;
  getIconComponent: (
    iconName: string,
    iconLibrary?: string,
  ) => React.ComponentType<any> | null;
  isReactIcon: (iconName: string) => boolean;
}

export const SelectFieldRenderer: React.FC<SelectFieldRendererProps> = ({
  def,
  normalizedPath,
  value,
  updateValue,
  getIconComponent,
  isReactIcon,
}) => {
  const t = useEditorT();

  // Pre-compute options with icons for better performance (only when showIcons is true)
  const optionsWithIcons =
    def.showIcons && def.options
      ? (def.options || []).map((opt) => {
          const IconComponent = opt.iconLibrary
            ? getIconComponent(opt.value, opt.iconLibrary)
            : null;

          const isReactIconValue = IconComponent
            ? isReactIcon(opt.value)
            : false;

          return {
            ...opt,
            IconComponent,
            isReactIconValue,
          };
        })
      : null;

  // Pre-compute selected option and icon
  const selectedOption = def.options?.find((opt) => opt.value === value);
  const selectedIcon = selectedOption?.iconLibrary
    ? getIconComponent(selectedOption.value, selectedOption.iconLibrary)
    : null;

  return (
    <div className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
      <label className="flex items-center space-x-3 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            />
          </svg>
        </div>
        <div className="flex-1">
          <span className="text-sm font-semibold text-slate-700">
            {def.label}
          </span>
          {def.description && (
            <p className="text-xs text-slate-500 mt-1">{def.description}</p>
          )}
        </div>
      </label>
      <div className="relative">
        {def.showIcons && optionsWithIcons ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 text-slate-700 font-medium flex items-center justify-between ${
                value && value.length > 0
                  ? "border-green-300 bg-green-50"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2 flex-1">
                {selectedOption ? (
                  <>
                    {selectedIcon &&
                      (isReactIcon(selectedOption.value)
                        ? React.createElement(selectedIcon, {
                            className: "w-5 h-5",
                            style: {
                              fontSize: "20px",
                              width: "20px",
                              height: "20px",
                              color: "currentColor",
                            },
                          })
                        : React.createElement(selectedIcon, {
                            size: 20,
                            className: "w-5 h-5",
                            style: { color: "currentColor" },
                          }))}
                    <span>{selectedOption.label}</span>
                  </>
                ) : (
                  <span className="text-slate-500">
                    {def.placeholder || t("editor_sidebar.select_option")}
                  </span>
                )}
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-[300px] overflow-y-auto w-[var(--radix-dropdown-menu-trigger-width)]">
              {optionsWithIcons.map((opt) => {
                const IconComponent = opt.IconComponent;
                const isReactIconValue = opt.isReactIconValue;
                const isSelected = opt.value === value;

                return (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => updateValue(normalizedPath, opt.value)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 w-full">
                      {IconComponent &&
                        (isReactIconValue
                          ? React.createElement(IconComponent, {
                              className: "w-5 h-5",
                              style: {
                                fontSize: "20px",
                                width: "20px",
                                height: "20px",
                              },
                            })
                          : React.createElement(IconComponent, {
                              size: 20,
                              className: "w-5 h-5",
                            }))}
                      <span className="flex-1">{opt.label}</span>
                      {isSelected && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 text-slate-700 font-medium flex items-center justify-between ${
                value && value.length > 0
                  ? "border-green-300 bg-green-50"
                  : "border-slate-200"
              }`}
            >
              <span className={value ? "" : "text-slate-500"}>
                {def.options?.find((opt) => opt.value === value)?.label ||
                  def.placeholder ||
                  t("editor_sidebar.select_option")}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-[300px] overflow-y-auto w-[var(--radix-dropdown-menu-trigger-width)]">
              {(def.options || []).map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => updateValue(normalizedPath, opt.value)}
                    className="cursor-pointer"
                  >
                    <span className="flex-1">{opt.label}</span>
                    {isSelected && <Check className="h-4 w-4 text-green-500" />}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {def.options && def.options.length === 0 && (
        <p className="text-xs text-amber-500 mt-2">
          {t("editor_sidebar.no_options_available")}
        </p>
      )}
      {/* Debug info for select fields */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-2 text-xs text-gray-500">
          <div>
            {t("editor_sidebar.current_value_debug", {
              value: value || "undefined",
            })}
          </div>
          <div>
            {t("editor_sidebar.options_debug", {
              options: JSON.stringify(def.options || []),
            })}
          </div>
          <div>{t("editor_sidebar.path_debug", { path: normalizedPath })}</div>
        </div>
      )}
    </div>
  );
};
