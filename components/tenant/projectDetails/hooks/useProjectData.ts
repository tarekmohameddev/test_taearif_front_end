import { useEffect } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultProjectDetails2Data } from "@/context/editorStoreFunctions/projectDetailsFunctions";
import type { ProjectDetails2Props } from "../types";

export const useProjectData = (props: ProjectDetails2Props) => {
  const variantId = props.variant || "projectDetails2";
  const uniqueId = props.id || variantId;

  // Connect to stores
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const projectDetailsStates = useEditorStore((s) => s.projectDetailsStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // Initialize tenant data
  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Extract component data from tenantData
  const getTenantComponentData = () => {
    if (!tenantData?.componentSettings) {
      return {};
    }
    // Search through all pages for this component variant
    for (const [pageSlug, pageComponents] of Object.entries(
      tenantData.componentSettings,
    )) {
      // Check if pageComponents is an object (not array)
      if (
        typeof pageComponents === "object" &&
        !Array.isArray(pageComponents)
      ) {
        // Search through all components in this page
        for (const [componentId, component] of Object.entries(
          pageComponents as any,
        )) {
          // Check if this is the exact component we're looking for by ID
          if (
            (component as any).type === "projectDetails" &&
            (componentId === props.id ||
              (component as any).id === props.id ||
              (component as any).id === uniqueId)
          ) {
            return (component as any).data;
          }
        }
      }
      // Also handle array format
      if (Array.isArray(pageComponents)) {
        for (const component of pageComponents) {
          if (
            (component as any).type === "projectDetails" &&
            ((component as any).id === props.id ||
              (component as any).id === uniqueId)
          ) {
            return (component as any).data;
          }
        }
      }
    }
    return {};
  };

  const tenantComponentData = getTenantComponentData();

  // Initialize component in store
  useEffect(() => {
    if (props.useStore) {
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultProjectDetails2Data(),
              ...tenantComponentData,
              ...props,
            }
          : {
              ...getDefaultProjectDetails2Data(),
              ...props,
            };

      ensureComponentVariant("projectDetails", uniqueId, initialData);
    }
  }, [
    uniqueId,
    props.useStore,
    ensureComponentVariant,
    tenantComponentData,
    props,
  ]);

  // Retrieve data from store
  const storeData = props.useStore
    ? projectDetailsStates[uniqueId] || {}
    : {};
  const currentStoreData = props.useStore
    ? getComponentData("projectDetails", uniqueId) || {}
    : {};

  // Get default data
  const defaultData = getDefaultProjectDetails2Data();

  // Check if tenantComponentData exists
  const hasTenantData =
    tenantComponentData && Object.keys(tenantComponentData).length > 0;

  // Check if currentStoreData is just default data
  const isStoreDataDefault =
    currentStoreData?.content?.descriptionTitle ===
    defaultData?.content?.descriptionTitle;

  // Merge data with correct priority
  const mergedData = {
    ...defaultData, // 1. Defaults (lowest priority)
    ...props, // 2. Props from parent component
    ...(hasTenantData ? tenantComponentData : {}), // 3. Backend data (tenant data)
    ...(hasTenantData && isStoreDataDefault
      ? {}
      : currentStoreData), // 4. Current store data (highest priority if not default)
  };

  // Get primary color
  const primaryColor =
    mergedData.styling?.primaryColor ||
    (tenantData?.WebsiteLayout?.branding?.colors?.primary &&
    tenantData.WebsiteLayout.branding.colors.primary.trim() !== ""
      ? tenantData.WebsiteLayout.branding.colors.primary
      : "#8b5f46");

  // Get logo image from tenantData
  const { loadingTenantData } = useTenantStore();
  const logoImage = loadingTenantData
    ? null
    : tenantData?.globalComponentsData?.header?.logo?.image ||
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/logo.png`;

  return {
    mergedData,
    primaryColor,
    logoImage,
    tenantData,
  };
};
