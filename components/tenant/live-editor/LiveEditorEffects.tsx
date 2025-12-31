"use client";
import { useRef } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { ComponentInstance } from "@/lib-liveeditor/types";

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
