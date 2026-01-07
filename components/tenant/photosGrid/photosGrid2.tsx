"use client";

import { useEffect, useMemo } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultPhotosGridData } from "@/context/editorStoreFunctions/photosGridFunctions";

interface PhotosGridProps {
  visible?: boolean;
  layout?: {
    maxWidth?: string;
    columns?: {
      mobile?: number;
      tablet?: number;
      desktop?: number;
    };
    gap?: string;
    padding?: { top?: string; bottom?: string };
    aspectRatio?: string;
  };
  content?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    description?: string;
  };
  photos?: Array<{
    id: string;
    src: string;
    alt: string;
    caption?: string;
    tag?: string;
  }>;
  styling?: {
    backgroundColor?: string;
    titleColor?: string;
    subtitleColor?: string;
    descriptionColor?: string;
    captionColor?: string;
    tagColor?: string;
    overlayColor?: string;
    borderRadius?: string;
    imageBorderRadius?: string;
    cardShadow?: string;
    hoverScale?: string;
  };
  typography?: any;
  responsive?: any;
  animations?: any;

  variant?: string;
  useStore?: boolean;
  id?: string;
}

export default function PhotosGrid2(props: PhotosGridProps) {
  // 1. EXTRACT UNIQUE ID
  const variantId = props.variant || "photosGrid2";
  const uniqueId = props.id || variantId;
  const gridElementId = `photos-grid-${uniqueId}`;

  // 2. CONNECT TO STORES
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const photosGridStates = useEditorStore((s) => s.photosGridStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // 3. INITIALIZE IN STORE (on mount)
  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

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
          // Use componentId === props.id (most reliable identifier)
          if (
            (component as any).type === "photosGrid" &&
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
          // Search by id (most reliable identifier)
          if (
            (component as any).type === "photosGrid" &&
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

  const tenantComponentData = useMemo(
    () => getTenantComponentData(),
    [tenantData, variantId],
  );

  useEffect(() => {
    if (props.useStore) {
      const hasTenantData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0;

      const initialData = hasTenantData
        ? {
            ...getDefaultPhotosGridData(),
            ...tenantComponentData,
            ...props,
          }
        : {
            ...getDefaultPhotosGridData(),
            ...props,
          };

      ensureComponentVariant("photosGrid", uniqueId, initialData);
    }
  }, [
    uniqueId,
    props.useStore,
    ensureComponentVariant,
    tenantComponentData,
    props,
  ]);

  // 4. RETRIEVE DATA FROM STORE
  const storeData = props.useStore
    ? photosGridStates[uniqueId] || {}
    : {};
  const currentStoreData = props.useStore
    ? getComponentData("photosGrid", uniqueId) || {}
    : {};

  // 5. MERGE DATA
  // Get default data
  const defaultData = getDefaultPhotosGridData();

  // Check if tenantComponentData exists
  const hasTenantData =
    tenantComponentData &&
    Object.keys(tenantComponentData).length > 0;

  // Check if currentStoreData is just default data (by comparing a key field like content.title)
  const isStoreDataDefault =
    currentStoreData?.content?.title === defaultData?.content?.title;

  // Merge data with correct priority
  const mergedData = {
    ...defaultData, // 1. Defaults (lowest priority)
    ...props, // 2. Props from parent component
    // If tenantComponentData exists, use it (it's from Database)
    ...(hasTenantData ? tenantComponentData : {}), // 3. Backend data (tenant data)
    // Use currentStoreData only if it's not just default data
    // (meaning it has been updated by user) or if tenantComponentData doesn't exist
    ...(hasTenantData && isStoreDataDefault
      ? {}
      : currentStoreData), // 4. Current store data (highest priority if not default)
  };

  // 6. EARLY RETURN IF NOT VISIBLE
  if (!mergedData.visible) {
    return null;
  }

  const columnsMobile = mergedData.layout?.columns?.mobile || 1;
  const columnsTablet = mergedData.layout?.columns?.tablet || columnsMobile;
  const columnsDesktop = mergedData.layout?.columns?.desktop || columnsTablet;
  const tabletBreakpoint = mergedData.responsive?.tabletBreakpoint || "768px";
  const desktopBreakpoint =
    mergedData.responsive?.desktopBreakpoint || "1024px";
  const hoverScale = mergedData.styling?.hoverScale || "1.05";
  const gapValue = mergedData.layout?.gap || "0.5rem";
  const aspectRatio = mergedData.layout?.aspectRatio || "4 / 3";

  const gridStyles = `
    #${gridElementId} {
      display: grid;
      grid-template-columns: repeat(${columnsMobile}, minmax(0, 1fr));
      gap: ${gapValue};
    }

    @media (min-width: ${tabletBreakpoint}) {
      #${gridElementId} {
        grid-template-columns: repeat(${columnsTablet}, minmax(0, 1fr));
      }
    }

    @media (min-width: ${desktopBreakpoint}) {
      #${gridElementId} {
        grid-template-columns: repeat(${columnsDesktop}, minmax(0, 1fr));
      }
    }

    #${gridElementId} .photo-item {
      transition: transform 300ms ease;
      overflow: hidden;
    }

    #${gridElementId} .photo-item:hover {
      transform: scale(${hoverScale});
    }
  `;

  // 7. RENDER
  return (
    <section
      style={{
        backgroundColor: mergedData.styling?.backgroundColor,
        paddingTop: mergedData.layout?.padding?.top,
        paddingBottom: mergedData.layout?.padding?.bottom,
      }}
    >
      <style>{gridStyles}</style>

      <div
        className="container mx-auto px-4"
        style={{ maxWidth: mergedData.layout?.maxWidth }}
      >
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          {mergedData.content?.eyebrow && (
            <span
              style={{
                color: mergedData.styling?.tagColor,
                fontWeight: 600,
              }}
            >
              {mergedData.content.eyebrow}
            </span>
          )}
          {mergedData.content?.title && (
            <h2
              style={{
                color: mergedData.styling?.titleColor,
                fontSize: mergedData.typography?.title?.fontSize?.desktop,
                fontWeight: mergedData.typography?.title?.fontWeight,
                fontFamily: mergedData.typography?.title?.fontFamily,
              }}
            >
              {mergedData.content.title}
            </h2>
          )}
          {mergedData.content?.subtitle && (
            <p
              style={{
                color: mergedData.styling?.subtitleColor,
                fontSize: mergedData.typography?.subtitle?.fontSize?.desktop,
                fontWeight: mergedData.typography?.subtitle?.fontWeight,
                fontFamily: mergedData.typography?.subtitle?.fontFamily,
              }}
            >
              {mergedData.content.subtitle}
            </p>
          )}
          {mergedData.content?.description && (
            <p
              className="max-w-2xl mx-auto"
              style={{
                color: mergedData.styling?.descriptionColor,
                fontSize: mergedData.typography?.caption?.fontSize?.desktop,
                fontWeight: mergedData.typography?.caption?.fontWeight,
                fontFamily: mergedData.typography?.caption?.fontFamily,
              }}
            >
              {mergedData.content.description}
            </p>
          )}
        </div>

        {/* Photos Grid - بدون card wrapper */}
        <div id={gridElementId}>
          {mergedData.photos?.map((photo: any, index: number) => (
            <div
              key={photo.id || index}
              className="photo-item"
              style={{
                borderRadius:
                  mergedData.styling?.imageBorderRadius ||
                  mergedData.styling?.borderRadius,
                overflow: "hidden",
              }}
            >
              <div
                className="relative w-full"
                style={{
                  aspectRatio,
                  overflow: "hidden",
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {mergedData.styling?.overlayColor && (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: mergedData.styling?.overlayColor,
                      opacity: 0.2,
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
