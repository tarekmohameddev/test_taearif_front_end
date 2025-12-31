// ============================================================================
// LiveEditor Iframe Content Component
// ============================================================================

import React, { Suspense, useMemo } from "react";
import { motion } from "framer-motion";
import { LiveEditorDropZone } from "@/services-liveeditor/live-editor/dragDrop";
import { LiveEditorDraggableComponent } from "@/services-liveeditor/live-editor/dragDrop/DraggableComponent";
import { CachedComponent } from "@/services-liveeditor/live-editor";
import StaticHeader1 from "@/components/tenant/header/StaticHeader1";
import StaticFooter1 from "@/components/tenant/footer/StaticFooter1";
import { SkeletonLoader } from "@/components/skeleton";
import type { DeviceType } from "../types";

interface LiveEditorIframeContentProps {
  backendDataState: {
    componentsWithMergedData: Array<{
      [key: string]: any;
      mergedData: any;
    }>;
    globalHeaderData: any;
    globalFooterData: any;
  };
  selectedDevice: DeviceType;
  deviceDimensions: any;
  HeaderComponent: any;
  FooterComponent: any;
  globalHeaderVariant: string;
  globalFooterVariant: string;
  pageComponents: any[];
  state: any;
  selectedComponentId: string | null;
  handleEditClick: (id: string) => void;
  handleDeleteClick: (id: string) => void;
}

export function LiveEditorIframeContent({
  backendDataState,
  selectedDevice,
  deviceDimensions,
  HeaderComponent,
  FooterComponent,
  globalHeaderVariant,
  globalFooterVariant,
  pageComponents,
  state,
  selectedComponentId,
  handleEditClick,
  handleDeleteClick,
}: LiveEditorIframeContentProps) {
  // ⭐ CRITICAL: Memoize header data and key to prevent infinite loops
  // Only recalculate when actual data changes, not on every render
  const { headerDataWithoutVariant, headerKey } = useMemo(() => {
    const headerData = backendDataState.globalHeaderData
      ? (() => {
          const { variant: _variant, ...data } =
            backendDataState.globalHeaderData;
          return data;
        })()
      : {};

    // Use a simple hash instead of full JSON.stringify to prevent key changes on every render
    // Only include variant in key, data changes will be handled by props
    const key = `global-header-${globalHeaderVariant}`;

    return {
      headerDataWithoutVariant: headerData,
      headerKey: key,
    };
  }, [backendDataState.globalHeaderData, globalHeaderVariant]);

  // ⭐ CRITICAL: Memoize footer data and key to prevent infinite loops
  const { footerDataWithoutVariant, footerKey } = useMemo(() => {
    const footerData = backendDataState.globalFooterData
      ? (() => {
          const { variant: _variant, ...data } =
            backendDataState.globalFooterData;
          return data;
        })()
      : {};

    const key = `global-footer-${globalFooterVariant}`;

    return {
      footerDataWithoutVariant: footerData,
      footerKey: key,
    };
  }, [backendDataState.globalFooterData, globalFooterVariant]);

  return (
    <div
      className={`w-full h-full overflow-auto ${
        selectedDevice === "phone"
          ? "max-w-[375px] mx-auto"
          : selectedDevice === "tablet"
            ? "max-w-[768px] mx-auto"
            : "w-full"
      }`}
      style={
        {
          "--device-type": selectedDevice,
          "--device-width":
            typeof deviceDimensions[selectedDevice].width === "number"
              ? `${deviceDimensions[selectedDevice].width}px`
              : deviceDimensions[selectedDevice].width,
          "--device-height":
            typeof deviceDimensions[selectedDevice].height === "number"
              ? `${deviceDimensions[selectedDevice].height}px`
              : deviceDimensions[selectedDevice].height,
        } as React.CSSProperties
      }
      data-live-editor-entry
    >
      {/* Static Header - Clickable for editing */}
      <div
        onClick={(e) => {
          // منع جميع الأحداث داخل الـ Header
          e.preventDefault();
          e.stopPropagation();
          handleEditClick("global-header");
        }}
        className="cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-opacity-50 transition-all duration-200"
        style={{
          position: "relative",
          pointerEvents: "auto",
        }}
      >
        <div style={{ pointerEvents: "none" }}>
          <Suspense fallback={<SkeletonLoader componentName="header" />}>
            {!HeaderComponent ? (
              <StaticHeader1 overrideData={headerDataWithoutVariant} />
            ) : (
              <HeaderComponent
                key={headerKey}
                overrideData={headerDataWithoutVariant}
                variant={globalHeaderVariant}
                id="global-header"
              />
            )}
          </Suspense>
        </div>
        {/* Overlay indicator */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-200"
          style={{
            background: "rgba(59, 130, 246, 0.1)",
            border: "2px dashed rgba(59, 130, 246, 0.5)",
          }}
        />
      </div>

      {/* منطقة إفلات رئيسية - محسنة للنظام الجديد */}
      <LiveEditorDropZone
        zone="root"
        minEmptyHeight={pageComponents.length === 0 ? 200 : 50}
        className={`min-h-[50px] transition-all duration-200 ${
          selectedDevice === "phone"
            ? `space-y-2 ${pageComponents.length === 0 ? "pb-[320px]" : "pb-10"} `
            : selectedDevice === "tablet"
              ? `space-y-4 ${pageComponents.length === 0 ? "pb-[800px]" : "pb-10"} `
              : `space-y-4 ${pageComponents.length === 0 ? "pb-[1300px]" : "pb-[200px]"} `
        }`}
        style={{
          background:
            pageComponents.length === 0
              ? "linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(16, 185, 129, 0.02) 100%)"
              : "transparent",
        }}
      >
        {/* عرض المكونات - محسن بانيميشن وتفاعلات */}
        {backendDataState.componentsWithMergedData.map(
          (component: any, index: number) => {
            return (
              <motion.div
                key={component.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
                className={`relative ${
                  component.layout?.span === 2
                    ? selectedDevice === "phone"
                      ? "w-full"
                      : "w-full"
                    : "w-full"
                }`}
              >
                <LiveEditorDraggableComponent
                  id={component.id}
                  componentType={component.componentName}
                  depth={1}
                  index={index}
                  zoneCompound="root"
                  isLoading={false}
                  isSelected={selectedComponentId === component.id}
                  label={component.componentName}
                  onEditClick={() => handleEditClick(component.id)}
                  onDeleteClick={() => handleDeleteClick(component.id)}
                  inDroppableZone={true}
                  autoDragAxis="both"
                >
                  {(ref: any) => (
                    <div
                      ref={ref}
                      className={`relative ${
                        selectedDevice === "phone"
                          ? "text-sm"
                          : selectedDevice === "tablet"
                            ? "text-base"
                            : "text-base"
                      }`}
                    >
                      <CachedComponent
                        key={`${component.id}-${component.componentName}-${component.forceUpdate || 0}-${selectedDevice}`}
                        componentName={component.componentName}
                        section={state.slug}
                        componentId={component.id}
                        data={
                          {
                            ...component.mergedData, // ✅ استخدام البيانات من useState
                            id: component.id,
                            useStore: true,
                            variant: component.componentName, // ⭐ FIX: Use componentName instead of id for variant
                            deviceType: selectedDevice,
                            forceUpdate: component.forceUpdate,
                          } as any
                        }
                      />
                    </div>
                  )}
                </LiveEditorDraggableComponent>
              </motion.div>
            );
          },
        )}
      </LiveEditorDropZone>

      {/* Static Footer - Clickable for editing */}
      <div
        onClick={(e) => {
          // منع جميع الأحداث داخل الـ Footer
          e.preventDefault();
          e.stopPropagation();
          handleEditClick("global-footer");
        }}
        className="cursor-pointer hover:ring-2 hover:ring-green-500 hover:ring-opacity-50 transition-all duration-200"
        style={{
          position: "relative",
          pointerEvents: "auto",
        }}
      >
        <div style={{ pointerEvents: "none" }}>
          <Suspense fallback={<SkeletonLoader componentName="footer" />}>
            {!FooterComponent ? (
              <StaticFooter1 overrideData={footerDataWithoutVariant} />
            ) : (
              <FooterComponent
                key={footerKey}
                overrideData={footerDataWithoutVariant}
                variant={globalFooterVariant}
                id="global-footer"
              />
            )}
          </Suspense>
        </div>
        {/* Overlay indicator */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-200"
          style={{
            background: "rgba(34, 197, 94, 0.1)",
            border: "2px dashed rgba(34, 197, 94, 0.5)",
          }}
        />
      </div>
    </div>
  );
}
