"use client";
import React from "react";
import { ComponentData, ComponentInstance } from "@/lib/types";
import { useEditorStore } from "@/context/editorStore";
import { EditorSidebarProps } from "./types";
import { BrandingSettings } from "./components/BrandingSettings";

// Hooks
import { useEditorSidebarResize } from "./hooks/useEditorSidebarResize";
import { useEditorSidebarInitialization } from "./hooks/useEditorSidebarInitialization";
import { useEditorSidebarData } from "./hooks/useEditorSidebarData";
import { useInputHandlers } from "./handlers/useInputHandlers";
import { useSaveHandler } from "./handlers/useSaveHandler";

// Views
import { MainView } from "./views/MainView";
import { AddSectionView } from "./views/AddSectionView";
import { EditComponentView } from "./views/EditComponentView";
import { SidebarFooter } from "./views/SidebarFooter";

export function EditorSidebar({
  isOpen,
  onClose,
  view,
  setView,
  selectedComponent,
  onComponentUpdate,
  onComponentThemeChange,
  onPageThemeChange,
  onSectionAdd,
  onComponentReset,
  width,
  setWidth,
}: EditorSidebarProps) {
  const {
    tempData,
    setTempData,
    updateByPath,
    updateComponentByPath,
    globalHeaderData,
    globalFooterData,
    globalHeaderVariant,
    globalFooterVariant,
    setGlobalHeaderData,
    setGlobalFooterData,
    setGlobalHeaderVariant,
    setGlobalFooterVariant,
    updateGlobalHeaderByPath,
    updateGlobalFooterByPath,
    globalComponentsData,
    setGlobalComponentsData,
    setCurrentPage,
    setHasChangesMade,
    setWebsiteLayout,
    halfTextHalfImageStates,
  } = useEditorStore();

  // Hooks
  const { sidebarRef, handleMouseDown } = useEditorSidebarResize(setWidth);

  useEditorSidebarInitialization({
    view,
    selectedComponent,
    globalHeaderData,
    globalFooterData,
    globalFooterVariant,
    globalComponentsData,
    setTempData,
    setCurrentPage,
  });

  useEditorSidebarData({
    view,
    selectedComponent,
    globalHeaderData,
    globalFooterData,
    globalFooterVariant,
    halfTextHalfImageStates,
    setTempData,
  });

  const { handleInputChange } = useInputHandlers();

  const { handleSave } = useSaveHandler({
    view,
    selectedComponent,
    tempData,
    setTempData,
    setGlobalHeaderData,
    setGlobalFooterData,
    setGlobalComponentsData,
    globalComponentsData,
    setWebsiteLayout,
    setHasChangesMade,
    onComponentUpdate,
    onClose,
  });

  return (
    <div
      ref={sidebarRef}
      className="h-full flex bg-gradient-to-br from-slate-50 via-white to-slate-50 shadow-2xl border-l border-slate-200/60"
      style={{ width: `${width}px` }}
    >
      <div
        className="w-3 h-full cursor-col-resize flex items-center justify-center bg-gradient-to-b from-slate-100 via-blue-50 to-slate-100 hover:from-blue-100 hover:via-blue-100 hover:to-blue-100 transition-all duration-200 group"
        onMouseDown={handleMouseDown}
      >
        <div className="w-1 h-12 bg-gradient-to-b from-slate-300 via-blue-400 to-slate-300 rounded-full group-hover:from-blue-400 group-hover:via-blue-500 group-hover:to-blue-400 transition-all duration-200"></div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 bg-gradient-to-b from-slate-50/50 to-white mt-[5rem]">
          {view === "main" && (
            <MainView onPageThemeChange={onPageThemeChange} setView={setView} />
          )}

          {view === "add-section" && (
            <AddSectionView onSectionAdd={onSectionAdd} />
          )}

          {view === "branding-settings" && <BrandingSettings />}

          {view === "edit-component" && selectedComponent && (
            <EditComponentView
              selectedComponent={selectedComponent}
              tempData={tempData}
              globalHeaderVariant={globalHeaderVariant}
              globalFooterVariant={globalFooterVariant}
              setGlobalHeaderVariant={setGlobalHeaderVariant}
              setGlobalFooterVariant={setGlobalFooterVariant}
              setGlobalHeaderData={setGlobalHeaderData}
              setGlobalFooterData={setGlobalFooterData}
              setGlobalComponentsData={setGlobalComponentsData}
              globalComponentsData={globalComponentsData}
              setHasChangesMade={setHasChangesMade}
              onComponentThemeChange={onComponentThemeChange}
              onComponentReset={onComponentReset}
              updateByPath={updateByPath}
              updateComponentByPath={updateComponentByPath}
              handleInputChange={handleInputChange}
            />
          )}
        </div>

        <SidebarFooter
          view={view}
          selectedComponent={selectedComponent}
          handleSave={handleSave}
          onClose={onClose}
          setView={setView}
          setTempData={setTempData}
        />
      </div>
    </div>
  );
}

// Export the main component as default
export default EditorSidebar;
