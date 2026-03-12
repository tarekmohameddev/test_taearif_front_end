"use client";

import { useEffect, useMemo } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultHeroBannerData } from "@/context/editorStoreFunctions/heroBannerFunctions";
import { HeroBanner } from "@/stories/HeroBanner/HeroBanner";
import type { HeroBannerProps } from "@/stories/HeroBanner/HeroBanner.types";

interface HeroBanner1Props extends Partial<HeroBannerProps> {
  variant?: string;
  useStore?: boolean;
  id?: string;
  overrideData?: Partial<HeroBannerProps>;
}

export default function HeroBanner1(props: HeroBanner1Props) {
  const variantId = props.variant || "heroBanner1";
  const uniqueId = props.id || variantId;

  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const heroBannerStates = useEditorStore((s) => s.heroBannerStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  const getTenantComponentData = (): Partial<HeroBannerProps> => {
    if (!tenantData) return {};

    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "heroBanner" &&
          component.componentName === variantId
        ) {
          return (component as any).data || {};
        }
      }
    }

    if (tenantData?.componentSettings) {
      for (const pageComponents of Object.values(
        tenantData.componentSettings
      )) {
        if (
          typeof pageComponents === "object" &&
          !Array.isArray(pageComponents)
        ) {
          for (const [componentId, component] of Object.entries(
            pageComponents as Record<string, any>
          )) {
            if (
              component?.type === "heroBanner" &&
              (component?.componentName === variantId ||
                componentId === uniqueId)
            ) {
              return component?.data || {};
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
      const store = useEditorStore.getState();
      const initial =
        Object.keys(tenantComponentData).length > 0
          ? { ...getDefaultHeroBannerData(), ...tenantComponentData, ...props }
          : { ...getDefaultHeroBannerData(), ...props };
      store.ensureComponentVariant("heroBanner", uniqueId, initial);
    }
  }, [uniqueId, props.useStore]);

  const storeData = props.useStore
    ? getComponentData("heroBanner", uniqueId) || {}
    : {};
  const currentStoreData = heroBannerStates[uniqueId] || {};

  const defaultData = useMemo(() => getDefaultHeroBannerData(), []);

  const mergedData = useMemo((): HeroBannerProps => {
    const base = {
      ...defaultData,
      ...props,
      ...tenantComponentData,
      ...storeData,
      ...currentStoreData,
      ...(props.overrideData || {}),
    };
    return {
      ...base,
      primaryCta: base.primaryCta
        ? { ...defaultData.primaryCta!, ...base.primaryCta }
        : undefined,
      secondaryCta: base.secondaryCta
        ? { ...defaultData.secondaryCta!, ...base.secondaryCta }
        : undefined,
    };
  }, [defaultData, props, tenantComponentData, storeData, currentStoreData]);

  if (!mergedData.visible) {
    return null;
  }

  return (
    <HeroBanner
      title={mergedData.title}
      subtitle={mergedData.subtitle}
      description={mergedData.description}
      titleTextProps={mergedData.titleTextProps}
      subtitleTextProps={mergedData.subtitleTextProps}
      descriptionTextProps={mergedData.descriptionTextProps}
      primaryCta={mergedData.primaryCta}
      secondaryCta={mergedData.secondaryCta}
      videoSrc={mergedData.videoSrc}
      fallbackImage={mergedData.fallbackImage}
      dir={mergedData.dir}
      showScrollIndicator={mergedData.showScrollIndicator}
      onScrollDown={mergedData.onScrollDown}
    />
  );
}
