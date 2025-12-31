"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { getDefaultTitleData } from "@/context-liveeditor/editorStoreFunctions/titleFunctions";

interface TitleProps {
  visible?: boolean;
  content?: {
    title?: string;
  };
  styling?: {
    textAlign?: "left" | "center" | "right";
    color?: string;
    backgroundColor?: string;
  };
  typography?: {
    fontSize?: {
      mobile?: string;
      tablet?: string;
      desktop?: string;
    };
    fontWeight?: string;
    fontFamily?: string;
    lineHeight?: string;
    letterSpacing?: string;
  };
  spacing?: {
    padding?: {
      top?: string;
      bottom?: string;
      left?: string;
      right?: string;
    };
  };
  animations?: {
    enabled?: boolean;
    type?: string;
    duration?: number;
    delay?: number;
  };

  variant?: string;
  useStore?: boolean;
  id?: string;
}

export default function Title1(props: TitleProps = {}) {
  // 1. Extract unique ID
  const variantId = props.variant || "title1";
  const uniqueId = props.id || variantId;

  // 2. Connect to stores
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const titleStates = useEditorStore((s) => s.titleStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // 3. Initialize from tenant & store
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
          component.type === "title" &&
          component.componentName === variantId
        ) {
          return component.data;
        }
      }
    }

    if (tenantData?.componentSettings) {
      for (const [, pageComponents] of Object.entries(
        tenantData.componentSettings,
      )) {
        if (
          typeof pageComponents === "object" &&
          !Array.isArray(pageComponents)
        ) {
          for (const [, component] of Object.entries(pageComponents as any)) {
            if (
              (component as any).type === "title" &&
              (component as any).componentName === variantId
            ) {
              return (component as any).data;
            }
          }
        }
      }
    }

    return {};
  };

  const tenantComponentData = getTenantComponentData();

  useEffect(() => {
    if (props.useStore) {
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultTitleData(),
              ...tenantComponentData,
              ...props,
            }
          : {
              ...getDefaultTitleData(),
              ...props,
            };

      ensureComponentVariant("title", uniqueId, initialData);
    }
  }, [
    uniqueId,
    props.useStore,
    ensureComponentVariant,
    tenantComponentData,
    props,
  ]);

  // 4. Retrieve data from store
  const storeData = titleStates?.[uniqueId];
  const currentStoreData = getComponentData("title", uniqueId);

  // 5. Merge data (defaults -> store -> props)
  const mergedData = {
    ...getDefaultTitleData(),
    ...storeData,
    ...currentStoreData,
    ...props,
  };

  // 6. Early return if not visible
  if (!mergedData.visible) {
    return null;
  }

  // 7. Render
  const padding = mergedData.spacing?.padding || {};
  const fontSizeDesktop = mergedData.typography?.fontSize?.desktop;
  const fontSizeTablet = mergedData.typography?.fontSize?.tablet;
  const fontSizeMobile = mergedData.typography?.fontSize?.mobile;

  return (
    <section
      style={{
        backgroundColor: mergedData.styling?.backgroundColor,
        paddingTop: padding.top,
        paddingBottom: padding.bottom,
        paddingLeft: padding.left,
        paddingRight: padding.right,
      }}
    >
      <div
        className="w-full"
        style={{
          textAlign: mergedData.styling?.textAlign || "center",
        }}
      >
        <h1
          style={{
            color: mergedData.styling?.color,
            fontSize: fontSizeDesktop,
            fontWeight: mergedData.typography?.fontWeight,
            fontFamily: mergedData.typography?.fontFamily,
            lineHeight: mergedData.typography?.lineHeight,
            letterSpacing: mergedData.typography?.letterSpacing,
          }}
          className="mx-auto max-w-5xl"
        >
          <span
            className="block md:hidden"
            style={{ fontSize: fontSizeMobile }}
          >
            {mergedData.content?.title}
          </span>
          <span
            className="hidden md:inline lg:hidden"
            style={{ fontSize: fontSizeTablet }}
          >
            {mergedData.content?.title}
          </span>
          <span
            className="hidden lg:inline"
            style={{ fontSize: fontSizeDesktop }}
          >
            {mergedData.content?.title}
          </span>
        </h1>
      </div>
    </section>
  );
}
