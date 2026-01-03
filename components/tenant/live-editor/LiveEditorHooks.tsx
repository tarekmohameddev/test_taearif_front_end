"use client";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import useTenantStore from "@/context/tenantStore";
import { ComponentInstance, ComponentData } from "@/lib/types";
import { DropIndicator } from "@/services/live-editor";
import {
  createInitialComponents,
  PAGE_DEFINITIONS,
} from "@/services/live-editor";

// ============================================================================
// Hooks والـ State Management للـ LiveEditor
// ============================================================================

export function useLiveEditorState() {
  const tenantId = useTenantStore((s) => s.tenantId);
  const slug = useParams<{ slug?: string }>()?.slug || "homepage";

  const { user, loading: authLoading } = useAuth();
  const {
    fetchTenantData,
    loading: tenantLoading,
    tenant,
    tenantData,
  } = useTenantStore();

  // State Management
  const [sidebarWidth, setSidebarWidth] = useState(600);
  const [initialized, setInitialized] = useState(false);

  // تهيئة المكونات فوراً بالبيانات الافتراضية
  const [pageComponents, setPageComponents] = useState<ComponentInstance[]>(
    () => createInitialComponents(slug),
  );

  const [registeredComponents, setRegisteredComponents] = useState<
    Record<string, any>
  >({});

  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState<
    "main" | "add-section" | "edit-component" | "branding-settings"
  >("main");

  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null,
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState<string | null>(
    null,
  );

  const [deletePageDialogOpen, setDeletePageDialogOpen] = useState(false);
  const [deletePageConfirmation, setDeletePageConfirmation] = useState("");

  // مؤشر الإفلات
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(
    null,
  );

  return {
    // Params
    tenantId,
    slug,

    // Auth & Tenant
    user,
    authLoading,
    tenantLoading,
    tenant,
    tenantData,
    fetchTenantData,

    // State
    sidebarWidth,
    setSidebarWidth,
    initialized,
    setInitialized,
    pageComponents,
    setPageComponents,
    registeredComponents,
    setRegisteredComponents,
    activeId,
    setActiveId,
    sidebarOpen,
    setSidebarOpen,
    sidebarView,
    setSidebarView,
    selectedComponentId,
    setSelectedComponentId,
    deleteDialogOpen,
    setDeleteDialogOpen,
    componentToDelete,
    setComponentToDelete,
    deletePageDialogOpen,
    setDeletePageDialogOpen,
    deletePageConfirmation,
    setDeletePageConfirmation,
    dropIndicator,
    setDropIndicator,
  };
}

export function useLiveEditorComputed(
  state: ReturnType<typeof useLiveEditorState>,
) {
  const { pageComponents, selectedComponentId, slug } = state;

  // Computed Values
  const componentOrderIds = useMemo(
    () => pageComponents.map((c) => c.id),
    [pageComponents],
  );

  const selectedComponent = useMemo(() => {
    // Handle global components
    if (selectedComponentId === "global-header") {
      return {
        id: "global-header",
        type: "header",
        componentName: "header1",
        data: {},
      };
    }
    if (selectedComponentId === "global-footer") {
      return {
        id: "global-footer",
        type: "footer",
        componentName: "footer1",
        data: {},
      };
    }

    // Handle regular page components
    return pageComponents.find((c) => c.id === selectedComponentId);
  }, [selectedComponentId, pageComponents]);

  // Get page title for display
  const pageTitle = useMemo(() => {
    if (slug === "homepage") return "Homepage";
    return slug.charAt(0).toUpperCase() + slug.slice(1);
  }, [slug]);

  // Check if this is a predefined page
  const isPredefinedPage = useMemo(() => {
    return Object.keys(PAGE_DEFINITIONS).includes(slug);
  }, [slug]);

  return {
    componentOrderIds,
    selectedComponent,
    pageTitle,
    isPredefinedPage,
  };
}
