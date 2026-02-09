import { useEffect } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultProjectDetailsData } from "@/context/editorStoreFunctions/projectDetailsFunctions";
import { ProjectDetailsProps } from "../types";

/**
 * Hook to manage project details store integration
 */
export const useProjectStore = (props: ProjectDetailsProps) => {
  const variantId = props.variant || "projectDetails1";
  const uniqueId = props.id || variantId;

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

    for (const [pageSlug, pageComponents] of Object.entries(
      tenantData.componentSettings,
    )) {
      if (
        typeof pageComponents === "object" &&
        !Array.isArray(pageComponents)
      ) {
        for (const [componentId, component] of Object.entries(
          pageComponents as any,
        )) {
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

  // Initialize in store
  useEffect(() => {
    if (props.useStore) {
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultProjectDetailsData(),
              ...tenantComponentData,
              ...props,
            }
          : {
              ...getDefaultProjectDetailsData(),
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

  // Merge data with correct priority
  const defaultData = getDefaultProjectDetailsData();
  const hasTenantData =
    tenantComponentData &&
    Object.keys(tenantComponentData).length > 0;
  const isStoreDataDefault =
    currentStoreData?.content?.title === defaultData?.content?.title;

  const mergedData = {
    ...defaultData,
    ...props,
    ...(hasTenantData ? tenantComponentData : {}),
    ...(hasTenantData && isStoreDataDefault
      ? {}
      : currentStoreData),
  };

  // Get primary color
  const primaryColor =
    mergedData.styling?.primaryColor ||
    (tenantData?.WebsiteLayout?.branding?.colors?.primary &&
    tenantData.WebsiteLayout.branding.colors.primary.trim() !== ""
      ? tenantData.WebsiteLayout.branding.colors.primary
      : "#059669");

  return {
    mergedData,
    primaryColor,
    uniqueId,
  };
};
