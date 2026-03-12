"use client";

import { useEffect, useMemo } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultPhilosophyCtaSectionData } from "@/context/editorStoreFunctions/philosophyCtaSectionFunctions";
import { PhilosophyCtaSection } from "@/stories/PhilosophyCtaSection/PhilosophyCtaSection";
import type { PhilosophyCtaSectionProps } from "@/stories/PhilosophyCtaSection/PhilosophyCtaSection.types";

interface PhilosophyCtaSection1Props extends Partial<PhilosophyCtaSectionProps> {
  variant?: string;
  useStore?: boolean;
  id?: string;
  overrideData?: Partial<PhilosophyCtaSectionProps>;
}

export default function PhilosophyCtaSection1(props: PhilosophyCtaSection1Props) {
  const variantId = props.variant || "philosophyCtaSection1";
  const uniqueId = props.id || variantId;

  const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const philosophyCtaSectionStates = useEditorStore((s) => s.philosophyCtaSectionStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  const getTenantComponentData = (): Partial<PhilosophyCtaSectionProps> => {
    if (!tenantData) return {};
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const c of tenantData.components) {
        if (c.type === "philosophyCtaSection" && c.componentName === variantId)
          return (c as any).data || {};
      }
    }
    if (tenantData?.componentSettings) {
      for (const pageComponents of Object.values(tenantData.componentSettings)) {
        if (typeof pageComponents === "object" && !Array.isArray(pageComponents)) {
          for (const [cid, comp] of Object.entries(pageComponents as Record<string, any>)) {
            if (comp?.type === "philosophyCtaSection" && (comp?.componentName === variantId || cid === uniqueId))
              return comp?.data || {};
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
      const initial = Object.keys(tenantComponentData).length > 0
        ? { ...getDefaultPhilosophyCtaSectionData(), ...tenantComponentData, ...props }
        : { ...getDefaultPhilosophyCtaSectionData(), ...props };
      store.ensureComponentVariant("philosophyCtaSection", uniqueId, initial);
    }
  }, [uniqueId, props.useStore]);

  const storeData = props.useStore ? getComponentData("philosophyCtaSection", uniqueId) || {} : {};
  const currentStoreData = philosophyCtaSectionStates[uniqueId] || {};
  const defaultData = useMemo(() => getDefaultPhilosophyCtaSectionData(), []);

  const mergedData = useMemo((): PhilosophyCtaSectionProps => ({
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
    ...(props.overrideData || {}),
  }), [defaultData, props, tenantComponentData, storeData, currentStoreData]);

  if (!mergedData.visible) return null;

  return (
    <PhilosophyCtaSection
      heading={mergedData.heading}
      description={mergedData.description}
      ctaLabel={mergedData.ctaLabel}
      ctaHref={mergedData.ctaHref}
      dir={mergedData.dir}
      headingTextProps={mergedData.headingTextProps}
      descriptionTextProps={mergedData.descriptionTextProps}
      ctaTextProps={mergedData.ctaTextProps}
    />
  );
}
