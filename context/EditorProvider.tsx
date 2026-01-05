// context/EditorProvider.tsx
"use client";

import { ReactNode } from "react";
import toast from "react-hot-toast";
import SaveConfirmationDialog from "@/components/SaveConfirmationDialog";
import { useEditorStore } from "./editorStore";
import useAuthStore from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import useTenantStore from "./tenantStore";

export function EditorProvider({ children }: { children: ReactNode }) {
  const { showDialog, closeDialog, openSaveDialogFn } = useEditorStore();
  const { userData } = useAuthStore();
  // tenantId يمكن أن يكون subdomain (tenant1) أو custom domain (hey.com)
  const tenantId = userData?.username;

  const confirmSave = async () => {
    // Execute any page-provided save logic first (if set)
    // This updates staticPagesData from pageComponents for static pages
    openSaveDialogFn();

    // Collect all component states from the editor store
    // Get fresh state after openSaveDialogFn() has updated staticPagesData
    const state = useEditorStore.getState();

    // Get tenantData for username and websiteName
    const currentTenantData = useTenantStore.getState().tenantData;
    const username = currentTenantData?.username || tenantId || "";
    const websiteName = currentTenantData?.websiteName || tenantId || "";

    // Log detailed component info for each page
    Object.entries(state.pageComponentsByPage).forEach(([page, components]) => {
      // Log detailed data for each component
      components.forEach((component) => {});
    });

    // Ensure header and footer contain variant inside their data
    const headerData = state.globalComponentsData?.header || {};
    const footerData = state.globalComponentsData?.footer || {};
    const headerVariant = state.globalHeaderVariant || "StaticHeader1";
    const footerVariant = state.globalFooterVariant || "StaticFooter1";

    // Get static page slugs to exclude them from pages
    const staticPageSlugs = new Set(Object.keys(state.staticPagesData || {}));

    // Convert pageComponentsByPage to pages format (array format) for API
    // ⚠️ Exclude static pages - they should only be in StaticPages, not in pages
    // Note: API builds componentSettings from pages array, so we don't need to send it
    const pages: Record<string, any[]> = {};
    Object.entries(state.pageComponentsByPage).forEach(
      ([pageSlug, components]) => {
        // Skip static pages - they are handled separately in StaticPages
        if (staticPageSlugs.has(pageSlug)) {
          return;
        }

        // pages format: array of components (API expects this format)
        pages[pageSlug] = components.map((comp: any) => ({
          id: comp.id,
          type: comp.type,
          name: comp.name,
          componentName: comp.componentName,
          data: comp.data || {},
          position: comp.position || 0,
          layout: (comp as any).layout || { row: 0, col: 0, span: 2 },
        }));
      },
    );

    const payload: any = {
      tenantId: username, // API requires tenantId (maps to username in database)
      username: username,
      websiteName: websiteName,
      pages: pages, // API requires pages in array format (API builds componentSettings from this)
      globalComponentsData: {
        ...state.globalComponentsData,
        header: {
          ...headerData,
          variant: headerVariant, // Ensure variant is inside header data
        },
        footer: {
          ...footerData,
          variant: footerVariant, // Ensure variant is inside footer data
        },
        globalHeaderVariant: headerVariant,
        globalFooterVariant: footerVariant,
      },
      WebsiteLayout: state.WebsiteLayout || {
        metaTags: {
          pages: [],
        },
      },
    };

    // Collect all theme backups from ThemesBackup field (NEW: separate field)
    // Exclude the current theme (it's already in pages and globalComponentsData)
    const themesBackup: Record<string, any> = {};
    const currentTheme = state.WebsiteLayout?.currentTheme;

    // Get backups from ThemesBackup field directly
    // Regex pattern /^Theme\d+Backup$/ supports any number (1, 2, 10, 11, 100, etc.)
    if (state.ThemesBackup && typeof state.ThemesBackup === "object") {
      Object.entries(state.ThemesBackup).forEach(([backupKey, backupData]) => {
        if (backupKey.match(/^Theme\d+Backup$/)) {
          // Extract theme number from backup key
          const themeMatch = backupKey.match(/^Theme(\d+)Backup$/);
          const backupThemeNumber = themeMatch
            ? parseInt(themeMatch[1], 10)
            : null;

          // Only include backups that are NOT the current theme
          if (
            backupThemeNumber !== null &&
            backupThemeNumber !== currentTheme
          ) {
            themesBackup[backupKey] = backupData;
          }
        }
      });
    }

    // Add ThemesBackup to payload if it has any backups
    if (Object.keys(themesBackup).length > 0) {
      payload.ThemesBackup = themesBackup;
    }

    // ⭐ Add StaticPages to payload if it has any data
    // Get fresh staticPagesData after openSaveDialogFn() has updated it
    const freshState = useEditorStore.getState();
    const hasStaticPagesData =
      freshState.staticPagesData &&
      typeof freshState.staticPagesData === "object" &&
      Object.keys(freshState.staticPagesData).length > 0;

    if (hasStaticPagesData) {
      // Use fresh staticPagesData to ensure we have the latest componentName updates
      payload.StaticPages = freshState.staticPagesData;
    }

    // Send to backend to persist
    await axiosInstance
      .post("/v1/tenant-website/save-pages", payload)
      .then(() => {
        closeDialog();
        toast.success("Changes saved successfully!");

        // ⭐ NEW: Update tenantStore.tenantData with saved data
        // This prevents loading old data when navigating back to a page
        const currentTenantData = useTenantStore.getState().tenantData;

        if (currentTenantData) {
          // Get static page slugs to exclude them from componentSettings
          const staticPageSlugs = new Set(
            Object.keys(state.staticPagesData || {}),
          );

          // Convert pageComponentsByPage to componentSettings format
          // ⚠️ Exclude static pages - they should only be in StaticPages, not in componentSettings
          const updatedComponentSettings: Record<string, any> = {};
          Object.entries(state.pageComponentsByPage).forEach(
            ([pageSlug, components]) => {
              // Skip static pages - they are handled separately in StaticPages
              if (staticPageSlugs.has(pageSlug)) {
                return;
              }

              updatedComponentSettings[pageSlug] = {};
              components.forEach((comp: any) => {
                updatedComponentSettings[pageSlug][comp.id] = {
                  type: comp.type,
                  name: comp.name,
                  componentName: comp.componentName,
                  data: comp.data || {},
                  position: comp.position || 0,
                  layout: (comp as any).layout || { row: 0, col: 0, span: 2 },
                };
              });
            },
          );

          // Update tenantStore with new data
          useTenantStore.setState({
            tenantData: {
              ...currentTenantData,
              componentSettings: updatedComponentSettings,
              globalComponentsData: state.globalComponentsData,
              WebsiteLayout: state.WebsiteLayout,
            },
          });

          console.log("✅ tenantStore.tenantData updated after save");
        }
      })
      .catch((e) => {
        console.error("[Save All] Error saving pages:", e);
        closeDialog();
        toast.error(
          e.response?.data?.message || e.message || "Failed to save changes",
        );
      });
  };

  return (
    <>
      {children}
      <SaveConfirmationDialog
        open={showDialog}
        isThemeConfirmation={false}
        onClose={closeDialog}
        onConfirm={confirmSave}
      />
    </>
  );
}
