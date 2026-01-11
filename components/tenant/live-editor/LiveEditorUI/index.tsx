"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEditorStore } from "@/context/editorStore";
import { useEditorT } from "@/context/editorI18nStore";
import { EnhancedLiveEditorDragDropContext } from "@/services/live-editor/dragDrop/EnhancedLiveEditorDragDropContext";
import {
  validateComponentPositions,
  PositionValidation,
  PositionDebugInfo,
} from "@/services/live-editor/dragDrop/enhanced-position-tracker";
import { EditorSidebar } from "@/components/tenant/live-editor/EditorSidebar";
import { ComponentsSidebar } from "@/components/tenant/live-editor/ComponentsSidebar";
import { DebugControls } from "@/components/tenant/live-editor/debug/DebugControls";

// Import extracted modules
import type { LiveEditorUIProps, DeviceType } from "./types";
import { getDeviceDimensions } from "./constants";
import AutoFrame from "./AutoFrame/AutoFrame";
import { useStaticPageDetection } from "./hooks/useStaticPageDetection";
import { useGlobalComponents } from "./hooks/useGlobalComponents";
import { useBackendDataState } from "./hooks/useBackendDataState";
import { useDeviceManagement } from "./hooks/useDeviceManagement";
import { useComponentHandlers } from "./hooks/useComponentHandlers";
import { LiveEditorHeader } from "./components/LiveEditorHeader";
import { LiveEditorIframeContent } from "./components/LiveEditorIframeContent";
import { DeleteComponentDialog } from "./components/Dialogs/DeleteComponentDialog";
import { DeletePageDialog } from "./components/Dialogs/DeletePageDialog";
import { ChangesMadeDialog } from "./components/Dialogs/ChangesMadeDialog";
import { DebugPanel } from "./components/DebugPanel";

export function LiveEditorUI({ state, computed, handlers }: LiveEditorUIProps) {
  const t = useEditorT();
  const deviceDimensions = getDeviceDimensions(t);
  const {
    user,
    pageComponents,
    selectedComponentId,
    sidebarOpen,
    sidebarView,
    deleteDialogOpen,
    deletePageDialogOpen,
    deletePageConfirmation,
    setDeletePageConfirmation,
    setDeleteDialogOpen,
    setDeletePageDialogOpen,
  } = state;

  // Store subscriptions
  const hasChangesMade = useEditorStore((s) => s.hasChangesMade);
  const themeChangeTimestamp = useEditorStore((s) => s.themeChangeTimestamp);
  const staticPagesData = useEditorStore((s) => s.staticPagesData);

  // Custom hooks
  const isStaticPage = useStaticPageDetection(state.slug);
  const {
    globalHeaderVariant,
    globalFooterVariant,
    HeaderComponent,
    FooterComponent,
    globalHeaderData,
    globalFooterData,
  } = useGlobalComponents();

  const { backendDataState } = useBackendDataState({
    pageComponents,
    slug: state.slug,
    globalHeaderData,
    globalFooterData,
    globalFooterVariant,
    themeChangeTimestamp,
    selectedComponentId,
    staticPagesData,
  });

  const { selectedDevice, handleDeviceChange, screenWidth } =
    useDeviceManagement({
      pageComponents,
      state,
    });

  // Local state
  const [sidebarWidth, setSidebarWidth] = useState(state.sidebarWidth);
  const [iframeReady, setIframeReady] = useState(false);
  const [isComponentsSidebarOpen, setIsComponentsSidebarOpen] = useState(false);
  const [
    wasComponentsSidebarManuallyClosed,
    setWasComponentsSidebarManuallyClosed,
  ] = useState(false);
  const [showChangesDialog, setShowChangesDialog] = useState(false);
  const [previousHasChangesMade, setPreviousHasChangesMade] = useState(false);
  const [debugInfo, setDebugInfo] = useState<PositionDebugInfo | null>(null);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [positionValidation, setPositionValidation] =
    useState<PositionValidation | null>(null);
  const [showDebugControls, setShowDebugControls] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // ⭐ CRITICAL: Use ref to track previous pageComponents to prevent infinite loops
  const prevPageComponentsRef = useRef<string>("");

  // Component handlers
  const {
    handleAddComponent,
    handleMoveComponent,
    handlePositionDebug,
    handleResetPositions,
  } = useComponentHandlers({
    pageComponents,
    state,
    selectedComponentId,
    setDebugInfo,
    setPositionValidation,
    setWasComponentsSidebarManuallyClosed,
  });

  // Detect when hasChangesMade changes from false to true
  useEffect(() => {
    if (hasChangesMade && !previousHasChangesMade) {
      setShowChangesDialog(true);
    }
    setPreviousHasChangesMade(hasChangesMade);
  }, [hasChangesMade, previousHasChangesMade]);

  // Prevent Radix UI from adding pointer-events: none to body
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const body = document.body;
      if (body.style.pointerEvents === "none") {
        body.style.pointerEvents = "";
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });

    const checkAndRemove = () => {
      const body = document.body;
      if (body.style.pointerEvents === "none") {
        body.style.pointerEvents = "";
      }
    };

    checkAndRemove();
    const interval = setInterval(checkAndRemove, 50);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  // Control Components Sidebar based on screen width
  useEffect(() => {
    if (screenWidth >= 1300 && !wasComponentsSidebarManuallyClosed) {
      setIsComponentsSidebarOpen(true);
    } else if (screenWidth < 1300) {
      setIsComponentsSidebarOpen(false);
    }
  }, [screenWidth, wasComponentsSidebarManuallyClosed]);

  // Close Components Sidebar when Editor Sidebar opens
  useEffect(() => {
    if (sidebarOpen) {
      setIsComponentsSidebarOpen(false);
    }
  }, [sidebarOpen]);

  // Close Components Sidebar when view changes to edit-component
  useEffect(() => {
    if (sidebarView === "edit-component") {
      setIsComponentsSidebarOpen(false);
    }
  }, [sidebarView]);

  // Re-open Components Sidebar when Editor Sidebar closes
  useEffect(() => {
    if (!sidebarOpen && !wasComponentsSidebarManuallyClosed) {
      setIsComponentsSidebarOpen(true);
    }
  }, [sidebarOpen, wasComponentsSidebarManuallyClosed]);

  // Update sidebar width when state changes
  useEffect(() => {
    setSidebarWidth(state.sidebarWidth);
  }, [state.sidebarWidth]);

  // Update position validation when components change
  useEffect(() => {
    // ⭐ CRITICAL: Check if pageComponents actually changed using JSON.stringify
    // This prevents infinite loops from reference changes
    const currentPageComponentsStr = JSON.stringify(pageComponents);

    // If pageComponents didn't actually change, skip update
    if (prevPageComponentsRef.current === currentPageComponentsStr) {
      return; // No actual changes, skip update
    }

    // Update ref
    prevPageComponentsRef.current = currentPageComponentsStr;

    if (pageComponents.length > 0) {
      const componentsWithCorrectPositions = pageComponents.map(
        (comp: any, index: number) => {
          if (comp.position === undefined || comp.position !== index) {
            return {
              ...comp,
              position: index,
              layout: {
                ...comp.layout,
                row: index,
              },
            };
          }
          return comp;
        },
      );

      const hasPositionChanges = componentsWithCorrectPositions.some(
        (comp: any, index: number) => pageComponents[index].position !== index,
      );

      if (hasPositionChanges) {
        state.setPageComponents(componentsWithCorrectPositions);
        setTimeout(() => {
          const store = useEditorStore.getState();
          const currentPage = store.currentPage;
          store.forceUpdatePageComponents(
            currentPage,
            componentsWithCorrectPositions,
          );
        }, 0);
        return;
      }

      const validation = validateComponentPositions(pageComponents);
      setPositionValidation(validation);
    }
    // ⭐ CRITICAL: Only depend on pageComponents
    // state object changes on every render, causing infinite loops
    // Use stable dependency array with fixed size
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageComponents]);

  const { selectedComponent, pageTitle } = computed;

  const {
    openMainSidebar,
    closeSidebar,
    handleEditClick,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    handleDeletePage,
    confirmDeletePage,
    cancelDeletePage,
    handleComponentUpdate,
    handleComponentThemeChange,
    handleComponentReset,
    handleAddSection,
  } = handlers;

  // Iframe content memoized
  const iframeContent = useMemo(
    () => (
      <LiveEditorIframeContent
        backendDataState={backendDataState}
        selectedDevice={selectedDevice}
        deviceDimensions={deviceDimensions}
        HeaderComponent={HeaderComponent}
        FooterComponent={FooterComponent}
        globalHeaderVariant={globalHeaderVariant}
        globalFooterVariant={globalFooterVariant}
        pageComponents={pageComponents}
        state={state}
        selectedComponentId={selectedComponentId}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
      />
    ),
    [
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
      themeChangeTimestamp,
    ],
  );

  if (!user) {
    return null;
  }

  return (
    <EnhancedLiveEditorDragDropContext
      onComponentAdd={handleAddComponent}
      onComponentMove={handleMoveComponent}
      components={pageComponents}
      onPositionDebug={handlePositionDebug}
      disableAutoScroll={false}
      iframeRef={iframeRef}
    >
      <div className="flex min-h-screen bg-gray-50">
        {/* Components Sidebar */}
        <AnimatePresence>
          {isComponentsSidebarOpen && <ComponentsSidebar />}
        </AnimatePresence>

        {/* Main Content Area */}
        <motion.div
          className="flex-1 flex flex-col"
          animate={{
            marginRight: sidebarOpen ? sidebarWidth : 0,
            marginLeft: isComponentsSidebarOpen ? 280 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Header */}
          <LiveEditorHeader
            pageTitle={pageTitle}
            selectedDevice={selectedDevice}
            deviceDimensions={deviceDimensions}
            screenWidth={screenWidth}
            isComponentsSidebarOpen={isComponentsSidebarOpen}
            isStaticPage={isStaticPage}
            showDebugPanel={showDebugPanel}
            onToggleComponentsSidebar={() => {
              const newState = !isComponentsSidebarOpen;
              setIsComponentsSidebarOpen(newState);
              if (!newState) {
                setWasComponentsSidebarManuallyClosed(true);
              } else {
                setWasComponentsSidebarManuallyClosed(false);
              }
            }}
            onDeviceChange={handleDeviceChange}
            onOpenBrandingSettings={() => {
              state.setSidebarView("branding-settings");
              state.setSidebarOpen(true);
            }}
            onOpenAddSection={() => {
              state.setSidebarView("add-section");
              state.setSidebarOpen(true);
            }}
            onDeletePage={handleDeletePage}
            onToggleDebugPanel={() => setShowDebugPanel(!showDebugPanel)}
            t={t}
          />

          {/* Editor Content */}
          <div
            className={`flex-1 p-6 ${
              selectedDevice === "laptop" ? "" : "flex justify-center"
            }`}
          >
            <div
              className={`transition-all duration-300 ${
                selectedDevice === "laptop" ? "w-full h-full" : "rounded-lg"
              }`}
              style={{
                width:
                  typeof deviceDimensions[selectedDevice].width === "number"
                    ? `${deviceDimensions[selectedDevice].width}px`
                    : deviceDimensions[selectedDevice].width,
                height:
                  typeof deviceDimensions[selectedDevice].height === "number"
                    ? `${deviceDimensions[selectedDevice].height}px`
                    : deviceDimensions[selectedDevice].height,
                maxWidth: selectedDevice === "laptop" ? "100%" : "100%",
                maxHeight:
                  selectedDevice === "laptop" ? "100%" : "calc(100vh - 200px)",
                overflow: "auto",
              }}
            >
              <AutoFrame
                className="w-full h-full border border-gray-200 rounded-lg"
                style={{ overflow: "auto" }}
                frameRef={iframeRef}
                onReady={() => setIframeReady(true)}
                onNotReady={() => setIframeReady(false)}
              >
                {iframeContent}
              </AutoFrame>
            </div>
          </div>
        </motion.div>

        {/* Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={closeSidebar}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
                duration: 0.3,
              }}
              className="fixed right-0 top-0 h-full z-50"
              style={{ width: `${sidebarWidth}px` }}
            >
              <EditorSidebar
                isOpen={sidebarOpen}
                onClose={closeSidebar}
                view={sidebarView}
                setView={state.setSidebarView}
                selectedComponent={selectedComponent}
                onComponentUpdate={handleComponentUpdate}
                onComponentThemeChange={handleComponentThemeChange}
                onComponentReset={handleComponentReset}
                onSectionAdd={handleAddSection}
                onPageThemeChange={handlers.handlePageThemeChange}
                width={sidebarWidth}
                setWidth={state.setSidebarWidth}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dialogs */}
        <DeleteComponentDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          t={t}
        />

        <DeletePageDialog
          open={deletePageDialogOpen}
          onOpenChange={setDeletePageDialogOpen}
          confirmation={deletePageConfirmation}
          onConfirmationChange={setDeletePageConfirmation}
          onConfirm={confirmDeletePage}
          onCancel={cancelDeletePage}
          t={t}
        />

        <ChangesMadeDialog
          open={showChangesDialog}
          onOpenChange={setShowChangesDialog}
          t={t}
        />

        {/* Debug Panel */}
        <DebugPanel
          show={showDebugPanel}
          onClose={() => setShowDebugPanel(false)}
          positionValidation={positionValidation}
          hasChangesMade={hasChangesMade}
          pageComponents={pageComponents}
          selectedComponentId={selectedComponentId}
          debugInfo={debugInfo}
          onResetPositions={handleResetPositions}
          onShowDebugControls={() => setShowDebugControls(true)}
          t={t}
        />

        {/* Debug Controls */}
        {showDebugControls && process.env.NODE_ENV === "development" && (
          <DebugControls onClose={() => setShowDebugControls(false)} />
        )}
      </div>
    </EnhancedLiveEditorDragDropContext>
  );
}
