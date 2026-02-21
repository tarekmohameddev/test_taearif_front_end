"use client";
import { useRef, useEffect } from "react";
import { useEditorStore } from "@/context/editorStore";
import { ComponentInstance } from "@/lib/types";
import { useEventDebug } from "@/lib/debug/live-editor/hooks/useEventDebug";

// Effects
import { useAuthEffect } from "./effects/useAuthEffect";
import { useTenantDataEffect } from "./effects/useTenantDataEffect";
import { useDatabaseLoadingEffect } from "./effects/useDatabaseLoadingEffect";
import { useRegisteredComponentsEffect } from "./effects/useRegisteredComponentsEffect";
import { useComponentNamesEffect } from "./effects/useComponentNamesEffect";
import { useStoreSyncEffect } from "./effects/useStoreSyncEffect";
import { useStaticPagesSyncEffect } from "./effects/useStaticPagesSyncEffect";
import { useThemeChangeEffect } from "./effects/useThemeChangeEffect";
import { useLastSyncedRef } from "./effects/useLastSyncedRef";
import { useCurrentPageEffect } from "./effects/useCurrentPageEffect";
import { useStaticPagesSubscriptionEffect } from "./effects/useStaticPagesSubscriptionEffect";
import { useSaveFunctionEffect } from "./effects/useSaveFunctionEffect";

// ============================================================================
// useEffect Hooks للـ LiveEditor
// ============================================================================

export function useLiveEditorEffects(state: any) {
  const {
    user,
    authLoading,
    tenantId,
    fetchTenantData,
    tenantLoading,
    tenantData,
    initialized,
    setInitialized,
    pageComponents,
    setPageComponents,
    registeredComponents,
    setRegisteredComponents,
    slug,
  } = state;

  // Debug tracking
  const { emitEvent } = useEventDebug();
  const store = useEditorStore.getState();

  // Emit LIVE_EDITOR_OPENED event
  useEffect(() => {
    if (initialized) {
      emitEvent("LIVE_EDITOR_OPENED", {
        context: {
          component: {
            id: "live-editor",
            type: "live-editor",
            variant: "main",
            name: "Live Editor",
          },
          location: {
            file: "LiveEditorEffects.tsx",
            function: "useLiveEditorEffects",
            line: 0,
          },
          user: {
            action: "open",
            page: slug || "homepage",
          },
          editor: {
            currentPage: store.currentPage || slug || "homepage",
            componentsCount: pageComponents.length,
            globalHeaderVariant: store.globalHeaderVariant || null,
            globalFooterVariant: store.globalFooterVariant || null,
          },
        },
        details: {
          action: "live_editor_opened",
          source: "useLiveEditorEffects",
        },
      });
    }
  }, [initialized, slug, pageComponents.length]);

  // Get theme change timestamp for useThemeChangeEffect
  const themeChangeTimestamp = useEditorStore(
    (state) => state.themeChangeTimestamp,
  );

  // Get staticPagesData for useStaticPagesSyncEffect
  const staticPagesData = useEditorStore((state) => state.staticPagesData);

  // Initialize lastSyncedRef (shared across multiple effects)
  const lastSyncedRef = useLastSyncedRef();

  // Authentication Effect
  useAuthEffect({ user, authLoading });

  // Tenant Data Loading Effect
  useTenantDataEffect({ tenantId, fetchTenantData });

  // Database Loading Effect
  useDatabaseLoadingEffect({
    initialized,
    authLoading,
    tenantLoading,
    tenantData,
    slug,
    setPageComponents,
    setInitialized,
  });

  // Registered Components Effect
  useRegisteredComponentsEffect({
    tenantData,
    setRegisteredComponents,
  });

  // Component Names Update Effect
  useComponentNamesEffect({
    registeredComponents,
    slug,
    pageComponents,
    setPageComponents,
  });

  // Store Sync Effect
  useStoreSyncEffect({
    initialized,
    slug,
    tenantData,
    pageComponents,
    setPageComponents,
    lastSyncedRef,
  });

  // Static Pages Sync Effect
  useStaticPagesSyncEffect({
    initialized,
    slug,
    tenantData,
    staticPagesData,
    setPageComponents,
    lastSyncedRef,
  });

  // Theme Change Reset Effect
  useThemeChangeEffect({
    themeChangeTimestamp,
    lastSyncedRef,
  });

  // Current Page Update Effect
  useCurrentPageEffect({ slug });

  // Static Pages Subscription Effect
  useStaticPagesSubscriptionEffect({
    slug,
    pageComponents,
    setPageComponents,
  });

  // Save Function Setup Effect
  useSaveFunctionEffect({
    slug,
    pageComponents,
  });
}
