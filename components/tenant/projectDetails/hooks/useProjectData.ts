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

  // Get branding colors from WebsiteLayout (fallback to brown #8b5f46)
  const brandingColors = {
    primary:
      tenantData?.WebsiteLayout?.branding?.colors?.primary &&
      tenantData.WebsiteLayout.branding.colors.primary.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.primary
        : "#8b5f46", // Brown fallback
    secondary:
      tenantData?.WebsiteLayout?.branding?.colors?.secondary &&
      tenantData.WebsiteLayout.branding.colors.secondary.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.secondary
        : "#8b5f46", // Fallback to brown
    accent:
      tenantData?.WebsiteLayout?.branding?.colors?.accent &&
      tenantData.WebsiteLayout.branding.colors.accent.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.accent
        : "#8b5f46", // Fallback to brown
  };

  // Helper function to get primary color based on useDefaultColor and globalColorType
  const getPrimaryColor = (): string => {
    // ColorObjectRenderer saves data in this structure:
    // When useDefaultColor = true:
    //   - styling.primaryColor.useDefaultColor = true
    //   - styling.primaryColor.globalColorType = "primary" | "secondary" | "accent"
    // When useDefaultColor = false:
    //   - styling.primaryColor = "#hexcolor" (direct string)
    
    const colorField = mergedData?.styling?.primaryColor;
    
    // Get useDefaultColor and globalColorType from the color field
    let useDefaultColorValue: boolean | undefined;
    let globalColorTypeValue: string | undefined;
    
    if (colorField && typeof colorField === "object" && !Array.isArray(colorField)) {
      useDefaultColorValue = colorField.useDefaultColor;
      globalColorTypeValue = colorField.globalColorType;
    }
    
    // Also check at the path level (ColorObjectRenderer stores them separately)
    if (useDefaultColorValue === undefined) {
      useDefaultColorValue = mergedData?.styling?.primaryColor?.useDefaultColor;
    }
    if (globalColorTypeValue === undefined) {
      globalColorTypeValue = mergedData?.styling?.primaryColor?.globalColorType;
    }
    
    // Check useDefaultColor value (default is true if not specified)
    const useDefaultColor = useDefaultColorValue !== undefined ? useDefaultColorValue : true;
    
    // If useDefaultColor is true, use branding color from WebsiteLayout
    if (useDefaultColor) {
      const globalColorType = (globalColorTypeValue || "primary") as keyof typeof brandingColors;
      const brandingColor = brandingColors[globalColorType] || brandingColors.primary;
      return brandingColor;
    }
    
    // If useDefaultColor is false, try to get custom color
    // The color is stored as a string directly at styling.primaryColor
    if (
      colorField &&
      typeof colorField === "string" &&
      colorField.trim() !== "" &&
      colorField.startsWith("#")
    ) {
      return colorField.trim();
    }
    
    // If colorField is an object, check for value property
    if (colorField && typeof colorField === "object" && !Array.isArray(colorField)) {
      if (
        colorField.value &&
        typeof colorField.value === "string" &&
        colorField.value.trim() !== "" &&
        colorField.value.startsWith("#")
      ) {
        return colorField.value.trim();
      }
    }
    
    // Final fallback: use primary branding color
    return brandingColors.primary;
  };

  // Get primary color using the helper function
  const primaryColor = getPrimaryColor();

  // Helper to resolve a color field (useDefaultColor + globalColorType or custom hex)
  const getColorFromField = (
    colorField: unknown,
    fallback: string,
  ): string => {
    if (!colorField) return fallback;
    let useDefaultColorValue: boolean | undefined;
    let globalColorTypeValue: string | undefined;
    if (
      typeof colorField === "object" &&
      colorField !== null &&
      !Array.isArray(colorField)
    ) {
      useDefaultColorValue = (colorField as any).useDefaultColor;
      globalColorTypeValue = (colorField as any).globalColorType;
    }
    const useDefaultColor = useDefaultColorValue !== undefined ? useDefaultColorValue : true;
    if (useDefaultColor) {
      const globalColorType = (globalColorTypeValue || "primary") as keyof typeof brandingColors;
      return brandingColors[globalColorType] || brandingColors.primary;
    }
    if (
      typeof colorField === "string" &&
      colorField.trim() !== "" &&
      colorField.startsWith("#")
    ) {
      return colorField.trim();
    }
    if (
      typeof colorField === "object" &&
      colorField !== null &&
      !Array.isArray(colorField) &&
      (colorField as any).value &&
      typeof (colorField as any).value === "string" &&
      (colorField as any).value.startsWith("#")
    ) {
      return (colorField as any).value.trim();
    }
    return fallback;
  };

  const heroBackgroundType = mergedData.hero?.background?.type ?? "imageAndColor";
  const defaultHeroImage = "/images/placeholders/projectDetails2/hero.jpg";
  const heroImageSrc =
    mergedData.hero?.background?.image?.trim() ||
    defaultHeroImage;

  const getHeroBackgroundColor = (): string =>
    getColorFromField(mergedData.hero?.background?.color, brandingColors.primary);

  const getHeroOverlayColor = (): string =>
    getColorFromField(
      mergedData.hero?.background?.overlay?.color,
      brandingColors.primary,
    );

  const heroOverlayOpacity =
    typeof mergedData.hero?.background?.overlay?.opacity === "number"
      ? mergedData.hero.background.overlay.opacity
      : typeof mergedData.hero?.overlayOpacity === "number"
        ? mergedData.hero.overlayOpacity
        : 0.8;

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
    heroBackgroundType,
    heroImageSrc,
    getHeroBackgroundColor,
    getHeroOverlayColor,
    heroOverlayOpacity,
  };
};
