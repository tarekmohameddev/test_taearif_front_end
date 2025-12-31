"use client";

import { useEffect, useMemo } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { getDefaultPhotosGridData } from "@/context-liveeditor/editorStoreFunctions/photosGridFunctions";

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

export default function PhotosGrid1(props: PhotosGridProps) {
  // 1. EXTRACT UNIQUE ID
  const variantId = props.variant || "photosGrid1";
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
    if (!tenantData) return {};

    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "photosGrid" &&
          component.componentName === variantId
        ) {
          return component.data;
        }
      }
    }

    if (tenantData?.componentSettings) {
      for (const pageSettings of Object.values(
        tenantData.componentSettings,
      ) as any[]) {
        if (!pageSettings || typeof pageSettings !== "object") continue;
        for (const [componentId, component] of Object.entries(pageSettings)) {
          if (
            (component as any).type === "photosGrid" &&
            (component as any).componentName === variantId
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
  const storeData = photosGridStates[uniqueId];
  const currentStoreData = getComponentData("photosGrid", uniqueId);

  // 5. MERGE DATA
  const mergedData = {
    ...getDefaultPhotosGridData(),
    ...storeData,
    ...currentStoreData,
    ...props,
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
  const hoverScale = mergedData.styling?.hoverScale || "1.02";
  const cardShadow =
    mergedData.styling?.cardShadow || "0 10px 30px rgba(0,0,0,0.06)";
  const gapValue = mergedData.layout?.gap || "1.25rem";
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

    #${gridElementId} .photo-card {
      transition: transform 180ms ease, box-shadow 180ms ease;
    }

    #${gridElementId} .photo-card:hover {
      transform: scale(${hoverScale});
      box-shadow: ${cardShadow};
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

        {/* Photos Grid */}
        <div id={gridElementId}>
          {mergedData.photos?.map((photo: any, index: number) => (
            <div
              key={photo.id || index}
              className="photo-card overflow-hidden"
              style={{
                borderRadius: mergedData.styling?.borderRadius,
                boxShadow: cardShadow,
                backgroundColor: "#ffffff",
              }}
            >
              <div
                className="relative w-full"
                style={{
                  aspectRatio,
                  overflow: "hidden",
                  borderRadius: mergedData.styling?.imageBorderRadius,
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
                <div
                  className="absolute inset-0"
                  style={{
                    background: mergedData.styling?.overlayColor,
                    opacity: 0.2,
                  }}
                />
              </div>

              <div className="p-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p
                    style={{
                      color: mergedData.styling?.captionColor,
                      fontSize:
                        mergedData.typography?.caption?.fontSize?.desktop,
                      fontWeight: mergedData.typography?.caption?.fontWeight,
                      fontFamily: mergedData.typography?.caption?.fontFamily,
                    }}
                  >
                    {photo.caption}
                  </p>
                  {photo.alt && (
                    <span
                      style={{
                        color: mergedData.styling?.descriptionColor,
                        fontSize:
                          mergedData.typography?.caption?.fontSize?.mobile,
                      }}
                    >
                      {photo.alt}
                    </span>
                  )}
                </div>

                {photo.tag && (
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: mergedData.styling?.overlayColor,
                      color: mergedData.styling?.tagColor,
                    }}
                  >
                    {photo.tag}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
