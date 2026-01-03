"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ComponentInstanceWithPosition } from "@/lib/types";
import { useSidebarStateManager } from "@/context/SidebarStateManager";
import { AdvancedSimpleSwitcher } from "./components/AdvancedSimpleSwitcher";
import { COMPONENTS } from "@/lib/ComponentsList";
import { useEditorT } from "@/context/editorI18nStore";

interface UnifiedSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedComponent: ComponentInstanceWithPosition | null;
  onComponentUpdate: (id: string, newData: any) => void;
  width: number;
  setWidth: (w: number) => void;
}

export function UnifiedSidebar({
  isOpen,
  onClose,
  selectedComponent,
  onComponentUpdate,
  width,
  setWidth,
}: UnifiedSidebarProps) {
  const t = useEditorT();
  const {
    selectedComponent: sidebarSelectedComponent,
    setSelectedComponent,
    updateComponentData,
    getComponentData,
    updateGlobalHeader,
    updateGlobalFooter,
    getGlobalHeaderData,
    getGlobalFooterData,
    currentPage,
    setCurrentPage,
  } = useSidebarStateManager();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Sync selected component
  useEffect(() => {
    setSelectedComponent(selectedComponent);
  }, [selectedComponent, setSelectedComponent]);

  // Handle component updates directly on pageComponentsByPage
  const handleUpdateByPath = useCallback(
    (path: string, value: any) => {
      if (!selectedComponent) return;

      // Handle global components
      if (selectedComponent.id === "global-header") {
        updateGlobalHeader(path, value);
        onComponentUpdate(selectedComponent.id, getGlobalHeaderData());
      } else if (selectedComponent.id === "global-footer") {
        updateGlobalFooter(path, value);
        onComponentUpdate(selectedComponent.id, getGlobalFooterData());
      } else {
        // Update component data directly in pageComponentsByPage
        updateComponentData(selectedComponent.id, path, value);

        // Get updated data and notify parent
        const updatedData = getComponentData(selectedComponent.id);
        if (updatedData) {
          onComponentUpdate(selectedComponent.id, updatedData);
        }
      }
    },
    [
      selectedComponent,
      updateComponentData,
      getComponentData,
      updateGlobalHeader,
      updateGlobalFooter,
      getGlobalHeaderData,
      getGlobalFooterData,
      onComponentUpdate,
    ],
  );

  // Get current component data for display
  const getCurrentComponentData = useCallback(() => {
    if (!selectedComponent) return {};

    if (selectedComponent.id === "global-header") {
      return getGlobalHeaderData();
    } else if (selectedComponent.id === "global-footer") {
      return getGlobalFooterData();
    } else {
      return getComponentData(selectedComponent.id) || {};
    }
  }, [
    selectedComponent,
    getComponentData,
    getGlobalHeaderData,
    getGlobalFooterData,
  ]);

  // Handle save (no-op since we're editing directly)
  const handleSave = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen || !selectedComponent) return null;

  const currentData = getCurrentComponentData();

  return (
    <div
      className="h-full flex bg-gradient-to-br from-slate-50 via-white to-slate-50 shadow-2xl border-l border-slate-200/60"
      style={{ width: `${width}px` }}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200/60">
          <h3 className="text-lg font-semibold text-slate-800">
            {t("editor_sidebar.edit_component")}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Component Info */}
        <div className="p-4 border-b border-slate-200/60">
          <div className="text-sm text-slate-600">
            <div className="font-medium">
              {t("editor_sidebar.type")}: {selectedComponent.type}
            </div>
            <div className="font-medium">
              {t("editor_sidebar.id")}: {selectedComponent.id}
            </div>
            <div className="font-medium">
              {t("editor_sidebar.page")}: {currentPage}
            </div>
          </div>
        </div>

        {/* Component Editor */}
        <div className="flex-1 overflow-y-auto p-4">
          {COMPONENTS[selectedComponent.type] ? (
            <AdvancedSimpleSwitcher
              type={selectedComponent.type}
              componentName={
                selectedComponent.componentName || selectedComponent.name
              }
              componentId={selectedComponent.id}
              onUpdateByPath={handleUpdateByPath}
              currentData={currentData}
            />
          ) : (
            <div className="text-center text-slate-500 py-8">
              {t("editor_sidebar.component_type_not_supported")}:{" "}
              {selectedComponent.type}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/60">
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t("editor_sidebar.save_changes")}
          </button>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className="w-1 bg-slate-200 hover:bg-slate-300 cursor-col-resize transition-colors"
        onMouseDown={(e) => {
          e.preventDefault();
          const startX = e.clientX;
          const startWidth = width;

          const handleMouseMove = (e: MouseEvent) => {
            const newWidth = startWidth - (e.clientX - startX);
            if (newWidth > 300 && newWidth < 800) {
              setWidth(newWidth);
            }
          };

          const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
          };

          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
        }}
      />
    </div>
  );
}
