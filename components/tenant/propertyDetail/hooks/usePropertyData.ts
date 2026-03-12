import { useEffect } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultpropertyDetail2Data } from "@/context/editorStoreFunctions/propertyDetailFunctions";
import { useTenantId } from "@/hooks/useTenantId";
import type { propertyDetail2Props } from "../types/types";
import { fetchProperty } from "../services/propertyApi";
import { useState, useMemo } from "react";
import type { Property } from "../types/types";
import { getPropertyImages } from "../utils/imageUtils";

export const usePropertyData = (props: propertyDetail2Props) => {
  const variantId = props.variant || "propertyDetail2";
  const uniqueId = props.id || variantId;

  // Connect to stores
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const propertyDetailStates = useEditorStore((s) => s.propertyDetailStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // Tenant ID hook
  const { tenantId: tenantIdFromHook, isLoading: tenantLoading } =
    useTenantId();
  const finalTenantId = tenantId || tenantIdFromHook;

  // Property data state
  const [property, setProperty] = useState<Property | null>(null);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [propertyError, setPropertyError] = useState<string | null>(null);

  // Extract component data from tenantData (fetched once by wrapper / useTenantDataEffect)
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
            (component as any).type === "propertyDetail" &&
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
            (component as any).type === "propertyDetail" &&
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
              ...getDefaultpropertyDetail2Data(),
              ...tenantComponentData,
              ...props,
            }
          : {
              ...getDefaultpropertyDetail2Data(),
              ...props,
            };

      ensureComponentVariant("propertyDetail", uniqueId, initialData);
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
    ? propertyDetailStates?.[uniqueId] || {}
    : {};
  const currentStoreData = props.useStore
    ? getComponentData("propertyDetail", uniqueId) || {}
    : {};

  // Merge data (priority order)
  const defaultData = getDefaultpropertyDetail2Data();
  const hasTenantData =
    tenantComponentData &&
    Object.keys(tenantComponentData).length > 0;
  const isStoreDataDefault =
    currentStoreData?.content?.descriptionTitle ===
    defaultData?.content?.descriptionTitle;

  const mergedData = {
    ...defaultData,
    ...props,
    ...(hasTenantData ? tenantComponentData : {}),
    ...(hasTenantData && isStoreDataDefault ? {} : currentStoreData),
  };

  // Get primary color from tenantData or mergedData
  const primaryColorFromTenant =
    tenantData?.WebsiteLayout?.branding?.colors?.primary &&
    tenantData.WebsiteLayout.branding.colors.primary.trim() !== ""
      ? tenantData.WebsiteLayout.branding.colors.primary
      : "#8b5f46";

  const primaryColor =
    mergedData.styling?.primaryColor || primaryColorFromTenant;

  // Property images - computed value
  const propertyImages = useMemo(() => {
    return getPropertyImages(property);
  }, [property]);

  // Fetch property data
  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoadingProperty(true);
        setPropertyError(null);
        const propertyData = await fetchProperty(
          finalTenantId,
          props.propertySlug,
        );
        if (propertyData) {
          setProperty(propertyData);
        } else {
          setPropertyError("العقار غير موجود");
        }
      } catch (error: any) {
        setPropertyError(
          error.message || "حدث خطأ في تحميل بيانات العقار",
        );
      } finally {
        setLoadingProperty(false);
      }
    };

    if (finalTenantId && props.propertySlug) {
      loadProperty();
    }
  }, [finalTenantId, props.propertySlug]);

  return {
    mergedData,
    property,
    loadingProperty,
    propertyError,
    tenantLoading,
    primaryColor,
    tenantData,
    propertyImages,
    finalTenantId,
  };
};
